import React, { useState } from "react";
import "vis-network/styles/vis-network.css";
import "../css/Popup.css";
import RelationTree from '../pages-subfolder/relation-tree';
import Relationcaracter from '../pages-subfolder/relation-caracter';
//import RelationTree from '../pages-subfolder/test';


const Relation = () => {

  const [profileList, setProfileList] = useState([]);
  const [activeTab, setActiveTab] = useState("caracter");

  console.log("liste des profil",profileList);

  return(
    <>
    <div className="divButton">
           <button
          className={`button-45 ${activeTab === "résumé" ? "active" : ""}`}
          onClick={() => setActiveTab("caracter")}
        >
          personnes
        </button>

        <button
          className={`button-45 ${activeTab === "résumé" ? "active" : ""}`}
          onClick={() => setActiveTab("Tree")}
        >
          arbre de relation
        </button> 
        </div>
        <div className="popup-content">
          {activeTab === "caracter" && <Relationcaracter SetProfileList={setProfileList} />}
          {activeTab === "Tree" && <RelationTree SetProfileList={profileList} />}
        </div>

    </>

  )
 
};

export default Relation;
