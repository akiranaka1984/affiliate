const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { register, login, getProfile, changePassword } = require('../controllers/auth.controller');

const router = express.Router();

// ユーザー登録
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role').isIn(['affiliate', 'advertiser']).withMessage('Role must be affiliate or advertiser')
  ],
  validate,
  register
);

// ユーザーログイン
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

// プロフィール取得
router.get('/profile', authenticate, getProfile);

// パスワード変更
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
  ],
  validate,
  changePassword
);

module.exports = router;