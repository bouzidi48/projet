import React, { useState } from 'react';
import axios from 'axios';

const ContactFom = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: '',
    numero_commande: '',
    telephone: '',
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Convertir numero_commande en nombre
    const { numero_commande, ...restFormData } = formData;
    const updatedFormData = {
      ...restFormData,
      numero_commande: numero_commande ? Number(numero_commande) : null,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/contacts/create', updatedFormData);
      
      if (response.data && response.data.statusCode === 200) {
        setSuccessMessage('Votre message a été envoyé avec succès.');
      } else {
        setErrorMessage('Il y a eu un problème lors de l\'envoi de votre message.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(`Erreur ${error.response.status}: ${error.response.data.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.'}`);
      } else {
        setErrorMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Contactez-nous</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.nom}
            placeholder="Votre nom"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.email}
            placeholder="Votre email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Message</label>
          <textarea
            name="message"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.message}
            placeholder="Votre message"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Numéro de commande</label>
          <input
            type="text"
            name="numero_commande"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.numero_commande}
            placeholder="Numéro de commande"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Téléphone</label>
          <input
            type="text"
            name="telephone"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.telephone}
            placeholder="Votre téléphone"
            required
          />
        </div>
        <button type="submit" className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300">
          Envoyer
        </button>
      </form>

      {/* Message de succès ou d'erreur */}
      {successMessage && (
        <div className="mt-6 text-green-600 font-bold text-center">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mt-6 text-red-600 font-bold text-center">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ContactFom;