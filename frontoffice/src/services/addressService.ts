// src/services/AddressService.ts

import { Address } from "../types/address";

const LOCAL_STORAGE_KEY = 'userAddresses';

export const AddressService = {
  getUserAddresses: (userId: string): Address[] => {
    const allAddresses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    return allAddresses[userId] || [];
  },

  saveUserAddresses: (userId: string, addresses: Address[]): void => {
    const allAddresses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    allAddresses[userId] = addresses;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allAddresses));
  },

  addAddress: (userId: string, address: Omit<Address, 'id'>): Address => {
    const addresses = AddressService.getUserAddresses(userId);
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(), // Generate a unique ID
    };
    
    // If this is the first address or it's set as default, make sure it's the only default
    if (address.isDefault || addresses.length === 0) {
      addresses.forEach(addr => addr.isDefault = false);
      newAddress.isDefault = true;
    }
    
    addresses.push(newAddress);
    AddressService.saveUserAddresses(userId, addresses);
    return newAddress;
  },

  updateAddress: (userId: string, updatedAddress: Address): Address => {
    const addresses = AddressService.getUserAddresses(userId);
    const index = addresses.findIndex(addr => addr.id === updatedAddress.id);
    
    if (index !== -1) {
      // If the updated address is set as default, update other addresses
      if (updatedAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }
      addresses[index] = updatedAddress;
      AddressService.saveUserAddresses(userId, addresses);
    }
    
    return updatedAddress;
  },

  deleteAddress: (userId: string, addressId: string): void => {
    let addresses = AddressService.getUserAddresses(userId);
    addresses = addresses.filter(addr => addr.id !== addressId);
    
    // If we deleted the default address and there are other addresses, make the first one default
    if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
      addresses[0].isDefault = true;
    }
    
    AddressService.saveUserAddresses(userId, addresses);
  },
};