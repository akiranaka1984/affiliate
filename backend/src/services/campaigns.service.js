const { Campaign } = require('../models/campaign.model');
const { AdvertiserProfile } = require('../models/advertiser.model');
const { AffiliateProfile } = require('../models/affiliate.model');
const { AffiliateLink } = require('../models/affiliate-link.model');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * キャンペーンサービス
 * キャンペーン関連のビジネスロジックを提供
 */
class CampaignService {
  /**
   * 新しいキャンペーンを作成
   * @param {Object} campaignData - キャンペーンデータ
   * @param {String} advertiserId - 広告主ID
   * @returns {Promise<Object>} 作成されたキャンペーン
   */
  async createCampaign(campaignData, advertiserId) {
    try {
      // 広告主プロフィールの存在確認
      const advertiserProfile = await AdvertiserProfile.findOne({
        where: { userId: advertiserId }
      });
      
      if (!advertiserProfile) {
        throw new Error('広告主プロフィールが見つかりません');
      }
      
      // キャンペーン作成
      const campaign = await Campaign.create({
        ...campaignData,
        advertiserId: advertiserProfile.id
      });
      
      return campaign;
    } catch (error) {
      logger.error('キャンペーン作成エラー:', error);
      throw error;
    }
  }
  
  /**
   * キャンペーンを更新
   * @param {String} id - キャンペーンID
   * @param {Object} campaignData - 更新するキャンペーンデータ
   * @param {String} advertiserId - 広告主ID
   * @returns {Promise<Object>} 更新されたキャンペーン
   */
  async updateCampaign(id, campaignData, advertiserId) {
    try {
      // 広告主に属するキャンペーンか確認
      const campaign = await this.getCampaignById(id);
      
      if (!campaign) {
        throw new Error('キャンペーンが見つかりません');
      }
      
      const advertiserProfile = await AdvertiserProfile.findOne({
        where: { userId: advertiserId }
      });
      
      if (campaign.advertiserId !== advertiserProfile.id) {
        throw new Error('このキャンペーンを更新する権限がありません');
      }
      
      // キャンペーン更新
      await campaign.update(campaignData);
      
      return campaign;
    } catch (error) {
      logger.error('キャンペーン更新エラー:', error);
      throw error;
    }
  }
  
  /**
   * キャンペーンを削除
   * @param {String} id - キャンペーンID
   * @param {String} advertiserId - 広告主ID
   * @returns {Promise<Boolean>} 削除成功時 true
   */
  async deleteCampaign(id, advertiserId) {
    try {
      // 広告主に属するキャンペーンか確認
      const campaign = await this.getCampaignById(id);
      
      if (!campaign) {
        throw new Error('キャンペーンが見つかりません');
      }
      
      const advertiserProfile = await AdvertiserProfile.findOne({
        where: { userId: advertiserId }
      });
      
      if (campaign.advertiserId !== advertiserProfile.id) {
        throw new Error('このキャンペーンを削除する権限がありません');
      }
      
      // キャンペーン削除
      await campaign.destroy();
      
      return true;
    } catch (error) {
      logger.error('キャンペーン削除エラー:', error);
      throw error;
    }
  }
  
  /**
   * IDによるキャンペーン取得
   * @param {String} id - キャンペーンID
   * @returns {Promise<Object>} キャンペーン
   */
  async getCampaignById(id) {
    try {
      const campaign = await Campaign.findByPk(id, {
        include: [
          {
            model: AdvertiserProfile,
            attributes: ['id', 'companyName', 'website', 'logo']
          }
        ]
      });
      
      return campaign;
    } catch (error) {
      logger.error('キャンペーン取得エラー:', error);
      throw error;
    }
  }
  
  /**
   * すべてのキャンペーンを取得（広告主向け）
   * @param {String} advertiserId - 広告主ID
   * @param {Object} options - ページネーションと検索オプション
   * @returns {Promise<Object>} キャンペーンリスト
   */
  async getAdvertiserCampaigns(advertiserId, options = {}) {
    try {
      const { page = 1, limit = 10, search = '', status } = options;
      const offset = (page - 1) * limit;
      
      const advertiserProfile = await AdvertiserProfile.findOne({
        where: { userId: advertiserId }
      });
      
      if (!advertiserProfile) {
        throw new Error('広告主プロフィールが見つかりません');
      }
      
      const where = {
        advertiserId: advertiserProfile.id
      };
      
      // 検索条件がある場合
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      // ステータスフィルタがある場合
      if (status) {
        where.status = status;
      }
      
      const include = [
        {
          model: AdvertiserProfile,
          attributes: ['id', 'companyName', 'website', 'logo']
        }
      ];
      
      const { count, rows } = await Campaign.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include
      });
      
      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        campaigns: rows
      };
    } catch (error) {
      logger.error('広告主キャンペーン取得エラー:', error);
      throw error;
    }
  }
  
  /**
   * アフィリエイト向けのキャンペーンを取得
   * @param {String} affiliateId - アフィリエイトID
   * @param {Object} options - ページネーションと検索オプション
   * @returns {Promise<Object>} キャンペーンリスト
   */
  async getAffiliateCampaigns(affiliateId, options = {}) {
    try {
      const { page = 1, limit = 10, search = '', category, joined = false } = options;
      const offset = (page - 1) * limit;
      
      const affiliateProfile = await AffiliateProfile.findOne({
        where: { userId: affiliateId }
      });
      
      if (!affiliateProfile) {
        throw new Error('アフィリエイトプロフィールが見つかりません');
      }
      
      // 基本的な検索条件（アクティブで公開されているキャンペーン）
      const where = {
        status: 'active',
        isPublic: true
      };
      
      // 検索条件がある場合
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      // カテゴリフィルタがある場合
      if (category) {
        where.category = category;
      }
      
      // 参加済みキャンペーンのみを取得
      let include = [
        {
          model: AdvertiserProfile,
          attributes: ['id', 'companyName', 'website', 'logo']
        }
      ];
      
      // 参加済みキャンペーンのみを取得するオプション
      if (joined) {
        include.push({
          model: AffiliateLink,
          required: true,
          where: {
            affiliateId: affiliateProfile.id
          },
          attributes: ['id', 'trackingCode', 'status']
        });
      }
      
      const { count, rows } = await Campaign.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include
      });
      
      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        campaigns: rows
      };
    } catch (error) {
      logger.error('アフィリエイトキャンペーン取得エラー:', error);
      throw error;
    }
  }
  
  /**
   * アフィリエイトリンクを生成
   * @param {String} campaignId - キャンペーンID
   * @param {String} affiliateId - アフィリエイトID
   * @param {Object} linkData - リンクデータ
   * @returns {Promise<Object>} 生成されたアフィリエイトリンク
   */
  async generateAffiliateLink(campaignId, affiliateId, linkData = {}) {
    try {
      // トランザクション開始
      const result = await sequelize.transaction(async (t) => {
        // キャンペーンの存在確認
        const campaign = await Campaign.findByPk(campaignId, { transaction: t });
        
        if (!campaign) {
          throw new Error('キャンペーンが見つかりません');
        }
        
        if (campaign.status !== 'active') {
          throw new Error('このキャンペーンは現在アクティブではありません');
        }
        
        // アフィリエイトプロフィールの存在確認
        const affiliateProfile = await AffiliateProfile.findOne({
          where: { userId: affiliateId },
          transaction: t
        });
        
        if (!affiliateProfile) {
          throw new Error('アフィリエイトプロフィールが見つかりません');
        }
        
        // 既存のリンクがあるか確認
        const existingLink = await AffiliateLink.findOne({
          where: {
            campaignId: campaign.id,
            affiliateId: affiliateProfile.id
          },
          transaction: t
        });
        
        if (existingLink) {
          throw new Error('このキャンペーンのアフィリエイトリンクは既に存在します');
        }
        
        // トラッキングコード生成
        const trackingCode = this.generateTrackingCode(campaign.id, affiliateProfile.id);
        
        // 承認が必要かどうかを確認
        const status = campaign.approvalRequired ? 'pending' : 'approved';
        
        // アフィリエイトリンク作成
        const affiliateLink = await AffiliateLink.create({
          affiliateId: affiliateProfile.id,
          campaignId: campaign.id,
          trackingCode,
          status,
          name: linkData.name || campaign.title,
          customUrl: linkData.customUrl || null
        }, { transaction: t });
        
        return affiliateLink;
      });
      
      return result;
    } catch (error) {
      logger.error('アフィリエイトリンク生成エラー:', error);
      throw error;
    }
  }
  
  /**
   * トラッキングコードを生成
   * @param {String} campaignId - キャンペーンID
   * @param {String} affiliateId - アフィリエイトID
   * @returns {String} 生成されたトラッキングコード
   */
  generateTrackingCode(campaignId, affiliateId) {
    // UUID の最初の8文字を使用
    const campaignShort = campaignId.substring(0, 8);
    const affiliateShort = affiliateId.substring(0, 8);
    
    // タイムスタンプを追加（衝突を避けるため）
    const timestamp = new Date().getTime().toString(36);
    
    // トラッキングコードを作成
    return `${campaignShort}${affiliateShort}${timestamp}`;
  }
  
  /**
   * カテゴリ一覧を取得
   * @returns {Promise<Array>} カテゴリリスト
   */
  async getCategories() {
    try {
      const campaigns = await Campaign.findAll({
        attributes: ['category'],
        where: {
          category: {
            [Op.not]: null
          }
        },
        group: ['category']
      });
      
      return campaigns.map(c => c.category).filter(Boolean);
    } catch (error) {
      logger.error('カテゴリ取得エラー:', error);
      throw error;
    }
  }

  
}

module.exports = new CampaignService();