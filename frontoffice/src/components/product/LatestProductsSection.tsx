import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../product/ProductCard';

const LatestProductsSection: React.FC = () => {
  const { products, loading, error } = useProducts();

  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdate).getTime() - new Date(a.createdate).getTime())
      .slice(0, 4);  // Get the 4 most recent products
  }, [products]);

  if (loading) return <div className="text-center py-8">Loading latest products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Latest Arrivals</h2>
          <Link 
            to="/shop" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} productId={product.id} />
          ))}
        </div>
        {latestProducts.length === 0 && (
          <p className="text-center text-gray-600">No products available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default LatestProductsSection;