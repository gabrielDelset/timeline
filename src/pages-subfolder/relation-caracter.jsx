import React, { useState , useEffect, useCallback} from "react";
import ProfileCard from "../component/caracter";
import Profilesheet from "../component/caracter-sheet";
import ProfileTextEditor from "../component/textEditor"
import '../css/Relation.css';
import { useAuth } from '../tools/AuthContext'; 
import { getListCaracter } from '../tools/API/api';



const Relationcaracter = () => {
  const { email } = useAuth();
  const [profiles, setProfiles] = useState([]); // Initialisation avec un tableau videb
  const [photo, setPhoto] = useState(null); // on stock la photos ici (pour la passer dans le texteditor)
  const [name, setName] = useState(null); // on stock la photos ici (pour la passer dans le texteditor)
  const [surname, setSurname] = useState(null); // on stock la photos ici (pour la passer dans le texteditor)
  const [date, setDate] = useState(null); // on stock la photos ici (pour la passer dans le texteditor)
  const [selectedId, setSelectedId] = useState(0); // Stocke l'ID sélectionné

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getListCaracter(email, "timeline1"); // Attendre la réponse de l'API
        setProfiles(data); // Mettre à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des caractères :", error);
      }
    };

    fetchProfiles();
}, []); // Dépendances vides : s'exécute uniquement au montage du composant



console.log("omg les datas", profiles);


const handleSelect = useCallback((id) => {
  setSelectedId(id);
  console.log("ID sélectionné :", id);
}, []);

  


  return (
    <div  className="fenetre">
    <div className="column-caracter">
      {profiles.map((profile) => (
       <ProfileCard 
       key={profile.id} 
       id={profile.id}  // Ajoute l'ID ici pour être sûr qu'il est bien transmis
       imageUrl={profile.photo} 
       firstName={profile.firstName} 
       lastName={profile.lastName} 
       onSelect={handleSelect}  
     />
     
      ))}
         
    </div>
    <Profilesheet setPhoto={setPhoto} setName={setName} setSurname={setSurname} setDate={setDate} />
    <ProfileTextEditor id = {selectedId} photo={photo} name={name} surname={surname} date={date}/>
    </div>
  );
};

export default Relationcaracter;
