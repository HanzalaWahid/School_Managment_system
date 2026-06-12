import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const emptyForm = { username: '', first_name: '', last_name: '', email: '', password: 'pass1234', department: '', designation: '' };

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTeachers = async () => {
    try {
      const data = await api.get('/teachers/');
      setTeachers(data.results || data);
    } catch { setError('Failed to load teachers.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadTeachers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editId) {
        await api.patch(`/teachers/${editId}/`, {
          department: form.department,
          designation: form.designation,
        });
      } else {
        await api.post('/auth/register/', {
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          role: 'teacher',
          department: form.department,
          designation: form.designation,
        });
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      loadTeachers();
    } catch (e) {
      let message = e.message;
      try {
        const errObj = JSON.parse(e.message || '{}');
        message = errObj.detail || Object.values(errObj).flat().join(', ') || message;
      } catch {
        message = message;
      }
      setError('Error: ' + message);
    } finally { setSaving(false); }
  };

  const handleEdit = (t) => {
    setForm({
      username: t.user_detail?.username || '',
      first_name: t.user_detail?.first_name || '',
      last_name: t.user_detail?.last_name || '',
      email: t.user_detail?.email || '',
      password: '',
      department: t.department,
      designation: t.designation,
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try { await api.delete(`/teachers/${id}/`); loadTeachers(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Teachers</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : 'Add Teacher'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-2 md:grid-cols-3 gap-4">
          <h3 className="col-span-full font-semibold text-gray-700">{editId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
          {!editId && (
            <>
              <input placeholder="Username *" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              <input placeholder="Email *" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              <input placeholder="Password *" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </>
          )}
          {!editId && <input placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />}
          {!editId && <input placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />}
          <input placeholder="Department (e.g. Science)" required value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Designation (e.g. Senior Teacher)" required value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <div className="col-span-full">
            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
              {saving ? 'Saving...' : (editId ? 'Update Teacher' : 'Save Teacher')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading teachers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gray-600 text-sm border-y border-gray-200">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Username</th>
                <th className="p-3 font-semibold">Department</th>
                <th className="p-3 font-semibold">Designation</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {teachers.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No teachers found. Add one above.</td></tr>
              ) : teachers.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-slate-50">
                  <td className="p-3 font-medium text-gray-800">{t.user_detail?.first_name} {t.user_detail?.last_name}</td>
                  <td className="p-3 text-gray-500">{t.user_detail?.username}</td>
                  <td className="p-3 text-gray-600">{t.department}</td>
                  <td className="p-3 text-gray-600">{t.designation}</td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline font-medium">Delete</button>
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

export default Teachers;
