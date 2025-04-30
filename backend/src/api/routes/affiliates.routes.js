// backend/src/api/routes/affiliates.routes.js
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body, param } = require('express-validator');

// 仮のコントローラー - 実際のファイルが作成されたら置き換えてください
const affiliatesController = {
  getProfile: (req, res) => {
    res.status(200).json({ message: 'Affiliate profile endpoint - to be implemented' });
  },
  updateProfile: (req, res) => {
    res.status(200).json({ message: 'Update affiliate profile endpoint - to be implemented' });
  },
  getAffiliates: (req, res) => {
    res.status(200).json({ message: 'Get affiliates endpoint - to be implemented' });
  },
  getAffiliateById: (req, res) => {
    res.status(200).json({ message: 'Get affiliate by id endpoint - to be implemented' });
  },
  updateAffiliate: (req, res) => {
    res.status(200).json({ message: 'Update affiliate endpoint - to be implemented' });
  },
  getEarnings: (req, res) => {
    res.status(200).json({ message: 'Get earnings endpoint - to be implemented' });
  }
};

const router = express.Router();

// アフィリエイトのプロフィール取得
router.get(
  '/profile',
  authenticate,
  authorize('affiliate'),
  affiliatesController.getProfile
);

// アフィリエイトのプロフィール更新
router.put(
  '/profile',
  authenticate,
  authorize('affiliate'),
  [
    body('companyName').optional().isString().withMessage('Company name must be a string'),
    body('website').optional().isURL().withMessage('Website must be a valid URL'),
    body('niche').optional().isString().withMessage('Niche must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('taxId').optional().isString().withMessage('Tax ID must be a string')
  ],
  validate,
  affiliatesController.updateProfile
);

// アフィリエイトの収益情報取得
router.get(
  '/earnings',
  authenticate,
  authorize('affiliate'),
  affiliatesController.getEarnings
);

// 管理者・広告主向けアフィリエイト管理エンドポイント
// アフィリエイト一覧取得
router.get(
  '/',
  authenticate,
  authorize('admin', 'advertiser'),
  affiliatesController.getAffiliates
);

// アフィリエイト詳細取得
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'advertiser'),
  param('id').isUUID().withMessage('Valid affiliate ID is required'),
  validate,
  affiliatesController.getAffiliateById
);

// 管理者のみアフィリエイト情報更新
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    param('id').isUUID().withMessage('Valid affiliate ID is required'),
    body('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be valid'),
    body('commissionTier').optional().isInt({ min: 1, max: 5 }).withMessage('Commission tier must be between 1 and 5')
  ],
  validate,
  affiliatesController.updateAffiliate
);

module.exports = router;