'use client';

import { useState, useEffect } from 'react';
import { Star, Edit } from 'lucide-react';
import { createProductReview, updateProductReview } from '../../lib/review';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AddReview({ productId }) {
  const { checkAuthStatus, user } = useAuth();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReview = async () => {
      const isLoggedIn = await checkAuthStatus();
      console.log('User logged in:', isLoggedIn);
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/v1/user/reviews/', {
          params: { productId },
        });

        const review = res.data;

        if (review && (review.comment || review.rating)) {
          setUserReview(review);
          setRating(review.rating);
          setComment(review.comment);
        } else {
          setUserReview(null);
        }
      } catch (err) {
        console.error('Error fetching user review:', err);
        setUserReview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReview();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write a review');

    try {
      setIsSubmitting(true);
      const payload = { rating, comment };

      const response = isEditing
        ? await updateProductReview(productId, payload)
        : await createProductReview(productId, payload);

      if (response.success) {
        toast.success(`Review ${isEditing ? 'updated' : 'submitted'} successfully!`);
        setUserReview({ rating, comment });
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Error submitting review');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div className="space-y-3">
          <label className="text-lg font-semibold text-black">Your Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none hover:scale-110 transition-transform"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={28}
                  className={`${
                    (hover || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  } transition-colors`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-sm font-medium text-gray-700">
                {rating}/5 stars
              </span>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-3">
          <label htmlFor="comment" className="text-lg font-semibold text-black">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            rows="5"
            placeholder="Share your experience with this product..."
            required
          />
          <p className="text-sm text-gray-600">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-lg font-semibold transition-all ${
              isSubmitting || rating === 0 || !comment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isEditing ? 'Updating...' : 'Submitting...'}
              </span>
            ) : (
              isEditing ? 'Update Review' : 'Submit Review'
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setRating(userReview.rating);
                setComment(userReview.comment);
              }}
              className="flex-1 sm:flex-none px-8 py-3 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">Please sign in to write a review</p>
      </div>
    );
  }

  if (!userReview || isEditing) {
    return renderForm();
  }

  // Display existing review
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-black">Your Review</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <Edit size={16} />
          Edit Review
        </button>
      </div>

      <div className="space-y-4">
        {/* User's Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`${
                  star <= userReview.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-black">
            {userReview.rating}/5 stars
          </span>
        </div>

        {/* User's Comment */}
        <div className="space-y-2">
          <p className="text-gray-700 leading-relaxed text-lg">
            {userReview.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
