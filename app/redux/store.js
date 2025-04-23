// store.js
import { configureStore } from '@reduxjs/toolkit'; // Recommended way with Redux Toolkit
import cartReducer from './reducer/cartReducer';
import authReducer from '../redux/reducer/authSlice';
import wishReducer from '../redux/reducer/wishSlice';
import remTimeReducer from '../redux/reducer/timeSlice';
import loginStatusReducer from '../redux/reducer/loginSlice';



const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wish: wishReducer,
    time: remTimeReducer,
    login: loginStatusReducer
  },
  devTools: process.env.NODE_ENV !== 'production', // Redux DevTools in development
});

export default store;
