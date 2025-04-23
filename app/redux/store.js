// store.js
import { configureStore } from '@reduxjs/toolkit'; // Recommended way with Redux Toolkit
import cartReducer from './reducer/cartReducer';
import authReducer from '../redux/reducer/authSlice';
import wishReducer from '../redux/reducer/wishSlice';
import remTimeReducer from '../redux/reducer/timeSlice';



const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wish: wishReducer,
    time: remTimeReducer
  },
  devTools: process.env.NODE_ENV !== 'production', // Redux DevTools in development
});

export default store;
