import React from 'react';

interface CartSummaryProps {
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ total }) => {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
      <div className="flex justify-between mb-2">
        <span>Sous-total:</span>
        <span>{total.toFixed(2)} MAD</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Frais de livraison:</span>
        <span>Gratuit</span>
      </div>
      <div className="flex justify-between font-semibold text-lg mt-4">
        <span>Total:</span>
        <span>{total.toFixed(2)} MAD</span>
      </div>
      <button 
        className="w-full bg-black text-white py-2 mt-4 rounded"
        onClick={() => {
          // Handle checkout logic here
          console.log('Proceeding to checkout');
        }}
      >
        Procéder au paiement
      </button>
    </div>
  );
};

export default CartSummary;