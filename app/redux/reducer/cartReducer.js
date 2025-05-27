import { 
  SET_CART_ITEMS, 
  ADD_ITEM_TO_CART, 
  REMOVE_ITEM_FROM_CART, 
  UPDATE_CART_ITEM_QUANTITY 
} from '../types';

const initialState = {
  items: [],
  totalPrice: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_ITEMS:
      return {
        ...state,
        items: action.payload,
        totalPrice: action.payload.reduce((sum, item) => 
          sum + (item.price * (item.quantity || 1)), 0
        )
      };

    case ADD_ITEM_TO_CART:
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case REMOVE_ITEM_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload)
      };

    case UPDATE_CART_ITEM_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    default:
      return state;
  }
};

export default cartReducer;