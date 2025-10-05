import React, { useState } from "react";
import "vis-network/styles/vis-network.css";
import styled from "styled-components";

import RelationTree from '../pages-subfolder/relation-tree';
import Relationcaracter from '../pages-subfolder/relation-caracter';

// -------- STYLED COMPONENTS --------

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 10px 0;
`;

const TabButton = styled.button`
  align-items: center;
  background-color: ${({ active }) => (active ? "#D33A2C" : "#FFE7E7")};
  border: 1px solid ${({ active }) => (active ? "#D33A2C" : "#FEE0E0")};
  border-radius: 11px;
  box-sizing: border-box;
  color: ${({ active }) => (active ? "#fff" : "#D33A2C")};
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  line-height: 33px;
  padding: 6px 14px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ active }) => (active ? "#D33A2C" : "#FFE3E3")};
    border-color: ${({ active }) => (active ? "#D33A2C" : "#FAA4A4")};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  text-align: left;
`;

// -------- COMPONENT --------

const Relation = () => {
  const [profileList, setProfileList] = useState([]);
  const [activeTab, setActiveTab] = useState("caracter");

  console.log("liste des profil", profileList);

  return (
    <>
      <ButtonGroup>
        <TabButton
          active={activeTab === "caracter"}
          onClick={() => setActiveTab("caracter")}
        >
          Personnes
        </TabButton>

        <TabButton
          active={activeTab === "Tree"}
          onClick={() => setActiveTab("Tree")}
        >
          Arbre de relation
        </TabButton>
      </ButtonGroup>

      <Content>
        {activeTab === "caracter" && (
          <Relationcaracter SetProfileList={setProfileList} />
        )}
        {activeTab === "Tree" && (
          <RelationTree SetProfileList={profileList} />
        )}
      </Content>
    </>
  );
};

export default Relation;
