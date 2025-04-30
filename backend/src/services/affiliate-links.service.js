// backend/src/services/affiliate-links.service.js
const { AffiliateLink } = require('../models/affiliate-link.model');
const { AffiliateProfile } = require('../models/affiliate.model');
const { Campaign } = require('../models/campaign.model');
const { TrackingClick, TrackingConversion } = require('../models/tracking.model');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * アフィリエイトリンクサービス
 * アフィリエイトリンク関連のビジネスロジックを提供
 */
class AffiliateLinkService {
  /**
   * アフィリエイトリンク一覧を取得
   * @param {String} userId - ユーザーID
   * @param {Object} options - オプション（ページネーション、検索など）
   * @returns {Promise<Object>} - アフィリエイトリンク一覧
   */
  async getAffiliateLinks(userId, options = {}) {
    try {
      const { page = 1, limit = 10, search = '', campaignId = '' } = options;
      const offset = (page - 1) * limit;
      
      // アフィリエイトプロフィール取得
      const affiliateProfile = await AffiliateProfile.findOne({
        where: { userId }
      });
      
      if (!affiliateProfile) {
        throw new Error('アフィリエイトプロフィールが見つかりません');
      }
      
      // 検索条件設定
      const where = {
        affiliateId: affiliateProfile.id
      };
      
      // キャンペーンIDのフィルター
      if (campaignId) {
        where.campaignId = campaignId;
      }
      
      // キーワード検索条件
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { customUrl: { [Op.like]: `%${search}%` } },
          { '$campaign.title$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      // アフィリエイトリンク一覧取得
      const { count, rows: links } = await AffiliateLink.findAndCountAll({
        where,
        include: [
          {
            model: Campaign,
            attributes: ['id', 'title', 'description', 'targetUrl', 'commissionType', 'commissionAmount', 'category', 'image']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      // 合計統計情報を取得
      const totalStats = await this.getAggregateLinkStats(affiliateProfile.id);
      
      return {
        totalLinks: count,
        links,
        ...totalStats,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('アフィリエイトリンク一覧の取得に失敗しました:', error);
      throw error;
    }
  }
  
  /**
   * アフィリエイトリンク集計統計を取得
   * @param {String} affiliateId - アフィリエイトID
   * @returns {Promise<Object>} - 集計統計情報
   */
  async getAggregateLinkStats(affiliateId) {
    try {
      // クリック・コンバージョン集計クエリ
      const stats = await AffiliateLink.findAll({
        where: { affiliateId },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('clickCount')), 'totalClicks'],
          [sequelize.fn('SUM', sequelize.col('conversionCount')), 'totalConversions'],
          [sequelize.fn('SUM', sequelize.col('revenue')), 'totalRevenue'],
        ],
        raw: true
      });
      
      return {
        totalClicks: parseInt(stats[0].totalClicks || 0),
        totalConversions: parseInt(stats[0].totalConversions || 0),
        totalRevenue: parseFloat(stats[0].totalRevenue || 0)
      };
    } catch (error) {
      logger.error('アフィリエイトリンク集計統計の取得に失敗しました:', error);
      return {
        totalClicks: 0,
        totalConversions: 0,
        totalRevenue: 0
      };
    }
  }
  
  /**
   * アフィリエイトリンクの統計情報を取得
   * @param {String} linkId - リンクID
   * @param {String} userId - ユーザーID
   * @param {Object} options - オプション（期間など）
   * @returns {Promise<Object>} - リンク統計情報
   */
  async getLinkStats(linkId, userId, options = {}) {
    try {
      const { startDate, endDate } = options;
      
      // アフィリエイトプロフィール取得
      const affiliateProfile = await AffiliateProfile.findOne({
        where: { userId }
      });
      
      if (!affiliateProfile) {
        throw new Error('アフィリエイトプロフィールが見つかりません');
      }
      
      // リンク取得
      const link = await AffiliateLink.findOne({
        where: {
          id: linkId,
          affiliateId: affiliateProfile.id
        },
        include: [
          {
            model: Campaign,
            attributes: ['title', 'commissionType', 'commissionAmount']
          }
        ]
      });
      
      if (!link) {
        throw new Error('アフィリエイトリンクが見つかりません');
      }
      
      // クリック・コンバージョン取得条件
      const whereClicks = {
        affiliateLinkId: linkId
      };
      
      // 期間フィルター
      if (startDate) {
        whereClicks.createdAt = whereClicks.createdAt || {};
        whereClicks.createdAt[Op.gte] = new Date(startDate);
      }
      
      if (endDate) {
        whereClicks.createdAt = whereClicks.createdAt || {};
        whereClicks.createdAt[Op.lte] = new Date(endDate);
      }
      
      // クリック情報取得
      const clicks = await TrackingClick.findAll({
        where: whereClicks,
        include: [
          {
            model: TrackingConversion
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      // 日別データの集計
      const dailyStats = this.aggregateDailyStats(clicks, link);
      
      // 集計データの作成
      const stats = {
        link,
        clicks: clicks.length,
        conversions: clicks.reduce((sum, click) => sum + click.TrackingConversions.length, 0),
        revenue: clicks.reduce((sum, click) => {
          return sum + click.TrackingConversions.reduce((convSum, conv) => convSum + parseFloat(conv.commission || 0), 0);
        }, 0),
        dailyStats,
        recentClicks: clicks.slice(0, 10) // 最新10件のみ返す
      };
      
      return stats;
    } catch (error) {
      logger.error('アフィリエイトリンク統計情報の取得に失敗しました:', error);
      throw error;
    }
  }
  
  /**
   * 日別データの集計
   * @param {Array} clicks - クリックデータ 
   * @param {Object} link - リンク情報
   * @returns {Array} - 日別集計データ
   */
  aggregateDailyStats(clicks, link) {
    // 日付でグループ化
    const groupedByDate = clicks.reduce((groups, click) => {
      const date = new Date(click.createdAt).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = {
          date,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      groups[date].clicks += 1;
      groups[date].conversions += click.TrackingConversions.length;
      groups[date].revenue += click.TrackingConversions.reduce((sum, conv) => sum + parseFloat(conv.commission || 0), 0);
      
      return groups;
    }, {});
    
    // 配列に変換して日付順にソート
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  /**
   * アフィリエイトリンクの削除
   * @param {String} linkId - リンクID
   * @param {String} userId - ユーザーID
   * @returns {Promise<Boolean>} - 削除成功時 true
   */
  async deleteAffiliateLink(linkId, userId) {
    try {
      // アフィリエイトプロフィール取得
      const affiliateProfile = await AffiliateProfile.findOne({
        where: { userId }
      });
      
      if (!affiliateProfile) {
        throw new Error('アフィリエイトプロフィールが見つかりません');
      }
      
      // リンク取得
      const link = await AffiliateLink.findOne({
        where: {
          id: linkId,
          affiliateId: affiliateProfile.id
        }
      });
      
      if (!link) {
        throw new Error('アフィリエイトリンクが見つかりません');
      }
      
      // リンク削除
      await link.destroy();
      
      return true;
    } catch (error) {
      logger.error('アフィリエイトリンクの削除に失敗しました:', error);
      throw error;
    }
  }
}

module.exports = new AffiliateLinkService();