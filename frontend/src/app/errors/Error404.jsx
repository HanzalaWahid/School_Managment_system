import { motion } from "framer-motion";

const Error404 = () => (
  <div className="flex h-screen items-center justify-center bg-bg-dark text-white font-sans">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 glow-indigo">
        <span className="text-xl font-bold tracking-widest text-primary">SYS</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Error404</h1>
      <p className="text-sm text-text-muted">Enterprise System Module</p>
      <button className="mt-8 btn-premium px-6 py-2 text-xs font-bold">Return</button>
    </motion.div>
  </div>
);

export default Error404;
