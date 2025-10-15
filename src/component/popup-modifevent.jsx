import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { getTimeline, modiftime, modifname, modifcolor } from '../tools/API/api';
import { useAuth } from '../tools/AuthContext';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const PopupModifEvent = ({ onClose, item, onRefresh }) => {
  const popupRef = useRef(null);
  const [arcData, setArcData] = useState({ name: '', start: '', end: '', color: '#000000' });
  const { email } = useAuth();

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

  useEffect(() => {
    if (item) {
      const colorMatch = item.style?.match(/#([0-9a-fA-F]{6})/);
      const extractedColor = colorMatch ? `#${colorMatch[1]}` : '#000000';

      // Conversion des dates au format accepté par <input type="date">
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split(' ')[0]; // Ex: "2020-03-17 00:00" -> "2020-03-17"
      };

      setArcData({
        start: formatDate(item.start),
        end: formatDate(item.end),
        name: item.content || '',
        color: extractedColor,
      });
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

  console.log(arcData);

  return (
    <Overlay>
      <Container ref={popupRef}>
        <Title>modifier "{item.content}"</Title>
        
        <Section>
          <Subtitle>modifier période</Subtitle>
          <Button onClick={handleTime}>modifier</Button>
          <Input
            type="date"
            value={arcData.start}
            onChange={(e) => setArcData({ ...arcData, start: e.target.value })}
          />
          <Input
            type="date"
            value={arcData.end}
            onChange={(e) => setArcData({ ...arcData, end: e.target.value })}
          />
        </Section>

        <Section>
          <Subtitle>modifier nom</Subtitle>
          <Button onClick={handleName}>modifier</Button>
          <Input
            type="text"
            value={arcData.name}
            onChange={(e) => setArcData({ ...arcData, name: e.target.value })}
          />
        </Section>

        <Section>
          <Subtitle>modifier couleur</Subtitle>
          <Button onClick={handleColor}>modifier</Button>
          <label> Couleur : </label>
          <Input
            type="color"
            value={arcData.color}
            onChange={(e) => setArcData({ ...arcData, color: e.target.value })}
          />
        </Section>
      </Container>
    </Overlay>
  );
};

export default PopupModifEvent;
