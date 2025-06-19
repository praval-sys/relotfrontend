import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
};

export const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    AddWish: (state, action) => {
      // Handle both single item and array
      if (Array.isArray(action.payload)) {
        state.wishlist = action.payload;
      } else {
        const existingItem = state.wishlist.find(
          (item) => item.product === action.payload.productId
        );
        if (!existingItem) {
          state.wishlist.push(action.payload);
        }
      }
    },
    RemoveWish: (state, action) => {
      const { productId, variantId } = action.payload;
      state.wishlist = state.wishlist.filter(item => 
        !(item.product === productId && 
          (!variantId || item.variantId === variantId))
      );
    },
    clearWish: (state) => {
      state.wishlist = [];
    },
  },
});

export const { AddWish, RemoveWish, clearWish } = wishSlice.actions;
export default wishSlice.reducer;
