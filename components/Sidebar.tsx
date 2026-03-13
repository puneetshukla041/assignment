// components/Sidebar.tsx
import { useState, useEffect } from 'react';
import { Trash2, Plus, Save, X } from 'lucide-react';
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

  // Whenever a new node is selected, populate the form
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

    if (selectedNode) {
      onUpdateNode(selectedNode.id, title, note);
    } else {
      onAddNode(title, note);
      setTitle('');
      setNote('');
    }
  };

  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 bg-obsidian-surface/90 backdrop-blur-xl border border-obsidian-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-transform z-10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-obsidian-border bg-obsidian-bg/50">
        <h2 className="text-lg font-semibold text-white">
          {selectedNode ? 'Edit Node' : 'Add New Node'}
        </h2>
        <button onClick={onClose} className="p-1 rounded-md text-obsidian-muted hover:text-white hover:bg-obsidian-border transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 flex-grow">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-obsidian-muted uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., React Server Components"
            className="w-full bg-obsidian-bg border border-obsidian-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 flex-grow">
          <label className="text-xs font-medium text-obsidian-muted uppercase tracking-wider">Note Content</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe this topic..."
            className="w-full h-full min-h-[150px] bg-obsidian-bg border border-obsidian-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4">
          {selectedNode && (
            <button
              type="button"
              onClick={() => {
                onDeleteNode(selectedNode.id);
                onClose();
              }}
              className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              title="Delete Node"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            type="submit"
            className="flex-grow flex items-center justify-center gap-2 bg-obsidian-accent hover:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {selectedNode ? <Save size={18} /> : <Plus size={18} />}
            {selectedNode ? 'Save Changes' : 'Create Node'}
          </button>
        </div>
      </form>
    </div>
  );
}