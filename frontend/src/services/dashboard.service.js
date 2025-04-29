// frontend/src/services/dashboard.service.js
import api from './api';

const DashboardService = {
  /**
   * アフィリエイト向けダッシュボードデータを取得
   * @returns {Promise} API レスポンス
   */
  getAffiliateDashboard: async () => {
    try {
      const response = await api.get('/dashboard/affiliate');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * 広告主向けダッシュボードデータを取得
   * @returns {Promise} API レスポンス
   */
  getAdvertiserDashboard: async () => {
    try {
      const response = await api.get('/dashboard/advertiser');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * 管理者向けダッシュボードデータを取得
   * @returns {Promise} API レスポンス
   */
  getAdminDashboard: async () => {
    try {
      const response = await api.get('/dashboard/admin');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default DashboardService;