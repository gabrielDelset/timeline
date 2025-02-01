import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import "../css/Popup.css";
import RelationTree from '../pages-subfolder/relation-tree';
import Relationcaracter from '../pages-subfolder/relation-caracter';
//import Relationcaracter from '../component/caracter-sheet';


const Relation = () => {


  const [activeTab, setActiveTab] = useState("Relation");

  const networkRef = useRef(null);

  useEffect(() => {
  }, []);

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
          {activeTab === "caracter" && <Relationcaracter/>}
          {activeTab === "Tree" && <RelationTree />}
        </div>

    </>

  )
 
};

export default Relation;
