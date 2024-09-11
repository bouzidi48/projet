import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../../hooks/useCart';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ThankYouProps {
  orderNumber: string;
  orderData: OrderData;
}

const ThankYou: React.FC<ThankYouProps> = ({ orderNumber, orderData }) => {
  const { clearCart, items } = useCart();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Optionnel : Vider le panier automatiquement lorsque la page ThankYou se charge
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    console.log('État des items mis à jour:', items);
  }, [items]);

  return (
    <div className="text-center py-8 px-4">
      <FaCheckCircle className="text-green-500 text-6xl sm:text-7xl mx-auto mb-6 animate-bounce" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">🎉 Félicitations! 🎉</h1>
      <p className="text-xl sm:text-2xl mb-6">Votre commande est confirmée!</p>
      <div className="bg-gray-100 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <p className="text-lg mb-2">Numéro de commande:</p>
        <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Résumé de la commande</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Articles</h3>
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-bold mb-2">Détails</h3>
            <div className="flex justify-between mb-2">
              <span>Sous-total</span>
              <span>{orderData.subtotal.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Frais de livraison</span>
              <span>{orderData.shipping.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Taxes</span>
              <span>{orderData.tax.toFixed(2)} MAD</span>
            </div>
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{orderData.total.toFixed(2)} MAD</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-8 text-gray-600 max-w-2xl mx-auto">
        Un e-mail de confirmation avec les détails de votre commande a été envoyé à votre adresse.
      </p>
      <Link 
        to="/" 
        onClick={() => {
          clearCart();  // Vider le panier lorsqu'on clique sur le bouton
          window.location.reload();  // Rafraîchir la page
        }}
        className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline inline-block transition duration-300 ease-in-out transform hover:scale-105"
      >
        Retour à la boutique
      </Link>
    </div>
  );
};

export default ThankYou;
