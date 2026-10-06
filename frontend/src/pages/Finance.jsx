import React, { useEffect, useEffectEvent, useState } from 'react';
import { api } from '../utils/api';

const emptyForm = { student: '', amount: '', due_date: '' };

const Finance = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isPrincipal = currentUser.role === 'principal';
  const canManage = currentUser.role === 'accountant';
  const canView = ['admin', 'school_admin', 'accountant', 'principal', 'student', 'parent'].includes(currentUser.role);

  const loadData = async () => {
    if (!canView) {
      setError('Finance is available only to admins and students.');
      setLoading(false);
      return;
    }

    try {
      if (isPrincipal) {
        setSummary(await api.get('/invoices/summary/'));
        setLoading(false);
        return;
      }
      const inv = await api.get('/invoices/');
      setInvoices(inv?.results || inv || []);
      if (canManage) {
        const stu = await api.get('/students/');
        setStudents(stu?.results || stu || []);
      }
    } catch (e) {
      let message = e?.message || 'Failed to load data.';
      if (e?.status === 403) {
        message = 'Permission denied. You do not have access to finance data.';
      }
      setError(`Failed to load finance data: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = useEffectEvent(() => { void loadData(); });

  useEffect(() => { loadInitialData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editId) {
        await api.patch(`/invoices/${editId}/`, form);
      } else {
        await api.post('/invoices/', form);
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      loadData();
    } catch (e) { setError('Error saving invoice: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (inv) => {
    setForm({ student: inv.student, amount: inv.amount, status: inv.status, due_date: inv.due_date });
    setEditId(inv.id); setShowForm(true);
  };

  const statusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700',
    };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] || ''}`}>{status}</span>;
  };

  const totalUnpaid = isPrincipal
    ? Number(summary?.unpaid_amount || 0)
    : invoices.filter(i => ['unpaid', 'pending', 'partially_paid'].includes(i.status)).reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalPaid = isPrincipal
    ? Number(summary?.total_collected || 0)
    : invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">{isPrincipal ? summary?.total_invoices ?? 0 : invoices.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">${totalUnpaid.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Finance — Invoices</h2>
          {canManage && (
            <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              {showForm ? 'Cancel' : 'Add Invoice'}
            </button>
          )}
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

        {showForm && canManage && (
          <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4">
            <h3 className="col-span-full font-semibold text-gray-700">{editId ? 'Edit Invoice' : 'New Invoice'}</h3>
            <select required value={form.student} onChange={e => setForm({...form, student: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select Student *</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.user_detail?.first_name} {s.user_detail?.last_name} ({s.roll_number})</option>
              ))}
            </select>
            <input placeholder="Amount *" type="number" step="0.01" required value={form.amount}
              onChange={e => setForm({...form, amount: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            <input type="date" required value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            <div className="col-span-full">
              <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                {saving ? 'Saving...' : (editId ? 'Update Invoice' : 'Save Invoice')}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading invoices...</div>
        ) : !isPrincipal && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-gray-600 text-sm border-y border-gray-200">
                  <th className="p-3 font-semibold">Invoice #</th>
                  <th className="p-3 font-semibold">Student</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Due Date</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-400">No invoices found. Add one above.</td></tr>
                ) : invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-slate-50">
                    <td className="p-3 font-mono text-gray-500">#{inv.id}</td>
                    <td className="p-3 font-medium text-gray-800">{inv.student_name}</td>
                    <td className="p-3 font-semibold text-gray-800">${parseFloat(inv.amount).toFixed(2)}</td>
                    <td className="p-3">{statusBadge(inv.status)}</td>
                    <td className="p-3 text-gray-600">{inv.due_date}</td>
                    <td className="p-3 space-x-3">
                      {canManage && <button onClick={() => handleEdit(inv)} className="text-blue-600 hover:underline font-medium">Edit</button>}
                    </td>
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

export default Finance;
