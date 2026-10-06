import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const emptyForm = { student: '', course: '', date: '', status: 'present' };

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = currentUser.role === 'admin' || currentUser.role === 'school_admin' || currentUser.role === 'teacher';
  const canView = ['admin', 'school_admin', 'teacher', 'principal', 'student', 'parent'].includes(currentUser.role);

  const loadData = async () => {
    try {
      const [att, stu, cou] = await Promise.all([
        api.get('/attendance/'),
        api.get('/students/'),
        api.get('/courses/'),
      ]);
      setRecords(att?.results || att || []);
      setStudents(stu?.results || stu || []);
      setCourses(cou?.results || cou || []);
    } catch (e) {
      const message = e?.message || 'Failed to load attendance data.';
      setError(`Failed to load attendance data: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        student: form.student,
        course: form.course,
        date: form.date,
        status: form.status,
      };
      if (editId) {
        await api.patch(`/attendance/${editId}/`, payload);
      } else {
        await api.post('/attendance/', payload);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      loadData();
    } catch (e) {
      let message = e.message;
      try {
        const errObj = JSON.parse(e.message || '{}');
        message = errObj.detail || Object.values(errObj).flat().join(', ') || message;
      } catch {
        message = 'Error saving attendance record.';
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setForm({
      student: record.student,
      course: record.course,
      date: record.date,
      status: record.status,
    });
    setEditId(record.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Attendance</h2>
            <p className="text-sm text-gray-500">View and manage attendance records.</p>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              {showForm ? 'Cancel' : 'Add Record'}
            </button>
          )}
        </div>

        {!canView && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">Attendance is not available for this role.</div>}
        {error && canView && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

        {showForm && canManage && (
          <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
            <h3 className="col-span-full font-semibold text-gray-700">{editId ? 'Edit Attendance' : 'New Attendance Record'}</h3>
            <select required value={form.student} onChange={e => setForm({ ...form, student: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select Student *</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.user_detail?.first_name} {s.user_detail?.last_name} ({s.roll_number})</option>
              ))}
            </select>
            <select required value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select Course *</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
            <div className="col-span-full">
              <button type="submit" disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                {saving ? 'Saving...' : (editId ? 'Update Record' : 'Save Record')}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading attendance records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-gray-600 text-sm border-y border-gray-200">
                  <th className="p-3 font-semibold">Student</th>
                  <th className="p-3 font-semibold">Course</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Status</th>
                  {canManage && <th className="p-3 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody className="text-sm">
                {records.length === 0 ? (
                  <tr><td colSpan={canManage ? 5 : 4} className="p-6 text-center text-gray-400">No attendance records found.</td></tr>
                ) : records.map(record => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-slate-50">
                    <td className="p-3 font-medium text-gray-800">{record.student_name}</td>
                    <td className="p-3 text-gray-600">{record.course_name}</td>
                    <td className="p-3 text-gray-600">{record.date}</td>
                    <td className="p-3 text-gray-800 uppercase">{record.status}</td>
                    {canManage && (
                      <td className="p-3 space-x-3">
                        <button onClick={() => handleEdit(record)} className="text-blue-600 hover:underline font-medium">Edit</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
