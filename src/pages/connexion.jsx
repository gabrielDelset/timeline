import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from '../tools/API/api';

const LoginPage = ({setLoggedIn, setEmail}) => {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');  
  const [Errormessage, setErrorMessage] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();  // Reset error message
 
    setErrorMessage(''); // Reset error message

    try {
      // Appel à l'API pour la connexion
      const response = await connect(identifiant, motDePasse);

      // Vérification si l'API renvoie un succès (code 200 par exemple)
      if (response.code === 200) {
        setLoggedIn(true);
        setEmail(identifiant); // Mise à jour de l'état global avec l'identifiant
      } else {
        setErrorMessage('Identifiant ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connexion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Identifiant</label>
          <input
            type="text"
            placeholder="Entrez votre identifiant"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>Valider</button>
      </form>
    </div>
  );
};

// Styles en ligne (vous pouvez utiliser un fichier CSS séparé si vous le préférez)
const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '50px auto',
    margintop: '50000px auto',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    
  },
  inputGroup: {
    marginBottom: '15px',
     
  },
  label: {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default LoginPage;
