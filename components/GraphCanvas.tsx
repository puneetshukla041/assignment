"use client";
import { Plus } from 'lucide-react';
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useOnSelectionChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphState } from '../hooks/useGraphState';
import { CustomNode } from './CustomNode';
import { Sidebar } from './Sidebar';
import { AppNode } from '../types/graph';

const nodeTypes = { customNode: CustomNode };

export function GraphCanvas() {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, isLoaded } = useGraphState();
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

  // CRUD: Update an existing node
  const handleUpdateNode = useCallback((id: string, title: string, note: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, title, note } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // CRUD: Add a new node
  const handleAddNode = useCallback((title: string, note: string) => {
    const newNode: AppNode = {
      id: `node-${Date.now()}`,
      type: 'customNode',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 }, // Drop it in view
      data: { title, note },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // CRUD: Delete a node AND its connected edges
  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-obsidian-bg"
      >
        <Background gap={24} size={2} color="#333333" />
        <Controls className="bg-obsidian-surface border-obsidian-border fill-obsidian-text shadow-node rounded-xl overflow-hidden" showInteractive={false} />
        <MiniMap nodeColor="#5c6bc0" maskColor="rgba(30, 30, 30, 0.7)" className="bg-obsidian-surface border border-obsidian-border rounded-xl shadow-node" />

        <Panel position="top-left" className="m-6">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Knowledge Base</h1>
          <p className="text-sm text-obsidian-muted mt-1">Interactive Relationship Mapper</p>
          
          <button 
            onClick={() => { setSelectedNode(null); setIsSidebarOpen(true); }}
            className="mt-4 flex items-center gap-2 bg-obsidian-surface hover:bg-obsidian-border border border-obsidian-border text-white text-sm px-4 py-2 rounded-lg transition-colors shadow-node"
          >
            <Plus size={16} /> Add Topic
          </button>
        </Panel>
      </ReactFlow>

      {/* Render the Sidebar over the canvas */}
      {isSidebarOpen && (
        <Sidebar 
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}