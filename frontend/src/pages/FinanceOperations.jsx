import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const FinanceOperations = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = user.role === 'accountant';
  const [tab, setTab] = useState('payments');
  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [audit, setAudit] = useState([]);
  const [feeForm, setFeeForm] = useState({ academic_year: '', term: '', title: '', class_name: '', amount: '', due_date: '' });
  const [paymentForm, setPaymentForm] = useState({ invoice: '', amount: '', method: 'cash', reference: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [yearData, termData, invoiceData, feeData, paymentData, auditData] = await Promise.all([
        api.get('/auth/academic-years/'), api.get('/auth/terms/'), api.get('/invoices/'),
        api.get('/invoices/fees/'), api.get('/invoices/payments/'), api.get('/invoices/audit/'),
      ]);
      setYears(yearData.results || yearData);
      setTerms(termData.results || termData);
      setInvoices(invoiceData.results || invoiceData);
      setFees(feeData.results || feeData);
      setPayments(paymentData.results || paymentData);
      setAudit(auditData.results || auditData);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load finance operations.');
    }
  };

  useEffect(() => {
    let active = true;
    const fetchFinanceData = async () => {
      try {
        const [yearData, termData, invoiceData, feeData, paymentData, auditData] = await Promise.all([
          api.get('/auth/academic-years/'), api.get('/auth/terms/'), api.get('/invoices/'),
          api.get('/invoices/fees/'), api.get('/invoices/payments/'), api.get('/invoices/audit/'),
        ]);
        if (!active) return;
        setYears(yearData.results || yearData);
        setTerms(termData.results || termData);
        setInvoices(invoiceData.results || invoiceData);
        setFees(feeData.results || feeData);
        setPayments(paymentData.results || paymentData);
        setAudit(auditData.results || auditData);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load finance operations.');
      }
    };
    void fetchFinanceData();
    return () => { active = false; };
  }, []);

  const createFee = async (event) => {
    event.preventDefault();
    try {
      await api.post('/invoices/fees/', feeForm);
      setFeeForm({ academic_year: '', term: '', title: '', class_name: '', amount: '', due_date: '' });
      await load();
    } catch (requestError) { setError(requestError.message || 'Unable to save fee structure.'); }
  };

  const recordPayment = async (event) => {
    event.preventDefault();
    try {
      await api.post('/invoices/payments/', paymentForm);
      setPaymentForm({ invoice: '', amount: '', method: 'cash', reference: '' });
      await load();
    } catch (requestError) { setError(requestError.message || 'Unable to record payment.'); }
  };

  const tabs = [
    ['payments', 'Payments'], ['fees', 'Fee structures'], ['audit', 'Finance audit'],
  ];

  return (
    <main className="space-y-6">
      <header><h1 className="text-2xl font-bold text-gray-900">Finance operations</h1><p className="mt-1 text-sm text-slate-500">Payments, schedules, and finance audit events</p></header>
      {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <nav aria-label="Finance views" className="flex gap-2 border-b border-slate-200">{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id} className={`border-b-2 px-4 py-3 text-sm font-semibold ${tab === id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}>{label}</button>)}</nav>

      {tab === 'payments' && <section className="space-y-5">
        {canManage && <form onSubmit={recordPayment} className="grid gap-3 border border-slate-200 bg-white p-5 sm:grid-cols-4">
          <h2 className="text-lg font-semibold sm:col-span-4">Record payment</h2>
          <select aria-label="Invoice" required value={paymentForm.invoice} onChange={(event) => setPaymentForm({ ...paymentForm, invoice: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm"><option value="">Select invoice</option>{invoices.filter((invoice) => invoice.status !== 'void').map((invoice) => <option key={invoice.id} value={invoice.id}>#{invoice.id} · {invoice.student_name} · {invoice.amount}</option>)}</select>
          <input aria-label="Payment amount" required type="number" min="0.01" step="0.01" placeholder="Amount" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <select aria-label="Payment method" value={paymentForm.method} onChange={(event) => setPaymentForm({ ...paymentForm, method: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm"><option value="cash">Cash</option><option value="bank">Bank</option><option value="online">Online</option></select>
          <input aria-label="Payment reference" placeholder="Reference" value={paymentForm.reference} onChange={(event) => setPaymentForm({ ...paymentForm, reference: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <button className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-4">Record payment</button>
        </form>}
        <div className="overflow-x-auto border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Payment history</h2><table className="w-full text-left text-sm"><thead><tr className="border-y border-slate-200 text-slate-500"><th className="p-2">Date</th><th className="p-2">Student</th><th className="p-2">Invoice</th><th className="p-2">Method</th><th className="p-2">Amount</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id} className="border-b border-slate-100"><td className="p-2">{new Date(payment.received_at).toLocaleDateString()}</td><td className="p-2">{payment.student_name}</td><td className="p-2">#{payment.invoice_id}</td><td className="p-2">{payment.method}</td><td className="p-2">{payment.amount}</td></tr>)}</tbody></table></div>
      </section>}

      {tab === 'fees' && <section className="space-y-5">
        {canManage && <form onSubmit={createFee} className="grid gap-3 border border-slate-200 bg-white p-5 sm:grid-cols-3">
          <h2 className="text-lg font-semibold sm:col-span-3">New fee structure</h2>
          <select aria-label="Fee academic year" required value={feeForm.academic_year} onChange={(event) => setFeeForm({ ...feeForm, academic_year: event.target.value, term: '' })} className="border border-slate-300 px-3 py-2 text-sm"><option value="">Academic year</option>{years.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}</select>
          <select aria-label="Fee term" required value={feeForm.term} onChange={(event) => setFeeForm({ ...feeForm, term: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm"><option value="">Term</option>{terms.filter((term) => String(term.academic_year) === String(feeForm.academic_year)).map((term) => <option key={term.id} value={term.id}>{term.name}</option>)}</select>
          <input aria-label="Fee title" required placeholder="Fee title" value={feeForm.title} onChange={(event) => setFeeForm({ ...feeForm, title: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <input aria-label="Class name" required placeholder="Class" value={feeForm.class_name} onChange={(event) => setFeeForm({ ...feeForm, class_name: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <input aria-label="Fee amount" required type="number" min="0.01" step="0.01" placeholder="Amount" value={feeForm.amount} onChange={(event) => setFeeForm({ ...feeForm, amount: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <input aria-label="Fee due date" required type="date" value={feeForm.due_date} onChange={(event) => setFeeForm({ ...feeForm, due_date: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
          <button className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-3">Save fee structure</button>
        </form>}
        <div className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Fee structures</h2><ul className="divide-y divide-slate-100">{fees.map((fee) => <li key={fee.id} className="flex justify-between gap-3 py-3 text-sm"><span>{fee.title} · Class {fee.class_name}</span><span>{fee.amount} · {fee.due_date}</span></li>)}</ul></div>
      </section>}

      {tab === 'audit' && <section className="border border-slate-200 bg-white p-5"><h2 className="mb-3 text-lg font-semibold">Finance audit</h2><ul className="divide-y divide-slate-100">{audit.map((event) => <li key={event.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span><strong>{event.action}</strong><span className="ml-2 text-slate-500">{event.object_type} #{event.object_id}</span></span><time className="text-slate-500">{new Date(event.created_at).toLocaleString()}</time></li>)}</ul></section>}
    </main>
  );
};

export default FinanceOperations;
