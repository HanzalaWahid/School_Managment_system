import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const emptySchool = { name: '', code: '', address: '' };
const emptyAdmin = { username: '', email: '', password: '', first_name: '', last_name: '' };

const PlatformAdmin = () => {
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [schoolForm, setSchoolForm] = useState(emptySchool);
  const [adminForm, setAdminForm] = useState(emptyAdmin);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [schoolData, userData, auditData] = await Promise.all([
        api.get('/auth/schools/'),
        api.get('/auth/users/'),
        api.get('/auth/audit-logs/'),
      ]);
      setSchools(schoolData.results || schoolData);
      setUsers(userData.results || userData);
      setAuditEvents(auditData.results || auditData);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load platform data.');
    }
  };

  useEffect(() => {
    let active = true;
    const fetchPlatformData = async () => {
      try {
        const [schoolData, userData, auditData] = await Promise.all([
          api.get('/auth/schools/'),
          api.get('/auth/users/'),
          api.get('/auth/audit-logs/'),
        ]);
        if (!active) return;
        setSchools(schoolData.results || schoolData);
        setUsers(userData.results || userData);
        setAuditEvents(auditData.results || auditData);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load platform data.');
      }
    };
    void fetchPlatformData();
    return () => { active = false; };
  }, []);

  const createSchool = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const school = await api.post('/auth/schools/', schoolForm);
      setSchoolForm(emptySchool);
      setSelectedSchool(String(school.id));
      await load();
    } catch (requestError) {
      setError(requestError.message || 'Unable to create school.');
    }
  };

  const toggleSchool = async (school) => {
    try {
      await api.patch(`/auth/schools/${school.id}/`, { is_active: !school.is_active });
      await load();
    } catch (requestError) {
      setError(requestError.message || 'Unable to update school.');
    }
  };

  const createSchoolAdmin = async (event) => {
    event.preventDefault();
    if (!selectedSchool) return;
    try {
      await api.post(`/auth/schools/${selectedSchool}/admins/`, adminForm);
      setAdminForm(emptyAdmin);
      await load();
    } catch (requestError) {
      setError(requestError.message || 'Unable to create school administrator.');
    }
  };

  const visibleUsers = users.filter((user) =>
    `${user.username} ${user.email} ${user.role} ${user.school || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Platform</h1>
        <p className="mt-1 text-sm text-slate-500">Schools, administrator accounts, and recent audit events</p>
      </header>
      {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Add school</h2>
          <form className="grid gap-3 sm:grid-cols-3" onSubmit={createSchool}>
            <input aria-label="School name" required placeholder="School name" value={schoolForm.name} onChange={(event) => setSchoolForm({ ...schoolForm, name: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
            <input aria-label="School code" required placeholder="Code" value={schoolForm.code} onChange={(event) => setSchoolForm({ ...schoolForm, code: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
            <input aria-label="School address" placeholder="Address" value={schoolForm.address} onChange={(event) => setSchoolForm({ ...schoolForm, address: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
            <button className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-3">Create school</button>
          </form>
          <ul className="mt-5 divide-y divide-slate-100">
            {schools.map((school) => (
              <li key={school.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span><strong>{school.name}</strong><span className="ml-2 text-slate-500">{school.code}</span></span>
                <button onClick={() => toggleSchool(school)} className="border border-slate-300 px-3 py-1.5 text-xs font-semibold">{school.is_active ? 'Suspend' : 'Reactivate'}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Create School Admin</h2>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={createSchoolAdmin}>
            <select required aria-label="School" value={selectedSchool} onChange={(event) => setSelectedSchool(event.target.value)} className="border border-slate-300 px-3 py-2 text-sm sm:col-span-2">
              <option value="">Select school</option>
              {schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
            {['username', 'email', 'password', 'first_name', 'last_name'].map((field) => (
              <input key={field} aria-label={field.replace('_', ' ')} required={['username', 'email', 'password'].includes(field)} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} placeholder={field.replace('_', ' ')} value={adminForm[field]} onChange={(event) => setAdminForm({ ...adminForm, [field]: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm" />
            ))}
            <button disabled={!selectedSchool} className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">Create administrator</button>
          </form>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Platform users</h2>
          <input aria-label="Search platform users" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} className="border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-y border-slate-200 text-slate-500"><th className="p-2">User</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">School</th></tr></thead>
            <tbody>{visibleUsers.map((user) => <tr key={user.id} className="border-b border-slate-100"><td className="p-2">{user.username}</td><td className="p-2">{user.email}</td><td className="p-2">{user.role}</td><td className="p-2">{schools.find((school) => school.id === user.school)?.name || 'Platform'}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent audit events</h2>
        <ul className="divide-y divide-slate-100">
          {auditEvents.slice(0, 20).map((event) => <li key={event.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span><strong>{event.action}</strong><span className="ml-2 text-slate-500">{event.object_type} #{event.object_id}</span></span><time className="text-slate-500">{new Date(event.created_at).toLocaleString()}</time></li>)}
        </ul>
      </section>
    </main>
  );
};

export default PlatformAdmin;
