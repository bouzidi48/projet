import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (!prev.some(item => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  }, []);

  const removeFromFavorites = useCallback((productId: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      const isCurrentlyFavorite = prev.some(item => item.id === product.id);
      if (isCurrentlyFavorite) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const isFavorite = useCallback((productId: number) => {
    return favorites.some((item) => item.id === productId);
  }, [favorites]);

  return { favorites, addToFavorites, removeFromFavorites, toggleFavorite, isFavorite };
};