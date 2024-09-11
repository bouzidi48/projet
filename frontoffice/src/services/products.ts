import axios from 'axios';
import { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_URL}/product`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await axios.get(`${API_URL}/product/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },
};