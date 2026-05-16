import React, { useState, useEffect } from 'react';
import { Star, ShieldAlert, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import api from '../../../api/axiosInstance';
import { toast } from 'react-hot-toast';
import { Loader } from '../../../components/common/Loader';
import AdminPageHeader from '../components/AdminPageHeader';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/reviews/moderation');
      setReviews(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch flagged reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId, action) => {
    if (action === 'delete' && !window.confirm('Are you sure you want to permanently delete this review?')) {
      return;
    }
    
    try {
      await api.post(`/reviews/${reviewId}/moderate`, { action });
      toast.success(action === 'approve' ? 'Review approved' : 'Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Moderation failed');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Review Moderation"
        description="Review and moderate user-reported and AI-flagged feedback"
        icon={ShieldAlert}
      />

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All clear!</h3>
            <p className="text-gray-500 dark:text-gray-400">There are no flagged reviews waiting for moderation.</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={review.reviewer?.avatar || '/default-avatar.png'} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.reviewer?.name || review.reviewer?.fullName}</p>
                      <p className="text-xs text-gray-500">Reviewer</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                  "{review.comment}"
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {review.aiVerification?.isFake && (
                    <div className="flex items-start gap-2 text-sm p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">AI Flagged (Fake Review)</p>
                        <p className="text-xs opacity-90">{review.aiVerification.flagReason}</p>
                      </div>
                    </div>
                  )}

                  {review.reported?.isReported && (
                    <div className="flex items-start gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">User Reported</p>
                        <p className="text-xs opacity-90">{review.reported.reportReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-48 flex flex-col gap-3 justify-center md:border-l border-gray-200 dark:border-gray-800 md:pl-6">
                <button
                  onClick={() => handleModerate(review._id, 'approve')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-medium transition-colors text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Keep
                </button>
                <button
                  onClick={() => handleModerate(review._id, 'delete')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
