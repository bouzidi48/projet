import React, { useState } from 'react';
import Header from '../components/common/Header';
import CartDrawer from '../components/cart/CartDrawer';
import Footer from '../components/common/Footer';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCartDrawer = () => setIsCartOpen(true);
  const closeCartDrawer = () => setIsCartOpen(false);
  const [productData, setProductData] = useState<any[]>([]);
  return (
    <div className="public-layout">
       <Header openCartDrawer={openCartDrawer} setProductData={setProductData} />
       {/* CART DRAWER */}
       <CartDrawer   isOpen={isCartOpen} onClose={closeCartDrawer} />
      <main className="container mx-auto mt-0 px-4">
        {children}
      </main>
       {/* FOOTER */}
       
    </div>
  );
};

export default PublicLayout;