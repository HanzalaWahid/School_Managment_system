import GlassCard from "../../components/ui/GlassCard";
import { motion } from "framer-motion";

const Staff = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Staff</h1>
      <p className="text-sm text-text-muted">Manage your enterprise staff metrics and operations.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard className="p-6 md:col-span-2">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <h3 className="text-lg font-bold text-white">System Data</h3>
        </div>
        <div className="h-48 flex items-center justify-center text-text-muted border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
          No data available for this module yet.
        </div>
      </GlassCard>
    </div>
  </motion.div>
);

export default Staff;
