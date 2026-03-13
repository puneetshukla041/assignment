"use client";
import { AnimatePresence } from 'framer-motion';

import { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';

import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Panel, 
  useOnSelectionChange, 
  ReactFlowProvider 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphState } from '../hooks/useGraphState';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { Sidebar } from './Sidebar';
import { AppNode, AppEdge } from '../types/graph';

// Register both custom components outside the render cycle
const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

function GraphContent() {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    isLoaded 
  } = useGraphState();
  
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Listen for node clicks natively via React Flow
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 0) { 
        setSelectedNode(nodes[0] as AppNode); 
        setIsSidebarOpen(true); 
      } else { 
        setSelectedNode(null); 
      }
    },
  });

  // --- THE NEXT LEVEL STRETCH GOAL: FOCUS MODE LOGIC ---
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return null;
    const ids = new Set<string>([selectedNode.id]);
    edges.forEach(e => {
      if (e.source === selectedNode.id) ids.add(e.target);
      if (e.target === selectedNode.id) ids.add(e.source);
    });
    return ids;
  }, [selectedNode, edges]);

  // Dynamically apply fading to unconnected elements
  const displayNodes = useMemo(() => nodes.map(node => ({
    ...node,
    style: { 
      ...node.style, 
      opacity: connectedNodeIds ? (connectedNodeIds.has(node.id) ? 1 : 0.2) : 1, 
      transition: 'opacity 0.4s ease' 
    }
  })), [nodes, connectedNodeIds]);

  const displayEdges = useMemo(() => edges.map(edge => ({
    ...edge,
    style: { 
      ...edge.style, 
      opacity: connectedNodeIds ? ((connectedNodeIds.has(edge.source) || connectedNodeIds.has(edge.target)) ? 1 : 0.1) : 1, 
      transition: 'opacity 0.4s ease' 
    }
  })), [edges, connectedNodeIds]);
  // ------------------------------------------------------

  // CRUD: Update an existing node
  const handleUpdateNode = useCallback((id: string, title: string, note: string) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, title, note } } : node));
  }, [setNodes]);

  // CRUD: Add a new node
  const handleAddNode = useCallback((title: string, note: string) => {
    const newNode: AppNode = { 
      id: `node-${Date.now()}`, 
      type: 'customNode', 
      position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 }, 
      data: { title, note } 
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // CRUD: Delete a node AND its connected edges
  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  // Prevent rendering until localStorage and CSVs are parsed
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-obsidian-bg">
        <div className="w-8 h-8 border-4 border-obsidian-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        onEdgesDelete={(deletedEdges) => setEdges((eds) => eds.filter((e) => !deletedEdges.find((de) => de.id === e.id)))}
        nodeTypes={nodeTypes} 
        edgeTypes={edgeTypes}
        fitView 
        className="bg-obsidian-bg"
      >
        <Background gap={24} size={2} color="#333333" />
        <Controls className="bg-obsidian-surface border-white/10 fill-obsidian-text shadow-node rounded-xl overflow-hidden" showInteractive={false} />
        <MiniMap nodeColor="#5c6bc0" maskColor="rgba(30, 30, 30, 0.7)" className="bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg" />
        
        {/* Upgraded Premium HUD Panel */}
        <Panel position="top-left" className="m-6 bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] max-w-sm pointer-events-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-obsidian-accent to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Knowledge Base</h1>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Map out relationships between concepts. Drag handles to connect, and click to focus.
          </p>
          <button 
            onClick={() => { setSelectedNode(null); setIsSidebarOpen(true); }} 
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus size={16} /> Add New Topic
          </button>
        </Panel>
      </ReactFlow>

      {/* AnimatePresence enables the smooth sliding exit animation for the Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar 
            selectedNode={selectedNode} 
            onUpdateNode={handleUpdateNode} 
            onAddNode={handleAddNode} 
            onDeleteNode={handleDeleteNode} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrap the main content in the Provider to enable React Flow hooks
export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphContent />
    </ReactFlowProvider>
  );
}