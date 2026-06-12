import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const menuList = [
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
        <h1 className="text-xl font-bold">School Admin</h1>
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
        <NavLink to="/login" className="block w-full text-center py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition-colors">
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
