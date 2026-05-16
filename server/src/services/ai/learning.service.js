import AIFeedback from '../../models/AIFeedback.js';

/**
 * AI Learning Service
 * --------------------
 * Implements a lightweight continuous learning loop for the recommendation engine.
 *
 * Approach (no heavy ML — appropriate for a marketplace at this scale):
 * 1. Every recommendation shown to a user is logged with a `shown` signal.
 * 2. User reactions (clicked / applied / hired / dismissed / thumbs_*) update the row.
 * 3. Periodically we aggregate feedback by skill and category to compute a
 *    multiplier in [0.5, 1.5] which biases future match scores.
 *
 * The multiplier is a simple online estimator: positive signals raise it,
 * dismissals lower it, with smoothing so a single click doesn't flip a skill.
 */

const POSITIVE_SIGNALS = new Set(['clicked', 'applied', 'hired', 'completed', 'thumbs_up']);
const NEGATIVE_SIGNALS = new Set(['dismissed', 'thumbs_down']);

class AILearningService {
  constructor() {
    // In-memory cached weights; rebuilt from DB on demand. For prod you'd
    // persist this to a small collection, but recomputing from feedback is
    // cheap at this dataset size.
    this.skillWeights = new Map();
    this.categoryWeights = new Map();
    this.lastRebuiltAt = 0;
    this.TTL_MS = 15 * 60 * 1000; // 15 minutes
  }

  async logFeedback({ userId, surface, signal, prediction, job, proposal, contract, review, skills, category, note }) {
    const doc = await AIFeedback.create({
      user: userId,
      surface,
      signal,
      prediction: prediction || {},
      job,
      proposal,
      contract,
      review,
      skills: (skills || []).map((s) => String(s).toLowerCase()),
      category,
      note,
    });
    // Trigger an async, non-blocking rebuild if cache is stale
    if (Date.now() - this.lastRebuiltAt > this.TTL_MS) {
      this.rebuildWeights().catch((err) =>
        console.error('[AI Learning] rebuildWeights failed', err)
      );
    }
    return doc;
  }

  async rebuildWeights() {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
    const rows = await AIFeedback.find({ createdAt: { $gte: since } })
      .select('signal skills category')
      .lean();

    const skillStats = new Map(); // skill -> {pos, neg}
    const categoryStats = new Map();

    for (const row of rows) {
      const isPos = POSITIVE_SIGNALS.has(row.signal);
      const isNeg = NEGATIVE_SIGNALS.has(row.signal);
      if (!isPos && !isNeg) continue;

      (row.skills || []).forEach((s) => {
        const stat = skillStats.get(s) || { pos: 0, neg: 0 };
        if (isPos) stat.pos += 1; else stat.neg += 1;
        skillStats.set(s, stat);
      });
      if (row.category) {
        const stat = categoryStats.get(row.category) || { pos: 0, neg: 0 };
        if (isPos) stat.pos += 1; else stat.neg += 1;
        categoryStats.set(row.category, stat);
      }
    }

    // Convert to multipliers using a smoothed ratio: weight = 1 + (pos - neg) / (pos + neg + 10)
    // bounded to [0.5, 1.5] so no single skill can dominate.
    const toWeight = (stat) => {
      const denom = stat.pos + stat.neg + 10;
      const raw = 1 + (stat.pos - stat.neg) / denom;
      return Math.max(0.5, Math.min(1.5, raw));
    };

    this.skillWeights = new Map(
      Array.from(skillStats.entries()).map(([k, v]) => [k, toWeight(v)])
    );
    this.categoryWeights = new Map(
      Array.from(categoryStats.entries()).map(([k, v]) => [k, toWeight(v)])
    );
    this.lastRebuiltAt = Date.now();

    return {
      skillsTracked: this.skillWeights.size,
      categoriesTracked: this.categoryWeights.size,
      sampleSize: rows.length,
    };
  }

  async getSkillWeight(skill) {
    if (Date.now() - this.lastRebuiltAt > this.TTL_MS) {
      await this.rebuildWeights();
    }
    return this.skillWeights.get(String(skill).toLowerCase()) || 1.0;
  }

  async applyToScore(baseScore, { skills = [], category } = {}) {
    if (Date.now() - this.lastRebuiltAt > this.TTL_MS) {
      await this.rebuildWeights();
    }
    let multiplier = 1.0;
    let count = 0;
    for (const s of skills) {
      const w = this.skillWeights.get(String(s).toLowerCase());
      if (w) { multiplier += (w - 1); count += 1; }
    }
    if (category) {
      const w = this.categoryWeights.get(category);
      if (w) { multiplier += (w - 1); count += 1; }
    }
    if (count > 0) multiplier = multiplier / count + (1 - 1 / count); // average pull toward 1
    return Math.round(baseScore * multiplier);
  }

  async getInsights() {
    if (Date.now() - this.lastRebuiltAt > this.TTL_MS) {
      await this.rebuildWeights();
    }
    const topSkills = Array.from(this.skillWeights.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const bottomSkills = Array.from(this.skillWeights.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10);
    return {
      lastRebuiltAt: this.lastRebuiltAt ? new Date(this.lastRebuiltAt) : null,
      topSkills,
      bottomSkills,
      categories: Array.from(this.categoryWeights.entries()).sort((a, b) => b[1] - a[1]),
    };
  }
}

const aiLearningService = new AILearningService();
export default aiLearningService;
