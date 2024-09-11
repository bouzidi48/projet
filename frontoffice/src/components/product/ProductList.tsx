import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

interface ProductListProps {
  categoryId?: number;
  searchTerm?: string;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId, searchTerm }) => {
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = [...products];

    if (categoryId) {
      filteredProducts = filteredProducts.filter(product => product.category?.id === categoryId);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.nameProduct.toLowerCase().includes(lowercasedTerm) ||
        product.description.toLowerCase().includes(lowercasedTerm)
      );
    }

    filteredProducts.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        return sortOrder === 'asc' 
          ? a.nameProduct.localeCompare(b.nameProduct, 'fr')
          : b.nameProduct.localeCompare(a.nameProduct, 'fr');
      }
    });

    return filteredProducts;
  }, [products, categoryId, searchTerm, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: 'price' | 'name') => {
    if (newSortBy === sortBy) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erreur: {error.message}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Produits</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleSortChange('name')}
            className={`px-3 py-1 rounded ${sortBy === 'name' ? 'bg-gray-200' : ''}`}
            aria-label="Trier par nom"
          >
            Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortChange('price')}
            className={`px-3 py-1 rounded ${sortBy === 'price' ? 'bg-gray-200' : ''}`}
            aria-label="Trier par prix"
          >
            Prix {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-10">Aucun produit trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} productId={product.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;