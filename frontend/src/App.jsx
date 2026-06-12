import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

// Public Pages
import LandingPage from './app/public/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Finance from './pages/Finance';
import Courses from './pages/Courses';
import Results from './pages/Results';
import Attendance from './pages/Attendance';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
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
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />

        {/* Dashboard Routes wrapped in DashboardLayout and protected */}
        <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
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
