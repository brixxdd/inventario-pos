import { createSlice } from '@reduxjs/toolkit';

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [],
    loading: false,
    error: null
  },
  reducers: {
    addSale: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.sales = action.payload;
      } else {
        state.sales.push(action.payload);
      }
    },
    updateStock: (state, action) => {
      const { productId, quantity } = action.payload;
      // Implementa la lógica necesaria
    }
  }
});

export const { addSale, updateStock } = salesSlice.actions;
export default salesSlice.reducer; 