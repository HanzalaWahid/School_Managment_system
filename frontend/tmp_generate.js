const fs = require('fs');

const pages = {
  'src/app/admin/about.jsx': 'Admin About',
  'src/app/admin/reports.jsx': 'Admin Reports',
  'src/app/staff/dashboard.jsx': 'Staff Dashboard',
  'src/app/staff/about.jsx': 'Staff About',
  'src/app/staff/classes.jsx': 'Staff Classes',
  'src/app/staff/performance.jsx': 'Staff Performance',
  'src/app/student/dashboard.jsx': 'Student Dashboard',
  'src/app/student/about.jsx': 'Student About',
  'src/app/student/invoices.jsx': 'Student Invoices',
  'src/app/student/timetable.jsx': 'Student Timetable',
  'src/app/auth/login.jsx': 'Login',
  'src/app/auth/role-switch.jsx': 'Role Switcher',
};

const stub = (name) => `import GlassCard from '../../components/ui/GlassCard';

const Component = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-white mb-2">${name}</h1>
    <GlassCard className="p-8">
      <p className="text-text-muted">This is an auto-generated placeholder for ${name}.</p>
    </GlassCard>
  </div>
);

export default Component;
`;

const stubAuth = (name) => `const Component = () => (
  <div className="flex h-screen items-center justify-center bg-bg-dark text-white">
    <h1 className="text-4xl font-bold">${name}</h1>
  </div>
);

export default Component;
`;

for (const [path, name] of Object.entries(pages)) {
  const content = path.includes('auth') ? stubAuth(name) : stub(name);
  fs.writeFileSync(path, content.trim());
}
console.log('Pages generated successfully!');
