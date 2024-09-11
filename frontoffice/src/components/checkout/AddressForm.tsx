import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaEnvelope, FaHome } from 'react-icons/fa';
import { Address } from '../../types/address';

interface AddressFormData extends Omit<Address, 'id'> {
  phone: string;
}

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Le nom de l\'adresse est requis'),
  fullName: yup.string().required('Le nom complet est requis'),
  phone: yup
    .string()
    .matches(/^(05|06|07)[0-9]{8}$/, 'Doit être un numéro de téléphone marocain valide')
    .required('Le numéro de téléphone est requis'),
  street: yup.string().required('L\'adresse est requise'),
  city: yup.string().required('La ville est requise'),
  country: yup.string().required('Le pays est requis'),
  postalCode: yup.string().matches(/^[0-9]{5}$/, 'Code postal invalide').required('Le code postal est requis'),
  isDefault: yup.boolean(),
});

const InputField: React.FC<{
  icon: React.ReactNode;
  label: string;
  name: keyof AddressFormData;
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
        className={`block w-full pl-10 pr-3 py-2 text-gray-700 bg-white border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const AddressForm: React.FC<AddressFormProps> = ({ address, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: yupResolver(schema),
    defaultValues: address || {
      name: '',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      country: '',
      postalCode: '',
      isDefault: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        icon={<FaHome />}
        label="Nom de l'adresse"
        name="name"
        register={register}
        error={errors.name?.message}
        placeholder="Ex: Domicile, Bureau"
      />
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
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          {...register('isDefault')}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
          Définir comme adresse par défaut
        </label>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {address ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;