// backend/src/api/routes/users.routes.js
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body, param } = require('express-validator');

// 仮のコントローラー - 実際のファイルが作成されたら置き換えてください
const usersController = {
  getProfile: (req, res) => {
    res.status(200).json({ message: 'User profile endpoint - to be implemented' });
  },
  updateProfile: (req, res) => {
    res.status(200).json({ message: 'Update profile endpoint - to be implemented' });
  },
  getUsers: (req, res) => {
    res.status(200).json({ message: 'Get users endpoint - to be implemented' });
  },
  getUserById: (req, res) => {
    res.status(200).json({ message: 'Get user by id endpoint - to be implemented' });
  },
  updateUser: (req, res) => {
    res.status(200).json({ message: 'Update user endpoint - to be implemented' });
  },
  deleteUser: (req, res) => {
    res.status(200).json({ message: 'Delete user endpoint - to be implemented' });
  }
};

const router = express.Router();

// 自分のプロフィール取得
router.get('/profile', authenticate, usersController.getProfile);

// 自分のプロフィール更新
router.put(
  '/profile',
  authenticate,
  [
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string'),
    body('phone').optional().isString().withMessage('Phone must be a string')
  ],
  validate,
  usersController.updateProfile
);

// 管理者向けユーザー管理エンドポイント
// ユーザー一覧取得
router.get('/', authenticate, authorize('admin'), usersController.getUsers);

// ユーザー詳細取得
router.get(
  '/:id',
  authenticate, 
  authorize('admin'),
  param('id').isUUID().withMessage('Valid user ID is required'),
  validate,
  usersController.getUserById
);

// ユーザー更新
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    param('id').isUUID().withMessage('Valid user ID is required'),
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role').optional().isIn(['admin', 'advertiser', 'affiliate']).withMessage('Role must be valid'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
  ],
  validate,
  usersController.updateUser
);

// ユーザー削除
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID().withMessage('Valid user ID is required'),
  validate,
  usersController.deleteUser
);

module.exports = router;