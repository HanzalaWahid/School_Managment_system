import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const AcademicPeriods = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = ['admin', 'school_admin'].includes(user.role);
  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [yearForm, setYearForm] = useState({ name: '', start_date: '', end_date: '', is_active: false });
  const [termForm, setTermForm] = useState({ academic_year: '', name: '', start_date: '', end_date: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [yearData, termData] = await Promise.all([api.get('/auth/academic-years/'), api.get('/auth/terms/')]);
      setYears(yearData.results || yearData);
      setTerms(termData.results || termData);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load academic periods.');
    }
  };

  useEffect(() => {
    let active = true;
    const fetchPeriods = async () => {
      try {
        const [yearData, termData] = await Promise.all([api.get('/auth/academic-years/'), api.get('/auth/terms/')]);
        if (!active) return;
        setYears(yearData.results || yearData);
        setTerms(termData.results || termData);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load academic periods.');
      }
    };
    void fetchPeriods();
    return () => { active = false; };
  }, []);

  const createYear = async (event) => {
    event.preventDefault();
    try {
      await api.post('/auth/academic-years/', yearForm);
      setYearForm({ name: '', start_date: '', end_date: '', is_active: false });
      await load();
    } catch (requestError) { setError(requestError.message || 'Unable to create academic year.'); }
  };

  const createTerm = async (event) => {
    event.preventDefault();
    try {
      await api.post('/auth/terms/', termForm);
      setTermForm({ academic_year: '', name: '', start_date: '', end_date: '' });
      await load();
    } catch (requestError) { setError(requestError.message || 'Unable to create term.'); }
  };

  return (
    <main className="space-y-6">
      <header><h1 className="text-2xl font-bold text-gray-900">Academic periods</h1><p className="mt-1 text-sm text-slate-500">School years and terms</p></header>
      {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {canManage && <section className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={createYear} className="grid gap-3 border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">New academic year</h2>
          <input aria-label="Year name" required placeholder="Name, e.g. 2026-2027" value={yearForm.name} onChange={(event) => setYearForm({ ...yearForm, name: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3"><input aria-label="Year starts" required type="date" value={yearForm.start_date} onChange={(event) => setYearForm({ ...yearForm, start_date: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" /><input aria-label="Year ends" required type="date" value={yearForm.end_date} onChange={(event) => setYearForm({ ...yearForm, end_date: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={yearForm.is_active} onChange={(event) => setYearForm({ ...yearForm, is_active: event.target.checked })} />Active year</label>
          <button className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create year</button>
        </form>
        <form onSubmit={createTerm} className="grid gap-3 border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">New term</h2>
          <select aria-label="Academic year" required value={termForm.academic_year} onChange={(event) => setTermForm({ ...termForm, academic_year: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm"><option value="">Select year</option>{years.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}</select>
          <input aria-label="Term name" required placeholder="Term name" value={termForm.name} onChange={(event) => setTermForm({ ...termForm, name: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3"><input aria-label="Term starts" required type="date" value={termForm.start_date} onChange={(event) => setTermForm({ ...termForm, start_date: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" /><input aria-label="Term ends" required type="date" value={termForm.end_date} onChange={(event) => setTermForm({ ...termForm, end_date: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" /></div>
          <button className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create term</button>
        </form>
      </section>}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Academic years</h2><ul className="divide-y divide-slate-100">{years.map((year) => <li key={year.id} className="flex justify-between py-3 text-sm"><span>{year.name}</span><span className="text-slate-500">{year.start_date} to {year.end_date}{year.is_active ? ' · Active' : ''}</span></li>)}</ul></div>
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Terms</h2><ul className="divide-y divide-slate-100">{terms.map((term) => <li key={term.id} className="flex justify-between py-3 text-sm"><span>{term.name}</span><span className="text-slate-500">{years.find((year) => year.id === term.academic_year)?.name}: {term.start_date} to {term.end_date}</span></li>)}</ul></div>
      </section>
    </main>
  );
};

export default AcademicPeriods;
