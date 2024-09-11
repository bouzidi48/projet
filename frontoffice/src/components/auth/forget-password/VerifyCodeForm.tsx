import React, { useState } from 'react';
import { userService } from '../../../services/auth';

interface VerifyCodeFormProps {
  email: string;
  onCodeVerified: () => void;
}

const VerifyCodeForm: React.FC<VerifyCodeFormProps> = ({ email, onCodeVerified }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await userService.verifyPasswordResetCode(code);
      onCodeVerified();
    } catch (err) {
      setError('Code invalide. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Vérification du code</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Entrez le code à 6 chiffres envoyé à {email}
      </p>
      <div className="mt-4">
        <input
          type="text"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Code à 6 chiffres"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />
      </div>
      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Vérification...' : 'Vérifier le code'}
        </button>
      </div>
    </form>
  );
};

export default VerifyCodeForm;