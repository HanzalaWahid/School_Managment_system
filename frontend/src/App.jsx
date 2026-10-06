import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

// Public Pages
import LandingPage from './app/public/LandingPage';
import Login from './pages/Login';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Finance from './pages/Finance';
import Courses from './pages/Courses';
import Results from './pages/Results';
import Attendance from './pages/Attendance';
import PlatformAdmin from './pages/PlatformAdmin';
import AcademicPeriods from './pages/AcademicPeriods';
import GuardianPortal from './pages/GuardianPortal';
import FinanceOperations from './pages/FinanceOperations';

const ROLE_ACCESS = {
  '/platform': ['super_admin'],
  '/academic-periods': ['school_admin', 'admin', 'principal'],
  '/guardians': ['school_admin', 'admin', 'principal', 'receptionist', 'parent'],
  '/finance-operations': ['school_admin', 'admin', 'accountant'],
  '/students': ['school_admin', 'admin', 'principal', 'accountant', 'receptionist', 'teacher', 'student', 'parent'],
  '/teachers': ['school_admin', 'admin', 'principal', 'receptionist', 'teacher'],
  '/courses': ['school_admin', 'admin', 'principal', 'receptionist', 'teacher', 'student', 'parent'],
  '/attendance': ['school_admin', 'admin', 'principal', 'teacher', 'student', 'parent'],
  '/finance': ['school_admin', 'admin', 'principal', 'accountant', 'student', 'parent'],
  '/results': ['school_admin', 'admin', 'principal', 'teacher', 'student', 'parent'],
};

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const path = window.location.pathname;
  const allowedRoles = ROLE_ACCESS[path];
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />

        {/* Dashboard Routes wrapped in DashboardLayout and protected */}
        <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/platform" element={<PlatformAdmin />} />
          <Route path="/academic-periods" element={<AcademicPeriods />} />
          <Route path="/guardians" element={<GuardianPortal />} />
          <Route path="/finance-operations" element={<FinanceOperations />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/results" element={<Results />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
