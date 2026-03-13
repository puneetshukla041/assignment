// hooks/useGraphState.ts
import { useState, useEffect, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import Papa from 'papaparse';
import { AppNode, AppEdge, CSVNode, CSVEdge } from '../types/graph';
import { nodesCsv, edgesCsv } from '../lib/seedData';

const STORAGE_KEY = 'knowledge-graph-data';

export function useGraphState() {
  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<AppEdge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(storedData);
      setNodes(savedNodes);
      setEdges(savedEdges);
    } else {
      const parsedNodes = Papa.parse<CSVNode>(nodesCsv, { header: true, skipEmptyLines: true }).data;
      const parsedEdges = Papa.parse<CSVEdge>(edgesCsv, { header: true, skipEmptyLines: true }).data;

      const formattedNodes: AppNode[] = parsedNodes.map((row, index) => ({
        id: row.id,
        type: 'customNode',
        position: { x: (index % 3) * 320, y: Math.floor(index / 3) * 200 },
        data: { title: row.title, note: row.note },
      }));

      const formattedEdges: AppEdge[] = parsedEdges.map((row, index) => ({
        id: `e-${row.source}-${row.target}-${index}`,
        source: row.source,
        target: row.target,
        type: 'customEdge', // Uses our new premium edge
        label: row.label,
        animated: true,
        style: { stroke: '#5c6bc0', strokeWidth: 2 },
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, isLoaded]);

  const onNodesChange = useCallback((changes: NodeChange<AppNode>[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange<AppEdge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((connection: Connection) => {
    // This pops up asking for the relationship when a line is drawn
    const label = window.prompt("Enter relationship (e.g., 'requires', 'uses'):", "related to");
    if (label === null) return; 

    setEdges((eds) => addEdge({ 
      ...connection, 
      type: 'customEdge',
      label, 
      animated: true, 
      style: { stroke: '#5c6bc0', strokeWidth: 2 } 
    }, eds));
  }, []);

  return { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, isLoaded };
}