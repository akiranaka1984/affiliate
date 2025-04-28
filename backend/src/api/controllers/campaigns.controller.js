const campaignService = require('../../services/campaigns.service');
const logger = require('../../config/logger');

/**
 * キャンペーンコントローラー
 * キャンペーン関連のエンドポイントハンドラー
 */
class CampaignController {
  /**
   * 新しいキャンペーンを作成
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async createCampaign(req, res) {
    try {
      const campaignData = req.body;
      const advertiserId = req.user.id;
      
      const campaign = await campaignService.createCampaign(campaignData, advertiserId);
      
      res.status(201).json({
        message: 'キャンペーンを作成しました',
        campaign
      });
    } catch (error) {
      logger.error('キャンペーン作成コントローラーエラー:', error);
      res.status(500).json({
        message: error.message || 'キャンペーンの作成中にエラーが発生しました'
      });
    }
  }
  
  /**
   * キャンペーンを更新
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async updateCampaign(req, res) {
    try {
      const { id } = req.params;
      const campaignData = req.body;
      const advertiserId = req.user.id;
      
      const campaign = await campaignService.updateCampaign(id, campaignData, advertiserId);
      
      res.status(200).json({
        message: 'キャンペーンを更新しました',
        campaign
      });
    } catch (error) {
      logger.error('キャンペーン更新コントローラーエラー:', error);
      
      if (error.message.includes('権限がありません') || error.message.includes('見つかりません')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({
        message: error.message || 'キャンペーンの更新中にエラーが発生しました'
      });
    }
  }
  
  /**
   * キャンペーンを削除
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async deleteCampaign(req, res) {
    try {
      const { id } = req.params;
      const advertiserId = req.user.id;
      
      await campaignService.deleteCampaign(id, advertiserId);
      
      res.status(200).json({
        message: 'キャンペーンを削除しました'
      });
    } catch (error) {
      logger.error('キャンペーン削除コントローラーエラー:', error);
      
      if (error.message.includes('権限がありません') || error.message.includes('見つかりません')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({
        message: error.message || 'キャンペーンの削除中にエラーが発生しました'
      });
    }
  }
  
  /**
   * IDによるキャンペーン取得
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getCampaignById(req, res) {
    try {
      const { id } = req.params;
      
      const campaign = await campaignService.getCampaignById(id);
      
      if (!campaign) {
        return res.status(404).json({ message: 'キャンペーンが見つかりません' });
      }
      
      res.status(200).json(campaign);
    } catch (error) {
      logger.error('キャンペーン取得コントローラーエラー:', error);
      res.status(500).json({
        message: error.message || 'キャンペーンの取得中にエラーが発生しました'
      });
    }
  }
  
  /**
   * 広告主のキャンペーン一覧を取得
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getAdvertiserCampaigns(req, res) {
    try {
      const advertiserId = req.user.id;
      const { page, limit, search, status } = req.query;
      
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        search: search || '',
        status: status || null
      };
      
      const result = await campaignService.getAdvertiserCampaigns(advertiserId, options);
      
      res.status(200).json(result);
    } catch (error) {
      logger.error('広告主キャンペーン一覧コントローラーエラー:', error);
      res.status(500).json({
        message: error.message || 'キャンペーン一覧の取得中にエラーが発生しました'
      });
    }
  }
  
  /**
   * アフィリエイト向けキャンペーン一覧を取得
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getAffiliateCampaigns(req, res) {
    try {
      const affiliateId = req.user.id;
      const { page, limit, search, category, joined } = req.query;
      
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        search: search || '',
        category: category || null,
        joined: joined === 'true'
      };
      
      const result = await campaignService.getAffiliateCampaigns(affiliateId, options);
      
      res.status(200).json(result);
    } catch (error) {
      logger.error('アフィリエイトキャンペーン一覧コントローラーエラー:', error);
      res.status(500).json({
        message: error.message || 'キャンペーン一覧の取得中にエラーが発生しました'
      });
    }
  }
  
  /**
   * アフィリエイトリンクを生成
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async generateAffiliateLink(req, res) {
    try {
      const { campaignId } = req.params;
      const affiliateId = req.user.id;
      const linkData = req.body;
      
      const affiliateLink = await campaignService.generateAffiliateLink(
        campaignId,
        affiliateId,
        linkData
      );
      
      res.status(201).json({
        message: 'アフィリエイトリンクを生成しました',
        affiliateLink
      });
    } catch (error) {
      logger.error('アフィリエイトリンク生成コントローラーエラー:', error);
      
      if (error.message.includes('既に存在します') || error.message.includes('見つかりません')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({
        message: error.message || 'アフィリエイトリンクの生成中にエラーが発生しました'
      });
    }
  }
  
  /**
   * カテゴリ一覧を取得
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getCategories(req, res) {
    try {
      const categories = await campaignService.getCategories();
      
      res.status(200).json(categories);
    } catch (error) {
      logger.error('カテゴリ一覧コントローラーエラー:', error);
      res.status(500).json({
        message: error.message || 'カテゴリ一覧の取得中にエラーが発生しました'
      });
    }
  }
}

module.exports = new CampaignController();