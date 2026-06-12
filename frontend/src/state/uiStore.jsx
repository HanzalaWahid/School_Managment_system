import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [role, setRole] = useState('admin'); // admin | staff | student
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const toggleCommandPalette = () => setIsCommandPaletteOpen(prev => !prev);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const value = {
    role,
    setRole,
    isSidebarExpanded,
    toggleSidebar,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    toggleCommandPalette,
    toasts,
    addToast,
    removeToast
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
