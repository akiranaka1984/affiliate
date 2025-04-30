// backend/src/api/routes/tracking.routes.js
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body, param, query } = require('express-validator');

// 仮のコントローラー - 実際のファイルが作成されたら置き換えてください
const trackingController = {
  trackClick: (req, res) => {
    res.status(200).json({ message: 'Click tracking endpoint - to be implemented' });
  },
  trackConversion: (req, res) => {
    res.status(200).json({ message: 'Conversion tracking endpoint - to be implemented' });
  },
  getClicks: (req, res) => {
    res.status(200).json({ message: 'Get clicks endpoint - to be implemented' });
  },
  getConversions: (req, res) => {
    res.status(200).json({ message: 'Get conversions endpoint - to be implemented' });
  },
  redirectToTargetUrl: (req, res) => {
    res.status(200).json({ message: 'Redirect to target URL endpoint - to be implemented' });
  }
};

const router = express.Router();

// 公開エンドポイント - クリックトラッキング
router.get(
  '/click/:trackingCode',
  trackingController.trackClick
);

// 公開エンドポイント - コンバージョントラッキング
router.post(
  '/conversion',
  [
    body('trackingCode').isString().withMessage('Tracking code is required'),
    body('orderId').optional().isString().withMessage('Order ID must be a string'),
    body('amount').optional().isNumeric().withMessage('Amount must be a number')
  ],
  validate,
  trackingController.trackConversion
);

// クリックリダイレクト処理（短縮URLなど）
router.get(
  '/c/:trackingCode',
  trackingController.redirectToTargetUrl
);

// 認証が必要なエンドポイント - クリック履歴の取得
router.get(
  '/clicks',
  authenticate,
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    query('campaignId').optional().isUUID().withMessage('Campaign ID must be a valid UUID'),
    query('linkId').optional().isUUID().withMessage('Link ID must be a valid UUID')
  ],
  validate,
  trackingController.getClicks
);

// 認証が必要なエンドポイント - コンバージョン履歴の取得
router.get(
  '/conversions',
  authenticate,
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    query('campaignId').optional().isUUID().withMessage('Campaign ID must be a valid UUID'),
    query('linkId').optional().isUUID().withMessage('Link ID must be a valid UUID')
  ],
  validate,
  trackingController.getConversions
);

module.exports = router;