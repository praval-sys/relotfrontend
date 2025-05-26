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

export async function addToWishlist(product) {
  try {
    const response = await api.post('/v1/wish/add/', {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

export async function removeItem(productId) {
  try {
    const response = await api.delete(`/v1/wish/remove/${productId}`);
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

export async function moveToCart(productId) {
  try {
    const response = await api.post(`/v1/wish//move-to-cart/${productId}` );
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