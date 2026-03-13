// components/GraphCanvas.tsx
"use client";

import { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { 
  ReactFlow, Background, Controls, MiniMap, Panel, 
  useOnSelectionChange, ReactFlowProvider 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphState } from '../hooks/useGraphState';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge'; // Import the new edge
import { Sidebar } from './Sidebar';
import { AppNode, AppEdge } from '../types/graph';

// Register both custom components
const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

function GraphContent() {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, isLoaded } = useGraphState();
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 0) { setSelectedNode(nodes[0] as AppNode); setIsSidebarOpen(true); } 
      else { setSelectedNode(null); }
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
    style: { ...node.style, opacity: connectedNodeIds ? (connectedNodeIds.has(node.id) ? 1 : 0.2) : 1, transition: 'opacity 0.4s ease' }
  })), [nodes, connectedNodeIds]);

  const displayEdges = useMemo(() => edges.map(edge => ({
    ...edge,
    style: { ...edge.style, opacity: connectedNodeIds ? ((connectedNodeIds.has(edge.source) || connectedNodeIds.has(edge.target)) ? 1 : 0.1) : 1, transition: 'opacity 0.4s ease' }
  })), [edges, connectedNodeIds]);
  // ------------------------------------------------------

  const handleUpdateNode = useCallback((id: string, title: string, note: string) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, title, note } } : node));
  }, [setNodes]);

  const handleAddNode = useCallback((title: string, note: string) => {
    const newNode: AppNode = { id: `node-${Date.now()}`, type: 'customNode', position: { x: 100, y: 100 }, data: { title, note } };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  if (!isLoaded) return <div className="flex items-center justify-center w-full h-screen bg-obsidian-bg"><div className="w-8 h-8 border-4 border-obsidian-accent border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        nodes={displayNodes} // using the dynamic nodes array
        edges={displayEdges} // using the dynamic edges array
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        onEdgesDelete={(deletedEdges) => setEdges((eds) => eds.filter((e) => !deletedEdges.find((de) => de.id === e.id)))}
        nodeTypes={nodeTypes} 
        edgeTypes={edgeTypes} // Register the edge UI
        fitView 
        className="bg-obsidian-bg"
      >
        <Background gap={24} size={2} color="#333333" />
        <Controls className="bg-obsidian-surface border-obsidian-border fill-obsidian-text shadow-node rounded-xl overflow-hidden" showInteractive={false} />
        <MiniMap nodeColor="#5c6bc0" maskColor="rgba(30, 30, 30, 0.7)" className="bg-obsidian-surface border border-obsidian-border rounded-xl shadow-node" />
        
        <Panel position="top-left" className="m-6">
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Knowledge Base</h1>
          <p className="text-sm text-obsidian-muted mt-1 max-w-xs leading-relaxed">
            Click a topic to focus on its relationships. Drag from handles to create connections.
          </p>
          <button onClick={() => { setSelectedNode(null); setIsSidebarOpen(true); }} className="mt-4 flex items-center gap-2 bg-obsidian-surface hover:bg-obsidian-border border border-obsidian-border text-white text-sm px-4 py-2 rounded-lg transition-colors shadow-node"><Plus size={16} /> Add Topic</button>
        </Panel>
      </ReactFlow>
      {isSidebarOpen && <Sidebar selectedNode={selectedNode} onUpdateNode={handleUpdateNode} onAddNode={handleAddNode} onDeleteNode={handleDeleteNode} onClose={() => setIsSidebarOpen(false)} />}
    </div>
  );
}

export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphContent />
    </ReactFlowProvider>
  );
}