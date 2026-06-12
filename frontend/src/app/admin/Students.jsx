import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedTable from '../../components/ui/AdvancedTable';
import GlassCard from '../../components/ui/GlassCard';
import { useUI } from '../../state/uiStore';
import { GraduationCap, Mail, Phone, Calendar, MoreVertical, X, ExternalLink, ShieldCheck } from 'lucide-react';

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { addToast } = useUI();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const data = [
    { id: 'STU-001', name: 'Alice Johnson', grade: '10th Grade', email: 'alice.j@school.com', status: 'Active', enrollment: '2023-09-01' },
    { id: 'STU-002', name: 'Bob Smith', grade: '12th Grade', email: 'bob.s@school.com', status: 'On Leave', enrollment: '2021-09-01' },
    { id: 'STU-003', name: 'Charlie Davis', grade: '9th Grade', email: 'charlie.d@school.com', status: 'Active', enrollment: '2024-01-15' },
    { id: 'STU-004', name: 'Diana Prince', grade: '11th Grade', email: 'diana.p@school.com', status: 'Active', enrollment: '2022-09-01' },
    { id: 'STU-005', name: 'Ethan Hunt', grade: '10th Grade', email: 'ethan.h@school.com', status: 'Withdrawn', enrollment: '2023-09-01' },
    { id: 'STU-006', name: 'Fiona Gallagher', grade: '12th Grade', email: 'fiona.g@school.com', status: 'Active', enrollment: '2021-09-01' },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Student Profile', 
      className: 'min-w-[250px]',
      render: (val, row) => (
        <div className="flex items-center gap-4 py-2" onClick={(e) => { e.stopPropagation(); setSelectedStudent(row); }}>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-white group-hover:text-primary transition-colors">{val}</p>
            <p className="text-[10px] text-text-muted font-bold tracking-widest">{row.id}</p>
          </div>
        </div>
      )
    },
    { key: 'grade', label: 'Academic Grade' },
    { key: 'email', label: 'Contact', render: (val) => <span className="text-text-muted text-xs">{val}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => {
        const styles = {
          Active: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
          'On Leave': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          Withdrawn: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20'
        };
        return <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${styles[val]}`}>{val}</span>;
      }
    },
    { key: 'enrollment', label: 'Joined Date', render: (val) => <span className="text-text-muted text-xs font-medium">{val}</span> },
  ];

  const handleAdd = () => {
    addToast({
      title: 'Action Triggered',
      message: 'Opening student enrollment workflow...',
      type: 'info'
    });
  };

  return (
    <div className="relative">
      <AdvancedTable 
        title="Student Directory"
        subtitle="Manage academic profiles and enrollment status."
        columns={columns}
        data={data}
        loading={loading}
        onAdd={handleAdd}
      />

      {/* Slide-over Preview Panel */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-bg-dark/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-screen bg-bg-card border-l border-white/10 z-[120] p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-white/5 rounded-xl text-text-muted"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-2">
                  <button className="glass p-2 rounded-xl text-text-muted hover:text-white border border-white/5">
                    <ExternalLink size={18} />
                  </button>
                  <button className="btn-premium px-4 py-2 text-xs font-bold">Edit Profile</button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-4xl text-primary font-bold mb-4 glow-indigo">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedStudent.name}</h3>
                  <p className="text-sm text-text-muted">{selectedStudent.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GlassCard className="p-4" hover={false}>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Grade</p>
                    <p className="text-sm font-bold text-white">{selectedStudent.grade}</p>
                  </GlassCard>
                  <GlassCard className="p-4" hover={false}>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-accent-emerald">{selectedStudent.status}</p>
                  </GlassCard>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] px-2">Contact Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <Mail size={18} className="text-primary" />
                      <span className="text-sm text-white/80">{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <Phone size={18} className="text-primary" />
                      <span className="text-sm text-white/80">+1 (555) 000-0000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] px-2">Compliance</h4>
                  <div className="p-4 rounded-2xl bg-accent-emerald/5 border border-accent-emerald/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-accent-emerald" />
                      <span className="text-sm font-bold text-white">Full Records Valid</span>
                    </div>
                    <span className="text-[10px] text-accent-emerald font-bold uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
