import { 
  SET_CART_ITEMS, 
  ADD_ITEM_TO_CART, 
  REMOVE_ITEM_FROM_CART, 
  UPDATE_CART_ITEM_QUANTITY, 
  SET_CART_TOTAL,
  CLEAR_CART
} from '../types';

const initialState = {
  items: [],
  totalPrice: 0
};

// ✅ FIXED: Helper function to calculate final price with discount
const getFinalPrice = (item) => {
  if (item.finalPrice) return item.finalPrice;
  
  const basePrice = item.price || 0;
  const discount = item.discount || 0;
  
  if (discount > 0) {
    return basePrice * (1 - discount / 100);
  }
  
  return basePrice;
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_TOTAL:
      return {
        ...state,
        totalPrice: action.payload
      };

    case SET_CART_ITEMS:
      // ✅ FIXED: Calculate total price using final prices
      const totalPrice = action.payload.reduce((sum, item) => {
        const finalPrice = getFinalPrice(item);
        const quantity = item.quantity || 1;
        return sum + (finalPrice * quantity);
      }, 0);
      
      return {
        ...state,
        items: action.payload,
        totalPrice: totalPrice
      };

    case ADD_ITEM_TO_CART:
      const newItem = action.payload;
      const newItemId = newItem.id || `${newItem.productId || newItem.product}${newItem.variantId ? `-${newItem.variantId}` : ''}`;
      
      const existingItemIndex = state.items.findIndex(item => {
        const itemId = item.id || `${item.productId || item.product}${item.variantId ? `-${item.variantId}` : ''}`;
        return itemId === newItemId;
      });

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: (item.quantity || 1) + (newItem.quantity || 1) }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...newItem, quantity: newItem.quantity || 1 }];
      }

      // ✅ FIXED: Calculate new total using final prices
      const newTotal = updatedItems.reduce((sum, item) => {
        const finalPrice = getFinalPrice(item);
        const quantity = item.quantity || 1;
        return sum + (finalPrice * quantity);
      }, 0);

      localStorage.setItem('cart', JSON.stringify({
        items: updatedItems,
        totalPrice: newTotal
      }));

      return {
        ...state,
        items: updatedItems,
        totalPrice: newTotal
      };

    case REMOVE_ITEM_FROM_CART:
      const removePayload = action.payload;
      const removeItemId = removePayload.itemId || `${removePayload.productId}${removePayload.variantId ? `-${removePayload.variantId}` : ''}`;
      
      const filteredItems = state.items.filter(item => {
        const itemId = item.id || `${item.productId || item.product}${item.variantId ? `-${item.variantId}` : ''}`;
        
        if (itemId === removeItemId) {
          return false;
        }
        
        const itemProductId = item.productId || item.product;
        if (itemProductId === removePayload.productId && item.variantId === removePayload.variantId) {
          return false;
        }
        
        return true;
      });

      // ✅ FIXED: Calculate new total using final prices
      const removedTotal = filteredItems.reduce((sum, item) => {
        const finalPrice = getFinalPrice(item);
        const quantity = item.quantity || 1;
        return sum + (finalPrice * quantity);
      }, 0);

      localStorage.setItem('cart', JSON.stringify({
        items: filteredItems,
        totalPrice: removedTotal
      }));

      return {
        ...state,
        items: filteredItems,
        totalPrice: removedTotal
      };

    case UPDATE_CART_ITEM_QUANTITY:
      const updatePayload = action.payload;
      const updateItemId = updatePayload.itemId || `${updatePayload.productId}${updatePayload.variantId ? `-${updatePayload.variantId}` : ''}`;
      
      const quantityUpdatedItems = state.items.map(item => {
        const itemId = item.id || `${item.productId || item.product}${item.variantId ? `-${item.variantId}` : ''}`;
        
        if (itemId === updateItemId) {
          return { ...item, quantity: updatePayload.quantity };
        }
        
        const itemProductId = item.productId || item.product;
        if (itemProductId === updatePayload.productId && item.variantId === updatePayload.variantId) {
          return { ...item, quantity: updatePayload.quantity };
        }
        
        return item;
      });

      // ✅ FIXED: Calculate new total using final prices
      const quantityTotal = quantityUpdatedItems.reduce((sum, item) => {
        const finalPrice = getFinalPrice(item);
        const quantity = item.quantity || 1;
        return sum + (finalPrice * quantity);
      }, 0);

      localStorage.setItem('cart', JSON.stringify({
        items: quantityUpdatedItems,
        totalPrice: quantityTotal
      }));

      return {
        ...state,
        items: quantityUpdatedItems,
        totalPrice: quantityTotal
      };

    case CLEAR_CART:
      localStorage.removeItem('cart');
      return {
        ...state,
        items: [],
        totalPrice: 0
      };

    default:
      return state;
  }
};

export default cartReducer;