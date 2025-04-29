import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（トークン添付）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラー処理、トークン期限切れ）
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // エラーメッセージを取得
    const errorMessage = error.response?.data?.message || '通信エラーが発生しました';
    
    // トークン期限切れ（401エラー）の場合、ログアウト処理
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // リフレッシュトークンがある場合はここでトークンリフレッシュ処理を実装
      
      // 現在の実装ではリフレッシュトークンがないため、ログアウト処理
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
    }
    
    // エラーを拡張してメッセージを含める
    error.displayMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

export default api;