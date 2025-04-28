import api from './api';

export async function getProductReviews(productId) {
  try {
    const response = await api.get(`/v1/products/${productId}/reviews`, {
      params: { productId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export async function createProductReview(productId, reviewData) {
  try {
    const response = await api.post('/api/reviews', {
      productId,
      ...reviewData,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}
