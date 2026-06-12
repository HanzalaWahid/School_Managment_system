import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const emptyForm = { name: '', code: '', teacher: '' };

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [c, t] = await Promise.all([api.get('/courses/'), api.get('/teachers/')]);
      setCourses(c.results || c);
      setTeachers(t.results || t);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { name: form.name, code: form.code, teacher: form.teacher || null };
      if (editId) {
        await api.patch(`/courses/${editId}/`, payload);
      } else {
        await api.post('/courses/', payload);
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      loadData();
    } catch (e) { setError('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, code: c.code, teacher: c.teacher || '' });
    setEditId(c.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await api.delete(`/courses/${id}/`); loadData(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Courses</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <h3 className="col-span-full font-semibold text-gray-700">{editId ? 'Edit Course' : 'Add New Course'}</h3>
          <input placeholder="Course Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Course Code * (e.g. CS101)" required value={form.code} onChange={e => setForm({...form, code: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <select value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            <option value="">Assign Teacher (optional)</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.user_detail?.first_name} {t.user_detail?.last_name} ({t.department})</option>
            ))}
          </select>
          <div className="col-span-full">
            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
              {saving ? 'Saving...' : (editId ? 'Update Course' : 'Save Course')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading courses...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gray-600 text-sm border-y border-gray-200">
                <th className="p-3 font-semibold">Code</th>
                <th className="p-3 font-semibold">Course Name</th>
                <th className="p-3 font-semibold">Teacher</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {courses.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-gray-400">No courses found. Add one above.</td></tr>
              ) : courses.map(c => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-blue-700">{c.code}</td>
                  <td className="p-3 font-medium text-gray-800">{c.name}</td>
                  <td className="p-3 text-gray-600">{c.teacher_name || <span className="text-gray-400 italic">Unassigned</span>}</td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline font-medium">Delete</button>
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

export default Courses;
