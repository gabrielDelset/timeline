import React from "react";
import Graph from "react-vis-network-graph";

const VisGraph = () => {
  const graph = {
    nodes: [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
    ],
    edges: [
      { from: 1, to: 2 },
    ],
  };

  const options = {
    interaction: { hover: true },
    manipulation: { enabled: true, addEdge: true ,  addNode: true},
    layout: { hierarchical: false },
    edges: { color: "#000000" },
  };

  return <Graph graph={graph} options={options} style={{ height: "400px" }} />;
};

export default VisGraph;
