import mongoose from 'mongoose';

/**
 * Tracks a user's progress through a course: which lessons completed,
 * assessment attempts, certification status, and earned badges.
 */
const attemptSchema = new mongoose.Schema(
  {
    answers: [{ type: Number }], // index of chosen option per question
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    attempts: [attemptSchema],
    bestScore: { type: Number, default: 0 },
    certified: { type: Boolean, default: false },
    certifiedAt: { type: Date },
    certificateCode: { type: String, unique: true, sparse: true },
    badges: [
      {
        code: { type: String, required: true }, // e.g. 'first_lesson', 'perfect_score'
        title: { type: String, required: true },
        awardedAt: { type: Date, default: Date.now },
      },
    ],
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const CourseEnrollment = mongoose.model('CourseEnrollment', enrollmentSchema);
export default CourseEnrollment;
