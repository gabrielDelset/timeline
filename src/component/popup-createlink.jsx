import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";
import { useAuth } from '../tools/AuthContext'; 
import { PushLInkdatabase , Getlinkdatabase} from '../tools/API/api';

const PopupCreateLink = ({ onClose }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', color: '#000000', strength: 1 });
  const [existingLinks, setExistingLinks] = useState([]); // Liste des liens existants
  const [selectedLink, setSelectedLink] = useState(null);
  const { email } = useAuth(); // Utilisation de l'email de l'utilisateur

  const { LinkList , setLinkList} = useAuth(); 

  const table = useRef('timeline1');    

console.log("listdeslinks",LinkList);

  //* on récupére ici les infos de la database pour les liens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Getlinkdatabase(email, table);


      } catch (error) {
        console.error('Erreur lors de la récupération de la timeline:', error);
      }
    };
  
    fetchData(); //appel de la fonction
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



/*

    [{
      name:"amis" , color:"blue" ,    length: 600,
    }
      {
     name:"amis" , color:"red" ,    length: 200,
    }
    {
     name:"amis" , color:"red" ,    length: 100 ,
    }
    ]


*/


  const handleAddLink = async () => {                                //? Ajout du lien dans la liste des liens existants      
    
    setExistingLinks([...existingLinks, { ...arcData }]);


    setArcData({ name: '', color: '#000000', strength: 1 }); // Réinitialise les champs

    console.log(arcData.name);
    await PushLInkdatabase(arcData.name, arcData.color, arcData.linkj, arcData.color, email, table);
  };

  // Fonction pour supprimer un lien sélectionné
  const handleDeleteLink = () => {
    if (!selectedLink) return;
    setExistingLinks(existingLinks.filter(link => link.name !== selectedLink));
    setSelectedLink(null);
  };

  return (
    <div className="popup-overlaylink">
      <div className="popup-containerlink" ref={popupRef} onClick={(e) => e.stopPropagation()}>
        <h1>Page des liens</h1>
        <div className="popup-contentlink">
        <h2>Choisir un lien déjà créé</h2>
            <div className="button-container"> 
              <select value={selectedLink || ''} onChange={(e) => setSelectedLink(e.target.value)}>
                <option value="" disabled>Sélectionner un lien</option>
                {existingLinks.map((link, index) => (
                  <option key={index} value={link.name}>{link.name}</option>
                ))}
             </select>
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
            value={arcData.strength}
            onChange={(e) => setArcData({ ...arcData, strength: parseInt(e.target.value, 10) })}
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
