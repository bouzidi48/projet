import React, { useState, ReactNode, useEffect } from 'react';
import { FaEdit, FaTrash, FaBox, FaMapMarkerAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import ProfileSettings from './ProfileSettings';
import OrderList from './OrderList';
import { useUserDetails } from '../../hooks/useUserDetails';
import { Address } from '../../types/address';
import AddressForm from '../checkout/AddressForm';
import { useAddressContext } from '../../contexts/AddressContext';

interface TabContentProps {
  children: ReactNode;
  isActive: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ children, isActive }) => (
  <div className={`${isActive ? 'block' : 'hidden'}`}>
    {children}
  </div>
);


const DashboardComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'commandes' | 'adresse' | 'profil'>('commandes');
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const { user, loading, error } = useUserDetails();
  const { addresses, addAddress, updateAddress, deleteAddress, refreshAddresses } = useAddressContext();

  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  const handleAddAddress = (newAddress: Omit<Address, 'id'>) => {
    addAddress(newAddress);
    setIsAddingNewAddress(false);
  };

  const handleUpdateAddress = (updatedAddress: Address) => {
    updateAddress(updatedAddress);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      deleteAddress(addressId);
    }
  };  

  const tabStyle = (tabName: 'commandes' | 'adresse' | 'profil'): string =>
    `flex items-center px-6 py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      activeTab === tabName
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erreur : {error}</div>;
  if (!user) return <div className="text-center py-10">Aucune donnée utilisateur disponible</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Mon Compte</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 border-b">
          <h2 className="text-2xl  text-center font-semibold text-white">Bienvenue, {user.username}</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-center mb-6 space-x-2">
            <button className={tabStyle('commandes')} onClick={() => setActiveTab('commandes')}>
              <FaBox className="mr-2" /> Commandes
            </button>
            <button className={tabStyle('adresse')} onClick={() => setActiveTab('adresse')}>
              <FaMapMarkerAlt className="mr-2" /> Adresses
            </button>
            <button className={tabStyle('profil')} onClick={() => setActiveTab('profil')}>
              <FaUser className="mr-2" /> Profil
            </button>
          </div>

          <TabContent isActive={activeTab === 'commandes'}>
            <OrderList />
          </TabContent>

          <TabContent isActive={activeTab === 'adresse'}>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Mes Adresses de Livraison</h3>
              {addresses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg text-gray-800 mb-2">{address.name}</h4>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="mr-1" />
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">{address.city}, {address.postalCode}</p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingAddress(address)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-300 flex items-center"
                        >
                          <FaTrash className="mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Vous n'avez pas encore d'adresse de livraison enregistrée.</p>
              )}
              {!isAddingNewAddress && !editingAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                >
                  <FaMapMarkerAlt className="mr-2" />
                  Ajouter une nouvelle adresse
                </button>
              )}
              {(isAddingNewAddress || editingAddress) && (
                <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
                  <h4 className="text-lg font-semibold mb-4 text-blue-600">
                    {isAddingNewAddress ? 'Ajouter une nouvelle adresse' : 'Modifier l\'adresse'}
                  </h4>
                  <AddressForm
                    address={editingAddress || undefined}
                    onSubmit={(data) => {
                      if (editingAddress) {
                        handleUpdateAddress({ ...data, id: editingAddress.id });
                      } else {
                        handleAddAddress(data);
                      }
                    }}
                    onCancel={() => {
                      setIsAddingNewAddress(false);
                      setEditingAddress(null);
                    }}
                  />
                </div>
              )}
            </div>
          </TabContent>

          <TabContent isActive={activeTab === 'profil'}>
            <ProfileSettings />
          </TabContent>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;