import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdvancedTable from '../../components/ui/AdvancedTable';
import { Shield, Clock, User, HardDrive, MapPin, Eye } from 'lucide-react';

const ActivityLogs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const data = [
    { id: 'LOG-001', user: 'Admin (saad)', action: 'Updated Student #STU-441', timestamp: '2026-04-09 14:30:12', ip: '192.168.1.5', severity: 'Info' },
    { id: 'LOG-002', user: 'Staff (mary_j)', action: 'Generated Monthly Report', timestamp: '2026-04-09 13:45:00', ip: '192.168.1.12', severity: 'Info' },
    { id: 'LOG-003', user: 'System', action: 'Automated Backup Completed', timestamp: '2026-04-09 12:00:00', ip: '127.0.0.1', severity: 'Success' },
    { id: 'LOG-004', user: 'Admin (saad)', action: 'Failed Login Attempt', timestamp: '2026-04-09 11:22:44', ip: '45.12.33.1', severity: 'Warning' },
    { id: 'LOG-005', user: 'Staff (ted_l)', action: 'Deleted Outdated Curriculum', timestamp: '2026-04-09 10:15:30', ip: '192.168.1.15', severity: 'Warning' },
  ];

  const columns = [
    { 
      key: 'user', 
      label: 'Initiator', 
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <User size={14} className="text-text-muted" />
          </div>
          <span className="font-bold text-white text-xs">{val}</span>
        </div>
      )
    },
    { key: 'action', label: 'Action Description', className: 'min-w-[300px]' },
    { key: 'timestamp', label: 'Timestamp', render: (val) => <div className="flex items-center gap-2 text-[10px] text-text-muted"><Clock size={12}/>{val}</div> },
    { key: 'ip', label: 'IP Address', render: (val) => <code className="text-[10px] bg-white/5 px-2 py-1 rounded text-primary">{val}</code> },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (val) => {
        const styles = {
          Info: 'text-primary',
          Success: 'text-accent-emerald',
          Warning: 'text-accent-rose'
        };
        return <span className={`font-bold text-[10px] uppercase tracking-widest ${styles[val]}`}>{val}</span>;
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 py-8 px-6 glass-surface rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Shield size={32} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">System Audit Trail</h2>
          <p className="text-sm text-text-muted font-medium">Monitoring all identity and data management events across the EDUFlow cluster.</p>
        </div>
      </div>

      <AdvancedTable 
        title="Recent Activity"
        subtitle="Chronological log of all system state changes."
        columns={columns}
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default ActivityLogs;
