import { useSelector } from 'react-redux';
import {
  SET_CART_ITEMS,
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
  SET_CART_TOTAL,
  CLEAR_CART
} from '../types';

export const setCartItems = (items) => ({
  type: SET_CART_ITEMS,
  payload: items
});

export const setCartTotal = (total) => ({
  type: SET_CART_TOTAL,
  payload: total
});

export const addItemToCart = (item) => ({
  type: ADD_ITEM_TO_CART,
  payload: item
});

// ✅ FIXED: Updated to handle the new payload structure
export const removeItemFromCart = (itemIdentifier) => ({
  type: REMOVE_ITEM_FROM_CART,
  payload: itemIdentifier
});

// ✅ FIXED: Updated to handle the new payload structure
export const updateCartItemQuantity = (updateData) => ({
  type: UPDATE_CART_ITEM_QUANTITY,
  payload: updateData
});

export const clearCart = () => ({
  type: CLEAR_CART
});

