import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import "../css/Popup.css";

const RelationTree = () => {
  const networkRef = useRef(null);

  useEffect(() => {
    const DIR = "../img/indonesia/";
    const nodes = [
      { id: 1, shape: "circularImage", image: DIR + "1.png" },
      { id: 2, shape: "circularImage", image: DIR + "2.png" },
      { id: 3, shape: "circularImage", image: DIR + "3.png" },
      {
        id: 4,
        shape: "circularImage",
        image: DIR + "4.png",
        label: "pictures by this guy!",
      },
      { id: 5, shape: "circularImage", image: DIR + "5.png", label: "gabriel delset", },
      { id: 6, shape: "circularImage", image: DIR + "6.png" },
      { id: 7, shape: "circularImage", image: DIR + "7.png" },
      { id: 8, shape: "circularImage", image: DIR + "8.png" },
      { id: 9, shape: "circularImage", image: DIR + "9.png" },
      { id: 10, shape: "circularImage", image: DIR + "10.png" },
      { id: 11, shape: "circularImage", image: DIR + "11.png" },
      { id: 12, shape: "circularImage", image: DIR + "12.png" },
      { id: 13, shape: "circularImage", image: DIR + "13.png" },
      { id: 14, shape: "circularImage", image: DIR + "14.png" },
      {
        id: 15,
        shape: "circularImage",
        image: DIR + "missing.png",
        brokenImage: DIR + "missingBrokenImage.png",
        label: "when images\nfail\nto load",
      },
      {
        id: 16,
        shape: "circularImage",
        image: DIR + "anotherMissing.png",
        brokenImage: DIR + "9.png",
        label: "fallback image in action",
      },
    ];

    const edges = [
      { from: 1, to: 16 , color: { color: "red" }},
      { from: 3, to: 16 },
      { from: 16, to: 3 },
      { from: 2, to: 3},
      { from: 4, to: 10 },
      { from: 1, to: 6 },
      { from: 11, to: 7 },
      { from: 7, to: 8 },
      { from: 1, to: 9 },
      { from: 2, to: 10 },
      { from: 6, to: 11 },
      { from: 1, to: 12 },
      { from: 10, to: 13 },
      { from: 1, to: 14 },
      { from: 13, to: 16 },
    ];

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      nodes: {
        borderWidth: 4,
        size: 30,
        color: {
          border: "#222222",
          background: "#666666",
        },
        font: { color: "#c51717" },
      },
      edges: {
        color: "lightgray",
      },
    };

    const container = networkRef.current;
    new Network(container, data, options);
  }, []);

  return(
    <>
    <div id="mynetwork" ref={networkRef} style={{ width: "100%", height: "550px", border: "1px solid lightgray" }}></div>
    </>

  )
 
};

export default RelationTree;
