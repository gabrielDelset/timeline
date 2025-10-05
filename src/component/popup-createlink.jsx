import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from '../tools/AuthContext'; 
import { PushLInkdatabase , getLink, DeleteLink} from '../tools/API/api';

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 60%;
  border: 4px solid #0a0101;
  border-radius: 25px;
  display: flex;
  justify-content: left;
  align-items: left;
  z-index: 1000;
  transform: translate(-50%, -50%);
  text-align: left;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFE7E7;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 20px;
  box-sizing: border-box;
  text-align: left;
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  margin: 12px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 15px;
`;

const Button74 = styled.button`
  background-color: #fbeee0;
  border: 2px solid #422800;
  border-radius: 30px;
  box-shadow: #422800 4px 4px 0 0;
  color: #422800;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 18px;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
  user-select: none;

  &:hover {
    background-color: #fff;
  }

  &:active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }

  &:disabled {
    background-color: #d3d3d3;
    border-color: #a0a0a0;
    color: #808080;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  transition: all 200ms;
  font-size: 40px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  background-color: #FFE7E7;
  border: none;
  cursor: pointer;

  &:hover {
    color: orange;
    background-color: #FFE7E7;
  }
`;

const PopupCreateLink = ({ onClose }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', color: '#000000', length: 1});
  const [existingLinks, setExistingLinks] = useState([]);
  const { selectedLink, setSelectedLink } = useAuth();
  const { email } = useAuth(); 
  const { LinkList , setLinkList} = useAuth(); 
  const table = 'timeline1';    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLink(email, table);
        setExistingLinks(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la timeline:', error);
      }
    };
    fetchData();
  }, []);

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

  const handleAddLink = async () => {
    try {
      await PushLInkdatabase(arcData.name, arcData.color, arcData.length * 100, email, table);
      setArcData({ name: '', color: '#000000', length: 1 });
      const response = await getLink(email, table);
      const rawLinks = response.data.data;
      const filteredLinks = rawLinks.filter(
        (link) => link.name && link.color && link.length !== null
      );
      setExistingLinks(filteredLinks);
      setSelectedLink(arcData.name);
    } catch (error) {
      console.error("Erreur lors de l'ajout du lien :", error);
    }
  };

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

  const handleSelectLink = () => {
    if (!selectedLink) return;
    console.log("Lien confirmé :", selectedLink);
  };

  return (
    <Overlay>
      <Container ref={popupRef} onClick={(e) => e.stopPropagation()}>
        <h1>Page des liens</h1>
        <Content>
          <h2>Choisir un lien déjà créé</h2>
          <ButtonContainer>
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
            <Button74 onClick={handleSelectLink} disabled={!selectedLink}>Sélectionner</Button74>
            <Button74 onClick={handleDeleteLink} disabled={!selectedLink}>Supprimer</Button74>
          </ButtonContainer>

          <h2>Ajouter un nouveau lien</h2>
          <ButtonContainer>
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
            <Button74 onClick={handleAddLink}>Ajouter</Button74>
          </ButtonContainer>
          <CloseButton onClick={onClose}>x</CloseButton>
        </Content>
      </Container>
    </Overlay>
  );
};

export default PopupCreateLink;
