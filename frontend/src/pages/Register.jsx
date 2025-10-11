import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'Inter, Roboto, Arial' }}>
      <h2>Registration Disabled</h2>
      <p>Public registration has been disabled. Only administrators can create student and teacher accounts from the admin dashboard.</p>
      <p>If you are an administrator, please <Link to="/login">login</Link> and go to the <Link to="/admin">Admin Dashboard</Link>.</p>
    </div>
  );
}
