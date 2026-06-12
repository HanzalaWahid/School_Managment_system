import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import Skeleton from '../../components/ui/Skeleton';
import { HardDrive, Cpu, Activity, Database, Globe, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, status, color, loading }) => (
  <GlassCard className="p-6 relative overflow-hidden group">
    {loading ? (
      <div className="space-y-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-full h-8" />
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
            <Icon size={20} className="text-white" style={{ color }} />
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-[2px] px-2 py-1 rounded bg-white/5 border border-white/10 ${status === 'Healthy' ? 'text-accent-emerald' : 'text-accent-rose'}`}>
            {status}
          </span>
        </div>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        <div className="h-1 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            className="h-full bg-primary" 
            style={{ backgroundColor: color }}
          />
        </div>
      </>
    )}
  </GlassCard>
);

const SystemHealth = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Cluster Health</h1>
        <p className="text-text-muted">Real-time infrastructure monitoring for EDUFlow Academy nodes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Cpu} label="CPU Usage" value="24.8%" status="Healthy" color="#6366f1" loading={loading} />
        <MetricCard icon={HardDrive} label="Memory Latency" value="12ms" status="Healthy" color="#22d3ee" loading={loading} />
        <MetricCard icon={Database} label="Storage Capacity" value="2.4 / 10 TB" status="Healthy" color="#10b981" loading={loading} />
        <MetricCard icon={Zap} label="API Request Rate" value="1.2k / sec" status="Optimal" color="#fb7185" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-white">Edge Node Distribution</h3>
            <Globe className="text-primary" size={24} />
          </div>
          <div className="space-y-6">
            {['US-East-1 (Primary)', 'US-West-2', 'EU-Frankfurt', 'AP-Singapore'].map((node, i) => (
              <div key={node} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent-emerald glow-emerald' : 'bg-text-dim'}`} />
                  <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{node}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Latency: {15 + i*5}ms</span>
                  <ArrowUpRight size={14} className="text-text-dim" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full bg-accent-emerald/5 border-2 border-accent-emerald/20 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-accent-emerald/10 rounded-full blur-2xl animate-pulse" />
            <CheckCircle2 size={64} className="text-accent-emerald relative z-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Systems Operational</h3>
          <p className="text-sm text-text-muted max-w-xs mx-auto mb-8">All core dependencies, databases, and microservices are currently performing within optimal parameters.</p>
          <div className="flex gap-4">
            <button className="glass px-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-white">View Details</button>
            <button className="btn-premium px-6 py-3 text-xs font-bold">Recent History</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SystemHealth;
