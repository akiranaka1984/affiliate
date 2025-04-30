// frontend/src/services/campaign.service.js
import api from './api';

/**
 * キャンペーン関連の API サービス
 */
const CampaignService = {
  /**
   * 広告主のキャンペーン一覧を取得
   * @param {Object} options - ページネーション、検索条件
   * @returns {Promise} API レスポンス
   */
  getAdvertiserCampaigns: async (options = {}) => {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = options;
      
      const response = await api.get('/campaigns/advertiser', {
        params: { page, limit, search, status }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * アフィリエイト向けキャンペーン一覧を取得
   * @param {Object} options - ページネーション、検索条件
   * @returns {Promise} API レスポンス
   */
  getAffiliateCampaigns: async (options = {}) => {
    try {
      const { page = 1, limit = 10, search = '', category = '', joined = false } = options;
      
      const response = await api.get('/campaigns/affiliate', {
        params: { page, limit, search, category, joined }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * キャンペーンに参加する
   * @param {String} campaignId - キャンペーンID
   * @param {Object} linkData - リンクデータ（オプション）
   * @returns {Promise} API レスポンス
   */
  joinCampaign: async (campaignId, linkData = {}) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/join`, linkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * アフィリエイトリンクを生成
   * @param {String} campaignId - キャンペーンID
   * @param {Object} linkData - リンクデータ（名前、カスタムURLなど）
   * @returns {Promise} API レスポンス
   */
  generateAffiliateLink: async (campaignId, linkData = {}) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/affiliate-link`, linkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * IDによるキャンペーン取得
   * @param {String} id - キャンペーンID
   * @returns {Promise} API レスポンス
   */
  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * 新しいキャンペーンを作成（広告主用）
   * @param {Object} campaignData - キャンペーンデータ
   * @returns {Promise} API レスポンス
   */
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * キャンペーンを更新（広告主用）
   * @param {String} id - キャンペーンID
   * @param {Object} campaignData - 更新するキャンペーンデータ
   * @returns {Promise} API レスポンス
   */
  updateCampaign: async (id, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * キャンペーンを削除（広告主用）
   * @param {String} id - キャンペーンID
   * @returns {Promise} API レスポンス
   */
  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * キャンペーンの統計情報を取得（広告主用）
   * @param {String} id - キャンペーンID
   * @param {Object} options - フィルターオプション
   * @returns {Promise} API レスポンス
   */
  getCampaignStats: async (id, options = {}) => {
    try {
      const { startDate, endDate } = options;
      const response = await api.get(`/campaigns/${id}/stats`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * カテゴリ一覧を取得
   * @returns {Promise} API レスポンス
   */
  getCategories: async () => {
    try {
      const response = await api.get('/campaigns/meta/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * アフィリエイトリンク一覧を取得（アフィリエイト用）
   * @param {Object} options - ページネーション、検索条件
   * @returns {Promise} API レスポンス
   */
  getAffiliateLinks: async (options = {}) => {
    try {
      const { page = 1, limit = 10, search = '', campaignId = '' } = options;
      const response = await api.get('/affiliate-links', {
        params: { page, limit, search, campaignId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * アフィリエイトリンクの統計情報を取得（アフィリエイト用）
   * @param {String} linkId - リンクID
   * @param {Object} options - フィルターオプション
   * @returns {Promise} API レスポンス
   */
  getLinkStats: async (linkId, options = {}) => {
    try {
      const { startDate, endDate } = options;
      const response = await api.get(`/affiliate-links/${linkId}/stats`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * アフィリエイトリンクを削除
   * @param {String} linkId - リンクID
   * @returns {Promise} API レスポンス
   */
  deleteAffiliateLink: async (linkId) => {
    try {
      const response = await api.delete(`/affiliate-links/${linkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default CampaignService;