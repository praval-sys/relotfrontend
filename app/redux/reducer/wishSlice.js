import wishlist from '@/app/(pages)/wishlist/page';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setToken: (state, action) => {
        state.token = action.payload;
      },
      clearToken: (state) => {
        state.token = null;
      },
    },
  });