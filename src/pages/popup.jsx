import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import Descriptionpage from './description';
import Relationionpage from './relation';
import ModifEventScreen from '../component/popup-modifevent';
import { deletEevent } from '../tools/API/api';

// -------- STYLED COMPONENTS --------

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  width: 80%;
  height: 80%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden; /* empêche les scrollbars internes */
`;


const Tabs = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const TabButton = styled.button`
  background-color: ${({ active }) => (active ? "#0056b3" : "#007bff")};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  text-align: left;
  /* plus d’overflow forcé → laisse le contenu s’étirer naturellement */
`;


const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button74 = styled.button`
  background-color: #fbeee0;
  border: 2px solid #422800;
  border-radius: 30px;
  box-shadow: #422800 4px 4px 0 0;
  color: #422800;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  padding: 0 18px;
  line-height: 40px;
  text-align: center;

  &:hover {
    background-color: #fff;
  }

  &:active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }
`;

// -------- COMPONENT --------

const Popup = ({ onClose, item, onRefresh }) => {
  const [activeTab, setActiveTab] = useState("Relation");
  const [isPopupModifOpen, setIsPopupModifOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isPopupModifOpen) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isPopupModifOpen]);

  const handleDelete = async () => {
    try {
      await deletEevent(item.id);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const modifevent = () => {
    setIsPopupModifOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupModifOpen(false);
  };

  return (
    <>
      {!isPopupModifOpen ? (
        <Overlay>
          <Container ref={popupRef}>
            <h1>{item.content}</h1>

            <Tabs>
              <TabButton 
                active={activeTab === "Relation"} 
                onClick={() => setActiveTab("Relation")}
              >
                Relation
              </TabButton>
              <TabButton 
                active={activeTab === "Résumé"} 
                onClick={() => setActiveTab("Résumé")}
              >
                Résumé
              </TabButton>
              <TabButton 
                active={activeTab === "photo"} 
                onClick={() => setActiveTab("photo")}
              >
                Photo
              </TabButton>
            </Tabs>

            <Content>
              {activeTab === "Relation" && <Relationionpage item={item} />}
              {activeTab === "Résumé" && <Descriptionpage item={item} />}
              {activeTab === "photo" && <p>Content for Photo Tab</p>}
            </Content>

            <Buttons>
              <Button74 onClick={handleDelete}>Supprimer l'événement</Button74>
              <Button74 onClick={modifevent}>Modifier l'événement</Button74>
            </Buttons>
          </Container>
        </Overlay>
      ) : (
        <Overlay>
          <ModifEventScreen 
            onClose={handleClosePopup} 
            item={item} 
            onRefresh={onRefresh} 
          />
        </Overlay>
      )}
    </>
  );
};

export default Popup;
