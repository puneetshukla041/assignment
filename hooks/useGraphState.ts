import { useState, useEffect, useCallback } from 'react';
import { 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  NodeChange, 
  EdgeChange, 
  Connection,
} from '@xyflow/react';
import Papa from 'papaparse';
import { AppNode, AppEdge, CSVNode, CSVEdge } from '../types/graph';
import { nodesCsv, edgesCsv } from '../lib/seedData';

const STORAGE_KEY = 'knowledge-graph-data';

export function useGraphState() {
  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<AppEdge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      // If we have saved data, load it immediately
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(storedData);
      setNodes(savedNodes);
      setEdges(savedEdges);
    } else {
      // If localStorage is empty, parse the CSV seed data
      const parsedNodes = Papa.parse<CSVNode>(nodesCsv, { header: true, skipEmptyLines: true }).data;
      const parsedEdges = Papa.parse<CSVEdge>(edgesCsv, { header: true, skipEmptyLines: true }).data;

      // Apply a simple math-based grid layout to prevent nodes from overlapping on first load
      const formattedNodes: AppNode[] = parsedNodes.map((row, index) => ({
        id: row.id,
        type: 'customNode', // We will build this premium UI component next
        position: { 
          x: (index % 3) * 320, 
          y: Math.floor(index / 3) * 200 
        },
        data: { title: row.title, note: row.note },
      }));

      // Format edges with sleek styling
      const formattedEdges: AppEdge[] = parsedEdges.map((row, index) => ({
        id: `e-${row.source}-${row.target}-${index}`,
        source: row.source,
        target: row.target,
        label: row.label,
        animated: true, 
        style: { stroke: '#5c6bc0', strokeWidth: 2 },
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    }
    
    // Mark as loaded to prevent hydration mismatches in Next.js
    setIsLoaded(true);
  }, []);

  // Sync to localStorage silently whenever nodes or edges change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, isLoaded]);

  // Essential standard handlers for dragging, selecting, and drawing new connections
  const onNodesChange = useCallback(
    (changes: NodeChange<AppNode>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<AppEdge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ 
      ...connection, 
      animated: true, 
      style: { stroke: '#5c6bc0', strokeWidth: 2 } 
    }, eds)),
    []
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isLoaded
  };
}