import api from './api';

/**
 * Get all orders for the authenticated user with pagination and filters
 */
export async function getUserOrders(page = 1, limit = 10, status = '') {
  try {
    const response = await api.get('/v1/user/orders/', {
      params: {
        page,
        limit,
        status
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch orders';
  }
}

/**
 * Get specific order details by ID
 */
export async function getOrderById(orderId) {
  try {
    const response = await api.get(`/v1/user/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch order details';
  }
}

// /**
//  * Create a new order
//  */
// export async function createOrder(orderData) {
//   try {
//     const response = await api.post('/orders', orderData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || 'Failed to create order';
//   }
// }

/**
 * Cancel an existing order
 */
export async function cancelOrder(orderId) {
  try {
    const response = await api.put(`/v1/user/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to cancel order';
  }
}

/**
 * Update order status (if needed for admin functionality)
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update order status';
  }
}