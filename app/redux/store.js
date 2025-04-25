// app/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from './storage'; // Custom SSR-safe storage wrapper

import cartReducer from './reducer/cartReducer';
import authReducer from './reducer/authSlice';
import wishReducer from './reducer/wishSlice';
import remTimeReducer from './reducer/timeSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  wish: wishReducer,
  time: remTimeReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'wish', 'time'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

const persistor = persistStore(store); // <-- define this

export { store, persistor }; // <-- export it
