import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { getTimeline, postarc } from '../tools/API/api';
import { useAuth } from '../tools/AuthContext';

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
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

// -------- COMPONENT --------
const PopupCreateEvent = ({ onClose, table, onRefresh }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', start: '', end: '', color: '#000000' });
  const [eventData, setEventData] = useState({ name: '', start: '', color: '#000000' });
  const { email } = useAuth(); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleAddArc = async () => {
    try {
      await postarc(arcData.name, arcData.start, arcData.end, arcData.color, email, table);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’arc:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      await postarc(eventData.name, eventData.start, null, eventData.color, email, table);
      await getTimeline();
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’événement:', error);
    }
  };

  return (
    <Overlay>
      <Container ref={popupRef}>
        <Title>Page d'ajout d'événement</Title>

        <Section>
          <Subtitle>Ajout d'un arc</Subtitle>
          <Button onClick={handleAddArc}>Ajouter</Button>
          <Input
            type="text"
            placeholder="Nom"
            value={arcData.name}
            onChange={(e) => setArcData({ ...arcData, name: e.target.value })}
          />
          <Input
            type="date"
            placeholder="Début"
            value={arcData.start}
            onChange={(e) => setArcData({ ...arcData, start: e.target.value })}
          />
          <Input
            type="date"
            placeholder="Fin"
            value={arcData.end}
            onChange={(e) => setArcData({ ...arcData, end: e.target.value })}
          />
          <label>Couleur : </label>
          <Input
            type="color"
            value={arcData.color}
            onChange={(e) => setArcData({ ...arcData, color: e.target.value })}
          />
        </Section>

        <Section>
          <Subtitle>Ajout d'un événement</Subtitle>
          <Button onClick={handleAddEvent}>Ajouter</Button>
          <Input
            type="text"
            placeholder="Nom"
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
          />
          <Input
            type="date"
            placeholder="Début"
            value={eventData.start}
            onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
          />
          <label>Couleur : </label>
          <Input
            type="color"
            value={eventData.color}
            onChange={(e) => setEventData({ ...eventData, color: e.target.value })}
          />
        </Section>
      </Container>
    </Overlay>
  );
};

export default PopupCreateEvent;
