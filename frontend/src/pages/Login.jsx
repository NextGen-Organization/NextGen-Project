import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const logged = await login(email, password);
      if (logged && logged.mustChangePassword) {
        navigate('/change-password');
        return;
      }
      if (logged && logged.mustCompleteProfile) {
        navigate('/profile?setup=1');
        return;
      }
      if (logged && logged.role === 'admin') navigate('/admin');
      else navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card slide-in" style={{ maxWidth: 480, margin: '24px auto' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
}
