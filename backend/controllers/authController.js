const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Simple in-memory refresh token store for demo. In production use DB or Redis.
const refreshTokens = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || (JWT_SECRET + '_refresh');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};

const generateRefreshToken = (user) => {
  const token = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN || '7d'
  });
  refreshTokens.set(token, user.id);
  return token;
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { first_name, last_name, email, password, role } = req.body;
    const existing = await userModel.findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ first_name, last_name, email, password_hash, role });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // Detect whether stored password equals the login (initial CIN password)
    let mustChangePassword = false;
    if (user.login) {
      try {
        mustChangePassword = await bcrypt.compare(user.login, user.password_hash);
      } catch (e) {
        mustChangePassword = false;
      }
    }

    // Detect whether user needs to complete profile (missing first name / last name / email)
    const mustCompleteProfile = !user.first_name || !user.last_name || !user.email;

  res.json({ user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name, login: user.login, mustChangePassword, mustCompleteProfile }, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // requireAuth middleware sets req.user = payload
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { first_name, last_name, email, current_password, new_password } = req.body;
    const user = await userModel.findUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If email changed, ensure uniqueness
    if (email && email !== user.email) {
      const existing = await userModel.findUserByEmail(email);
      if (existing && existing.id !== userId) return res.status(409).json({ message: 'Email already in use' });
    }

    // Handle password change
    let password_hash;
    if (new_password) {
      if (new_password.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });

      // Allow change without current_password if the account still uses initial login (CIN)
      let initialPasswordMatch = false;
      if (user.login) {
        initialPasswordMatch = await bcrypt.compare(user.login, user.password_hash);
      }

      if (!initialPasswordMatch) {
        if (!current_password) return res.status(400).json({ message: 'Current password required to change password' });
        const ok = await bcrypt.compare(current_password, user.password_hash);
        if (!ok) return res.status(401).json({ message: 'Current password incorrect' });
      }

      password_hash = await bcrypt.hash(new_password, 10);
    }

    const updated = await userModel.updateUser(userId, { first_name, last_name, email, password_hash });
    res.json({ user: { id: updated.id, email: updated.email, role: updated.role, first_name: updated.first_name, last_name: updated.last_name } });
  } catch (err) {
    next(err);
  }
};

// Admin-only: create user and generate account using CIN as login and initial password
exports.createUserByAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { first_name, last_name, email, role, cin } = req.body;
    const existing = await userModel.findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // Use CIN as login and as initial password (hashed). In production, send a password reset flow.
    const password_hash = await bcrypt.hash(cin, 10);
    let user;
    try {
      user = await userModel.createUser({ first_name, last_name, email, password_hash, role, login: cin });
    } catch (dbErr) {
      // handle duplicate entry or other db issues
      if (dbErr && dbErr.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email or login already exists' });
      return next(dbErr);
    }

    // Return created user info and the initial credentials (login=CIN). Do not return password.
    res.status(201).json({
      user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name },
      initialCredentials: { login: cin }
    });
  } catch (err) {
    next(err);
  }
};

// Admin: list all users
exports.listUsers = async (req, res, next) => {
  try {
  const cin = req.query.cin;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
  const users = await userModel.findAllUsers(cin ? { cin } : (limit ? { limit } : { limit: 5 }));
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// Admin: update a user by id
exports.updateUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;
    const updated = await userModel.updateUser(id, { first_name, last_name, email });
    // optionally update role column if schema supports it
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
};

// Admin: delete user
exports.deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ok = await userModel.deleteUserById(id);
    if (!ok) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token required' });
    if (!refreshTokens.has(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(token, REFRESH_SECRET, async (err, payload) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      const user = await userModel.findUserById(payload.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Missing token' });
    const token = auth.split(' ')[1];
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      const user = await userModel.findUserById(payload.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name });
    });
  } catch (err) {
    next(err);
  }
};
