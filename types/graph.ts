import { Node, Edge } from '@xyflow/react';

// Defines the custom data inside our nodes
export interface KnowledgeNodeData extends Record<string, unknown> {
  title: string;
  note: string;
}

// Strictly typed Node and Edge using React Flow's generic types
export type AppNode = Node<KnowledgeNodeData>;
export type AppEdge = Edge;

// Defines the structure of our seed data from the CSVs
export interface CSVNode {
  id: string;
  title: string;
  note: string;
}

export interface CSVEdge {
  source: string;
  target: string;
  label: string;
}