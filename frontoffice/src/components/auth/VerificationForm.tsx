import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService, ApiError } from '../../services/auth';

type VerificationData = {
  code: string;
};

const VerificationForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<VerificationData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;

  const onSubmit = async (data: VerificationData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.verifyRegistration(username, data.code);
      setSuccess(true);
      // Instead of an alert, we set a success state
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect to login after 2 seconds
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Une erreur inattendue est survenue lors de la vérification');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Vérifiez votre inscription
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veuillez entrer le code à 6 chiffres envoyé à votre adresse e-mail.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Vérification réussie ! Redirection vers la page de connexion...</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="code" className="sr-only">Code de vérification</label>
            <input
              id="code"
              {...register('code', { 
                required: 'Le code est requis',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Le code doit contenir 6 chiffres'
                }
              })}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Code à 6 chiffres"
            />
            {errors.code && <span className="text-red-500 text-xs italic">{errors.code.message}</span>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                (isSubmitting || success) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Vérification en cours...' : 'Vérifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;