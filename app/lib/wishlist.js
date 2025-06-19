import api from './api';

export async function getWishlist() {
  try {
    const response = await api.get('/v1/wish/' );
    return response.data;
  } catch (error) {
    console.error("Error getting wishlist:", error);
    throw error;
  }
}

export async function addToWishlist(productData) {
  try {
    console.log("Adding item to wishlist:", productData);
    const response = await api.post('/v1/wish/add', {
      productId: productData.productId,
      variantId: productData.variantId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function removeItem(productId, options = {}) {
  try {
    const queryParams = options.variantId ? `?variantId=${options.variantId}` : '';
    console.log("Removing item with ID:", productId.id, "and options:", options);
    const response = await api.delete(`/v1/wish/remove/${productId.id}${queryParams}` );
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

export async function clearWishlist() {
  try {
    const response = await api.delete('/v1/wish/clear/' );
    return response.data;
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw error;
  }
}

export async function moveToCart(productId,options = {}) {
  try {
    const response = await api.post(`/v1/wish//move-to-cart/${productId.id}`,options );
    return response.data;
  } catch (error) {
    console.error("Error moving to cart:", error);
    throw error;
  }
}


export async function moveAllToCart() {
  try {
    const response = await api.post('/v1/wish//move-all-to-cart' );
    return response.data;
  } catch (error) {
    console.error("Error moving to cart:", error);
    throw error;
  }
}

export async function checkWishlist(productId) {
  try {
    const response = await api.get(`/v1/wish/check/${productId}` );
    return response.data;
  } catch (error) {
    console.error("Error checking product in wishlist:", error);
    throw error;
  }
}