import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import { getTimeline, postarc } from '../tools/API/api';

import { useAuth } from '../tools/AuthContext';  // Import des variables globales

const styles = {
    container: {
      width: '100%',
      paddingTop: '500px', // Correction de paddingtop
    },
    timelineWrapper: {
      marginTop: '10%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    buttonsWrapper: {
      width: '90%',
    },
};

const PopupCreateEvent = ({ onClose, table, onRefresh }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', start: '', end: '', color: '#000000' });
  const [eventData, setEventData] = useState({ name: '', start: '', color: '#000000' });
  const { email } = useAuth(); // Accès direct à l'email de l'utilisateur

  console.log('createevent', email);
  console.log('createevent', table);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAddArc = async () => {
    try {
      await postarc(arcData.name, arcData.start, arcData.end, arcData.color, email, table);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’arc:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      await postarc(eventData.name, eventData.start, null, eventData.color, email, table);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’arc:', error);
    }
  };

  

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        <h1>Page d'ajout d'événement</h1>

        <div style={styles.buttonsWrapper}>
          {/* Ajout d'un Arc */}
          <div style={{ marginBottom: '20px' }}>
            <h2>Ajout d'un arc</h2>
            <button style={{ padding: '10px 20px', marginRight: '10px' }} onClick={handleAddArc}>
              Ajouter
            </button>
            <input
              type="text"
              placeholder="Nom"
              style={{ padding: '5px', marginRight: '10px' }}
              value={arcData.name}
              onChange={(e) => setArcData({ ...arcData, name: e.target.value })}
            />
            <input
              type="date"
              placeholder="Début"
              style={{ padding: '5px', marginRight: '10px' }}
              value={arcData.start}
              onChange={(e) => setArcData({ ...arcData, start: e.target.value })}
            />
            <input
              type="date"
              placeholder="Fin"
              style={{ padding: '5px', marginRight: '10px' }}
              value={arcData.end}
              onChange={(e) => setArcData({ ...arcData, end: e.target.value })}
            />
            <label> Couleur : </label>
            <input
              type="color"
              value={arcData.color}
              onChange={(e) => setArcData({ ...arcData, color: e.target.value })}
            />
          </div>

          {/* Ajout d'un Événement */}
          <div>
            <h2>Ajout d'un événement</h2>
            <button style={{ padding: '10px 20px', marginRight: '10px' }} onClick={handleAddEvent}>
              Ajouter
            </button>
            <input
              type="text"
              placeholder="Nom"
              style={{ padding: '5px', marginRight: '10px' }}
              value={eventData.name}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            />
            <input
              type="date"
              placeholder="Début"
              style={{ padding: '5px', marginRight: '10px' }}
              value={eventData.start}
              onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
            />
            <label> Couleur : </label>
            <input
              type="color"
              value={eventData.color}
              onChange={(e) => setEventData({ ...eventData, color: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupCreateEvent;
