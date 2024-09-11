import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorImage from '../../assets/OrderErreur.png'; // Assurez-vous que l'image est au bon endroit

const OrderErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <img src={errorImage} alt="Erreur" style={styles.image} />
      <h1 style={styles.title}>LE NUMÉRO DE COMMANDE N’EXISTE PAS</h1>
      <p style={styles.message}>
        Le numéro de commande ne correspond à aucune commande existante.<br />
        Veuillez vérifier que le numéro de commande saisi est correct.
      </p>
      <button style={styles.button} onClick={handleGoBack}>
        Retour à l'accueil
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center' as 'center',
    padding: '20px',
  },
  image: {
    width: '100px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  message: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
};

export default OrderErrorPage;
