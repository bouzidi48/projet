import axios from 'axios';
import { Cart, CartItemType } from '../types/carte';

const API_URL = 'http://localhost:3000/api';

export const CartService = {
  createOrUpdateCart: async (item: Omit<CartItemType, 'price'>): Promise<Cart> => {
    try {
      const response = await axios.post(`${API_URL}/product/createPanier`, item);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw new Error('Failed to update cart');
    }
  },

  // Add more cart-related API calls here if needed
};