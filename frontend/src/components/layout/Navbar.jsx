import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const pathName = location.pathname.split('/')[1] || 'Dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">Admin User</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;
