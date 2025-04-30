// src/controllers/campaign.controller.js
/* eslint-disable consistent-return */  // 例: ESLint を使う場合の無限 return 防止
const campaignService = require('../../services/campaigns.service');
const logger          = require('../../config/logger');

/**
 * キャンペーンコントローラー
 * ──────────────────────────────────────────
 * すべてのハンドラは「try / catch」を備え、
 *   ・正常系は res.status(xxx).json(...)
 *   ・異常系はエラーログ + 適切な HTTP ステータス
 * で応答します。
 */
class CampaignController {
  /**
   * POST /campaigns
   * 新しいキャンペーンを作成
   */
  async createCampaign(req, res) {
    try {
      const advertiserId = req.user.id;
      const campaignData = { ...req.body, advertiserId };

      const campaign = await campaignService.createCampaign(campaignData);

      return res.status(201).json({
        message: 'キャンペーンを作成しました',
        campaign,
      });
    } catch (err) {
      logger.error('キャンペーン作成コントローラーエラー:', err);
      return res.status(500).json({
        message: err.message || 'キャンペーンの作成中にエラーが発生しました',
      });
    }
  }

  /**
   * PATCH /campaigns/:id
   * キャンペーンを更新
   */
  async updateCampaign(req, res) {
    try {
      const id           = Number(req.params.id);
      const advertiserId = req.user.id;
      const campaignData = req.body;

      const campaign = await campaignService.updateCampaign(id, campaignData, advertiserId);

      return res.status(200).json({
        message: 'キャンペーンを更新しました',
        campaign,
      });
    } catch (err) {
      logger.error('キャンペーン更新コントローラーエラー:', err);

      if (err.message?.includes('権限がありません') || err.message?.includes('見つかりません')) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({
        message: err.message || 'キャンペーンの更新中にエラーが発生しました',
      });
    }
  }

  /**
   * DELETE /campaigns/:id
   * キャンペーンを削除
   */
  async deleteCampaign(req, res) {
    try {
      const id           = Number(req.params.id);
      const advertiserId = req.user.id;

      await campaignService.deleteCampaign(id, advertiserId);

      return res.status(200).json({ message: 'キャンペーンを削除しました' });
    } catch (err) {
      logger.error('キャンペーン削除コントローラーエラー:', err);

      if (err.message?.includes('権限がありません') || err.message?.includes('見つかりません')) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({
        message: err.message || 'キャンペーンの削除中にエラーが発生しました',
      });
    }
  }

  /**
   * GET /campaigns/:id
   * ID によるキャンペーン取得
   */
  async getCampaignById(req, res) {
    try {
      const id = Number(req.params.id);

      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({ message: 'キャンペーンが見つかりません' });
      }
      return res.status(200).json(campaign);
    } catch (err) {
      logger.error('キャンペーン取得コントローラーエラー:', err);
      return res.status(500).json({
        message: err.message || 'キャンペーンの取得中にエラーが発生しました',
      });
    }
  }

  /**
   * GET /advertiser/campaigns
   * 広告主のキャンペーン一覧
   */
  async getAdvertiserCampaigns(req, res) {
    try {
      const advertiserId    = req.user.id;
      const {
        page   = 1,
        limit  = 10,
        search = '',
        status = null,
      } = req.query;

      const options = {
        page  : Number(page),
        limit : Number(limit),
        search,
        status,
      };

      const result = await campaignService.getAdvertiserCampaigns(advertiserId, options);
      return res.status(200).json(result);
    } catch (err) {
      logger.error('広告主キャンペーン一覧コントローラーエラー:', err);
      return res.status(500).json({
        message: err.message || 'キャンペーン一覧の取得中にエラーが発生しました',
      });
    }
  }

  /**
   * GET /affiliate/campaigns
   * アフィリエイト向けキャンペーン一覧
   */
  async getAffiliateCampaigns(req, res) {
    try {
      const affiliateId = req.user.id;
      const {
        page     = 1,
        limit    = 10,
        search   = '',
        category = null,
        joined   = 'false',
      } = req.query;

      const options = {
        page    : Number(page),
        limit   : Number(limit),
        search,
        category,
        joined  : joined === 'true',
      };

      const result = await campaignService.getAffiliateCampaigns(affiliateId, options);
      return res.status(200).json(result);
    } catch (err) {
      logger.error('アフィリエイトキャンペーン一覧コントローラーエラー:', err);
      return res.status(500).json({
        message: err.message || 'キャンペーン一覧の取得中にエラーが発生しました',
      });
    }
  }

  /**
   * POST /campaigns/:campaignId/links
   * アフィリエイトリンクを生成
   */
  async generateAffiliateLink(req, res) {
    try {
      const campaignId  = Number(req.params.campaignId);
      const affiliateId = req.user.id;
      const linkData    = req.body;

      const affiliateLink = await campaignService.generateAffiliateLink(
        campaignId,
        affiliateId,
        linkData,
      );

      return res.status(201).json({
        message: 'アフィリエイトリンクを生成しました',
        affiliateLink,
      });
    } catch (err) {
      logger.error('アフィリエイトリンク生成コントローラーエラー:', err);

      if (err.message?.includes('既に存在します') || err.message?.includes('見つかりません')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: err.message || 'アフィリエイトリンクの生成中にエラーが発生しました',
      });
    }
  }

  /**
   * GET /campaigns/categories
   * カテゴリ一覧を取得
   */
  async getCategories(_req, res) {
    try {
      const categories = await campaignService.getCategories();
      return res.status(200).json(categories);
    } catch (err) {
      logger.error('カテゴリ一覧コントローラーエラー:', err);
      return res.status(500).json({
        message: err.message || 'カテゴリ一覧の取得中にエラーが発生しました',
      });
    }
  }

  /**
   * POST /campaigns/:id/join
   * アフィリエイトがキャンペーンに参加
   */
  async joinCampaign(req, res) {
    try {
      const campaignId  = Number(req.params.id);
      const affiliateId = req.user.id;
      const linkData    = req.body;

      // サービス層に「joinCampaign」を用意している場合はこちらを推奨
      // const affiliateLink = await campaignService.joinCampaign(campaignId, affiliateId, linkData);

      // ここでは generateAffiliateLink を再利用
      const affiliateLink = await campaignService.generateAffiliateLink(
        campaignId,
        affiliateId,
        linkData,
      );

      return res.status(201).json({
        message: 'キャンペーンへの参加リクエストを受け付けました',
        affiliateLink,
      });
    } catch (err) {
      logger.error('キャンペーン参加コントローラーエラー:', err);

      if (err.message?.includes('既に存在します') || err.message?.includes('見つかりません')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: err.message || 'キャンペーン参加処理中にエラーが発生しました',
      });
    }
  }
}

module.exports = new CampaignController();
