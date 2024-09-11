import React from 'react';
import ProductCard from '../../components/product/ProductCard';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <FiHeart className="text-red-500 w-8 h-8 mr-3" />
        <h1 className="text-3xl font-semibold text-gray-800">Mes Favoris</h1>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="text-gray-300 w-16 h-16 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-4">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <FiShoppingBag className="mr-2" />
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-8">
            Vous avez {favorites.length} produit{favorites.length > 1 ? 's' : ''} dans vos favoris
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <div key={product.id} className="transform hover:scale-105 transition duration-300">
                <ProductCard productId={product.id} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;