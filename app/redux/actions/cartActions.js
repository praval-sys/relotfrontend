import { useSelector } from 'react-redux';
import { SET_CART_ITEMS, ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, UPDATE_CART_ITEM_QUANTITY, SET_CART_TOTAL } from '../types';

export const setCartItems = (items) => ({
  type: SET_CART_ITEMS,
  payload: items
});

export const addItemToCart = (item) => ({
  type: ADD_ITEM_TO_CART,
  payload: item
});

export const removeItemFromCart = (itemId) => ({
  type: REMOVE_ITEM_FROM_CART,
  payload: itemId
});

export const updateCartItemQuantity = (itemId, quantity) => ({
  type: UPDATE_CART_ITEM_QUANTITY,
  payload: { itemId, quantity }
});

export const setCartTotal = (total) => ({
  type: SET_CART_TOTAL,
  payload: total
});

