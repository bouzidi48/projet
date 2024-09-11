import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../../services/OrderService';
import { Order } from '../../types/order';
import { useUserDetails } from '../../hooks/useUserDetails';

const OrderList: React.FC = () => {
  const [commandes, setCommandes] = useState<Order[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const { user, loading: userLoading, error: userError } = useUserDetails();

  useEffect(() => {
    const recupererCommandes = async () => {
      if (userLoading) return;
      if (userError) {
        setErreur("Erreur lors de la récupération des informations utilisateur");
        setChargement(false);
        return;
      }
      if (!user) {
        setErreur("Utilisateur non authentifié");
        setChargement(false);
        return;
      }
  
      try {
        const commandesRecuperees = await OrderService.getOrdersByUser(user.id);
        setCommandes(commandesRecuperees);
      } catch (err) {
        setErreur(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des commandes');
      } finally {
        setChargement(false);
      }
    };
  
    recupererCommandes();
  }, [user, userLoading, userError]);
  

  if (chargement || userLoading) return <div className="text-center py-10">Chargement de vos commandes...</div>;
  if (erreur || userError) return <div className="text-center py-10 text-red-500">Erreur : {erreur || userError}</div>;

  if (commandes.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Vous n'avez pas encore de commandes</h2>
        <p className="mb-6 text-gray-600">Découvrez notre sélection de produits exceptionnels et commencez votre shopping dès maintenant !</p>
        <Link to="/shop" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300">
          Explorer notre boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Vos Commandes</h2>
      <div className="space-y-6">
        {commandes.map((commande) => (
          <div key={commande.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Commande #{commande.id}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  commande.status === 'delivered' ? 'bg-green-200 text-green-800' :
                  commande.status === 'processing' ? 'bg-yellow-200 text-yellow-800' :
                  commande.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {commande.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Articles</h3>
                <ul className="list-disc pl-5">
                  {commande.orderItems.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.quantity}x {item.product.nameProduct} - {(item.product.price * item.quantity).toFixed(2)}€
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Date : {new Date(commande.created_at).toLocaleDateString('fr-FR')}</span>
                <span className="font-semibold">Total : {commande.total_amount.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;