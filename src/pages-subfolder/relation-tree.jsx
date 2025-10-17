import React, { useEffect, useState } from "react";
import Graph from "react-vis-network-graph";
import styled from "styled-components";
import ProfileCard from "../component/caracter";
import PopupCreateLink from "../component/popup-createlink";
import { useAuth } from "../tools/AuthContext";
import { v4 as uuid } from "uuid";
import { SaveTreeEdges, SaveTreeNodes ,  getJsonLinksid} from "../tools/API/api";


// ---------------- STYLED COMPONENTS (équivalents à Relation.css + Popup.css) ----------------

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
  &::-webkit-scrollbar { display: none; }
`;

const GraphWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50vh;
`;

const Legend = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const LegendSwatch = styled.span`
  width: 15px;
  height: 3px;
  display: inline-block;
  margin-right: 6px;
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
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover { background-color: #fff; }
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

  @media (min-width: 768px) {
    min-width: 120px;
    padding: 0 25px;
  }
`;

/* positions identiques à .button-container-save2 et .button-container-save3 */
const ButtonContainerSave2 = styled.div`
  position: absolute;
  bottom: 0vh;
  right: 4vh;
  z-index: 10;
  display: flex;
  gap: 4vh;
`;

const ButtonContainerSave3 = styled.div`
  position: absolute;
  bottom: 8vh;
  right: 4vh;
  z-index: 10;
  display: flex;
  gap: 4vh;
`;

const DivButton = styled.div`
  position: absolute;
  bottom: 1vh;
  left: 4vh;
  z-index: 10;
  display: flex;
  gap: 4vh;
`;

// ---------------- COMPONENT ----------------

const RelationTree = ({ SetProfileList, item }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isPopupLinkOpen, setIsPopupLinkOpen] = useState(false);
  const [saveButton, setSaveButton] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [TextSize, setTextSize] = useState(24);
  const [TextDisable, setTextDisable] = useState("disable");
  const [legendLinks, setLegendLinks] = useState([]);
  const [enable, setEnable] = useState(false);
  const { email, personnesJsonList, setPersonnesJsonList , selectedLink } = useAuth();
  


useEffect(() => {
  if (SetProfileList) setProfiles(SetProfileList);

  if (!personnesJsonList || !item?.id) return;

  // ✅ Trouver le groupe correspondant à l'ID courant
    console.log("item.id",item.id) ;
    console.log("personnesJsonList",personnesJsonList) ;
  const found = personnesJsonList.find(el => el.id === item.id);
console.log("found",found);


  if (found) {
      console.log(found.liens) ;
    setEdges(found.liens ?? []);
    setNodes(found.personnes ?? []);
  } else {
    // Si rien trouvé, on vide le graph
     console.log(found) ;
    setEdges([]);
    setNodes([]);
  }
}, [SetProfileList, personnesJsonList, item]);


  const options = {
  layout: { hierarchical: false },
  edges: {
    width: 4,
    color: { color: "#92da9e", highlight: "#92da9e", hover: "#92da9e" },
    length: 400, // 🔹 un peu plus court, plus stable visuellement
    arrows: { to: { enabled: false }, from: { enabled: false } },
    font: { size: TextSize, multi: "html" },
    smooth: { type: "continuous" } // 🔹 les liens suivent des courbes douces
  },
  nodes: {
    shape: "circularImage",
    borderWidth: 4,
    size: 40, // 🔹 légèrement plus gros, meilleur repérage visuel
    color: { border: "#222", background: "#666" },
    font: { size: 22, color: "#000" },
  },
  interaction: {
    hover: true,
    dragNodes: true,
    zoomView: true,
    dragView: true,
  },
  physics: {
    enabled: true,
    stabilization: {
      iterations: 250,
      fit: true,
    },
    solver: "forceAtlas2Based",
    forceAtlas2Based: {
      gravitationalConstant: -50,   // 🔹 repousse plus fort
      centralGravity: 0.001,         // 🔹 attire beaucoup moins vers le centre
      springLength: 350,             // 🔹 distance naturelle entre les nœuds
      springConstant: 0.03,          // 🔹 moins de tension dans les liens
      avoidOverlap: 1,               // 🔹 évite que les images se superposent
    },
  },
  manipulation: {
    enabled: true,
    addEdge: (edgeData, callback) => {
      if (selectedLink) {
        edgeData.color = {
          color: selectedLink.color,
          highlight: selectedLink.color,
          hover: selectedLink.color,
        };
        edgeData.length = selectedLink.length;
        edgeData.label = `<b>${selectedLink.name}</b>`;
      }
      edgeData.id = uuid();
      setEdges((prev) => [...prev, edgeData]);
      callback(null);
    },
    addNode: false,
    deleteEdge: (data, callback) => {
      setEdges((prev) => prev.filter((e) => !data.edges.includes(e.id)));
      callback(data);
    },
    deleteNode: (data, callback) => {
      setNodes((prev) => prev.filter((n) => !data.nodes.includes(n.id)));
      setEdges((prev) =>
        prev.filter(
          (e) => !data.nodes.includes(e.from) && !data.nodes.includes(e.to)
        )
      );
      callback(data);
    },
  },
};


  const events = {
    selectNode: ({ nodes: [id] }) => {
      setEdges((prev) =>
        prev.map((e) => ({
          ...e,
          hidden: !(e.from === id || e.to === id),
        }))
      );
    },
    deselectNode: () => {
      setEdges((prev) => prev.map((e) => ({ ...e, hidden: false })));
    },
  };

  const handleSelectProfile = (id) => {
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      setSelectedProfile(profile);
      setSaveButton(false);
    }
  };

  const addPerson = () => {
    if (!selectedProfile) return;
    if (!nodes.some((n) => n.id === selectedProfile.id)) {
      setNodes((prev) => [
        {
          id: selectedProfile.id,
          image: selectedProfile.photo,
          shape: "circularImage",
          label: selectedProfile.firstName,
        },
        ...prev,
      ]);
    }
  };

const SaveTree = async () => {
  try {
    console.log("Sauvegarde en cours pour", email, "ID", item.id);

    // 🔹 1. Sauvegarde côté serveur
    await SaveTreeEdges(JSON.stringify(edges), email, item.id);
    await SaveTreeNodes(JSON.stringify(nodes), email, item.id);

    // 🔹 2. Met à jour ton contexte local (sans recharger la page)
    setPersonnesJsonList((prevList) => {
      if (!prevList) return []; // au cas où il est null au départ

      // Vérifie si l'id existe déjà
      const exists = prevList.some((el) => Number(el.id) === Number(item.id));

      if (exists) {
        // Met à jour le bon élément
        return prevList.map((el) =>
          Number(el.id) === Number(item.id)
            ? { ...el, personnes: nodes, liens: edges }
            : el
        );
      } else {
        // Sinon, ajoute un nouveau groupe
        return [
          ...prevList,
          { id: item.id, personnes: nodes, liens: edges }
        ];
      }
    });

    console.log(" Données locales mises à jour pour l’ID", item.id);
  } catch (err) {
    console.error(" Erreur lors de la sauvegarde :", err);
  }
};

  const handleDisableText = () => {
    if (enable) {
      setTextSize(0);
      setTextDisable("enable");
      setEnable(false);

      const map = new Map();
      edges.forEach((e) => {
        const name = (e.label || "").replace(/<\/?b>/g, "");
        const color = e.color?.color || "#000";
        const key = `${name}|${color}`;
        if (!map.has(key)) map.set(key, { name, color });
      });
      setLegendLinks([...map.values()]);
    } else {
      setTextSize(24);
      setTextDisable("disable");
      setEnable(true);
      setLegendLinks([]);
    }
  };

  return (
    <>
      <Fenetre>
        <ColumnCaracter>
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              imageUrl={profile.photo}
              firstName={profile.firstName}
              lastName={profile.lastName}
              onSelect={handleSelectProfile}
              className={selectedProfile?.id === profile.id ? "selected" : ""}
            />
          ))}
        </ColumnCaracter>

        <GraphWrapper>
          <Graph
            graph={{ nodes, edges }}
            options={options}
            events={events}
            style={{ height: "100%" }}
          />

          {legendLinks.length > 0 && (
            <Legend>
              {legendLinks.map((link) => (
                <LegendItem key={link.name}>
                  <LegendSwatch style={{ backgroundColor: link.color }} />
                  {link.name}
                </LegendItem>
              ))}
            </Legend>
          )}

          <ButtonContainerSave3>
            <Button74 onClick={() => setIsPopupLinkOpen(true)}>Définir liens</Button74>
          </ButtonContainerSave3>

          <ButtonContainerSave2>
            <Button74 onClick={addPerson} disabled={saveButton}>Ajouter personne</Button74>
            <Button74 onClick={SaveTree} disabled={false}>Sauvegarder</Button74>
          </ButtonContainerSave2>

          <DivButton>
            <Button74 onClick={handleDisableText}>text {TextDisable}</Button74>
          </DivButton>
        </GraphWrapper>
      </Fenetre>

      {isPopupLinkOpen && <PopupCreateLink onClose={() => setIsPopupLinkOpen(false)} />}
    </>
  );
};

export default RelationTree;
