// store.js
import { configureStore } from '@reduxjs/toolkit'; // Recommended way with Redux Toolkit
import cartReducer from './reducer/cartReducer';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Redux DevTools in development
});

export default store;
