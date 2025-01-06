import React, { useRef, useEffect, useState } from 'react';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css'; // Import des styles par défaut
import '../css/Home.css'; // Import de ton fichier CSS personnalisé
import PopupScreen from './popup';
import PopupCreateScreen from './popupcreateevent';
import { getTimeline, postarc, postevenement } from '../tools/API/api';

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

const Home = () => {
  const container = useRef(null);
  const [response, setResponse] = useState('');
  const [arcData, setArcData] = useState({ name: '', start: '', end: '' });
  const [eventData, setEventData] = useState({ name: '', start: '' });
  const [timelineHeight, setTimelineHeight] = useState(window.innerHeight / 2); // Hauteur dynamique de la timeline

  const [selectedItem, setSelectedItem] = useState(null); // Pour stocker l'élément sélectionné
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Contrôle de la popup
  
  const [isPopupCreateOpen, setisPopupCreateOpen] = useState(false); // Contrôle de la popup d'ajout d'événement


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTimeline();
        setResponse(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la timeline:', error);
      }
    };

    fetchData(); //appel de la fonction
  }, []);

  useEffect(() => {
    const options = {
      selectable: true,
      editable: false,
      showCurrentTime: true, // Affiche la ligne de l'heure actuelle
      zoomMin: 604800000, // Zoom minimum : 1 semaine
      zoomMax: 3155760000000, // Zoom maximum : 1 siècle
    };
    const timeline = new Timeline(container.current, response, options);
  
    timeline.on('select', (event) => {
      const selectedId = event.items[0]; // ID de l'élément sélectionné
      if (selectedId) {
        const selectedData = response.find((item) => item.id === selectedId);
        setSelectedItem(selectedData); // Mettre à jour les données de l'élément sélectionné
        setIsPopupOpen(true); // Ouvrir la popup
      }
    });



        // Gestion de l'événement "doubleClick"
      timeline.on('doubleClick', (event) => {
        // Vérifiez que le double-clic ne concerne pas un élément existant
        if (!event.item) {
          setisPopupCreateOpen(true); // Ouvrir la popupde création de popup
        }
      });


    // Ajuste dynamiquement la hauteur de la timeline
    const updateHeight = () => {
      const containerHeight = container.current.scrollHeight;
      setTimelineHeight(Math.max(containerHeight, window.innerHeight / 2));
    };
  
    timeline.on('changed', updateHeight);
    updateHeight();


    return () => timeline.destroy();
  }, [response]);
  

  
  const handleAddArc = async () => {
    try {
      await postarc(arcData.name, arcData.start, arcData.end);
      const updatedTimeline = await getTimeline();
      setResponse(updatedTimeline.data);
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’arc:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      await postevenement(eventData.name, eventData.start);
      const updatedTimeline = await getTimeline();
      setResponse(updatedTimeline.data);
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’événement:', error);
    }
  };

  const handleClosePopup =  async() => {
    setIsPopupOpen(false);
    setisPopupCreateOpen(false);
    setSelectedItem(null);
  };

  const refreshTimeline = async () => {
    try {
      const updatedTimeline = await getTimeline(); 
      setResponse(updatedTimeline.data); 
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la timeline:', error);
    }
  };
  


  return (
    <div style={{ backgroundColor: '#575757', padding: '20px' }}>
      <div style={styles.timelineWrapper}>
        <div
          ref={container}
          style={{ ...styles.container, height: `${timelineHeight}px` }}
        />
      </div>
      {isPopupOpen && selectedItem && (
         <PopupScreen onClose={handleClosePopup} item={selectedItem} onRefresh={refreshTimeline} />
      )}

        {isPopupCreateOpen && (
         <PopupCreateScreen onClose={handleClosePopup} item={selectedItem} onRefresh={refreshTimeline} />
      )}
    </div>
  );

  
};

export default Home;
