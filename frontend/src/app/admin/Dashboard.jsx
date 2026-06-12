import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../../state/uiStore';
import GlassCard from '../../components/ui/GlassCard';
import Skeleton from '../../components/ui/Skeleton';
import { 
  Users, 
  GraduationCap, 
  Wallet, 
  Activity, 
  ArrowUpRight, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 6000 },
  { name: 'Sat', value: 5500 },
  { name: 'Sun', value: 4800 },
];

const StatCard = ({ icon: Icon, label, value, trend, color, loading }) => (
  <GlassCard className="relative overflow-hidden group">
    {loading ? (
      <div className="space-y-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-full h-8" />
      </div>
    ) : (
      <>
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl opacity-20 group-hover:opacity-40 transition-all"
          style={{ backgroundColor: color }}
        />
        <div className="flex justify-between items-start relative z-10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
            <Icon style={{ color }} size={24} />
          </div>
          <div className="flex items-center gap-1 text-accent-emerald font-bold bg-accent-emerald/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
            <ArrowUpRight size={12} />
            {trend}%
          </div>
        </div>
        <div className="mt-6 relative z-10">
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
        </div>
      </>
    )}
  </GlassCard>
);

const Dashboard = () => {
  const { role } = useUI();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [role]);

  const renderAdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={GraduationCap} label="Total Students" value="12,854" trend="15.2" color="#6366f1" loading={loading} />
      <StatCard icon={Users} label="Active Faculty" value="482" trend="4.8" color="#22d3ee" loading={loading} />
      <StatCard icon={Wallet} label="Net Revenue" value="$428,000" trend="24.1" color="#10b981" loading={loading} />
      <StatCard icon={Activity} label="System Load" value="96.2%" trend="2.4" color="#fb7185" loading={loading} />
    </div>
  );

  const renderStudentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={GraduationCap} label="Course GPA" value="3.84" trend="2.1" color="#6366f1" loading={loading} />
      <StatCard icon={Calendar} label="Attendance" value="98%" trend="1.5" color="#22d3ee" loading={loading} />
      <StatCard icon={Wallet} label="Pending Fees" value="$1,200" trend="0.0" color="#fb7185" loading={loading} />
      <StatCard icon={CheckCircle2} label="Completed ECTS" value="124" trend="12.4" color="#10b981" loading={loading} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-primary">John</span>
          </h1>
          <p className="text-text-muted">You are exploring the <span className="capitalize font-bold text-white">{role}</span> command center.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 glass px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/5 transition-all text-white border border-white/10">
            <Clock size={18} />
            History
          </button>
          <button className="btn-premium px-8 py-3.5 text-sm font-bold flex items-center gap-2">
            Generate Report
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      {role === 'student' ? renderStudentStats() : renderAdminStats()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Widget */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                <p className="text-sm text-text-muted">Real-time system health data</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 glass rounded-xl text-white hover:bg-white/5 border border-white/10"><TrendingUp size={20}/></button>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              {loading ? (
                <Skeleton className="w-full h-full rounded-2xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)'
                      }} 
                    />
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Activity Feed Widget */}
        <div>
          <GlassCard className="h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-white underline decoration-primary decoration-4 underline-offset-8">Activity Flow</h3>
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            </div>
            
            <div className="space-y-6">
              {loading ? [1,2,3,4].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                </div>
              )) : (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary group-hover:bg-primary/10 transition-all">
                        <AlertCircle size={18} className="text-text-muted group-hover:text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 border-b border-white/5 pb-4 group-last:border-none">
                      <p className="text-xs font-bold text-white group-hover:text-primary transition-all">Student Withdrawal Request</p>
                      <p className="text-[10px] text-text-muted mt-1 leading-relaxed">System flag: ID #EDU-2026-441 has requested formal withdrawal.</p>
                      <p className="text-[8px] text-primary font-bold mt-2 uppercase tracking-widest">12 MINUTES AGO</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {!loading && (
              <button className="w-full mt-6 py-3 glass rounded-xl text-xs font-bold text-text-muted hover:text-white hover:bg-white/5 transition-all">
                Access Audit Logs
              </button>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
