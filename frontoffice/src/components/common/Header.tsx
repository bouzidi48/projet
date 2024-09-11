import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiHome, FiHeart, FiShoppingCart, FiUser, FiSearch, FiMenu, FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import axios from 'axios';
import { axiosInstance } from '../../services/api';
import ProductCard from '../product/ProductCard';
import { Product } from '../../types/product';

interface HeaderProps {
  openCartDrawer: () => void;
  setProductData: (data: any[]) => void;
}

const Header: React.FC<HeaderProps> = ({ openCartDrawer, setProductData }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const { items, clearCart } = useCart();
  const [products, setProducts] = useState<Product>();


  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  console.log(items)
  const updateMedia = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);

  }, [updateMedia]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
  };

  const searchProduct = async () => {
    try {
      const response = await axiosInstance.get('/product/findbyNameProduct', {
        params: { nameProduct: searchQuery }
      });

      if (response.data.statusCode === 200) {
        console.log('Produit trouvé :', response.data.data);
        setProducts(response.data.data);

        // Gérer les résultats de la recherche ici
      } else {
        console.error('Produit non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du produit', error);
    }
  };
  console.log(products?.id)

  return (
    <header>
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-xl focus:outline-none"
            aria-label="Menu"
            title="Menu"
            onClick={() => setIsNavbarOpen(true)}
          >
            <FiMenu className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <Link to="/">
            <h1 className='font-montserrat font-thin text-3xl'>HARMONY</h1>
          </Link>
        </div>

        <div className={`flex-grow mx-8 ${isMobile ? 'hidden' : 'flex'} justify-end`}>
          <div className="relative text-gray-600">
            <input
              type="text"
              placeholder="Recherchez..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              title="Search"
              className="absolute right-2 top-2"
              onClick={searchProduct}
            >
              {products?.id ? (
                <Link to={`/product/${products.id}`}>
                  <FiSearch className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                </Link>
              ) : (
                <FiSearch className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-600">
          {!isMobile && (
            <>
              <Link to="/" aria-label="Home" title="Home" className="text-2xl focus:outline-none">
                <FiHome className="w-6 h-6" strokeWidth={1.5} />
              </Link>
              <Link to="/favorites" aria-label="Favorites" title="Favorites" className="focus:outline-none relative">
                <FiHeart className="w-6 h-6" strokeWidth={1.5} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label="Cart"
            title="Cart"
            className="focus:outline-none relative"
            onClick={openCartDrawer}
          >
            <FiShoppingCart className="w-6 h-6" strokeWidth={1.5} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </button>
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              aria-label="Account"
              title="Account"
              className="focus:outline-none"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            >
              <FiUser className="w-6 h-6" strokeWidth={1.5} />
            </button>
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon Compte</Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-2" /> Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiLogIn className="mr-2" /> Connexion
                    </Link>
                    <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiUserPlus className="mr-2" /> Inscription
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>



      <Navbar isOpen={isNavbarOpen} onClose={() => setIsNavbarOpen(false)} />
    </header>
  );
};

export default Header;
