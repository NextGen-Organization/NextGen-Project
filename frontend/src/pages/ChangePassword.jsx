import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/auth';

export default function ChangePassword() {
  const { accessToken, user } = useContext(AuthContext);
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = { new_password: newPassword };
      if (!user || !user.login) payload.current_password = current; // If no login-based initial password, require current
      await axios.put(`${API_BASE}/me`, payload, { headers: { Authorization: `Bearer ${accessToken}` } });
      setSuccess('Password updated');
      setTimeout(() => {
        navigate('/profile');
      }, 800);
    } catch (err) {
      const data = err.response?.data;
      if (data?.message) setError(data.message);
      else if (data?.errors) setError(data.errors.map(e=>`${e.param}: ${e.msg}`).join('; '));
      else setError('Failed to update password');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '40px auto' }}>
      <h2>Change Password</h2>
      <p>Please choose a new password (minimum 8 characters).</p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        {/* Only ask for current password if he doesn't have initial CIN flow */}
        {!user?.login && <input placeholder="Current password" type="password" value={current} onChange={e=>setCurrent(e.target.value)} />}
        <input placeholder="New password" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <button type="submit">Update password</button>
      </form>
    </div>
  );
}
