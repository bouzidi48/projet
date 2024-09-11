import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity , total } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    console.log('État des items mis à jour:', items);
  }, [items, ]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout', { state: { cartItems: items } });
  };

  return (
    <div className={`fixed inset-0 overflow-hidden ${isOpen ? 'z-50' : 'z-0 pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        ></div>
        <section
          className={`absolute inset-y-0 right-0 pl-10 max-w-full flex ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'} transition ease-in-out duration-500 sm:duration-700`}
          aria-labelledby="slide-over-heading"
        >
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900" id="slide-over-heading">
                    Panier
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={onClose}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Fermer le panneau</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    {items.length > 0 ? (
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {items.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">{item.price.toFixed(2)} MAD</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.color} | {item.size}</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                                  >
                                    -
                                  </button>
                                  <p className="text-gray-500 mx-2">Qté {item.quantity}</p>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="flex">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500">Votre panier est vide.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Sous-total</p>
                  <p>{total.toFixed(2)} MAD</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Livraison et taxes à ajouter lors de la finalisation de votre commande.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full"
                  >
                    Commander
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    ou{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-medium hover:text-indigo-500"
                      onClick={onClose}
                    >
                      Continuer vos achats<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(CartDrawer);
