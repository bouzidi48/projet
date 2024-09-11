import { useState, useEffect, useCallback, useMemo } from 'react';
import { CartItemType } from '../types/carte';
import axios from 'axios';
import { axiosInstance } from '../services/api';

export const useCart = () => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true);
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
          } else {
            throw new Error('Saved cart is not an array');
          }
        }
      } catch (err) {
        setError('Failed to load cart from localStorage');
        console.error('Failed to load cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = () => {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (err) {
        setError('Failed to save cart to localStorage');
        console.error('Failed to save cart:', err);
      }
    };

    if (!isLoading) {
      saveCart();
    }
  }, [items, isLoading]);
  

  const addItem = useCallback((newItem: CartItemType) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);
      if (existingItemIndex > -1) {
        return currentItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  }, []);


const updateQuantity = useCallback(async (id: string, quantity: number) => {
  try {
    
    // Mettez à jour l'état local pour refléter le changement de quantité
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + quantity) } : item
      )
      
    );

    // Extraire les informations de l'article (exemple d'ID décomposé en parties)
    const [productId, couleurId, sizeId] = id.split('-').map(Number);

    // Envoyer la requête au backend pour mettre à jour la quantité
    const response = await axios.post('http://localhost:3000/api/product/createPanier', {
      productId: productId,
      couleurId: couleurId,
      sizeId: sizeId,
      quantity: quantity
    }, { withCredentials: true });

    if (response.data.statusCode !== 200) {
      console.error('Erreur:', response.data.message);
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité', error);
  }
}, []);


const removeItem = useCallback(async (id: string) => {
  try {
    // Extraire les informations de l'article (productId, couleurId, sizeId) à partir de l'id
    const [productId, couleurId, sizeId] = id.split('-').map(Number);

    // Construire la query string avec les paramètres
    const queryString = `productId=${productId}&couleurId=${couleurId}&sizeId=${sizeId}`;

    // Envoyer une requête DELETE à votre backend avec la query string
    const response = await axiosInstance.delete(`/product/deletefromPanier?${queryString}`, {
      withCredentials: true, // Cette option indique si les cookies doivent être envoyés avec la requête
    });

    if (response.status === 200) {
      // Supprimer l'élément de l'état local seulement si la requête est réussie
      setItems(currentItems => currentItems.filter(item => item.id !== id));
    } else {
      console.error('Erreur lors de la suppression de l\'article:', response.data.message);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
  }
}, [setItems]); // Ajout de `setItems` dans les dépendances de `useCallback`

const clearCart = useCallback(async () => {
  try {
    const response = await axiosInstance.delete(`/product/deletePanier`, {
      withCredentials: true,
    });

    if (response.data.statusCode === 200) {
      localStorage.removeItem('cart');
      setItems([]);
      console.log('Panier vidé:', items); // Assurez-vous que `items` a bien été vidé.
    } else {
      console.error('Erreur lors de la suppression du panier:', response.data.message);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
  }
}, [setItems]);

// Utilisation de `useEffect` pour appeler `clearCart` dans une situation spécifique

  

  const total = useMemo(() => 
    Array.isArray(items) ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0,
    [items]
  );

  const cartItemsCount = useMemo(() => 
    Array.isArray(items) ? items.reduce((total, item) => total + item.quantity, 0) : 0,
    [items]
  );

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    isLoading,
    error,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    cartItemsCount
  };
};