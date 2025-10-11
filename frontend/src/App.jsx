import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './auth/AuthContext';
import ChangePassword from './pages/ChangePassword';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container">
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Link to="/login">Login</Link> | <Link to="/profile">Profile</Link>
            </div>
            <div>
              <AuthContext.Consumer>
                {({ user }) => user && user.role === 'admin' ? <span><Link to="/admin">Admin</Link></span> : null}
              </AuthContext.Consumer>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
