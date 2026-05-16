import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  aiVerification: {
    isFake: {
      type: Boolean,
      default: false,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    flagReason: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    }
  },
  reported: {
    isReported: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportReason: {
      type: String,
    },
    reportedAt: {
      type: Date,
    },
    adminResolved: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
    }
  }
}, { timestamps: true });

// Ensure a user can only review a specific contract once
reviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
