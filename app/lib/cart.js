import api from './api';

export async function getCart() {
  try {
    const response = await api.get('/v1/');
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function addToCart(product) {
  try {
    const formattedData = {
      products: [{
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
        image: product.images?.[0] || product.image || '/placeholder.png'
      }]
    };

    const response = await api.post("/v1/add", formattedData);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItem(productId, quantity) {
  try {
    const response = await api.put(`/v1/update/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart Item:", error);
    throw error;
  }
}

export async function removeCartItem(productId) {
  try {
    const response = await api.delete(`/v1/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
}

export async function clearCart() {
  try {
    const response = await api.delete();
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}