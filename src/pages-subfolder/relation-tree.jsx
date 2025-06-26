import React, { useEffect, useRef, useState } from "react";
import Graph from "react-vis-network-graph";
import "../css/Popup.css";
import ProfileCard from "../component/caracter";
import empty from "../images/empty-cat.jpg";
import PopupCreateLink from "../component/popup-createlink"; // Correction du nom

const RelationTree = ({ SetProfileList }) => {
  const networkRef = useRef(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isPopupLinkOpen, setIsPopupLinkOpen] = useState(false);
  const [saveButton, setSaveButton] = useState(true);
  const [nodes, setNodes] = useState([
    { id: 1, image: empty, label: "Node 1" },
    { id: 2, image: empty, label: "Node 2" }
  ]);
  const [edges, setEdges] = useState([
    { from: 1, to: 2 ,color:"blue"},
    { from: 2, to: 1 ,color:"blue"}
  ]);

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (SetProfileList) {
      setProfiles(SetProfileList);
    }
  }, [SetProfileList]);

  const graph = { nodes, edges };

  const options = {
    layout: { hierarchical: false },
    edges: {
      color: { color: "#92da9e", highlight: "#0a0000", hover: "#af0b0b" },
      length: 600,
      arrows: { to: { enabled: false }, from: { enabled: false } }
    },
    nodes: {
      shape: "circularImage",
      borderWidth: 4,
      size: 30,
      color: { border: "#222222", background: "#666666" },
      font: { color: "#91a4e4" }
    },
    interaction: { hover: true },
    physics: { enable: true },
    manipulation: {
      enabled: true,
      addEdge: (edgeData, callback) => {
        setEdges((prevEdges) => [...prevEdges, edgeData]);
        callback(edgeData);
      },
      addNode: false
    }
  };

  const handleSelect = (id) => {
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      setSelectedProfile(profile);
      setSaveButton(false);
    }
  };

  const addPerson = () => {
    if (!selectedProfile) return;
    if (!nodes.some((node) => node.id === selectedProfile.id)) {
      setNodes((prevNodes) => [
        { id: selectedProfile.id, image: selectedProfile.photo, shape: "circularImage", label: selectedProfile.firstName },
        ...prevNodes
      ]);
    } else {
      console.log("Cette personne est déjà dans le graphe.");
    }
  };

  const addLinks = () => {
    setIsPopupLinkOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupLinkOpen(false);
  };

  return (
    <>
      <div className="fenetre">
        <div className="column-caracter">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              imageUrl={profile.photo}
              firstName={profile.firstName}
              lastName={profile.lastName}
              onSelect={handleSelect}
              className={selectedProfile?.id === profile.id ? "selected" : ""}
            />
          ))}
        </div>

        <div style={{ position: "relative", width: "100%", height: "50vh" }}>
          <Graph graph={graph} options={options} style={{ height: "100%" }} />
          <div className="button-container-save3">
            <button className="button-74 save-button" onClick={addLinks}>
              Définir liens
            </button>
          </div>
          <div className="button-container-save2">
            <button className="button-74 save-button" onClick={addPerson} disabled={saveButton}>
              Ajouter personne
            </button>
            <button className="button-74 save-button" disabled={true}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
      {isPopupLinkOpen && <PopupCreateLink onClose={handleClosePopup} />}
    </>
  );
};

export default RelationTree;
