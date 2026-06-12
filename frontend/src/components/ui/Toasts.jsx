import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useUI } from '../../state/uiStore';

const Toast = ({ toast }) => {
  const { removeToast } = useUI();
  
  const Icons = {
    success: <CheckCircle2 className="text-accent-emerald" size={20} />,
    warning: <AlertTriangle className="text-accent-rose" size={20} />,
    info: <Info className="text-accent-cyan" size={20} />,
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0 }}
      layout
      className="glass-surface p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10 min-w-[300px]"
    >
      <div className="flex-shrink-0">
        {Icons[toast.type] || Icons.info}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{toast.title}</p>
        <p className="text-xs text-text-muted">{toast.message}</p>
      </div>
      <button 
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:bg-white/5 rounded-lg text-text-muted"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useUI();

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
