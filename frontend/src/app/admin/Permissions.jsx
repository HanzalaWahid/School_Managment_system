import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdvancedTable from '../../components/ui/AdvancedTable';
import GlassCard from '../../components/ui/GlassCard';
import { Shield, Lock, Eye, Edit3, Trash2, Key, UserCheck, AlertOctagon } from 'lucide-react';

const Permissions = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const roles = [
    { id: 1, role: 'Super Admin', users: 2, access: 'Full Access', status: 'System' },
    { id: 2, role: 'Finance Admin', users: 5, access: 'Financial Records, Audits', status: 'Custom' },
    { id: 3, role: 'Faculty Staff', users: 48, access: 'Students, Grades, Attendance', status: 'System' },
    { id: 4, role: 'Student', users: 12854, access: 'Personal Profile, Invoices', status: 'System' },
    { id: 5, role: 'Audit Viewer', users: 1, access: 'Read-only Audit Logs', status: 'Custom' },
  ];

  const columns = [
    { 
      key: 'role', 
      label: 'Security Role',
      render: (val) => (
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Shield size={16} className="text-primary" />
          </div>
          <span className="font-bold text-white tracking-tight">{val}</span>
        </div>
      )
    },
    { key: 'users', label: 'Assigned Users', render: (val) => <span className="text-text-muted font-bold">{val.toLocaleString()} Users</span> },
    { key: 'access', label: 'Access Permissions', className: 'min-w-[250px]', render: (val) => <span className="text-xs text-text-muted italic">{val}</span> },
    { 
      key: 'status', 
      label: 'Role Type',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${val === 'System' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-primary">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 glow-indigo">
            <Lock size={32} className="text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Access Control Management</h2>
            <p className="text-sm text-text-muted leading-relaxed">Establish granular security policies and assign role-based permissions to users within the EDUFlow cluster. System roles are immutable, while custom roles can be modified.</p>
          </div>
          <button className="btn-premium px-8 py-3.5 whitespace-nowrap">Create Custom Role</button>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center justify-center text-center bg-accent-rose/5 border border-accent-rose/20">
          <AlertOctagon size={32} className="text-accent-rose mb-4" />
          <h3 className="text-sm font-bold text-white mb-1">Security Audit Required</h3>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-4">Last checked: 14 days ago</p>
          <button className="w-full py-2.5 glass rounded-xl text-xs font-bold text-accent-rose border border-accent-rose/20 hover:bg-accent-rose/10">Initiate Audit</button>
        </GlassCard>
      </div>

      <AdvancedTable 
        title="Security Roles"
        subtitle="Current role mapping and permission definitions."
        columns={columns}
        data={roles}
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Multi-Factor Auth', status: 'Forced', icon: Key },
          { label: 'Identity Verification', status: 'Enabled', icon: UserCheck },
          { label: 'Role Escalation', status: 'Restricted', icon: Shield },
          { label: 'Session Timeout', status: '30 mins', icon: Clock },
        ].map((policy) => (
          <GlassCard key={policy.label} className="p-4 flex items-center gap-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-all">
              <policy.icon size={16} className="text-text-muted group-hover:text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{policy.label}</p>
              <p className="text-xs font-bold text-white mt-0.5">{policy.status}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Permissions;
