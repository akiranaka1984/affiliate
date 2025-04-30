// frontend/src/services/auth.service.js
import api from './api';
import jwtDecode from 'jwt-decode';

/**
 * 認証関連の API サービス
 */
const AuthService = {
  /**
   * ユーザー登録
   * @param {Object} userData - 登録ユーザーデータ
   * @returns {Promise} API レスポンス
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ユーザーログイン
   * @param {Object} credentials - ログイン認証情報
   * @returns {Promise} API レスポンス
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ユーザーログアウト
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * ユーザープロフィール取得
   * @returns {Promise} API レスポンス
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * プロフィール更新
   * @param {Object} profileData - プロフィールデータ
   * @returns {Promise} API レスポンス
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      // ローカルストレージのユーザー情報も更新
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * パスワード変更
   * @param {Object} passwordData - パスワード変更データ
   * @returns {Promise} API レスポンス
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 現在のユーザー情報を取得
   * @returns {Object|null} 現在のユーザー情報
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('ユーザー情報の解析エラー:', error);
      return null;
    }
  },

  /**
   * JWT トークンが有効かチェック
   * @returns {boolean} トークンが有効な場合 true
   */
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // トークンが期限切れているかチェック
      if (decoded.exp < currentTime) {
        // 期限切れの場合、ローカルストレージをクリア
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (err) {
      // トークンのデコードに失敗した場合
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  },

  /**
   * パスワードリセットリクエスト
   * @param {Object} email - ユーザーのメールアドレス
   * @returns {Promise} API レスポンス
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/reset-password-request', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * パスワードリセット
   * @param {Object} resetData - リセットトークンと新しいパスワード
   * @returns {Promise} API レスポンス
   */
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;