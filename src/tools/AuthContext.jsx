import { createContext, useContext, useState } from 'react';

// Création du contexte
const AuthContext = createContext();

// Provider du contexte
export const AuthProvider = ({ children }) => {
  // --- EMAIL ---
  const [email, setEmailRaw] = useState(() => {
    return localStorage.getItem('email') || '';
  });

  const setEmail = (value) => {
    setEmailRaw(value);
    localStorage.setItem('email', value);
  };

  // --- LOGGED IN ---
  const [loggedIn, setLoggedInRaw] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });

  const setLoggedIn = (value) => {
    setLoggedInRaw(value);
    localStorage.setItem('loggedIn', value.toString());
  };

  // --- LINK LIST ---
  const [LinkList, setLinkListRaw] = useState(() => {
    const stored = localStorage.getItem('LinkList');
    return stored ? JSON.parse(stored) : [];
  });

  const setLinkList = (list) => {
    setLinkListRaw(list);
    localStorage.setItem('LinkList', JSON.stringify(list));
  };

  // --- SELECTED LINK ---
  const [selectedLink, setSelectedLinkRaw] = useState(() => {
    const stored = localStorage.getItem('selectedLink');
    return stored ? JSON.parse(stored) : null;
  });

  const setSelectedLink = (link) => {
    setSelectedLinkRaw(link);
    if (link) {
      localStorage.setItem('selectedLink', JSON.stringify(link));
    } else {
      localStorage.removeItem('selectedLink');
    }
  };

  // --- PERSONNES JSON ---
  const [personnesJsonList, setPersonnesJsonListRaw] = useState(() => {
    const stored = localStorage.getItem('personnesJsonList');
    return stored ? JSON.parse(stored) : null;
  });

  const setPersonnesJsonList = (list) => {
    setPersonnesJsonListRaw(list);
    if (list) {
      localStorage.setItem('personnesJsonList', JSON.stringify(list)); // ✅ clé corrigée
    } else {
      localStorage.removeItem('personnesJsonList');
    }
  };



  return (
    <AuthContext.Provider
      value={{
        email, setEmail,
        loggedIn, setLoggedIn,
        LinkList, setLinkList,
        selectedLink, setSelectedLink,
        personnesJsonList, setPersonnesJsonList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);
