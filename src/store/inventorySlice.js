import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    updateStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock -= quantity;
      }
    }
  }
});

export const { addProduct, updateProduct, deleteProduct, updateStock } = inventorySlice.actions;
export default inventorySlice.reducer; 