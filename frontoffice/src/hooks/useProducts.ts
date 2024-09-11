import { useState, useEffect } from 'react';
import { productService } from '../services/products';
import { Product } from '../types/product';
import { axiosInstance } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };
  const searchProduct = async (searchQuery:string) => {
    try {
      const response = await axiosInstance.get('/product/findbyNameProduct', {
        params: { nameProduct: searchQuery }
      });

      if (response.data.statusCode === 200) {
        console.log('Produit trouvé :', response.data.data);
        setProduct(response.data.data);
        
        // Gérer les résultats de la recherche ici
      } else {
        console.error('Produit non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du produit', error);
    }
  };

  return { product, loading, error, refetch: fetchProduct,searchProduct  };
};