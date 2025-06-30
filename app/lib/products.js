import api from './api';

// ✅ Product API calls
export async function getProductById(id) {
  try {
    const response = await api.get(`/v1/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// ✅ RECOMMENDATION API CALLS

// Get general recommendations (personalized if user is logged in)
export async function getRecommendations(params = {}) {
  try {
    const response = await api.get('/v1/rec/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
}

// Get similar products based on a specific product
export async function getSimilarProducts(productId, params = {}) {
  try {
    const response = await api.get(`/v1/rec/similar/${productId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
}

// Get category-based recommendations
export async function getCategoryRecommendations(category, params = {}) {
  try {
    const response = await api.get(`/v1/rec/category/${category}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching category recommendations:", error);
    throw error;
  }
}

// Get bestseller products
export async function getBestSellerProducts(params = {}) {
  try {
    const response = await api.get('/v1/rec/bestsellers', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    throw error;
  }
}

// Get trending products
export async function getTrendingProducts(params = {}) {
  try {
    const response = await api.get('/v1/rec/trending', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }
}

// Get related products (with optional productId)
export async function getRelatedProducts(productId = null, params = {}) {
  try {
    const endpoint = productId ? `/v1/rec/related/${productId}` : '/v1/rec/related';
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
}

// ✅ LEGACY FUNCTIONS (kept for backward compatibility)
// Alias for getSimilarProducts (backward compatibility)
export async function getRelatedProductsLegacy(productId, category) {
  return getSimilarProducts(productId, { category });
}

// Alias for getBestSellerProducts (backward compatibility)
export async function getBestseller() {
  return getBestSellerProducts();
}

// Alias for getCategoryRecommendations (backward compatibility) 
export async function getCategoryRecommendationsLegacy() {
  return getRecommendations();
}

// ✅ HELPER FUNCTIONS

// Get personalized recommendations with fallback
export async function getPersonalizedRecommendations(userId = null, limit = 10) {
  try {
    return await getRecommendations({ 
      userId, 
      limit,
      type: 'personalized' 
    });
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    // Fallback to trending products if personalized fails
    return getTrendingProducts({ limit });
  }
}

// Get recommendations for product page
export async function getProductPageRecommendations(productId, limit = 8) {
  try {
    const [similar, related] = await Promise.all([
      getSimilarProducts(productId, { limit: limit / 2 }),
      getRelatedProducts(productId, { limit: limit / 2 })
    ]);
    
    return {
      similar: similar?.data || [],
      related: related?.data || [],
      combined: [...(similar?.data || []), ...(related?.data || [])]
    };
  } catch (error) {
    console.error("Error fetching product page recommendations:", error);
    throw error;
  }
}

// Get homepage recommendations
export async function getHomepageRecommendations() {
  try {
    const [trending, bestsellers, recommendations] = await Promise.all([
      getTrendingProducts({ limit: 12 }),
      getBestSellerProducts({ limit: 12 }),
      getRecommendations({ limit: 12 })
    ]);

    return {
      trending: trending?.data || [],
      bestsellers: bestsellers?.data || [],
      recommended: recommendations?.data || []
    };
  } catch (error) {
    console.error("Error fetching homepage recommendations:", error);
    throw error;
  }
}

// Get category page recommendations
export async function getCategoryPageRecommendations(category, currentProductId = null) {
  try {
    const params = { 
      limit: 20,
      excludeId: currentProductId // Exclude current product from recommendations
    };
    
    const [categoryRecs, trending] = await Promise.all([
      getCategoryRecommendations(category, params),
      getTrendingProducts({ ...params, category })
    ]);

    return {
      categoryRecommendations: categoryRecs?.data || [],
      trendingInCategory: trending?.data || []
    };
  } catch (error) {
    console.error("Error fetching category page recommendations:", error);
    throw error;
  }
}

// Search for products with recommendations
export async function searchProductsWithRecommendations(query, filters = {}) {
  try {
    // This would typically be a search endpoint, but using recommendations as fallback
    const recommendations = await getRecommendations({
      query,
      ...filters,
      limit: 20
    });

    return {
      results: recommendations?.data || [],
      query,
      filters
    };
  } catch (error) {
    console.error("Error searching products with recommendations:", error);
    throw error;
  }
}