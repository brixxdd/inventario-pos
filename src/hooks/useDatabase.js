import { useCallback } from 'react';

export const useDatabase = () => {
  const getProducts = useCallback(async () => {
    try {
      const products = await window.electron.invoke('db:getProducts');
      return products;
    } catch (error) {
      console.error('Error en getProducts:', error);
      throw error;
    }
  }, []);

  const addProduct = useCallback(async (product) => {
    try {
      return await window.electron.invoke('db:addProduct', product);
    } catch (error) {
      console.error('Error en addProduct:', error);
      throw error;
    }
  }, []);

  const createSale = useCallback(async (saleData) => {
    try {
      return await window.electron.invoke('db:createSale', saleData);
    } catch (error) {
      console.error('Error en createSale:', error);
      throw error;
    }
  }, []);

  const getSales = useCallback(async () => {
    try {
      return await window.electron.invoke('db:getSales');
    } catch (error) {
      console.error('Error en getSales:', error);
      throw error;
    }
  }, []);

  const checkSkuExists = useCallback(async (sku) => {
    try {
      return await window.electron.invoke('db:checkSku', sku);
    } catch (error) {
      console.error('Error al verificar SKU:', error);
      throw error;
    }
  }, []);

  return {
    getProducts,
    addProduct,
    createSale,
    getSales,
    checkSkuExists
  };
}; 