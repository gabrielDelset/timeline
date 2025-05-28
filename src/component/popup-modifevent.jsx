import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import { getTimeline, modiftime, modifname, modifcolor } from '../tools/API/api';

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

const PopupModifEvent = ({ onClose, item, onRefresh }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', start: '', end: '', color: '#000000' });
  const [eventData, setEventData] = useState({ name: '', start: '', color: '#000000' });
  const { email } = useAuth(); // Accès direct à l'email de l'utilisateur

 // console.log('createevent', email);


  useEffect(() => {
    console.log("on close")
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

// Ajoute ce useEffect juste après
useEffect(() => {
  if (item) {
    const colorMatch = item.style?.match(/#([0-9a-fA-F]{6})/);
    const extractedColor = colorMatch ? `#${colorMatch[1]}` : '#000000'; // couleur par défaut si non trouvée
    setArcData((prev) => ({
      ...prev,
      start: item.start || '',
      end: item.end || '',
      name: item.content || '',
      color: extractedColor
    }));
  }
}, [item]);

  const handleTime = async () => {
    try {
      await modiftime(item.id, arcData.start, arcData.end, email);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modif time:', error);
    }
  };

  const handleName = async () => {
    try {
      await modifname(item.id, arcData.name, email);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modif name:', error);
    }
  };

  const handleColor = async () => {
    try {
      await modifcolor(item.id, arcData.color, email);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modif color:', error);
    }
  };



//console.log("itzm modif",item);

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        <h1>modifier "{item.content}"</h1>
        <div style={styles.buttonsWrapper}>
          {/* Ajout d'un Arc */}
          <div style={{ marginBottom: '20px' }}>
            <h2>modifier periode</h2>
            <button style={{ padding: '10px 20px', marginRight: '10px' }} onClick={handleTime}>
            modifier
            </button>
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
          </div>

          {/* Ajout d'un Événement */}
          <div>
            <h2>modifier nom</h2>
            <button style={{ padding: '10px 20px', marginRight: '10px' }} onClick={handleName}>
            modifier
            </button>
            <input
              type="text"
              placeholder="Nom"
              style={{ padding: '5px', marginRight: '10px' }}
              value={arcData.name}
              onChange={(e) => setArcData({ ...arcData, name: e.target.value })}
            />
          </div>
          <div>
            <h2>modifier couleur</h2>
            <button style={{ padding: '10px 20px', marginRight: '10px' }} onClick={handleColor}>
              modifier
            </button>
            <label> Couleur : </label>
            <input
              type="color"
              value={arcData.color}
              onChange={(e) => setArcData({ ...arcData, color: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModifEvent;
