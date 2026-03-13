// components/Sidebar.tsx
import { useState, useEffect } from 'react';
import { Trash2, Plus, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppNode } from '../types/graph';

interface SidebarProps {
  selectedNode: AppNode | null;
  onUpdateNode: (id: string, title: string, note: string) => void;
  onAddNode: (title: string, note: string) => void;
  onDeleteNode: (id: string) => void;
  onClose: () => void;
}

export function Sidebar({ selectedNode, onUpdateNode, onAddNode, onDeleteNode, onClose }: SidebarProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title);
      setNote(selectedNode.data.note);
    } else {
      setTitle('');
      setNote('');
    }
  }, [selectedNode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (selectedNode) { onUpdateNode(selectedNode.id, title, note); } 
    else { onAddNode(title, note); setTitle(''); setNote(''); }
  };

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: '100%', opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      /* Apple Aesthetic: Heavy blur (3xl), translucent background, 
        squircle borders (rounded-[2rem]), and a soft ring 
      */
      className="absolute top-6 right-6 bottom-6 w-84 bg-[#252525]/60 backdrop-blur-3xl ring-1 ring-white/15 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {selectedNode ? 'Edit Topic' : 'New Topic'}
        </h2>
        {/* Apple-style frosted close button */}
        <button 
          onClick={onClose} 
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all duration-200 active:scale-90"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-5 flex-grow">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Title</label>
          {/* iOS style input: rounded-2xl, subtle inner shadow, vibrant focus ring */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., React Core"
            className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3.5 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:bg-white/10 transition-all shadow-inner placeholder:text-white/30"
          />
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Note Content</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full h-full min-h-[150px] bg-black/20 border border-white/5 rounded-2xl px-4 py-3.5 text-[15px] text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:bg-white/10 transition-all shadow-inner placeholder:text-white/30 leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto pt-2">
          {selectedNode && (
            <button
              type="button"
              onClick={() => { onDeleteNode(selectedNode.id); onClose(); }}
              /* Apple destructive styling */
              className="flex items-center justify-center p-3.5 rounded-2xl bg-white/5 text-[#ff453a] hover:bg-[#ff453a] hover:text-white active:scale-95 transition-all"
              title="Delete Node"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            type="submit"
            /* Apple Primary Action styling (System Blue) */
            className="flex-grow flex items-center justify-center gap-2 bg-[#0a84ff] hover:bg-[#0071e3] active:bg-[#005bb5] active:scale-95 text-white py-3.5 px-4 rounded-2xl font-semibold transition-all shadow-md"
          >
            {selectedNode ? <Save size={18} /> : <Plus size={18} />}
            {selectedNode ? 'Save Changes' : 'Create Node'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}