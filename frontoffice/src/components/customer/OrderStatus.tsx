import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderStatus = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/${orderNumber}`);
        if (response.data && response.data.statusCode === 200) {
          setOrderData(response.data.data);
        } else {
          setError('Le numéro de commande n\'existe pas ou a rencontré un problème.');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des informations de commande.');
      }
    };

    fetchOrderStatus();
  }, [orderNumber]);

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
        <p className="text-lg text-gray-600">{error}</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">Chargement...</h1>
      </div>
    );
  }

  const renderOrderStatus = () => {
    switch (orderData.status) {
      case 'shipped':
        return (
          <>
            <p className="text-xl font-bold mb-1">Statut : {orderData.status}</p>
            <p className="text-gray-600">Expédié le <strong>{new Date(orderData.ShippeAt).toLocaleDateString()}</strong></p>
            <p className="text-gray-600">Livré le <strong>{new Date(orderData.delivered).toLocaleDateString()}</strong></p>
          </>
        );
      case 'delivered':
        return (
          <>
            <p className="text-xl font-bold mb-1">Statut : {orderData.status}</p>
            <p className="text-gray-600">Livré le <strong>{new Date(orderData.delivered).toLocaleDateString()}</strong></p>
          </>
        );
      case 'processing':
        return (
          <>
            <p className="text-xl font-bold mb-1">Statut : {orderData.status}</p>
            <p className="text-gray-700">Votre commande est en cours de traitement.</p>
          </>
        );
      case 'cancelled':
        return (
          <>
            <p className="text-xl font-bold mb-1">Statut : {orderData.status}</p>
            <p className="text-gray-600">Annulée le <strong>{new Date(orderData.updated_at).toLocaleDateString()}</strong></p>
            <p className="text-gray-700">Votre commande a été annulée.</p>
          </>
        );
      default:
        return (
          <>
            <p className="text-xl font-bold mb-1">Statut : {orderData.status}</p>
            <p className="text-gray-700">Statut de la commande inconnu.</p>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">ÉTAT DE LA COMMANDE {orderNumber}</h1>
      </div>
      
      <div className="flex justify-between items-start mx-auto max-w-4xl space-x-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4">
            <div className="mr-4">
              🚚 {/* Remplacez cela par une icône appropriée */}
            </div>
            <div>
              <h2 className="text-xl font-semibold">À DOMICILE</h2>
              <p className="text-gray-600">Crée le <strong>{new Date(orderData.order_date).toLocaleDateString()}</strong></p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-md flex items-center justify-between">
            <div>
              {renderOrderStatus()}
              <p className="text-gray-700">Profitez bien de votre achat</p>
            </div>
            <div>
              👍 {/* Remplacez cela par une icône appropriée */}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4">
            <div className="mr-4">
              📦 {/* Remplacez cela par une icône appropriée */}
            </div>
            <div>
              <h2 className="text-xl font-semibold">ENVIE D'EN SAVOIR PLUS SUR VOS COMMANDES ?</h2>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Si vous voulez en savoir plus sur vos achats, accédez à votre compte pour consulter l'état de toutes vos commandes.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300"
          >
            ALLER À MES ACHATS
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
