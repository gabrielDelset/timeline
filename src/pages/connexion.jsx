import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from '../tools/API/api';

// ---------------- STYLED COMPONENTS ----------------

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

// ---------------- COMPONENT ----------------

const LoginPage = ({ setLoggedIn, setEmail }) => {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await connect(identifiant, motDePasse);
      if (response.code === 200) {
        setLoggedIn(true);
        setEmail(identifiant);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <Container>
      <Title>Connexion</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Identifiant</Label>
          <Input
            type="text"
            placeholder="Entrez votre identifiant"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Mot de passe</Label>
          <Input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit">Valider</Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
