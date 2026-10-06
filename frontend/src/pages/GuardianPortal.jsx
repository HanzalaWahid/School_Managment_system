import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const GuardianPortal = () => {
  const [children, setChildren] = useState([]);
  const [selectedId, setSelectedId] = useState(localStorage.getItem('active_child') || '');
  const [dashboard, setDashboard] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/guardians/').then((data) => {
      const guardians = data.results || data;
      const childList = guardians.flatMap((guardian) => guardian.children || []);
      setChildren(childList);
      if (childList.length) {
        setSelectedId((currentSelectedId) => currentSelectedId || String(childList[0].id));
      }
    }).catch((requestError) => setError(requestError.message || 'Unable to load linked children.'));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    localStorage.setItem('active_child', selectedId);
    const query = `?student=${encodeURIComponent(selectedId)}`;
    Promise.all([
      api.get(`/dashboard/${query}`),
      api.get(`/attendance/${query}`),
      api.get(`/results/${query}`),
      api.get(`/invoices/${query}`),
      api.get(`/courses/${query}`),
    ]).then(([dashboardData, attendanceData, resultData, invoiceData, courseData]) => {
      setDashboard(dashboardData);
      setAttendance(attendanceData.results || attendanceData);
      setResults(resultData.results || resultData);
      setInvoices(invoiceData.results || invoiceData);
      setCourses(courseData.results || courseData);
    }).catch((requestError) => setError(requestError.message || 'Unable to load child records.'));
  }, [selectedId]);

  const child = children.find((item) => String(item.id) === selectedId);

  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Guardian portal</h1><p className="mt-1 text-sm text-slate-500">Linked student records</p></div>
        <label className="grid gap-1 text-xs font-semibold text-slate-600">Child<select aria-label="Select child" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="min-w-56 border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">{children.map((item) => <option key={item.id} value={item.id}>{item.user__first_name} {item.user__last_name}</option>)}</select></label>
      </header>
      {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {child && <section className="grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-3"><p><span className="text-xs text-slate-500">Student</span><br /><strong>{child.user__first_name} {child.user__last_name}</strong></p><p><span className="text-xs text-slate-500">Class</span><br /><strong>{child.class_name} {child.section}</strong></p><p><span className="text-xs text-slate-500">Attendance records</span><br /><strong>{dashboard?.attendance_records ?? 'Loading'}</strong></p></section>}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Courses</h2><ul className="divide-y divide-slate-100">{courses.map((course) => <li key={course.id} className="py-3 text-sm">{course.code} · {course.name}</li>)}</ul></div>
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Published results</h2><ul className="divide-y divide-slate-100">{results.map((result) => <li key={result.id} className="flex justify-between py-3 text-sm"><span>{result.course_name}</span><strong>{result.marks} · {result.grade}</strong></li>)}</ul></div>
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Attendance</h2><ul className="divide-y divide-slate-100">{attendance.map((record) => <li key={record.id} className="flex justify-between py-3 text-sm"><span>{record.course_name}</span><span>{record.date} · {record.status}</span></li>)}</ul></div>
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Invoices</h2><ul className="divide-y divide-slate-100">{invoices.map((invoice) => <li key={invoice.id} className="flex justify-between py-3 text-sm"><span>#{invoice.id} · {invoice.status}</span><strong>{invoice.amount}</strong></li>)}</ul></div>
      </section>
    </main>
  );
};

export default GuardianPortal;
