import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/etat.png'; // Assurez-vous que l'image est bien placée à cet endroit
import { API_BASE_URL } from '../../services/api';


const OrderStatusCheck: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderNumber(e.target.value);
  };

  const handleSubmit = async () => {
    if (!orderNumber.trim()) {
      navigate('/error', { state: { message: 'Veuillez saisir un numéro de commande.' } });
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderNumber}`);
      console.log('Response:', response);
  
      if (response.data && response.data.statusCode === 200) {
        navigate(`/Orderstatus/${orderNumber}`);
      } else {
        console.log('Order not valid:', response.data);
        navigate('/order-error');
      }
    } catch (error) {
      console.error('API Error:', error);
      navigate('/order-error');
    }
  };

  

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>CONSULTEZ L’ÉTAT DE VOTRE COMMANDE</h1>
        <p style={styles.description}>Saisissez le numéro de votre commande</p>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={orderNumber}
            onChange={handleInputChange}
            placeholder="Numéro de commande"
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleSubmit}>
          VOIR L’ÉTAT DE LA COMMANDE
        </button>
      </div>
      <div style={styles.imageContainer}>
        <img src={image} alt="Commande en cours" style={styles.image} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderBottom: '2px solid #000',
    outline: 'none',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
};

export default OrderStatusCheck;
