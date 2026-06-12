import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CommandPalette from '../navigation/CommandPalette';
import { ToastContainer } from '../ui/Toasts';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../state/uiStore';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { isSidebarExpanded } = useUI();
  const location = useLocation();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <Sidebar />
      <Navbar />
      <CommandPalette />
      <ToastContainer />

      <main 
        className={`pt-[var(--navbar-height)] transition-all duration-300 min-h-screen relative z-10 ${
          isSidebarExpanded ? 'ml-[var(--sidebar-width)]' : 'ml-[var(--sidebar-collapsed)]'
        }`}
      >
        <div className="p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="mt-auto py-8 px-8 border-t border-slate-200 text-slate-500 flex justify-between items-center text-xs font-medium">
          <p>© 2026 EduFlow Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <span>v2.8.4-stable</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
