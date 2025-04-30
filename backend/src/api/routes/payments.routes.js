// backend/src/api/routes/payments.routes.js
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body, param, query } = require('express-validator');

// 仮のコントローラー - 実際のファイルが作成されたら置き換えてください
const paymentsController = {
  getAffiliatePayments: (req, res) => {
    res.status(200).json({ message: 'Get affiliate payments endpoint - to be implemented' });
  },
  getAffiliatePaymentDetails: (req, res) => {
    res.status(200).json({ message: 'Get affiliate payment details endpoint - to be implemented' });
  },
  getAdvertiserPayments: (req, res) => {
    res.status(200).json({ message: 'Get advertiser payments endpoint - to be implemented' });
  },
  getAdvertiserPaymentDetails: (req, res) => {
    res.status(200).json({ message: 'Get advertiser payment details endpoint - to be implemented' });
  },
  createPaymentMethod: (req, res) => {
    res.status(200).json({ message: 'Create payment method endpoint - to be implemented' });
  },
  updatePaymentMethod: (req, res) => {
    res.status(200).json({ message: 'Update payment method endpoint - to be implemented' });
  },
  deletePaymentMethod: (req, res) => {
    res.status(200).json({ message: 'Delete payment method endpoint - to be implemented' });
  },
  getPaymentMethods: (req, res) => {
    res.status(200).json({ message: 'Get payment methods endpoint - to be implemented' });
  },
  adminCreatePayment: (req, res) => {
    res.status(200).json({ message: 'Admin create payment endpoint - to be implemented' });
  },
  adminUpdatePayment: (req, res) => {
    res.status(200).json({ message: 'Admin update payment endpoint - to be implemented' });
  }
};

const router = express.Router();

// ============= アフィリエイト向けエンドポイント =============

// アフィリエイト向け - 支払い一覧取得
router.get(
  '/affiliate',
  authenticate,
  authorize('affiliate'),
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    query('status').optional().isIn(['pending', 'processing', 'completed', 'failed']).withMessage('Status must be valid')
  ],
  validate,
  paymentsController.getAffiliatePayments
);

// アフィリエイト向け - 支払い詳細取得
router.get(
  '/affiliate/:id',
  authenticate,
  authorize('affiliate'),
  param('id').isUUID().withMessage('Valid payment ID is required'),
  validate,
  paymentsController.getAffiliatePaymentDetails
);

// ============= 広告主向けエンドポイント =============

// 広告主向け - 支払い一覧取得
router.get(
  '/advertiser',
  authenticate,
  authorize('advertiser'),
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    query('status').optional().isIn(['pending', 'processing', 'completed', 'failed']).withMessage('Status must be valid')
  ],
  validate,
  paymentsController.getAdvertiserPayments
);

// 広告主向け - 支払い詳細取得
router.get(
  '/advertiser/:id',
  authenticate,
  authorize('advertiser'),
  param('id').isUUID().withMessage('Valid payment ID is required'),
  validate,
  paymentsController.getAdvertiserPaymentDetails
);

// ============= 支払い方法管理 =============

// 支払い方法一覧取得
router.get(
  '/methods',
  authenticate,
  paymentsController.getPaymentMethods
);

// 支払い方法作成
router.post(
  '/methods',
  authenticate,
  [
    body('type').isIn(['bank_transfer', 'paypal', 'stripe', 'credit_card']).withMessage('Payment type must be valid'),
    body('name').isString().withMessage('Name is required'),
    body('details').isObject().withMessage('Details must be an object')
  ],
  validate,
  paymentsController.createPaymentMethod
);

// 支払い方法更新
router.put(
  '/methods/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Valid payment method ID is required'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('details').optional().isObject().withMessage('Details must be an object'),
    body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
  ],
  validate,
  paymentsController.updatePaymentMethod
);

// 支払い方法削除
router.delete(
  '/methods/:id',
  authenticate,
  param('id').isUUID().withMessage('Valid payment method ID is required'),
  validate,
  paymentsController.deletePaymentMethod
);

// ============= 管理者向けエンドポイント =============

// 管理者向け - 支払い作成
router.post(
  '/admin',
  authenticate,
  authorize('admin'),
  [
    body('type').isIn(['affiliate', 'advertiser']).withMessage('Payment type must be valid'),
    body('userId').isUUID().withMessage('Valid user ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isString().withMessage('Currency must be a string'),
    body('status').optional().isIn(['pending', 'processing', 'completed', 'failed']).withMessage('Status must be valid'),
    body('note').optional().isString().withMessage('Note must be a string')
  ],
  validate,
  paymentsController.adminCreatePayment
);

// 管理者向け - 支払い更新
router.put(
  '/admin/:id',
  authenticate,
  authorize('admin'),
  [
    param('id').isUUID().withMessage('Valid payment ID is required'),
    body('status').isIn(['pending', 'processing', 'completed', 'failed']).withMessage('Status must be valid'),
    body('transactionId').optional().isString().withMessage('Transaction ID must be a string'),
    body('note').optional().isString().withMessage('Note must be a string')
  ],
  validate,
  paymentsController.adminUpdatePayment
);

module.exports = router;