import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const safeParseJSON = (value, fallback = []) => {
  try {
    if (!value || value === 'undefined') return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  // --- EMAIL ---
  const [email, setEmailRaw] = useState(() => localStorage.getItem('email') || '');
  const setEmail = (value) => {
    setEmailRaw(value);
    localStorage.setItem('email', value);
  };

  // --- LOGGED IN ---
  const [loggedIn, setLoggedInRaw] = useState(() => localStorage.getItem('loggedIn') === 'true');
  const setLoggedIn = (value) => {
    setLoggedInRaw(value);
    localStorage.setItem('loggedIn', value.toString());
  };

  // --- LINK LIST (types de liens disponibles) ---
  const [LinkList, setLinkListRaw] = useState(() => {
    const stored = localStorage.getItem('LinkList');
    return safeParseJSON(stored, []);
  });
  const setLinkList = (list) => {
    setLinkListRaw(list);
    localStorage.setItem('LinkList', JSON.stringify(list || []));
  };

  // --- SELECTED LINK (type de lien sélectionné pour création) ---
  const [selectedLink, setSelectedLinkRaw] = useState(() => {
    const stored = localStorage.getItem('selectedLink');
    // selectedLink peut être un objet ou null
    return safeParseJSON(stored, null);
  });
  const setSelectedLink = (link) => {
    setSelectedLinkRaw(link);
    if (link) localStorage.setItem('selectedLink', JSON.stringify(link));
    else localStorage.removeItem('selectedLink');
  };

  // --- PERSONNES JSON (nodes par groupe/timeline) ---
  const [personnesJsonList, setPersonnesJsonListRaw] = useState(() => {
    const stored = localStorage.getItem('personnesJsonList');
    return safeParseJSON(stored, []); // tableau d’objets { id, personnes, liens? }
  });
  const setPersonnesJsonList = (list) => {
    setPersonnesJsonListRaw(list || []);
    if (list) localStorage.setItem('personnesJsonList', JSON.stringify(list));
    else localStorage.removeItem('personnesJsonList');
  };

  // --- JSON LINKS LIST (edges par groupe/timeline) ---
  // Utilise cette clé si tu veux stocker séparément les liens (si distincts de personnesJsonList)
  const [JsonLinksList, setJsonLinksListRaw] = useState(() => {
    const stored = localStorage.getItem('JsonLinksList');
    return safeParseJSON(stored, []); // tableau d’objets { id, liens }
  });
  const setJsonLinksList = (list) => {
    setJsonLinksListRaw(list || []);
    if (list) localStorage.setItem('JsonLinksList', JSON.stringify(list));
    else localStorage.removeItem('JsonLinksList');
  };

  return (
    <AuthContext.Provider
      value={{
        email, setEmail,
        loggedIn, setLoggedIn,
        LinkList, setLinkList,
        selectedLink, setSelectedLink,
        personnesJsonList, setPersonnesJsonList,
        JsonLinksList, setJsonLinksList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
