const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  requestPasswordReset,
  resetPassword
} = require('../controllers/auth.controller');

const router = express.Router();

// ユーザー登録
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('有効なメールアドレスが必要です'),
    body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上である必要があります'),
    body('firstName').notEmpty().withMessage('名前は必須です'),
    body('lastName').notEmpty().withMessage('姓は必須です'),
    body('role').isIn(['affiliate', 'advertiser']).withMessage('ロールはaffiliateまたはadvertiserである必要があります')
  ],
  validate,
  register
);

// ユーザーログイン
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('有効なメールアドレスが必要です'),
    body('password').notEmpty().withMessage('パスワードは必須です')
  ],
  validate,
  login
);

// プロフィール取得
router.get('/profile', authenticate, getProfile);

// プロフィール更新
router.put('/profile', authenticate, updateProfile);

// パスワード変更
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('現在のパスワードは必須です'),
    body('newPassword').isLength({ min: 8 }).withMessage('新しいパスワードは8文字以上である必要があります')
  ],
  validate,
  changePassword
);

// パスワードリセットリクエスト
router.post(
  '/reset-password-request',
  [
    body('email').isEmail().withMessage('有効なメールアドレスが必要です')
  ],
  validate,
  requestPasswordReset
);

// パスワードリセット
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('リセットトークンは必須です'),
    body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上である必要があります')
  ],
  validate,
  resetPassword
);

module.exports = router;