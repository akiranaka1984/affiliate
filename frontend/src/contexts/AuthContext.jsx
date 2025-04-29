import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

// 認証コンテキストを作成
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 認証状態を管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初期化時に認証状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isTokenValid()) {
          // 有効なトークンがある場合、ユーザープロフィールを取得
          const userData = AuthService.getCurrentUser();
          
          if (userData) {
            // トークンが有効でも、最新のユーザー情報を取得
            try {
              const profile = await AuthService.getProfile();
              setUser(profile.user);
            } catch (profileError) {
              // プロフィール取得に失敗した場合はローカルストレージのデータを使用
              setUser(userData);
            }
            
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // エラー時は認証状態をリセット
        AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ログイン処理
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'ログイン中にエラーが発生しました');
      throw err;
    }
  };

  // 登録処理
  const register = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || '登録中にエラーが発生しました');
      throw err;
    }
  };

  // ログアウト処理
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // プロフィール更新処理
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await AuthService.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...response.user }));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'プロフィール更新中にエラーが発生しました');
      throw err;
    }
  };

  // パスワード変更処理
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await AuthService.changePassword(passwordData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'パスワード変更中にエラーが発生しました');
      throw err;
    }
  };

  // コンテキスト値を定義
  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};