import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    durationMinutes: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { _id: true, timestamps: true }
);

const assessmentQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // 4 options
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        'web-development', 'mobile-development', 'design', 'writing', 'marketing',
        'video-editing', 'data-entry', 'customer-service', 'seo', 'social-media',
        'translation', 'accounting', 'legal', 'business', 'other',
      ],
      index: true,
    },
    // Skills taught — used for personalized recommendation matching against User.skills
    skills: [{ type: String, lowercase: true, index: true }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      index: true,
    },
    lessons: [lessonSchema],
    assessment: {
      questions: [assessmentQuestionSchema],
      passingScore: { type: Number, default: 70, min: 50, max: 100 },
      timeLimitMinutes: { type: Number, default: 30 },
    },
    // Certificate awarded on passing assessment
    certificateTitle: { type: String },
    estimatedHours: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1, isPublished: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
