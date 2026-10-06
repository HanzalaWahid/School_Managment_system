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

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';
  const isPrincipal = user.role === 'principal';
  const isAccountant = user.role === 'accountant';
  const isReceptionist = user.role === 'receptionist';
  const isParent = user.role === 'parent';
  const isSchoolAdmin = user.role === 'school_admin' || user.role === 'admin';
  const isSuperAdmin = user.role === 'super_admin';

  const cards = isSuperAdmin ? [
    { label: 'Schools', value: stats?.total_schools ?? 'Data unavailable', path: '/platform', color: 'bg-blue-500' },
    { label: 'Active Schools', value: stats?.active_schools ?? 'Data unavailable', path: '/platform', color: 'bg-emerald-500' },
    { label: 'Active Users', value: stats?.active_users ?? 'Data unavailable', path: '/platform', color: 'bg-purple-500' },
    { label: 'Audit Events', value: stats?.recent_audit_events?.length ?? 'Data unavailable', path: '/platform', color: 'bg-yellow-500' },
  ] : isTeacher ? [
    { label: 'Assigned Classes', value: stats?.assigned_classes ?? 'Data unavailable', path: '/courses', color: 'bg-blue-500' },
    { label: 'Assigned Subjects', value: stats?.assigned_subjects ?? 'Data unavailable', path: '/courses', color: 'bg-purple-500' },
    { label: "Today's Attendance", value: stats?.today_attendance ?? 'Data unavailable', path: '/attendance', color: 'bg-emerald-500' },
    { label: 'Pending Attendance', value: stats?.pending_attendance ?? 'Data unavailable', path: '/attendance', color: 'bg-yellow-500' },
  ] : isStudent ? [
    { label: 'Current Class', value: stats?.current_class ?? 'Data unavailable', path: '/students', color: 'bg-blue-500' },
    { label: 'Attendance', value: stats?.attendance_summary?.total ?? 'Data unavailable', path: '/attendance', color: 'bg-emerald-500' },
    { label: 'Pending Fees', value: stats?.pending_fees ?? 'Data unavailable', path: '/finance', color: 'bg-yellow-500' },
    { label: 'Recent Results', value: stats?.recent_results?.length ?? 'Data unavailable', path: '/results', color: 'bg-purple-500' },
  ] : isParent ? [
    { label: 'Children', value: stats?.children?.length ?? 'Data unavailable', path: '/students', color: 'bg-blue-500' },
    { label: 'Attendance Records', value: stats?.attendance_records ?? 'Data unavailable', path: '/attendance', color: 'bg-emerald-500' },
    { label: 'Published Results', value: stats?.published_results ?? 'Data unavailable', path: '/results', color: 'bg-purple-500' },
    { label: 'Invoices', value: stats?.invoices ?? 'Data unavailable', path: '/finance', color: 'bg-yellow-500' },
  ] : isAccountant ? [
    { label: 'Outstanding Fees', value: stats?.outstanding_fees ?? 'Data unavailable', path: '/finance', color: 'bg-blue-500' },
    { label: 'Total Invoices', value: stats?.total_invoices ?? 'Data unavailable', path: '/finance', color: 'bg-purple-500' },
    { label: 'Overdue Invoices', value: stats?.overdue_invoices ?? 'Data unavailable', path: '/finance', color: 'bg-emerald-500' },
    { label: 'Recent Payments', value: stats?.recent_payments === 'Data unavailable' ? 'Data unavailable' : stats?.recent_payments ?? 'Data unavailable', path: '/finance', color: 'bg-yellow-500' },
  ] : isPrincipal ? [
    { label: 'Total Students', value: stats?.total_students ?? 'Data unavailable', path: '/students', color: 'bg-blue-500' },
    { label: 'Teachers', value: stats?.total_teachers ?? 'Data unavailable', path: '/teachers', color: 'bg-purple-500' },
    { label: 'Classes', value: stats?.total_courses ?? 'Data unavailable', path: '/courses', color: 'bg-emerald-500' },
    { label: 'Attendance', value: stats?.attendance_summary?.total ?? 'Data unavailable', path: '/attendance', color: 'bg-yellow-500' },
  ] : isReceptionist ? [
    { label: 'Total Students', value: stats?.total_students ?? 'Data unavailable', path: '/students', color: 'bg-blue-500' },
    { label: 'Teachers', value: stats?.total_teachers ?? 'Data unavailable', path: '/teachers', color: 'bg-purple-500' },
    { label: 'Classes', value: stats?.total_courses ?? 'Data unavailable', path: '/courses', color: 'bg-emerald-500' },
    { label: 'Admissions', value: stats?.total_students ?? 'Data unavailable', path: '/students', color: 'bg-yellow-500' },
  ] : isSchoolAdmin ? [
    { label: 'Total Students', value: stats?.total_students ?? 'Data unavailable', path: '/students', color: 'bg-blue-500' },
    { label: 'Teachers', value: stats?.total_teachers ?? 'Data unavailable', path: '/teachers', color: 'bg-purple-500' },
    { label: 'Classes', value: stats?.total_courses ?? 'Data unavailable', path: '/courses', color: 'bg-emerald-500' },
    { label: 'Pending Fees', value: stats?.unpaid_invoices ?? 'Data unavailable', path: '/finance', color: 'bg-yellow-500' },
  ] : [
    { label: 'Total Students', value: stats?.total_students ?? '—', path: '/students', color: 'bg-blue-500' },
    { label: 'Total Teachers', value: stats?.total_teachers ?? '—', path: '/teachers', color: 'bg-purple-500' },
    { label: 'Total Courses', value: stats?.total_courses ?? '—', path: '/courses', color: 'bg-emerald-500' },
    { label: 'Unpaid Invoices', value: stats?.unpaid_invoices ?? '—', path: '/finance', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.username || 'Teacher'} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">H-School Management System — {isSuperAdmin ? 'Platform overview' : isTeacher ? 'Teacher overview' : isAccountant ? 'Accountant overview' : isPrincipal ? 'Principal overview' : isReceptionist ? 'Receptionist overview' : isSchoolAdmin ? 'School admin overview' : isParent ? 'Guardian overview' : 'Student overview'}</p>
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

      {isSchoolAdmin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Actions</h3>
          <div className="flex gap-4 flex-wrap">
            <Link to="/students" className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium text-sm hover:bg-blue-100 transition-colors">+ Add Student</Link>
            <Link to="/teachers" className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded font-medium text-sm hover:bg-purple-100 transition-colors">+ Add Teacher</Link>
            <Link to="/finance" className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded font-medium text-sm hover:bg-yellow-100 transition-colors">+ Add Invoice</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
