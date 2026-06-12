import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, HelpCircle, Save } from 'lucide-react';

function Settings() {
  const sections = [
    { icon: User, title: 'Profile Information', desc: 'Update your personal details and public profile.' },
    { icon: Bell, title: 'Notifications', desc: 'Configure how you receive alerts and updates.' },
    { icon: Shield, title: 'Security & Privacy', desc: 'Manage your password and account security.' },
    { icon: Palette, title: 'Appearance', desc: 'Customize the look and feel of your dashboard.' },
    { icon: Database, title: 'Data Management', desc: 'Control your institution data and backups.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-text-muted">Manage your account preferences and system configurations.</p>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <motion.div 
            key={section.title}
            whileHover={{ scale: 1.01 }}
            className="glass-panel p-6 flex items-center gap-6 cursor-pointer group"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary transition-all">
              <section.icon size={24} className="text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{section.title}</h3>
              <p className="text-sm text-text-muted">{section.desc}</p>
            </div>
            <button className="px-4 py-2 glass rounded-xl text-xs font-bold text-white border border-white/10 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
              Manage
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button className="px-8 py-3.5 glass text-white rounded-xl font-bold border border-white/10 hover:bg-white/5">
          Discard Changes
        </button>
        <button className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary-glow flex items-center gap-2">
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </motion.div>
  );
}

export default Settings;
