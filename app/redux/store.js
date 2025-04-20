// store.js
import { configureStore } from '@reduxjs/toolkit'; // Recommended way with Redux Toolkit
import cartReducer from './reducer/cartReducer';
import authReducer from '../redux/reducer/authSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Redux DevTools in development
});

export default store;
