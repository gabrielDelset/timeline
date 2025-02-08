import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import Descriptionpage from './description';
import Relationionpage from './relation';

import { deletEevent } from '../tools/API/api';

const Popup = ({ onClose , item, onRefresh}) => {

  const [activeTab, setActiveTab] = useState("Relation");
  const popupRef = useRef(null);

//console.log(item);
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



  return (
    <div className="popup-overlay">
   
      <div className="popup-container" ref={popupRef}>
      <h1> {item.content} </h1>
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
          {activeTab === "Relation" && <Relationionpage item={item}/>}
          {activeTab === "Résumé" && <Descriptionpage item={item} />}
          {activeTab === "photo" && <p>Content for Photo Tab</p>}
        </div>
        <div className="button-container">
        <button  class="button-74" 
            onClick={handleDelete}
          >
            supprimé l'événement
          </button>
          <button
         className="button-74" 
            onClick={() => setActiveTab("Relation")}
          >
            modifier événement
          </button>
          </div>
      </div>
    </div>
  );
};

export default Popup;





