import React, { useRef, useEffect, useState } from 'react';
import { Timeline} from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css'; // Import des styles par défaut
import '../css/Home.css'; // Import de ton fichier CSS personnalisé
import PopupScreen from './popup';
import PopupCreateScreen from './popupcreateevent';
import { getTimeline } from '../tools/API/api';
import { useAuth } from '../tools/AuthContext';  //sert a importer les variables globals


const styles = {
  container: {
    width: '100%',
    paddingtop: '500px',
    height: '100%', // 25% de la hauteur de l'écran
  },
  timelineWrapper: {
    marginTop: '10%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100vh', //* 25% de la hauteur de l'écran
  },
  buttonsWrapper: {
    width: '90%',
  },
};

const Home = () => {
  const container = useRef(null);
  const table = useRef('table1');                                            //! a modifier plus tard mais voila ça fait le taff

  const { email } = useAuth(); // Accès direct au mail

  const [response, setResponse] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isPopupCreateOpen, setisPopupCreateOpen] = useState(false); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(email);
        const response = await getTimeline(email, table.current);
        setResponse(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la timeline:', error);
      }
    };
  
    fetchData(); //appel de la fonction
  }, [email]); // Ajout de `email` dans le tableau des dépendances
  

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
        setSelectedItem(selectedData);      // Mettre à jour les données de l'élément sélectionné
        setIsPopupOpen(true);             // Ouvrir la popup
      }
    });



        // Gestion de l'événement "doubleClick"
      timeline.on('doubleClick', (event) => {
        // Vérifiez que le double-clic ne concerne pas un élément existant
        if (!event.item) {
          setisPopupCreateOpen(true); // Ouvrir la popupde création de popup
        }
      });

    return () => timeline.destroy();
  }, [response]);
  

  
  const handleClosePopup =  async() => {
    setIsPopupOpen(false);
    setisPopupCreateOpen(false);
    setSelectedItem(null);
  };

  const refreshTimeline = async () => {
    try {
      const updatedTimeline = await getTimeline(email,table.current); 
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
          style={{ ...styles.container, height: `100px` }}
        />
      </div>
      {isPopupOpen && selectedItem && (
         <PopupScreen onClose={handleClosePopup} item={selectedItem} onRefresh={refreshTimeline} />
      )}

        {isPopupCreateOpen && (
         <PopupCreateScreen onClose={handleClosePopup} item={selectedItem}  table={table.current} onRefresh={refreshTimeline} />
      )}
    </div>
  );

  
};

export default Home;
