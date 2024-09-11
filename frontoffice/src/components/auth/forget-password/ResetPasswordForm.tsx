import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/auth';

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await userService.resetPassword(password, confirmPassword);
      setSuccess(response.message);
      // We'll redirect after showing the success message for a short time
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la réinitialisation du mot de passe.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Réinitialiser le mot de passe</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Entrez votre nouveau mot de passe pour {email}
      </p>
      <div className="mt-4">
        <input
          type="password"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading || success !== ''}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </button>
      </div>
      {success && (
        <p className="mt-2 text-center text-sm text-gray-600">
          Redirection vers la page de connexion dans quelques secondes...
        </p>
      )}
    </form>
  );
};

export default ResetPasswordForm;