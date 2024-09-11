import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaEnvelope, FaHome } from 'react-icons/fa';
import { Address } from '../../types/address';
import { useAddressContext } from '../../contexts/AddressContext';
import { axiosInstance } from '../../services/api';


interface ShippingFormData {
  addressName: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData, id: number) => void;
  userId: string;
}

const schema = yup.object().shape({
  addressName: yup.string().required('Le nom de l\'adresse est requis'),
  fullName: yup.string().required('Le nom complet est requis'),
  phone: yup
    .string()
    .matches(/^(05|06|07)[0-9]{8}$/, 'Doit être un numéro de téléphone marocain valide')
    .required('Le numéro de téléphone est requis'),
  street: yup.string().required('L\'adresse est requise'),
  city: yup.string().required('La ville est requise'),
  country: yup.string().required('Le pays est requis'),
  postalCode: yup.string().matches(/^[0-9]{5}$/, 'Code postal invalide').required('Le code postal est requis'),
});

const InputField: React.FC<{
  icon: React.ReactNode;
  label: string;
  name: keyof ShippingFormData;
  register: any;
  error?: string;
  type?: string;
  placeholder?: string;
}> = ({ icon, label, name, register, error, type = 'text', placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`block w-full pl-10 pr-3 py-2 text-gray-700 bg-white border ${error ? 'border-red-300' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const ShippingForm: React.FC<ShippingFormProps> = ({ onSubmit, userId }) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');
  const [isNewAddress, setIsNewAddress] = useState(true);

  const { addresses, addAddress } = useAddressContext();

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ShippingFormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    setSelectedAddressId('new');
    setIsNewAddress(true);
    reset({
      addressName: '',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      country: '',
      postalCode: '',
    });
  }, [userId, reset]);

  const fillFormWithAddress = (address: Address) => {
    setValue('addressName', address.adress);
    setValue('fullName', address.name);
    setValue('phone', address.phone);
    setValue('street', address.street);
    setValue('city', address.city);
    setValue('country', address.country);
    setValue('postalCode', address.postalCode);
  };


  const handleAddressSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setIsNewAddress(true);
      reset({
        addressName: '',
        fullName: '',
        phone: '',
        street: '',
        city: '',
        country: '',
        postalCode: '',
      });
    } else {
      setIsNewAddress(false);
      const selectedAddress = addresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        fillFormWithAddress(selectedAddress);
      }
    }
  };

  const handleFormSubmit = async (data: ShippingFormData) => {
    try {
      if (isNewAddress) {
        const newAddress: Omit<Address, 'id'> = {
          adress: data.addressName,
          name: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          isDefault: addresses.length === 0,
        };
        addAddress(newAddress);
      }
      const address = {
        phone: data.phone,
        name: data.fullName,
        address: data.addressName,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
      }
      // Préparation des données pour l'appel API
      const createOrderDto = {
        shippingAddress: address,
        // Si vous avez une adresse de facturation différente, vous pouvez l'ajouter ici
      };

      // Appel API avec Axios
      const response = await axiosInstance.post('/orders/create', createOrderDto, {
        withCredentials: true, // Si vous avez besoin d'envoyer les cookies de session
      });

      if (response.data.statusCode === 200) {
        // Si la commande est créée avec succès, rediriger vers la page de paiement
        onSubmit(data, response.data.data.id);  // ou vous pouvez rediriger directement vers la page de paiement
      } else {
        console.error('Erreur lors de la création de la commande:', response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-8 py-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Informations de livraison</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner une adresse
            </label>
            <select
              id="savedAddress"
              value={selectedAddressId}
              onChange={handleAddressSelection}
              className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="new">Nouvelle adresse</option>
              {addresses.map(addr => (
                <option key={addr.id} value={addr.id}>{addr.name}</option>
              ))}
            </select>
          </div>

          {isNewAddress && (
            <InputField
              icon={<FaHome />}
              label="Nom de l'adresse"
              name="addressName"
              register={register}
              error={errors.addressName?.message}
              placeholder="Ex: Domicile, Bureau"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              icon={<FaUser />}
              label="Nom complet"
              name="fullName"
              register={register}
              error={errors.fullName?.message}
              placeholder=""
            />
            <InputField
              icon={<FaPhone />}
              label="Téléphone"
              name="phone"
              register={register}
              error={errors.phone?.message}
              placeholder="06XXXXXXXX"
            />
          </div>
          <InputField
            icon={<FaMapMarkerAlt />}
            label="Adresse"
            name="street"
            register={register}
            error={errors.street?.message}
            placeholder="123 Rue Example"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              icon={<FaCity />}
              label="Ville"
              name="city"
              register={register}
              error={errors.city?.message}
              placeholder="Fès"
            />
            <InputField
              icon={<FaGlobe />}
              label="Pays"
              name="country"
              register={register}
              error={errors.country?.message}
              placeholder="Maroc"
            />
            <InputField
              icon={<FaEnvelope />}
              label="Code Postal"
              name="postalCode"
              register={register}
              error={errors.postalCode?.message}
              placeholder="20000"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-102"
            >
              PASSER AU PAIEMENT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingForm;