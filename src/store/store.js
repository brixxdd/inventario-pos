import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import inventoryReducer from './inventorySlice';
import salesReducer from './salesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    sales: salesReducer
  }
}); 