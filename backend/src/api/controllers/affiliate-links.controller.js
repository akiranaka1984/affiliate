// backend/src/api/controllers/affiliate-links.controller.js
const affiliateLinkService = require('../../services/affiliate-links.service');
const logger = require('../../config/logger');

/**
 * アフィリエイトリンクコントローラー
 * アフィリエイトリンク関連のエンドポイントハンドラー
 */
class AffiliateLinkController {
  /**
   * アフィリエイトリンク一覧を取得
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getAffiliateLinks(req, res) {
    try {
      const userId = req.user.id;
      const { page, limit, search, campaignId } = req.query;
      
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        search: search || '',
        campaignId: campaignId || ''
      };
      
      const result = await affiliateLinkService.getAffiliateLinks(userId, options);
      
      res.status(200).json(result);
    } catch (error) {
      logger.error('アフィリエイトリンク一覧の取得に失敗しました:', error);
      res.status(500).json({
        message: error.message || 'アフィリエイトリンク一覧の取得中にエラーが発生しました'
      });
    }
  }
  
  /**
   * アフィリエイトリンクの統計情報を取得
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getLinkStats(req, res) {
    try {
      const { id: linkId } = req.params;
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      
      const options = { startDate, endDate };
      
      const stats = await affiliateLinkService.getLinkStats(linkId, userId, options);
      
      res.status(200).json(stats);
    } catch (error) {
      logger.error('アフィリエイトリンク統計情報の取得に失敗しました:', error);
      
      if (error.message.includes('見つかりません')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({
        message: error.message || 'アフィリエイトリンク統計情報の取得中にエラーが発生しました'
      });
    }
  }
  
  /**
   * アフィリエイトリンクを削除
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async deleteAffiliateLink(req, res) {
    try {
      const { id: linkId } = req.params;
      const userId = req.user.id;
      
      await affiliateLinkService.deleteAffiliateLink(linkId, userId);
      
      res.status(200).json({
        message: 'アフィリエイトリンクを削除しました'
      });
    } catch (error) {
      logger.error('アフィリエイトリンクの削除に失敗しました:', error);
      
      if (error.message.includes('見つかりません')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({
        message: error.message || 'アフィリエイトリンクの削除中にエラーが発生しました'
      });
    }
  }
}

module.exports = new AffiliateLinkController();