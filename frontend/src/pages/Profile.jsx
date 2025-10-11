import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from '../components/Slider';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  // Hooks must run unconditionally and in the same order on every render.
  // Initialize form empty and populate it when `user` becomes available.
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [msg, setMsg] = useState(null);

  const location = useLocation();
  useEffect(() => {
    if (user) {
      setForm({ first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '' });
    }
    const params = new URLSearchParams(location.search);
    if (params.get('setup') === '1') setEditing(true);
  }, [user, location.search]);

  if (!user) return <div>Loading...</div>;

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/auth';
  const save = async (e) => {
    e.preventDefault();
    try {
  const res = await axios.put(`${API_BASE}/me`, form, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      setMsg('Profile updated');
      setEditing(false);
    } catch (err) {
      const data = err.response?.data;
      setMsg(data?.message || 'Failed to update');
    }
  };

  return (
    <div className="container">
      <Slider slides={[`Welcome back, ${user.first_name}`, 'Manage your profile', 'Change password for security']} />
      <div className="card" style={{ maxWidth: 720, margin: '18px auto' }}>
      <h2>Profile</h2>
      {msg && <div>{msg}</div>}
      {!editing ? (
        <div>
          <div>Name: {user.first_name} {user.last_name}</div>
          <div>Email: {user.email}</div>
          <div>Role: {user.role}</div>
          <div style={{ marginTop: 12 }}>
            {user.role === 'admin' && <a href="/admin" style={{ marginRight: 8 }}>Go to Admin Dashboard</a>}
            <a href="/change-password" style={{ marginRight: 8 }}>Change password</a>
            <button onClick={() => setEditing(true)}>Edit profile</button>
            <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          </div>
        </div>
      ) : (
        <form onSubmit={save} style={{ maxWidth: 600 }}>
          <input placeholder="First name" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} />
          <input placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <div style={{ marginTop: 8 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={()=>setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}
