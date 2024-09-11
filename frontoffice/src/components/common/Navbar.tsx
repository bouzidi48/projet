import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiSearch, FiUser, FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi';
import imageMenu from '../../assets/menu.png';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios'; // Ajout d'axios pour les requêtes API
import { axiosInstance } from '../../services/api';

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [categories, setCategories] = useState([]); // État pour stocker les catégories parentes
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Récupérer les catégories parentes depuis le backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories/ParentCategories');
        console.log(response.data.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories parentes :", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full sm:w-[600px] h-full bg-white shadow-lg z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" onClick={onClose}>
            <h1 className='font-montserrat font-light'>HARMONY</h1>
          </Link>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close Menu"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="relative text-gray-600">
          <input
            type="text"
            placeholder="Recherchez..."
            className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <FiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className={`p-6 ${!isMobile ? 'flex' : ''}`}>
        <nav className={`space-y-6 ${!isMobile ? 'w-1/2 pr-4' : ''}`}>
          <div>
            <h3 className="text-xs font-normal text-gray-800 uppercase tracking-wide mb-3">Nouveautés</h3>
            <ul className="text-s space-y-3 text-gray-500 font-light">
              <li><Link to="/nouveau" onClick={onClose} className="hover:text-indigo-600 transition-colors">Nouvelle Collection</Link></li>
              <li><Link to="/str-teen" onClick={onClose} className="hover:text-indigo-600 transition-colors">STR TEEN</Link></li>
              <li><Link to="/casual-sport" onClick={onClose} className="hover:text-indigo-600 transition-colors">Casual Sport</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-normal text-gray-800 uppercase tracking-wide mb-3">Catégories</h3>
            <ul className="text-s space-y-3 text-gray-500 font-light">
              {categories?.map((category) => (
                <li key={category?.id}>
                  <Link to={`/category/${category?.id}`} onClick={onClose} className="hover:text-indigo-600 transition-colors">
                    {category?.nameCategory}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-normal text-gray-800 uppercase tracking-wide mb-3">Guides</h3>
            <ul className="text-s space-y-3 text-gray-500 font-light">
              <li><Link to="/jeans-fit-guide" onClick={onClose} className="hover:text-indigo-600 transition-colors">Guide des coupes de jeans</Link></li>
              <li><Link to="/size-guide" onClick={onClose} className="hover:text-indigo-600 transition-colors">Guide des tailles</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-normal text-gray-800 uppercase tracking-wide mb-3">Account</h3>
            <ul className="text-s space-y-3 text-gray-500 font-light">
              {isAuthenticated ? (
                <>
                  <li><Link to="/dashboard" onClick={onClose} className="hover:text-indigo-600 transition-colors"><FiUser className="inline-block mr-2" />Mon Compte</Link></li>
                  <li><button onClick={() => { logout(); onClose(); }} className="hover:text-indigo-600 transition-colors"><FiLogOut className="inline-block mr-2" />Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" onClick={onClose} className="hover:text-indigo-600 transition-colors"><FiLogIn className="inline-block mr-2" />Login</Link></li>
                  <li><Link to="/register" onClick={onClose} className="hover:text-indigo-600 transition-colors"><FiUserPlus className="inline-block mr-2" />Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {!isMobile && (
          <div className="w-1/2 pl-4">
            <div className="relative">
              <img
                src={imageMenu}
                alt="Menu Promotional Image"
                className="w-full h-full object-cover rounded-lg"
              />
              <Link to="/new-in" className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">Découvrez</h2>
                <h2 className="text-xl">NEW IN</h2>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
