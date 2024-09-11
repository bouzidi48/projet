import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaCreditCard, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import { axiosInstance } from '../../services/api';


type PaymentMethod = 'cash' | 'card';

interface PaymentFormData {
  paymentMethod: PaymentMethod;
  nomCarte?: string;
  numeroCarte?: string;
  dateExpiration?: string;
  cvc?: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  orderId: number;
}

const schema = yup.object().shape({
  paymentMethod: yup.string().oneOf(['cash', 'card']).required(),
  nomCarte: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Le nom sur la carte est requis'),
    otherwise: (schema) => schema.notRequired(),
  }),
  numeroCarte: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .matches(/^[0-9]{16}$/, 'Le numéro de carte doit contenir 16 chiffres')
      .required('Le numéro de carte est requis'),
    otherwise: (schema) => schema.notRequired(),
  }),
  dateExpiration: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Format invalide. Utilisez MM/AA')
      .required('La date d\'expiration est requise'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cvc: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .matches(/^[0-9]{3,4}$/, 'Le CVC doit contenir 3 ou 4 chiffres')
      .required('Le CVC est requis'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit,orderId }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentMethod: 'cash',
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentMethod = watch('paymentMethod');

  const handleFormSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    if(data.paymentMethod === 'cash') {
      try {
        const response = await axiosInstance.post('/payments/cash', {orderId:orderId}, {
          withCredentials: true, // Si vous avez besoin d'envoyer les cookies de session
        });
  
        if (response.data.statusCode === 200) {
          // Si la commande est créée avec succès, rediriger vers la page de paiement
          onSubmit(data);  // ou vous pouvez rediriger directement vers la page de paiement
        } else {
          console.error('Erreur lors de la création de la commande:', response.data.data);
        }
      } catch (error) {
        console.error('Échec du traitement du paiement:', error);
        alert('Échec du paiement. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
    else {
      try {
        const response = await axiosInstance.post('/payments/card', {cardToken:"tok_visa",cardNumber:data.numeroCarte,cardExpiry:data.dateExpiration,cardCvc:data.cvc,orderId:orderId}, {
          withCredentials: true, // Si vous avez besoin d'envoyer les cookies de session
        });
  
        if (response.data.statusCode === 200) {
          // Si la commande est créée avec succès, rediriger vers la page de paiement
          onSubmit(data);  // ou vous pouvez rediriger directement vers la page de paiement
        } else {
          console.error('Erreur lors de la création de la commande:', response.data.data);
        }
      } catch (error) {
        console.error('Échec du traitement du paiement:', error);
        alert('Échec du paiement. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
    
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">MÉTHODE DE PAIEMENT</h1>
      <h2 className="text-xl mb-8 text-center text-gray-600">Choisissez votre mode de paiement préféré</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="flex justify-center space-x-4">
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <>
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${field.value === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
                  <input
                    type="radio"
                    {...field}
                    value="cash"
                    className="sr-only"
                  />
                  <FaMoneyBillWave className="text-4xl mb-2 text-green-500" />
                  <span className="font-semibold">Paiement à la livraison</span>
                </label>
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${field.value === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
                  <input
                    type="radio"
                    {...field}
                    value="card"
                    className="sr-only"
                  />
                  <FaCreditCard className="text-4xl mb-2 text-blue-500" />
                  <span className="font-semibold">Paiement par carte</span>
                </label>
              </>
            )}
          />
        </div>

        <div className="text-center text-sm text-gray-600">
          {paymentMethod === 'cash' ? (
            <p>Payez en espèces à la réception de votre commande. Aucun paiement préalable n'est nécessaire.</p>
          ) : (
            <p>Payez maintenant de manière sécurisée avec votre carte de crédit ou de débit. Visa et MasterCard sont acceptées.</p>
          )}
        </div>

        {paymentMethod === 'card' && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-6">
              <label htmlFor="nomCarte" className="block text-gray-700 text-sm font-bold mb-2">Nom sur la carte</label>
              <input
                id="nomCarte"
                {...register('nomCarte')}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              />
              {errors.nomCarte && <span className="text-red-500 text-xs italic">{errors.nomCarte.message}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="numeroCarte" className="block text-gray-700 text-sm font-bold mb-2">Numéro de carte</label>
              <input
                id="numeroCarte"
                {...register('numeroCarte')}
                placeholder="1234 5678 9012 3456"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              />
              {errors.numeroCarte && <span className="text-red-500 text-xs italic">{errors.numeroCarte.message}</span>}
            </div>

            <div className="flex mb-6">
              <div className="w-1/2 pr-2">
                <label htmlFor="dateExpiration" className="block text-gray-700 text-sm font-bold mb-2">Date d'expiration</label>
                <input
                  id="dateExpiration"
                  {...register('dateExpiration')}
                  placeholder="MM/AA"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
                {errors.dateExpiration && <span className="text-red-500 text-xs italic">{errors.dateExpiration.message}</span>}
              </div>
              <div className="w-1/2 pl-2">
                <label htmlFor="cvc" className="block text-gray-700 text-sm font-bold mb-2">CVC</label>
                <input
                  id="cvc"
                  {...register('cvc')}
                  placeholder="123"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
                {errors.cvc && <span className="text-red-500 text-xs italic">{errors.cvc.message}</span>}
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <FaLock className="mr-2 text-green-500" />
              <span>Vos informations de paiement sont sécurisées et cryptées</span>
            </div>
          </div>
        )}

        <div className="w-full px-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {isSubmitting ? 'Traitement...' : paymentMethod === 'cash' ? 'CONFIRMER LE PAIEMENT À LA LIVRAISON' : 'PAYER PAR CARTE'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;