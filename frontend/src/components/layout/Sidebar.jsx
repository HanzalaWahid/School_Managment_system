import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = currentUser.role === 'student';
  const isSchoolAdmin = currentUser.role === 'school_admin' || currentUser.role === 'admin';
  const isPrincipal = currentUser.role === 'principal';
  const isAccountant = currentUser.role === 'accountant';
  const isReceptionist = currentUser.role === 'receptionist';
  const isParent = currentUser.role === 'parent';
  const isSuperAdmin = currentUser.role === 'super_admin';
  const menuList = isSuperAdmin ? [
    { name: 'Platform Dashboard', path: '/dashboard' },
    { name: 'Schools & Users', path: '/platform' },
  ] : isStudent ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Profile', path: '/students' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Exams & Results', path: '/results' },
    { name: 'Fees & Payments', path: '/finance' },
  ] : isParent ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Guardian Portal', path: '/guardians' },
    { name: 'My Children', path: '/students' },
    { name: 'Courses', path: '/courses' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Published Results', path: '/results' },
    { name: 'Invoices & Payments', path: '/finance' },
  ] : isAccountant ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Finance', path: '/finance' },
    { name: 'Fee Structures', path: '/finance-operations' },
    { name: 'Invoices', path: '/finance' },
    { name: 'Payments', path: '/finance-operations' },
    { name: 'Finance Audit', path: '/finance-operations' },
    { name: 'Financial Reports', path: '/dashboard' },
    { name: 'Announcements', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard' },
    { name: 'Settings', path: '/dashboard' },
  ] : isPrincipal ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/students' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Classes & Sections', path: '/courses' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Exams & Results', path: '/results' },
    { name: 'Finance Summary', path: '/finance' },
    { name: 'Academic Periods', path: '/academic-periods' },
    { name: 'Academic Reports', path: '/dashboard' },
    { name: 'Announcements', path: '/dashboard' },
    { name: 'Analytics', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard' },
    { name: 'Settings', path: '/dashboard' },
  ] : isReceptionist ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/students' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Classes & Sections', path: '/courses' },
    { name: 'Admissions', path: '/students' },
    { name: 'Guardians', path: '/guardians' },
    { name: 'Profile', path: '/dashboard' },
  ] : isSchoolAdmin ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/students' },
    { name: 'Parents', path: '/students' },
    { name: 'Academic Periods', path: '/academic-periods' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Classes & Sections', path: '/courses' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Exams & Results', path: '/results' },
    { name: 'Fees & Payments', path: '/finance' },
    { name: 'Finance History', path: '/finance-operations' },
    { name: 'Announcements', path: '/dashboard' },
    { name: 'Analytics', path: '/dashboard' },
    { name: 'Settings', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard' },
  ] : [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/students' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Courses', path: '/courses' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Finance', path: '/finance', roles: ['admin', 'student'] },
    { name: 'Results', path: '/results' },
  ].filter(item => !item.roles || item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-xl font-bold">{isSuperAdmin ? 'Super Admin' : isParent ? 'Parent / Guardian' : isAccountant ? 'Accountant' : isPrincipal ? 'Principal' : isReceptionist ? 'Receptionist' : isSchoolAdmin ? 'School Admin' : 'Admin'}</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuList.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-6 py-3 transition-colors ${
                    isActive ? 'bg-slate-700 border-l-4 border-blue-500' : 'hover:bg-slate-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button type="button" onClick={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }} className="block w-full text-center py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition-colors">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
