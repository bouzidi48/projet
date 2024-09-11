import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppRoutes from './routes/AppRoutes';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AddressProvider } from './contexts/AddressContext';
import Footer from './components/common/Footer';
const App: React.FC = () => {

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AddressProvider >
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <Footer/>
            </div>
          </AddressProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;