import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import { useAuth } from '../tools/AuthContext'; 
import { PushLInkdatabase , getLink, DeleteLink} from '../tools/API/api';

const PopupCreateLink = ({ onClose }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', color: '#000000', length: 1});
  const [existingLinks, setExistingLinks] = useState([]); // Liste des liens existants
  const { selectedLink, setSelectedLink } = useAuth();
  const { email } = useAuth(); // Utilisation de l'email de l'utilisateur

  const { LinkList , setLinkList} = useAuth(); 

  const table = 'timeline1';    

//console.log("listdeslinks",LinkList);


  //* on récupére ici les infos de la database pour les liens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLink(email, table);
        console.log("response.data", response.data);
        setExistingLinks(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la timeline:', error);
      }
    };
  
    fetchData(); // appel de la fonction
  }, []);
  



  // Effet pour gérer la fermeture du popup quand on clique en dehors
  useEffect(() => {
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

console.log(existingLinks);


const handleAddLink = async () => {
  try {
    // Ajoute dans la base
    await PushLInkdatabase(arcData.name, arcData.color, arcData.length * 100, email, table);

    // Réinitialise les champs
    setArcData({ name: '', color: '#000000', length: 1 });

    // Recharge la liste complète depuis la base
    const response = await getLink(email, table);
    const rawLinks = response.data.data;

    // Filtre les liens valides (comme vu avant)
    const filteredLinks = rawLinks.filter(
      (link) => link.name && link.color && link.length !== null
    );

    setExistingLinks(filteredLinks);

    // Sélection automatique du nouveau lien
    setSelectedLink(arcData.name);
  } catch (error) {
    console.error("Erreur lors de l'ajout du lien :", error);
  }
};


  // Fonction pour supprimer un lien sélectionné
  const handleDeleteLink = async () => {
    if (!selectedLink) return;
  
    setExistingLinks(existingLinks.filter(link =>
      !(link.name === selectedLink.name &&
        link.color === selectedLink.color &&
        link.length === selectedLink.length)
    ));
    
   await DeleteLink(selectedLink.id,email,table )

    setSelectedLink(null);

  };

 // Fonction pour selectionner un liens
  const handleSelectLink = () => {
    if (!selectedLink) return;
  console.log(selectedLink);
    setSelectedLink(selectedLink);
  };
  
  

  return (
    <div className="popup-overlaylink">
      <div className="popup-containerlink" ref={popupRef} onClick={(e) => e.stopPropagation()}>
        <h1>Page des liens</h1>
        <div className="popup-contentlink">
        <h2>Choisir un lien déjà créé</h2>
            <div className="button-container"> 
            <select
              value={selectedLink ? JSON.stringify(selectedLink) : ''}
              onChange={(e) => setSelectedLink(JSON.parse(e.target.value))}
            >
              <option value="" disabled>Sélectionner un lien</option>
              {existingLinks.map((link, index) => (
                <option key={index} value={JSON.stringify(link)}>
                  {link.name}
                </option>
              ))}
            </select>
             <button className="button-74 save-button" onClick={handleSelectLink} disabled={!selectedLink}>selectionner</button>
          <button className="button-74 save-button" onClick={handleDeleteLink} disabled={!selectedLink}>Supprimer</button>
        </div>
        <h2>Ajouter un nouveau lien</h2>
        {/* Ajout d'un nouveau lien */}
        <div className="button-container">

          <label>Nom :</label>
          <input
            type="text"
            placeholder="Nom du lien"
            value={arcData.name}
            onChange={(e) => setArcData({ ...arcData, name: e.target.value })}
          />

          <label>Couleur :</label>
          <input
            type="color"
            value={arcData.color}
            onChange={(e) => setArcData({ ...arcData, color: e.target.value })}
          />

          <label>Force du lien :</label>
          <input
            type="number"
            min="1"
            max="10"
            value={arcData.length}
            onChange={(e) => setArcData({ ...arcData, length: parseInt(e.target.value, 10) })}
          />

          <button  className="button-74 save-button" onClick={handleAddLink}>Ajouter</button>
        </div>
        <div></div>
        <button  className="close" onClick={onClose}>x</button>
        </div>
      </div>
    </div>
  );
};

export default PopupCreateLink;
