import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import Slider from '../components/Slider';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/auth';

export default function AdminDashboard() {
  const { accessToken } = useContext(AuthContext);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', role: 'student', cin: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchCin, setSearchCin] = useState('');

  const fetchUsers = async (cin, limit) => {
    try {
      const params = [];
      if (cin) params.push(`cin=${encodeURIComponent(cin)}`);
      if (limit) params.push(`limit=${encodeURIComponent(limit)}`);
      const url = params.length ? `${API_BASE}/admin/users?${params.join('&')}` : `${API_BASE}/admin/users`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  React.useEffect(()=>{ if (accessToken) fetchUsers(); }, [accessToken]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    // Client-side validation to avoid sending invalid request
    if (!form.first_name || !form.last_name) {
      setError('First name and last name are required');
      return;
    }
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('A valid email is required');
      return;
    }
    if (!form.cin || form.cin.length < 6) {
      setError('CIN must be at least 6 characters');
      return;
    }
    if (!accessToken) {
      setError('Missing admin access token. Please login again.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/admin/users`, form, { headers: { Authorization: `Bearer ${accessToken}` } });
      setMessage(`User created: ${res.data.user.email} (login: ${res.data.initialCredentials.login})`);
      setForm({ first_name: '', last_name: '', email: '', role: 'student', cin: '' });
      setError(null);
  fetchUsers();
    } catch (err) {
      console.error(err);
      // Display backend validation errors when present
      const data = err.response?.data;
      console.error('Response data:', data);
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map(e => `${e.param}: ${e.msg}`).join('; '));
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError('Failed to create user');
      }
    }
  };

  const startEdit = (u) => { setEditingUser({ ...u }); setMessage(null); setError(null); };
  const saveEdit = async () => {
    try {
      const res = await axios.put(`${API_BASE}/admin/users/${editingUser.id}`, editingUser, { headers: { Authorization: `Bearer ${accessToken}` } });
      setMessage('User updated');
      setEditingUser(null);
      fetchUsers();
    } catch(err){ setError(err.response?.data?.message || 'Update failed'); }
  };

  const removeUser = async (id) => {
    if (!confirm('Delete user? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setMessage('User deleted');
      fetchUsers();
    } catch(err) { setError(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="container">
      <Slider slides={["Welcome to Admin Dashboard","Create student and teacher accounts","Manage users easily"]} />
      <div style={{ maxWidth: 700, margin: '18px auto', fontFamily: 'Inter, Roboto, Arial' }}>
      <div className="card">
      <h2>Admin Dashboard</h2>
      <p>Create student or teacher accounts. Initial login will be the CIN provided.</p>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
        <input placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="CIN (will be login and initial password)" value={form.cin} onChange={e => setForm({ ...form, cin: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
          <option value="director">Director</option>
        </select>
        <button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#0b74ff', color: '#fff', border: 'none' }}>Create</button>
      </form>
      </div>
      </div>
      <div className="container">
        <div className="card" style={{ maxWidth: 1100, margin: '18px auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input placeholder="Search by CIN" value={searchCin} onChange={e=>setSearchCin(e.target.value)} />
            <button onClick={()=>fetchUsers(searchCin)}>Search</button>
            <button onClick={()=>{ setSearchCin(''); fetchUsers(); }}>Clear</button>
          </div>
          <h3>Users</h3>
          <div style={{ marginBottom: 8, color: '#555' }}>Showing up to 5 users by default. Use Search to find a specific CIN or click Show all.</div>
          <div style={{ marginBottom: 12 }}>
            <button onClick={()=>fetchUsers(undefined)}>Refresh</button>
            <button onClick={()=>fetchUsers(undefined, 1000)} style={{ marginLeft: 8 }}>Show all</button>
          </div>
          {users.length === 0 ? <div>No users</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Login</th><th></th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{u.id}</td>
                    <td style={{ padding: 8 }}>{editingUser && editingUser.id === u.id ? <input value={editingUser.first_name} onChange={e=>setEditingUser({...editingUser, first_name:e.target.value})} /> : `${u.first_name} ${u.last_name}`}</td>
                    <td style={{ padding: 8 }}>{editingUser && editingUser.id === u.id ? <input value={editingUser.email} onChange={e=>setEditingUser({...editingUser, email:e.target.value})} /> : u.email}</td>
                    <td style={{ padding: 8 }}>{editingUser && editingUser.id === u.id ? <select value={editingUser.role} onChange={e=>setEditingUser({...editingUser, role:e.target.value})}><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option><option value="director">Director</option></select> : u.role}</td>
                    <td style={{ padding: 8 }}>{u.login}</td>
                    <td style={{ padding: 8 }}>
                      {editingUser && editingUser.id === u.id ? (
                        <>
                          <button onClick={saveEdit}>Save</button>
                          <button onClick={()=>setEditingUser(null)} style={{ marginLeft: 8 }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(u)}>Edit</button>
                          <button onClick={()=>removeUser(u.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
