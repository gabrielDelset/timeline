import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";

const Popup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("Tab1");
  const popupRef = useRef(null);

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
      </div>
    </div>
  );
};

export default Popup;
