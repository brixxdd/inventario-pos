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
      state.sales.push(action.payload);
    },
    updateStock: (state, action) => {
      // Lógica para actualizar el stock
      const { productId, quantity } = action.payload;
      // Implementa la lógica necesaria
    }
  }
});

export const { addSale, updateStock } = salesSlice.actions;
export default salesSlice.reducer; 