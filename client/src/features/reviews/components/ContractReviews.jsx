import React, { useState } from 'react';
import { Star, AlertCircle, Loader2, Flag } from 'lucide-react';
import api from '../../../api/axiosInstance';
import { toast } from 'react-hot-toast';

export const ContractReviews = ({ reviews, currentUserId, onReviewReported }) => {
  const [reportingId, setReportingId] = useState(null);
  const [reportReason, setReportReason] = useState('');

  const handleReport = async (reviewId) => {
    if (!reportReason || reportReason.trim().length < 10) {
      toast.error('Report reason must be at least 10 characters');
      return;
    }
    
    try {
      await api.post(`/reviews/${reviewId}/report`, { reason: reportReason });
      toast.success('Review reported successfully');
      setReportingId(null);
      setReportReason('');
      if (onReviewReported) onReviewReported();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report review');
    }
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contract Feedback</h3>
      <div className="grid gap-4">
        {reviews.map((review) => {
          const isMyReview = String(review.reviewer._id) === String(currentUserId);
          const isReported = review.reported?.isReported;

          return (
            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.reviewer?.avatar || '/default-avatar.png'}
                    alt={review.reviewer?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {isMyReview ? 'Your Review' : `Review by ${review.reviewer?.name || review.reviewer?.fullName || 'User'}`}
                    </h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                
                {!isMyReview && !isReported && (
                  <button
                    onClick={() => setReportingId(review._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">Report</span>
                  </button>
                )}
                {isReported && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                    Reported
                  </span>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.comment}</p>

              {reportingId === review._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Report this review</h5>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Why are you reporting this review?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white resize-none text-sm mb-2"
                    rows="2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReportingId(null)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReport(review._id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractReviews;
