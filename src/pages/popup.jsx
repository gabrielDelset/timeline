import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";

import { delete } from '../tools/API/api';

const Popup = ({ onClose , item}) => {
  const [activeTab, setActiveTab] = useState("Relation");
  const popupRef = useRef(null);
console.log(item);
  useEffect(() => {
    // Gestionnaire pour fermer la popup lorsqu'on clique en dehors
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose(); // Ferme la popup
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);




  const handleDelete = async (e) => {
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
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "Relation" ? "active" : ""}`}
            onClick={() => setActiveTab("Relation")}
          >
            Relation
          </button>
          <button
            className={`tab-button ${activeTab === "résumé" ? "active" : ""}`}
            onClick={() => setActiveTab("résumé")}
          >
            Résumé
          </button>
          <button
            className={`tab-button ${activeTab === "photo" ? "active" : ""}`}
            onClick={() => setActiveTab("photo")}
          >
            Photo
          </button>
        </div>
        <div className="popup-content">
          {activeTab === "Relation" && <p>Content for Relation Tab</p>}
          {activeTab === "résumé" && <p>Content for Résumé Tab</p>}
          {activeTab === "photo" && <p>Content for Photo Tab</p>}
        </div>
        <div  className="popup-button">
        <button 
            className={`tab-button-delete ${activeTab === "Relation" ? "active" : ""}`}
            onClick={() => setActiveTab("Relation")}
          >
            supprimé
          </button>
          <button
            className={`tab-button-save ${activeTab === "Relation" ? "active" : ""}`}
            onClick={() => setActiveTab("Relation")}
          >
            sauvegarder
          </button>
          </div>
      </div>
    </div>
  );
};

export default Popup;
