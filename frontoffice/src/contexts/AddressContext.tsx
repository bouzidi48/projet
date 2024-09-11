// src/contexts/AddressContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Address } from '../types/address';
import { AddressService } from '../services/addressService';
import { useAuth } from '../hooks/useAuth';

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  refreshAddresses: () => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddressContext must be used within an AddressProvider');
  }
  return context;
};

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { user } = useAuth();

  const refreshAddresses = useCallback(async () => {
    if (user?.id) {
      const userAddresses = await AddressService.getUserAddresses(user.id.toString());
      setAddresses(userAddresses);
    } else {
      setAddresses([]);
    }
  }, [user]);

  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user?.id) {
      const newAddress = AddressService.addAddress(user.id.toString(), address);
      setAddresses(prev => [...prev, newAddress]);
    }
  };

  const updateAddress = (address: Address) => {
    if (user?.id) {
      const updatedAddress = AddressService.updateAddress(user.id.toString(), address);
      setAddresses(prev => prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    }
  };

  const deleteAddress = (addressId: string) => {
    if (user?.id) {
      AddressService.deleteAddress(user.id.toString(), addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    }
  };

  return (
    <AddressContext.Provider value={{ 
      addresses, 
      addAddress, 
      updateAddress, 
      deleteAddress, 
      refreshAddresses
    }}>
      {children}
    </AddressContext.Provider>
  );
};