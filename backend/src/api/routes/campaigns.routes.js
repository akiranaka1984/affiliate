const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const campaignController = require('../controllers/campaigns.controller');

const router = express.Router();

// キャンペーン作成バリデーション
const createCampaignValidation = [
  body('title').notEmpty().withMessage('タイトルは必須です'),
  body('targetUrl').notEmpty().withMessage('ターゲットURLは必須です').isURL().withMessage('有効なURLを入力してください'),
  body('paymentType').isIn(['CPC', 'CPA', 'CPS']).withMessage('支払いタイプは CPC、CPA、または CPS のいずれかである必要があります'),
  body('commissionType').isIn(['fixed', 'percentage']).withMessage('コミッションタイプは fixed または percentage のいずれかである必要があります'),
  body('commissionAmount').isNumeric().withMessage('コミッション額は数値である必要があります')
];

// キャンペーン更新バリデーション
const updateCampaignValidation = [
  param('id').isUUID().withMessage('有効なキャンペーンIDを指定してください'),
  body('title').optional().notEmpty().withMessage('タイトルは空にできません'),
  body('targetUrl').optional().isURL().withMessage('有効なURLを入力してください'),
  body('paymentType').optional().isIn(['CPC', 'CPA', 'CPS']).withMessage('支払いタイプは CPC、CPA、または CPS のいずれかである必要があります'),
  body('commissionType').optional().isIn(['fixed', 'percentage']).withMessage('コミッションタイプは fixed または percentage のいずれかである必要があります'),
  body('commissionAmount').optional().isNumeric().withMessage('コミッション額は数値である必要があります'),
  body('status').optional().isIn(['draft', 'active', 'paused', 'completed']).withMessage('ステータスは draft、active、paused、または completed のいずれかである必要があります')
];

// IDバリデーション
const idValidation = [
  param('id').isUUID().withMessage('有効なキャンペーンIDを指定してください')
];

// -------------------- 広告主向けルート --------------------

// 広告主のキャンペーン作成
router.post(
  '/',
  authenticate,
  authorize('advertiser'),
  createCampaignValidation,
  validate,
  campaignController.createCampaign
);

// 広告主のキャンペーン更新
router.put(
  '/:id',
  authenticate,
  authorize('advertiser'),
  updateCampaignValidation,
  validate,
  campaignController.updateCampaign
);

// 広告主のキャンペーン削除
router.delete(
  '/:id',
  authenticate,
  authorize('advertiser'),
  idValidation,
  validate,
  campaignController.deleteCampaign
);

// 広告主のキャンペーン一覧取得
router.get(
  '/advertiser',
  authenticate,
  authorize('advertiser'),
  campaignController.getAdvertiserCampaigns
);

// -------------------- アフィリエイト向けルート --------------------

// アフィリエイト向けキャンペーン一覧
router.get(
  '/affiliate',
  authenticate,
  authorize('affiliate'),
  campaignController.getAffiliateCampaigns
);

// アフィリエイトリンク生成
router.post(
  '/:id/affiliate-link',
  authenticate,
  authorize('affiliate'),
  idValidation,
  validate,
  campaignController.generateAffiliateLink
);
// アフィリエイトがキャンペーンに参加する
router.post(
  '/:id/join',
  authenticate,
  authorize('affiliate'),
  idValidation,
  validate,
  campaignController.joinCampaign
);

// -------------------- 共通ルート --------------------

// IDによるキャンペーン取得
router.get(
  '/:id',
  authenticate,
  idValidation,
  validate,
  campaignController.getCampaignById
);

// カテゴリ一覧取得
router.get(
  '/meta/categories',
  authenticate,
  campaignController.getCategories
);

module.exports = router;