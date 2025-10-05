import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProfileCard from "../component/caracter";
import Profilesheet from "../component/caracter-sheet";
import ProfileTextEditor from "../component/textEditor";
import { useAuth } from "../tools/AuthContext";
import { getListCaracter } from "../tools/API/api";
import empty from "../images/empty-cat.jpg";

// ---------------- STYLED COMPONENTS ----------------

const Fenetre = styled.div`
  max-height: 500px;
  height: 500px;
  border: 1px solid #ccc;
  width: 99%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
`;

const ColumnCaracter = styled.div`
  max-height: 52.3vh;
  height: 52.3vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 0;
  border: 1px solid #ccc;
  width: 25vh;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// ---------------- COMPONENT ----------------

const Relationcaracter = ({ SetProfileList }) => {
  const { email } = useAuth();
  const [profiles, setProfiles] = useState([]); 
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [date, setDate] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [Update, setUpdate] = useState(true);
  const [returnedprofile, setreturnedprofile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getListCaracter(email, "timeline1"); 
        
        const emptyProfile = {
          id: 0,
          photo: empty,
          firstName: "ajouter",
          lastName: "personne",
          description: {
            blocks: [
              {
                key: "50ji1",
                data: {},
                text: "",
                type: "unstyled",
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: []
              }
            ],
            entityMap: {}
          },
          naissance: ""
        };
        SetProfileList(data);
        const updatedProfiles = [emptyProfile, ...data];
        setProfiles(updatedProfiles);

        if (returnedprofile === null) {
          setSelectedProfile(emptyProfile);
        } else {
          setSelectedProfile(profiles.find(profile => profile.id === returnedprofile) || emptyProfile);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des caractères :", error);
      }
    };

    fetchProfiles();
  }, [email, Update]); 

  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      setSelectedProfile(profiles.find(profile => profile.id === 0));
    }
  }, [profiles]);

  const handleSelect = (id) => {
    const profile = profiles.find(profile => profile.id === id);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  const handleProfileDeleted = (deletedId) => {
    setProfiles((prevProfiles) => prevProfiles.filter(profile => profile.id !== deletedId));
    if (selectedProfile && selectedProfile.id === deletedId) {
      setSelectedProfile(profiles.find(profile => profile.id === 0));
    }
  };

  const handleProfileSaved = (savedProfile) => {
    if(savedProfile !== 0){
      setreturnedprofile(savedProfile.id);
    }    
    setTimeout(() => {
        setUpdate(prevUpdate => !prevUpdate);
    }, 300);
  };

  return (
    <Fenetre>
      <ColumnCaracter>
        {profiles.map((profile) => (
          <ProfileCard 
            key={profile.id} 
            id={profile.id}  
            imageUrl={profile.photo} 
            firstName={profile.firstName} 
            lastName={profile.lastName} 
            onSelect={handleSelect}  
            className={selectedProfile && profile.id === selectedProfile.id ? "selected" : ""} 
          />
        ))}
      </ColumnCaracter>
      {selectedProfile && (
        <>
          <Profilesheet  
            selectedProfile={selectedProfile} 
            setPhoto={setPhoto} 
            setName={setName} 
            setSurname={setSurname} 
            setDate={setDate} 
          />
          <ProfileTextEditor 
            selectedProfile={selectedProfile} 
            photo={photo} 
            name={name} 
            surname={surname} 
            date={date} 
            onProfileDeleted={handleProfileDeleted} 
            onProfileSaved={handleProfileSaved}
          />
        </>
      )}
    </Fenetre>
  );
};

export default Relationcaracter;
