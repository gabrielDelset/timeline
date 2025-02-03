import { createContext, useContext, useState } from 'react';

// Création du contexte
const AuthContext = createContext();

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ email, setEmail, loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte plus facilement
export const useAuth = () => useContext(AuthContext);
