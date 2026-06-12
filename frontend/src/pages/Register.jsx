import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    // Student fields
    roll_number: '',
    class_name: '',
    section: '',
    // Teacher fields
    department: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare payload based on role
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      first_name: form.first_name,
      last_name: form.last_name,
      role: role,
    };

    if (role === 'student') {
      payload.roll_number = form.roll_number;
      payload.class_name = form.class_name;
      payload.section = form.section;
    } else {
      payload.department = form.department;
      payload.designation = form.designation;
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Automatically login or redirect to login
        // For convenience in this demo, let's redirect to login
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      } else {
        setError(Object.values(data).flat().join(', ') || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h1>
          <p className="text-slate-500 text-sm">Join H-School Management System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-semibold text-sm flex items-center justify-center gap-2 ${
              role === 'student'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-semibold text-sm flex items-center justify-center gap-2 ${
              role === 'teacher'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            I am a Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Dynamic Fields */}
          {role === 'student' ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roll Number</label>
                  <input
                    type="text"
                    name="roll_number"
                    required
                    value={form.roll_number}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Class</label>
                  <input
                    type="text"
                    name="class_name"
                    value={form.class_name}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Teacher Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    required
                    value={form.department}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    required
                    value={form.designation}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-md transition-colors mt-6 uppercase tracking-widest text-xs"
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
