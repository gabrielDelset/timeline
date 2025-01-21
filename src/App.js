import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

// Importation des composants
import Connexion from './pages/connexion'; // Assurez-vous que le fichier connexion existe
import HomeScreen from './pages/home';
//import HomeScreen from './pages/description';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // État pour vérifier si l'utilisateur est connecté
  const [email, setEmail] = useState('');

  return (
    <div style={styles.container}>
    <BrowserRouter>
    <div style={{ backgroundColor: '#575757', minHeight: '100vh' }}>
      {loggedIn ? (
        <HomeScreen email={email} />
      ) : (
        <Connexion setLoggedIn={setLoggedIn} setEmail={setEmail} />
      )}
      </div>
    </BrowserRouter>
    </div>
  );
}


const styles = {
  container: {
    backgroundColor: '#f9f9f9'
  },
};


export default App;
