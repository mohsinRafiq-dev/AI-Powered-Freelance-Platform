import Review from '../../models/Review.js';
import { AppError } from '../../core/errors/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini for fake review detection
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake_key');

/**
 * Creates a new review, running it through AI verification first
 */
export const createReview = async (req, res, next) => {
  try {
    const { jobId, contractId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    // 1. Basic validation
    if (!jobId || !contractId || !revieweeId || !rating || !comment) {
      return next(new AppError('All fields are required', 400));
    }

    // 2. Check if already reviewed
    const existingReview = await Review.findOne({ contract: contractId, reviewer: reviewerId });
    if (existingReview) {
      return next(new AppError('You have already submitted a review for this contract', 400));
    }

    // 3. AI Fake Review Detection
    let isFake = false;
    let confidenceScore = 0;
    let flagReason = '';

    try {
      const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
      const prompt = `
        Analyze the following review for a freelance platform. 
        Determine if it looks like a fake, spam, or malicious review.
        Respond ONLY with a JSON object in this exact format:
        {"isFake": boolean, "confidenceScore": number (0-100), "reason": "string explaining why"}
        
        Rating: ${rating}/5
        Comment: "${comment}"
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiAnalysis = JSON.parse(jsonMatch[0]);
        isFake = aiAnalysis.isFake;
        confidenceScore = aiAnalysis.confidenceScore;
        flagReason = aiAnalysis.reason;
      }
    } catch (aiError) {
      console.error('AI Verification failed, proceeding without AI flag:', aiError.message);
    }

    // 4. Create the review
    const newReview = await Review.create({
      job: jobId,
      contract: contractId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
      aiVerification: {
        isFake,
        confidenceScore,
        flagReason,
        verifiedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: isFake ? 'Review submitted but flagged for moderation' : 'Review submitted successfully',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets reviews for a specific user
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Don't show reviews that are flagged as fake unless an admin is viewing
    const query = { reviewee: userId };
    if (req.user?.role !== 'admin') {
      query['aiVerification.isFake'] = false;
    }

    const reviews = await Review.find(query)
      .populate('reviewer', 'name avatar')
      .populate('job', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets reviews for a specific contract
 */
export const getContractReviews = async (req, res, next) => {
  try {
    const { contractId } = req.params;
    
    const reviews = await Review.find({ contract: contractId })
      .populate('reviewer', 'name avatar fullName')
      .populate('reviewee', 'name avatar fullName');

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets reported and fake reviews for admin moderation
 */
export const getReviewsForModeration = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admins can view moderation queue', 403));
    }

    const reviews = await Review.find({
      $or: [
        { 'reported.isReported': true },
        { 'aiVerification.isFake': true }
      ]
    })
      .populate('reviewer', 'name avatar fullName email')
      .populate('reviewee', 'name avatar fullName email')
      .populate('contract', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reports a review to admin
 */
export const reportReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    review.reported = {
      isReported: true,
      reportedBy: req.user.id,
      reportReason: reason,
      reportedAt: new Date()
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Moderate a review (approve or delete)
 */
export const moderateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body;

    if (req.user.role !== 'admin') {
      return next(new AppError('Only admins can moderate reviews', 403));
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (action === 'approve') {
      review.aiVerification.isFake = false;
      review.reported.isReported = false;
      await review.save();
      res.status(200).json({ success: true, message: 'Review approved and restored' });
    } else if (action === 'delete') {
      await Review.findByIdAndDelete(reviewId);
      res.status(200).json({ success: true, message: 'Review deleted permanently' });
    } else {
      return next(new AppError('Invalid action', 400));
    }
  } catch (error) {
    next(error);
  }
};
