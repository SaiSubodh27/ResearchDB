import React, { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "project" | "paper" | "note" | "experiment";
  color: string;
}

const nodes: Node[] = [
  { id: "1", label: "IonCast", type: "project", color: "#a78bfa" },
  { id: "2", label: "Physics-Informed ML", type: "paper", color: "#818cf8" },
  { id: "3", label: "NASICON Review", type: "paper", color: "#818cf8" },
  {
    id: "4",
    label: "Model Architecture Notes",
    type: "note",
    color: "#14b8a6",
  },
  {
    id: "5",
    label: "Surrogate Model v5",
    type: "experiment",
    color: "#fbbf24",
  },
  { id: "6", label: "HES Framework", type: "project", color: "#a78bfa" },
  { id: "7", label: "Pillar Definitions", type: "note", color: "#14b8a6" },
  { id: "8", label: "Garnet LLZO", type: "paper", color: "#818cf8" },
  {
    id: "9",
    label: "SSE Screening Pipeline",
    type: "project",
    color: "#a78bfa",
  },
  {
    id: "10",
    label: "HES Score Collapse",
    type: "experiment",
    color: "#fbbf24",
  },
];

const edges = [
  ["1", "2"],
  ["1", "3"],
  ["1", "4"],
  ["1", "5"],
  ["6", "7"],
  ["6", "10"],
  ["2", "3"],
  ["2", "8"],
  ["3", "8"],
  ["9", "2"],
  ["9", "8"],
];

export function KnowledgeGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    project: true,
    paper: true,
    note: true,
    experiment: true,
  });

  const filteredNodes = nodes.filter((n) => filters[n.type]);
  const filteredEdges = edges.filter(
    ([from, to]) =>
      filteredNodes.some((n) => n.id === from) &&
      filteredNodes.some((n) => n.id === to),
  );

  const selectedNodeObj = selectedNode
    ? nodes.find((n) => n.id === selectedNode)
    : null;
  const connectedNodes = selectedNodeObj
    ? edges
        .filter(([from, to]) => from === selectedNode || to === selectedNode)
        .flat()
        .filter((id) => id !== selectedNode)
        .map((id) => nodes.find((n) => n.id === id)!)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-sidebar">
          Knowledge Graph
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Visualize relationships between your projects, papers, notes, and
          experiments
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filter Panel */}
        <div className="w-64 bg-card border border-border-light rounded-card p-6 h-fit sticky top-20">
          <h3 className="font-medium text-gray-900 mb-4">Filter Nodes</h3>
          <div className="space-y-3">
            {(["project", "paper", "note", "experiment"] as const).map(
              (type) => {
                const colors = {
                  project: "#a78bfa",
                  paper: "#818cf8",
                  note: "#14b8a6",
                  experiment: "#fbbf24",
                };
                const labels = {
                  project: "Projects",
                  paper: "Papers",
                  note: "Notes",
                  experiment: "Experiments",
                };
                return (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters[type]}
                      onChange={(e) =>
                        setFilters({ ...filters, [type]: e.target.checked })
                      }
                      className="w-4 h-4 text-accent rounded"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[type] }}
                      />
                      <span className="text-sm">{labels[type]}</span>
                    </div>
                  </label>
                );
              },
            )}
          </div>
        </div>

        {/* Graph Area */}
        <div className="flex-1">
          <div
            className="relative bg-card border border-border-light rounded-card p-6"
            style={{ height: "600px" }}
          >
            {/* SVG Graph */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              {/* Edges */}
              {filteredEdges.map((edge, i) => {
                const from = filteredNodes.find((n) => n.id === edge[0]);
                const to = filteredNodes.find((n) => n.id === edge[1]);
                if (!from || !to) return null;
                const fromY = (filteredNodes.indexOf(from) % 3) * 200 + 100;
                const toY = (filteredNodes.indexOf(to) % 3) * 200 + 100;
                const fromX =
                  Math.floor(filteredNodes.indexOf(from) / 3) * 300 + 100;
                const toX =
                  Math.floor(filteredNodes.indexOf(to) / 3) * 300 + 100;
                return (
                  <line
                    key={i}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#ccc"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            <div style={{ pointerEvents: "auto" }}>
              {filteredNodes.map((node, idx) => {
                const y = (idx % 3) * 200 + 80;
                const x = Math.floor(idx / 3) * 300 + 60;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="absolute"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      width: "80px",
                      height: "80px",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium text-center p-2 cursor-pointer hover:scale-110 transition-transform ${
                        selectedNode === node.id
                          ? "ring-2 ring-offset-2 ring-accent"
                          : ""
                      }`}
                      style={{
                        backgroundColor: node.color,
                        opacity: selectedNode === node.id ? 1 : 0.8,
                      }}
                    >
                      {node.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="absolute top-6 right-6 flex gap-2 z-10">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ZoomIn size={18} />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ZoomOut size={18} />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNodeObj && (
            <div className="mt-6 bg-card border border-border-light rounded-card p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                {selectedNodeObj.label}
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Type
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    {selectedNodeObj.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                    Connected Items
                  </p>
                  <div className="space-y-1">
                    {connectedNodes.length > 0 ? (
                      connectedNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNode(node.id)}
                          className="block text-sm text-accent hover:text-indigo-700 text-left"
                        >
                          • {node.label}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No connections</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
