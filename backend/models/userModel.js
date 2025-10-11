const pool = require('../db');

// Using existing database schema: table `utilisateur` with columns
// id, nom, prenom, email, role, login, mdp_hash

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT id, nom, prenom, email, role, login, mdp_hash FROM utilisateur WHERE email = ?', [email]);
  const row = rows[0];
  if (!row) return undefined;
  return {
    id: row.id,
    first_name: row.prenom || '',
    last_name: row.nom || '',
    email: row.email,
    login: row.login || null,
    role: row.role,
    password_hash: row.mdp_hash
  };
};

const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, nom, prenom, email, role, login, mdp_hash FROM utilisateur WHERE id = ?', [id]);
  const row = rows[0];
  if (!row) return undefined;
  return {
    id: row.id,
    first_name: row.prenom || '',
    last_name: row.nom || '',
    email: row.email,
    login: row.login || null,
    role: row.role,
    password_hash: row.mdp_hash
  };
};

const createUser = async ({ first_name, last_name, email, password_hash, role, login }) => {
  // Insert into `utilisateur` using mdp_hash column for password
  const [result] = await pool.query(
    'INSERT INTO utilisateur (nom, prenom, email, role, login, mdp_hash) VALUES (?, ?, ?, ?, ?, ?)',
    [last_name, first_name, email, role, login || null, password_hash]
  );
  return findUserById(result.insertId);
};

module.exports = { findUserByEmail, createUser, findUserById };

const updateUser = async (id, { first_name, last_name, email, password_hash }) => {
  // Build dynamic query
  const fields = [];
  const values = [];
  if (last_name !== undefined) { fields.push('nom = ?'); values.push(last_name); }
  if (first_name !== undefined) { fields.push('prenom = ?'); values.push(first_name); }
  if (email !== undefined) { fields.push('email = ?'); values.push(email); }
  if (password_hash !== undefined) { fields.push('mdp_hash = ?'); values.push(password_hash); }
  if (fields.length === 0) return findUserById(id);
  const sql = `UPDATE utilisateur SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  await pool.query(sql, values);
  return findUserById(id);
};

const findAllUsers = async (opts = {}) => {
  if (opts.cin) {
    const [rows] = await pool.query('SELECT id, nom, prenom, email, role, login FROM utilisateur WHERE login = ? ORDER BY id DESC', [opts.cin]);
    return rows.map(r => ({ id: r.id, first_name: r.prenom, last_name: r.nom, email: r.email, role: r.role, login: r.login }));
  }
  // support optional limit
  if (opts.limit && Number.isInteger(opts.limit)) {
    const [rows] = await pool.query('SELECT id, nom, prenom, email, role, login FROM utilisateur ORDER BY id DESC LIMIT ?', [opts.limit]);
    return rows.map(r => ({ id: r.id, first_name: r.prenom, last_name: r.nom, email: r.email, role: r.role, login: r.login }));
  }
  const [rows] = await pool.query('SELECT id, nom, prenom, email, role, login FROM utilisateur ORDER BY id DESC');
  return rows.map(r => ({ id: r.id, first_name: r.prenom, last_name: r.nom, email: r.email, role: r.role, login: r.login }));
};

const deleteUserById = async (id) => {
  const [res] = await pool.query('DELETE FROM utilisateur WHERE id = ?', [id]);
  return res.affectedRows > 0;
};

module.exports = { findUserByEmail, createUser, findUserById, updateUser, findAllUsers, deleteUserById };
