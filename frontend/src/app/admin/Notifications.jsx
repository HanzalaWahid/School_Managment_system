import { motion } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle2, MoreHorizontal, Trash2 } from 'lucide-react';

const notifications = [
  { id: 1, type: 'info', title: 'New Enrollment', desc: 'Alice Johnson has completed the registration for 10th Grade.', time: '2 mins ago', unread: true },
  { id: 2, type: 'warning', title: 'Fee Overdue', desc: '14 students from 12th Grade have pending fee payments.', time: '1 hour ago', unread: true },
  { id: 3, type: 'success', title: 'System Updated', desc: 'EduFlow Academy dashboard has been updated to v2.4.0.', time: '5 hours ago', unread: false },
  { id: 4, type: 'info', title: 'Faculty Meeting', desc: 'Monthly faculty meeting scheduled for tomorrow at 10:00 AM.', time: 'Yesterday', unread: false },
];

const IconBox = ({ type }) => {
  const styles = {
    info: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  const Icons = { info: Info, warning: AlertTriangle, success: CheckCircle2 };
  const Icon = Icons[type];

  return (
    <div className={`p-3 rounded-2xl border ${styles[type]}`}>
      <Icon size={20} />
    </div>
  );
};

function Notifications() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-text-muted">Stay updated with the latest institutional activities.</p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <motion.div 
            key={n.id}
            whileHover={{ x: 5 }}
            className={`glass-panel p-5 flex items-start gap-4 transition-all border-l-4 ${n.unread ? 'border-l-primary' : 'border-l-transparent'}`}
          >
            <IconBox type={n.type} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-bold ${n.unread ? 'text-white' : 'text-text-muted'}`}>{n.title}</h3>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{n.time}</span>
              </div>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">{n.desc}</p>
            </div>
            <button className="p-2 text-text-muted hover:text-white rounded-lg">
              <MoreHorizontal size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button className="flex items-center gap-2 text-text-muted hover:text-rose-400 transition-colors font-bold text-sm">
          <Trash2 size={16} />
          Clear all notifications
        </button>
      </div>
    </motion.div>
  );
}

export default Notifications;
