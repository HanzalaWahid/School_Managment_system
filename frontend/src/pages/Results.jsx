import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const emptyForm = { student: '', course: '', marks: '', grade: '' };

const GRADE_MAP = (marks) => {
  const m = parseFloat(marks);
  if (m >= 90) return 'A+';
  if (m >= 80) return 'A';
  if (m >= 70) return 'B';
  if (m >= 60) return 'C';
  if (m >= 50) return 'D';
  return 'F';
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [r, s, c] = await Promise.all([api.get('/results/'), api.get('/students/'), api.get('/courses/')]);
      setResults(r.results || r);
      setStudents(s.results || s);
      setCourses(c.results || c);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleMarksChange = (val) => {
    setForm(f => ({ ...f, marks: val, grade: GRADE_MAP(val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editId) {
        await api.patch(`/results/${editId}/`, { marks: form.marks, grade: form.grade });
      } else {
        await api.post('/results/', form);
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      loadData();
    } catch (e) { setError('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (r) => {
    setForm({ student: r.student, course: r.course, marks: r.marks, grade: r.grade });
    setEditId(r.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try { await api.delete(`/results/${id}/`); loadData(); }
    catch { setError('Failed to delete.'); }
  };

  const gradeColor = (g) => {
    if (['A+', 'A'].includes(g)) return 'bg-green-100 text-green-700';
    if (g === 'B') return 'bg-blue-100 text-blue-700';
    if (g === 'C') return 'bg-yellow-100 text-yellow-700';
    if (g === 'D') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Results & Marks</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : 'Add Result'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4">
          <h3 className="col-span-full font-semibold text-gray-700">{editId ? 'Edit Result' : 'Add New Result'}</h3>
          {!editId && (
            <>
              <select required value={form.student} onChange={e => setForm({...form, student: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">Select Student *</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.user_detail?.first_name} {s.user_detail?.last_name} ({s.roll_number})</option>
                ))}
              </select>
              <select required value={form.course} onChange={e => setForm({...form, course: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">Select Course *</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </>
          )}
          <input placeholder="Marks (0-100) *" required type="number" min="0" max="100" value={form.marks}
            onChange={e => handleMarksChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Grade (auto-filled)" value={form.grade} readOnly
            className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed" />
          <div className="col-span-full">
            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
              {saving ? 'Saving...' : (editId ? 'Update Result' : 'Save Result')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading results...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gray-600 text-sm border-y border-gray-200">
                <th className="p-3 font-semibold">Student</th>
                <th className="p-3 font-semibold">Course</th>
                <th className="p-3 font-semibold">Marks</th>
                <th className="p-3 font-semibold">Grade</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {results.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No results found. Add one above.</td></tr>
              ) : results.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-slate-50">
                  <td className="p-3 font-medium text-gray-800">{r.student_name}</td>
                  <td className="p-3 text-gray-600">{r.course_name}</td>
                  <td className="p-3 font-semibold text-gray-800">{r.marks}<span className="text-gray-400 text-xs">/100</span></td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${gradeColor(r.grade)}`}>{r.grade}</span></td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline font-medium">Delete</button>
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

export default Results;
