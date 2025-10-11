const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireRole } = require('../middleware/authMiddleware');

// Public registration removed. Admins create users via POST /admin/users
router.post(
  '/admin/users',
  requireRole('admin'),
  [
    body('first_name').isLength({ min: 1 }).withMessage('First name required'),
    body('last_name').isLength({ min: 1 }).withMessage('Last name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('role').isIn(['student', 'teacher', 'admin', 'director']).withMessage('Invalid role'),
    body('cin').isLength({ min: 6 }).withMessage('CIN required and must be at least 6 chars')
  ],
  authController.createUserByAdmin
);

// Admin management endpoints
router.get('/admin/users', requireRole('admin'), authController.listUsers);
router.put('/admin/users/:id', requireRole('admin'), authController.updateUserByAdmin);
router.delete('/admin/users/:id', requireRole('admin'), authController.deleteUserByAdmin);

router.post('/login', [body('email').isEmail(), body('password').exists()], authController.login);
// Update profile (requires auth)
const { requireAuth } = require('../middleware/authMiddleware');
router.put(
  '/me',
  requireAuth,
  [
    body('first_name').optional().isLength({ min: 1 }).withMessage('First name required'),
    body('last_name').optional().isLength({ min: 1 }).withMessage('Last name required'),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('new_password').optional().isLength({ min: 8 }).withMessage('New password must be at least 8 chars')
  ],
  authController.updateProfile
);
router.post('/refresh', authController.refresh);

// Example of protected route requiring admin
router.get('/me', authController.me);
router.get('/admin-only', requireRole('admin'), (req, res) => res.json({ ok: true }));

module.exports = router;
