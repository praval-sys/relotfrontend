// components/product/ProductReviews.jsx
'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { getProductReviews } from '../../lib/review';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getProductReviews(productId);
        if (response.success && response.data) {
          setReviews(response.data);
          
          // Calculate average rating
          if (response.data.length > 0) {
            const total = response.data.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(total / response.data.length);
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // ✅ Fixed: Use _id instead of id for MongoDB documents
  const toggleExpandReview = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-4 h-32"></div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i}
                className={`h-5 w-5 ${i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-lg font-bold text-black">{averageRating.toFixed(1)}</span>
          <span className="text-gray-600">
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => {
          // ✅ Fixed: Use _id as the unique identifier
          const reviewId = review._id || review.id;
          const isExpanded = expandedReviews[reviewId];
          const shouldTruncate = review.comment && review.comment.length > 200;
          const displayText = isExpanded || !shouldTruncate 
            ? review.comment 
            : truncateText(review.comment);

          return (
            <div key={reviewId} className="space-y-3">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    {/* ✅ Fixed: Handle user data properly */}
                    <p className="font-semibold text-black">
                      {review.user?.name || (typeof review.user === 'string' ? 'User' : 'Anonymous')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                {/* ✅ Added: Title support if available */}
                {review.title && (
                  <h4 className="font-semibold text-black">{review.title}</h4>
                )}
                <p className="text-gray-700 leading-relaxed">
                  {displayText || 'No comment provided.'}
                </p>
                
                {/* Read More/Less Button */}
                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpandReview(reviewId)}
                    className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    {isExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>

              {/* ✅ Added: Product info if needed for context */}
              {review.product && review.product.name && (
                <div className="text-xs text-gray-500 mt-2">
                  Reviewed: {review.product.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}