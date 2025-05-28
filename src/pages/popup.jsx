import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import Descriptionpage from './description';
import Relationionpage from './relation';

import ModifEventScreen from '../component/popup-modifevent';

import { deletEevent } from '../tools/API/api';

const Popup = ({ onClose , item, onRefresh}) => {

  const [activeTab, setActiveTab] = useState("Relation");
  const [isPopupModifOpen, setIsPopupModifOpen] = useState(false);
  const popupRef = useRef(null);

//console.log(item);
useEffect(() => {
  if (isPopupModifOpen) return; // Ne rien faire si la modale de modif est ouverte

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose(); // Ferme la popup
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [onClose, isPopupModifOpen]);





const handleDelete = async () => {   //permet de gérer la supression de l'événement
    try {
      console.log("Suppression de l'événement");
      await deletEevent(item.id); 
      onRefresh(); 
      onClose(); 
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    }
  };

  const modifevent = () => {
    setIsPopupModifOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupModifOpen(false);
  };


  return (
    <>
      {!isPopupModifOpen ? (
        <div className="popup-overlay">
          <div className="popup-container" ref={popupRef}>
            <h1>{item.content}</h1>
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === "Relation" ? "active" : ""}`}
                onClick={() => setActiveTab("Relation")}
              >
                Relation
              </button>
              <button
                className={`tab-button ${activeTab === "résumé" ? "active" : ""}`}
                onClick={() => setActiveTab("Résumé")}
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
              {activeTab === "Relation" && <Relationionpage item={item} />}
              {activeTab === "Résumé" && <Descriptionpage item={item} />}
              {activeTab === "photo" && <p>Content for Photo Tab</p>}
            </div>
            <div className="button-container">
              <button className="button-74" onClick={handleDelete}>
                supprimé l'événement
              </button>
              <button className="button-74" onClick={modifevent}>
                modifier événement
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="popup-overlay">
          <ModifEventScreen onClose={handleClosePopup} item={item} onRefresh={onRefresh} />
        </div>
      )}
    </>
  );
}; 

export default Popup; 




