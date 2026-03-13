import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { KnowledgeNodeData } from '../types/graph';

export function CustomNode({ data, selected }: NodeProps) {
  // Cast the raw React Flow data to our strictly typed interface
  const nodeData = data as unknown as KnowledgeNodeData;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative min-w-[200px] max-w-[280px] p-4 rounded-xl backdrop-blur-md bg-obsidian-surface/90 border transition-all duration-200 ${
        selected ? 'border-obsidian-accent shadow-node-active' : 'border-obsidian-border shadow-node'
      }`}
    >
      {/* Target Handle (Incoming connections from the Top) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-obsidian-muted border-2 border-obsidian-bg rounded-full" 
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-white truncate">
          {nodeData.title}
        </h3>
        <p className="text-xs text-obsidian-muted line-clamp-3 leading-relaxed">
          {nodeData.note}
        </p>
      </div>

      {/* Source Handle (Outgoing connections from the Bottom) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-obsidian-accent border-2 border-obsidian-bg rounded-full" 
      />
    </motion.div>
  );
}