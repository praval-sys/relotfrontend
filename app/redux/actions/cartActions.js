import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, UPDATE_CART_ITEM_QUANTITY } from '../types';

export const addItemToCart = (item) => {
  return {
    type: ADD_ITEM_TO_CART,
    payload: item, // The item object to add (e.g., { id, name, price, quantity: 1 })
  };
};

export const removeItemFromCart = (itemId) => {
  return {
    type: REMOVE_ITEM_FROM_CART,
    payload: itemId, // The ID of the item to remove
  };
};

export const updateCartItemQuantity = (itemId, quantity) => {
  return {
    type: UPDATE_CART_ITEM_QUANTITY,
    payload: { itemId, quantity },
  };
};

// Add other action creators as needed