import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import { getTimeline, postarc, postevenement } from '../tools/API/api';

import { useAuth } from '../tools/AuthContext';  //sert a importer les variables globals

const styles = {
    container: {
      width: '100%',
      paddingtop: '500px',
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

const PopupCreateEvent = ({ onClose , item, table, onRefresh}) => {

  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', start: '', end: '' });
  const [eventData, setEventData] = useState({ name: '', start: '' });
  const [response, setResponse] = useState('');
  const { email } = useAuth(); // Accès direct au mail

  console.log('createevent',email)
  console.log('createevent',table)


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




  const handleAddArc = async () => {
    try {
      await postarc(arcData.name, arcData.start, arcData.end, email , table);
      const updatedTimeline = await getTimeline();
      onRefresh(); 
      setResponse(updatedTimeline.data);
      onClose(); // Ferme la popup
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’arc:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      await postevenement(eventData.name, eventData.start, email,table );
      const updatedTimeline = await getTimeline();
      onRefresh(); 
      setResponse(updatedTimeline.data);
      onClose(); // Ferme la popup
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’événement:', error);
    }
  };


  
  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
      <h1> page d'ajout d'événement </h1>
      <div style={styles.buttonsWrapper}>
          <div style={{ marginBottom: '20px' }}>
            <h1>Ajout d'un arc</h1>
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
              style={{ padding: '5px' }}
              value={arcData.end}
              onChange={(e) => setArcData({ ...arcData, end: e.target.value })}
            />
          </div>

          <div>
            <h1>Ajout d'un événement</h1>
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
          </div>
        </div>
        </div>
    </div>
  );
};

export default PopupCreateEvent;





