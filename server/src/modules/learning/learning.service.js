import Course from '../../models/Course.js';
import CourseEnrollment from '../../models/CourseEnrollment.js';
import User from '../../models/User.js';
import crypto from 'crypto';
import { createAppError } from '../../core/errors/index.js';

const BADGES = {
  FIRST_LESSON: { code: 'first_lesson', title: 'First Steps' },
  HALFWAY: { code: 'halfway', title: 'Halfway There' },
  COURSE_COMPLETE: { code: 'course_complete', title: 'Course Conqueror' },
  PERFECT_SCORE: { code: 'perfect_score', title: 'Perfect Score' },
  FIRST_CERTIFICATE: { code: 'first_certificate', title: 'Certified Pro' },
};

class LearningService {
  // ---------- Course CRUD (admin) ----------
  async createCourse(adminId, data) {
    if (!data.slug) {
      data.slug = String(data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    const exists = await Course.findOne({ slug: data.slug });
    if (exists) throw createAppError('A course with this slug already exists', 409);
    return Course.create({ ...data, createdBy: adminId });
  }

  async updateCourse(courseId, data) {
    const course = await Course.findByIdAndUpdate(courseId, data, { new: true });
    if (!course) throw createAppError('Course not found', 404);
    return course;
  }

  async deleteCourse(courseId) {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) throw createAppError('Course not found', 404);
    return course;
  }

  // ---------- Browse ----------
  async listCourses({ category, level, search, page = 1, limit = 12 } = {}) {
    const query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-assessment.questions.correctIndex'),
      Course.countDocuments(query),
    ]);
    return { items, pagination: { page: Number(page), limit: Number(limit), total } };
  }

  async getCourse(courseId, userId) {
    // Strip correct answers from assessment so users can't cheat
    const course = await Course.findById(courseId).lean();
    if (!course || !course.isPublished) throw createAppError('Course not found', 404);
    if (course.assessment?.questions) {
      course.assessment.questions = course.assessment.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      }));
    }
    if (userId) {
      const enrollment = await CourseEnrollment.findOne({ user: userId, course: courseId });
      course.enrollment = enrollment;
    }
    return course;
  }

  // ---------- Enrollment & progress ----------
  async enroll(userId, courseId) {
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) throw createAppError('Course not found', 404);

    const existing = await CourseEnrollment.findOne({ user: userId, course: courseId });
    if (existing) return existing;

    return CourseEnrollment.create({ user: userId, course: courseId });
  }

  async markLessonComplete(userId, courseId, lessonId) {
    const course = await Course.findById(courseId).select('lessons');
    if (!course) throw createAppError('Course not found', 404);

    const lessonExists = course.lessons.some((l) => l._id.toString() === lessonId);
    if (!lessonExists) throw createAppError('Lesson not found in course', 404);

    let enrollment = await CourseEnrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      enrollment = await CourseEnrollment.create({ user: userId, course: courseId });
    }

    if (!enrollment.completedLessons.some((id) => id.toString() === lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const total = course.lessons.length;
    enrollment.progressPercent = total === 0 ? 0 : Math.round((enrollment.completedLessons.length / total) * 100);
    enrollment.lastAccessedAt = new Date();

    // Auto-award badges
    const awarded = new Set(enrollment.badges.map((b) => b.code));
    if (enrollment.completedLessons.length === 1 && !awarded.has(BADGES.FIRST_LESSON.code)) {
      enrollment.badges.push({ ...BADGES.FIRST_LESSON });
    }
    if (enrollment.progressPercent >= 50 && !awarded.has(BADGES.HALFWAY.code)) {
      enrollment.badges.push({ ...BADGES.HALFWAY });
    }
    if (enrollment.progressPercent === 100 && !awarded.has(BADGES.COURSE_COMPLETE.code)) {
      enrollment.badges.push({ ...BADGES.COURSE_COMPLETE });
    }

    await enrollment.save();
    return enrollment;
  }

  // ---------- Assessments (auto-graded) ----------
  async submitAssessment(userId, courseId, answers) {
    const course = await Course.findById(courseId);
    if (!course) throw createAppError('Course not found', 404);
    if (!course.assessment?.questions?.length) {
      throw createAppError('This course has no assessment', 400);
    }

    const questions = course.assessment.questions;
    if (!Array.isArray(answers) || answers.length !== questions.length) {
      throw createAppError(`Expected ${questions.length} answers, got ${answers?.length || 0}`, 400);
    }

    let correct = 0;
    const details = questions.map((q, i) => {
      const chosen = Number(answers[i]);
      const isCorrect = chosen === q.correctIndex;
      if (isCorrect) correct += 1;
      return {
        questionId: q._id,
        chosenIndex: chosen,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (course.assessment.passingScore || 70);

    let enrollment = await CourseEnrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      enrollment = await CourseEnrollment.create({ user: userId, course: courseId });
    }
    enrollment.attempts.push({ answers: answers.map(Number), score, passed });
    if (score > enrollment.bestScore) enrollment.bestScore = score;

    const awarded = new Set(enrollment.badges.map((b) => b.code));
    if (score === 100 && !awarded.has(BADGES.PERFECT_SCORE.code)) {
      enrollment.badges.push({ ...BADGES.PERFECT_SCORE });
    }

    if (passed && !enrollment.certified) {
      enrollment.certified = true;
      enrollment.certifiedAt = new Date();
      enrollment.certificateCode = crypto.randomBytes(8).toString('hex').toUpperCase();
      if (!awarded.has(BADGES.FIRST_CERTIFICATE.code)) {
        enrollment.badges.push({ ...BADGES.FIRST_CERTIFICATE });
      }
    }

    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    return { score, passed, correctAnswers: correct, totalQuestions: questions.length, details, enrollment };
  }

  // ---------- Personalized recommendations ----------
  /**
   * Recommend courses by matching the user's skills (or absence of skills they
   * SHOULD have given their primary category) against the course catalog.
   * Scoring: +skill overlap, +1 for level match, -progress already made.
   */
  async recommendCourses(userId, limit = 6) {
    const user = await User.findById(userId).select('skills experienceLevel role').lean();
    if (!user) throw createAppError('User not found', 404);

    const userSkills = new Set((user.skills || []).map((s) => String(s).toLowerCase()));

    const candidates = await Course.find({ isPublished: true }).lean();
    const enrollments = await CourseEnrollment.find({ user: userId }).select('course progressPercent').lean();
    const progressByCourse = new Map(enrollments.map((e) => [e.course.toString(), e.progressPercent]));

    const scored = candidates.map((c) => {
      const courseSkills = (c.skills || []).map((s) => String(s).toLowerCase());
      const overlap = courseSkills.filter((s) => userSkills.has(s)).length;
      const newSkills = courseSkills.filter((s) => !userSkills.has(s)).length;
      const progress = progressByCourse.get(c._id.toString()) || 0;

      // Score favors: courses that add a few new skills (skill gap),
      // matching level, and that the user hasn't already finished.
      let score = overlap * 2 + newSkills * 3;
      if (user.experienceLevel && c.level === user.experienceLevel) score += 2;
      if (progress === 100) score -= 100;
      else score -= progress / 20;

      return { course: c, score, alreadyEnrolledProgress: progress, newSkills };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored
      .filter((s) => s.score > 0)
      .slice(0, limit)
      .map(({ course, score, alreadyEnrolledProgress, newSkills }) => ({
        ...course,
        recommendationScore: score,
        progressPercent: alreadyEnrolledProgress,
        newSkillsCount: newSkills,
      }));
  }

  // ---------- Stats / progress tracking ----------
  async myProgress(userId) {
    const enrollments = await CourseEnrollment.find({ user: userId })
      .populate('course', 'title slug thumbnailUrl category level estimatedHours')
      .sort({ lastAccessedAt: -1 });

    const totalBadges = enrollments.reduce((a, e) => a + (e.badges?.length || 0), 0);
    const certificates = enrollments.filter((e) => e.certified);

    return {
      enrollments,
      stats: {
        total: enrollments.length,
        completed: enrollments.filter((e) => e.progressPercent === 100).length,
        certificates: certificates.length,
        badges: totalBadges,
      },
      certificates: certificates.map((c) => ({
        course: c.course,
        certificateCode: c.certificateCode,
        certifiedAt: c.certifiedAt,
        bestScore: c.bestScore,
      })),
    };
  }
}

export default new LearningService();
