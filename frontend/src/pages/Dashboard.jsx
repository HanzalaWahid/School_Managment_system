import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/dashboard/')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Students', value: stats?.total_students ?? '—', path: '/students', color: 'bg-blue-500' },
    { label: 'Total Teachers', value: stats?.total_teachers ?? '—', path: '/teachers', color: 'bg-purple-500' },
    { label: 'Total Courses', value: stats?.total_courses ?? '—', path: '/courses', color: 'bg-emerald-500' },
    { label: 'Unpaid Invoices', value: stats?.unpaid_invoices ?? '—', path: '/finance', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.username || 'Admin'} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">H-School Management System — Overview</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {cards.map(card => (
            <Link key={card.label} to={card.path}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow block">
              <div className={`w-10 h-10 ${card.color} rounded-lg mb-4`} />
              <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <Link to="/students" className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium text-sm hover:bg-blue-100 transition-colors">+ Add Student</Link>
          <Link to="/teachers" className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded font-medium text-sm hover:bg-purple-100 transition-colors">+ Add Teacher</Link>
          <Link to="/finance" className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded font-medium text-sm hover:bg-yellow-100 transition-colors">+ Add Invoice</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
