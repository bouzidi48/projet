import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import ThankYou from '../../components/checkout/ThankYou';
import { useCart } from '../../hooks/useCart';
import { FaShoppingBag, FaRegSadTear } from 'react-icons/fa';
import { OrderService } from '../../services/OrderService';
import { OrderItem, PaymentMethod, shippingAddress } from '../../types/order';
import { useUserDetails } from '../../hooks/useUserDetails';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'thank-you'>('shipping');
  const [shippingData, setShippingData] = useState<shippingAddress | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number>(0);
  const { user, loading: userLoading, error: userError } = useUserDetails();

  const cartItems = location.state?.cartItems as CartItem[] || [];

  if (userLoading) {
    return <div className="text-center py-16">Chargement...</div>;
  }

  if (userError || !user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Erreur d'authentification</h2>
        <p className="mb-4">Veuillez vous connecter pour continuer votre commande.</p>
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
          Se connecter
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaRegSadTear className="mx-auto text-6xl text-gray-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Oops ! Votre panier est vide</h1>
        <p className="text-xl mb-8 text-gray-600">
          Il semble que vous n'ayez pas encore trouvé votre bonheur. Mais ne vous inquiétez pas, nous avons une collection incroyable qui n'attend que vous !
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <FaShoppingBag className="mr-2" />
          Découvrir nos trésors
        </Link>
        <p className="mt-6 text-sm text-gray-500">
          Des pièces uniques vous attendent. Ne manquez pas l'opportunité de vous faire plaisir !
        </p>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10; // Example shipping cost
  const tax = subtotal * 0.2; // Example tax calculation (20%)
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (data: shippingAddress, orderId: number) => {
    setOrderId(orderId);
    setShippingData(data);
    setStep('payment');
  };

  const handlePaymentSubmit = async (data: { paymentMethod: PaymentMethod }) => {
    if (!shippingData) {
      console.error("Shipping data is missing");
      return;
    }
    
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.id.toString(),
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity
    }));

    try {
      const order = await OrderService.createOrder(
        user.id,
        orderItems,
        shippingData,
        data.paymentMethod
      );

      setOrderNumber(order.id);
      clearCart();
      setStep('thank-you');
    } catch (error) {
      console.error("Failed to create order:", error);
      // Handle error (show message to user, etc.)
    }
  };

  const orderData = {
    items: cartItems,
    subtotal,
    shipping,
    tax,
    total,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {step !== 'thank-you' && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">Finaliser votre commande</h1>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-2/3 px-4 mb-8">
              {step === 'shipping' && <ShippingForm onSubmit={handleShippingSubmit} userId={user.id.toString()} />}
              {step === 'payment' && <PaymentForm onSubmit={handlePaymentSubmit} orderId={orderId} />}
            </div>
            <div className="w-full lg:w-1/3 px-4">
              <div className="bg-gray-100 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} MAD</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Frais de livraison</span>
                  <span>{shipping.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes</span>
                  <span>{tax.toFixed(2)} MAD</span>
                </div>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {step === 'thank-you' && orderId && (
        <ThankYou orderNumber={orderId.toString()} orderData={orderData} />
      )}
    </div>
  );
};

export default Checkout;