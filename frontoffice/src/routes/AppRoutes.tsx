import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/public/Home';
import Shop from '../pages/public/Shop';
import ProductPage from '../pages/public/ProductPage';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import AboutUs from '../pages/public/About';
import ContactUs from '../pages/public/ContactUs';
import Category from '../pages/public/Category';
import { useAuth } from "../hooks/useAuth";
import NotFound from '../pages/public/NotFound';
import Dashboard from '../pages/private/Dashboard';
import Profile from '../pages/private/Profile';
import Orders from '../pages/private/Orders';
import Checkout from '../pages/private/Checkout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CartPage from '../pages/public/Carte';
import FavoritesPage from '../pages/public/FavoritePage';
import VerificationForm from '../components/auth/VerificationForm';
import PasswordResetFlow from '../components/auth/forget-password/PasswordResetFlow';
import Cookie from '../pages/public/Cookie';
import About from '../pages/public/About';
import Engagement from '../pages/public/Engagement';
import Ordererror from '../pages/public/Ordererror';
import CheckOrder from '../pages/public/CheckOrder';
import Orderstatus from '../pages/public/Orderstatus';
import Souscategories from '../pages/public/Souscategories';
import DemandeAdmin from '../pages/public/DemandeAdmin';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Router>
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/shop" replace /> : <Login />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerificationForm />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cookie" element={<Cookie/>}/>
          <Route path="/category/:id" Component={Category} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/reset-password" element={<PasswordResetFlow/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/check-order" element={<CheckOrder/>} />
          <Route path="/Orderstatus/:orderNumber" element={<Orderstatus />} />
          <Route path="/order-error" element={< Ordererror/>} />
          <Route path="/Engagement" element={<Engagement/>}/>
          <Route path="/souscategories" element={<Souscategories />} />
          <Route path="/DemandeAdmin" element={<DemandeAdmin />} />
            {/* Private routes */}
            <Route path="/dashboard" element={isAuthenticated? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/orders" element={isAuthenticated? <Orders /> : <Navigate to="/login" replace />} />
            <Route path="/checkout" element={isAuthenticated? <Checkout /> : <Navigate to="/login" replace />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
        </Routes>
      </PublicLayout>
    </Router>
  );
};

export default AppRoutes;