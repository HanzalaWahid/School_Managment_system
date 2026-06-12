const fs = require('fs');
const path = require('path');

const routes = {
  admin: [
    'Dashboard', 'Students', 'Staff', 'Classes', 'Finance', 'Reports', 
    'SystemHealth', 'AuditTrail', 'Notifications', 'RolesPermissions', 
    'FeeStructure', 'AcademicYear', 'Exams', 'Attendance', 'Settings'
  ],
  staff: [
    'Dashboard', 'Classes', 'Performance', 'Attendance', 'Assignments', 
    'LessonPlanner', 'Exams', 'Communication'
  ],
  student: [
    'Dashboard', 'Invoices', 'Timetable', 'Attendance', 'Results', 
    'Assignments', 'Notifications', 'Profile'
  ],
  auth: [
    'Login', 'ForgotPassword', 'ResetPassword', 'RoleSwitch', 'SessionExpired'
  ],
  system: [
    'Notifications', 'ActivityLogs', 'Search', 'Analytics', 'Settings'
  ],
  errors: [
    'Error403', 'Error404', 'Error500', 'Maintenance'
  ]
};

const createTemplate = (name, type) => {
  if (type === 'auth' || type === 'errors') {
    return 'import { motion } from "framer-motion";\n\n' +
      'const ' + name + ' = () => (\n' +
      '  <div className="flex h-screen items-center justify-center bg-bg-dark text-white font-sans">\n' +
      '    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">\n' +
      '      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 glow-indigo">\n' +
      '        <span className="text-xl font-bold tracking-widest text-primary">SYS</span>\n' +
      '      </div>\n' +
      '      <h1 className="text-3xl font-bold tracking-tight">' + name + '</h1>\n' +
      '      <p className="text-sm text-text-muted">Enterprise System Module</p>\n' +
      '      <button className="mt-8 btn-premium px-6 py-2 text-xs font-bold">Return</button>\n' +
      '    </motion.div>\n' +
      '  </div>\n' +
      ');\n\n' +
      'export default ' + name + ';\n';
  }

  return 'import GlassCard from "../../components/ui/GlassCard";\n' +
    'import { motion } from "framer-motion";\n\n' +
    'const ' + name + ' = () => (\n' +
    '  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">\n' +
    '    <div>\n' +
    '      <h1 className="text-3xl font-bold text-white mb-2">' + name + '</h1>\n' +
    '      <p className="text-sm text-text-muted">Manage your enterprise ' + name.toLowerCase() + ' metrics and operations.</p>\n' +
    '    </div>\n' +
    '    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n' +
    '      <GlassCard className="p-6 md:col-span-2">\n' +
    '        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">\n' +
    '          <h3 className="text-lg font-bold text-white">System Data</h3>\n' +
    '        </div>\n' +
    '        <div className="h-48 flex items-center justify-center text-text-muted border border-dashed border-white/10 rounded-xl bg-white/[0.01]">\n' +
    '          No data available for this module yet.\n' +
    '        </div>\n' +
    '      </GlassCard>\n' +
    '    </div>\n' +
    '  </motion.div>\n' +
    ');\n\n' +
    'export default ' + name + ';\n';
};

const run = () => {
  const srcAppDir = path.join(__dirname, 'src', 'app');
  
  if (!fs.existsSync(srcAppDir)) {
    fs.mkdirSync(srcAppDir, { recursive: true });
  }

  for (const [moduleType, pages] of Object.entries(routes)) {
    const dirPath = path.join(srcAppDir, moduleType);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    pages.forEach(page => {
      const filePath = path.join(dirPath, page + '.jsx');
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, createTemplate(page, moduleType));
        console.log('Created: ' + moduleType + '/' + page + '.jsx');
      } else {
        console.log('Skipped (exists): ' + moduleType + '/' + page + '.jsx');
      }
    });
  }
};

run();
