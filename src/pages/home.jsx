import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../tools/AuthContext';
import { getTimelineList} from '../tools/API/api';

const Page = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Banner = styled.div`
  width: 100%;
  background: linear-gradient(90deg, #007bff, #6610f2);
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  background: #fff;
  color: #007bff;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #e6e6e6;
  }
`;

const Section = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-left: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  flex: 0 0 250px;
  height: 150px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
`;

const Home = () => {
  const { email } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  getTimelineList(email).then((data) => {
    console.log('Liste des timelines:', data);
  })},
   []); 


  const userTimelines = [
    { id: 1, name: 'Voyage au Japon' },
    { id: 2, name: 'Projet ISEN' },
  ];

  const sharedTimelines = [{ id: 3, name: 'Timeline Groupe' }];

  const publicTimelines = [
    { id: 4, name: 'Histoire de l’Art' },
    { id: 5, name: 'Évolution du Cinéma' },
  ];

  return (
    <Page>
      <Banner>
        <div>TimeFlow</div>
        <Button onClick={() => navigate('/timeline/new')}>+ Créer une timeline</Button>
      </Banner>

      <Section>
        <SectionTitle>Vos timelines</SectionTitle>
        <Row>
          <Card onClick={() => navigate('/timeline/new')}>+</Card>
          {userTimelines.map((t) => (
            <Card key={t.id} onClick={() => navigate(`/timeline/${t.id}`)}>
              {t.name}
            </Card>
          ))}

        </Row>
      </Section>

      <Section>
        <SectionTitle>Timelines partagées</SectionTitle>
        <Row>
          {sharedTimelines.map((t) => (
            <Card key={t.id}>{t.name}</Card>
          ))}
        </Row>
      </Section>

      <Section>
        <SectionTitle>Timelines publiques</SectionTitle>
        <Row>
          {publicTimelines.map((t) => (
            <Card key={t.id}>{t.name}</Card>
          ))}
        </Row>
      </Section>
    </Page>
  );
};

export default Home;
