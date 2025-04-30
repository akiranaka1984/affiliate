// backend/src/api/routes/affiliate-links.routes.js
const express = require('express');
const { param } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const affiliateLinkController = require('../controllers/affiliate-links.controller');

const router = express.Router();

// IDバリデーション
const idValidation = [
  param('id').isUUID().withMessage('有効なリンクIDを指定してください')
];

// アフィリエイトリンク一覧を取得
router.get(
  '/',
  authenticate,
  authorize('affiliate'),
  affiliateLinkController.getAffiliateLinks
);

// アフィリエイトリンクの統計情報を取得
router.get(
  '/:id/stats',
  authenticate,
  authorize('affiliate'),
  idValidation,
  validate,
  affiliateLinkController.getLinkStats
);

// アフィリエイトリンクを削除
router.delete(
  '/:id',
  authenticate,
  authorize('affiliate'),
  idValidation,
  validate,
  affiliateLinkController.deleteAffiliateLink
);

module.exports = router;