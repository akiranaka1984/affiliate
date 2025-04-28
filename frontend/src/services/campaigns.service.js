import api from './api';

/**
 * キャンペーン関連のAPIサービス
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
   * 新しいキャンペーンを作成
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
   * キャンペーンを更新
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
   * キャンペーンを削除
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
  }
};

export default CampaignService;