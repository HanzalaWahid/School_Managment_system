import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const emptyForm = { username: '', email: '', password: 'pass1234', first_name: '', last_name: '', roll_number: '', class_name: '', section: '', date_of_birth: '' };

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const stu = await api.get('/students/');
      const studentList = stu.results || stu;
      setStudents(studentList);
    } catch (e) { setError('Failed to load student data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) {
        const payload = {
          roll_number: form.roll_number,
          class_name: form.class_name,
          section: form.section,
          date_of_birth: form.date_of_birth || null,
        };
        await api.patch(`/students/${editId}/`, payload);
      } else {
        await api.post('/auth/register/', {
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          role: 'student',
          roll_number: form.roll_number,
          class_name: form.class_name,
          section: form.section,
          date_of_birth: form.date_of_birth || null,
        });
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      loadData();
    } catch (e) {
      let message = e.message;
      try {
        const errObj = JSON.parse(e.message || '{}');
        message = errObj.detail || Object.values(errObj).flat().join(', ') || message;
      } catch {
        message = 'Error saving student. Ensure the provided user data is correct.';
      }
      setError(message);
    } finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({
      username: s.user_detail?.username || '',
      email: s.user_detail?.email || '',
      password: '',
      first_name: s.user_detail?.first_name || '',
      last_name: s.user_detail?.last_name || '',
      roll_number: s.roll_number,
      class_name: s.class_name,
      section: s.section,
      date_of_birth: s.date_of_birth || '',
    });
    setEditId(s.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await api.delete(`/students/${id}/`); loadData(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Students</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-2 md:grid-cols-3 gap-4">
          <h3 className="col-span-full font-semibold text-gray-700">{editId ? 'Edit Student' : 'Add New Student'}</h3>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Username *</label>
            <input required value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Password *</label>
            <input type="password" required={!editId} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">First Name</label>
            <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Last Name</label>
            <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Roll Number *</label>
            <input required value={form.roll_number} onChange={e => setForm({...form, roll_number: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Class</label>
            <input value={form.class_name} onChange={e => setForm({...form, class_name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Section</label>
            <input value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Date of Birth</label>
            <input type="date" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div className="col-span-full pt-2">
            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
              {saving ? 'Saving...' : (editId ? 'Update Student' : 'Save Student')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading students...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gray-600 text-sm border-y border-gray-200">
                <th className="p-3 font-semibold">Roll No.</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Username</th>
                <th className="p-3 font-semibold">Class</th>
                <th className="p-3 font-semibold">Section</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">No students found. Add one above.</td></tr>
              ) : students.map(s => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-slate-50">
                  <td className="p-3 font-mono text-gray-600">{s.roll_number}</td>
                  <td className="p-3 font-medium text-gray-800">{s.user_detail?.first_name} {s.user_detail?.last_name}</td>
                  <td className="p-3 text-gray-500">@{s.user_detail?.username}</td>
                  <td className="p-3 text-gray-600">{s.class_name}</td>
                  <td className="p-3 text-gray-600">{s.section}</td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
