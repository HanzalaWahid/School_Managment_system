import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Users, Wallet, Settings, Bell, Command, X } from 'lucide-react';
import { useUI } from '../../state/uiStore';
import { useNavigate } from 'react-router-dom';

const CommandPalette = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useUI();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const actions = [
    { icon: GraduationCap, label: 'Manage Students', path: '/students', category: 'Academic' },
    { icon: Users, label: 'View Teachers', path: '/teachers', category: 'Academic' },
    { icon: Wallet, label: 'Finance & Invoices', path: '/finance', category: 'Finance' },
    { icon: Bell, label: 'Notification Center', path: '/notifications', category: 'General' },
    { icon: Settings, label: 'System Settings', path: '/settings', category: 'General' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  const handleSelect = (path) => {
    navigate(path);
    setIsCommandPaletteOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      if (filteredActions[selectedIndex]) {
        handleSelect(filteredActions[selectedIndex].path);
      }
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="absolute inset-0 bg-bg-dark/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl glass-surface rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5">
              <Search className="text-text-muted" size={24} />
              <input
                autoFocus
                placeholder="Search across EDUFlow... (e.g. 'finance')"
                className="flex-1 bg-transparent border-none text-lg text-white placeholder-text-muted focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <div className="flex items-center gap-1 glass px-2 py-1 rounded-lg border border-white/10">
                <span className="text-[10px] text-text-muted font-bold">ESC</span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4 no-scrollbar">
              {filteredActions.length > 0 ? (
                <div className="space-y-4">
                  {filteredActions.map((action, index) => (
                    <div
                      key={action.path}
                      onClick={() => handleSelect(action.path)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all ${
                        index === selectedIndex 
                          ? 'bg-primary text-white glow-indigo' 
                          : 'hover:bg-white/5 text-text-muted'
                      }`}
                    >
                      <action.icon size={20} className={index === selectedIndex ? 'text-white' : 'text-primary'} />
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${index === selectedIndex ? 'text-white' : 'text-white/90'}`}>{action.label}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${index === selectedIndex ? 'text-white/60' : 'text-text-muted'}`}>{action.category}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-40">
                        <Command size={10} />
                        <span className="text-[10px] font-bold">↵</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-text-muted font-bold">No results found for "{query}"</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <kbd className="glass px-2 py-0.5 rounded text-[10px] text-text-muted">↑↓</kbd>
                  <span className="text-[10px] text-text-muted font-bold">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="glass px-2 py-0.5 rounded text-[10px] text-text-muted">↵</kbd>
                  <span className="text-[10px] text-text-muted font-bold">Select</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global Search</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
