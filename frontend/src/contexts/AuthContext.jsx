// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { toast } from 'react-toastify';

// 認証コンテキストを作成
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 認証状態を管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初期化時に認証状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      // ローカルストレージにトークンがあるか確認
      if (AuthService.isTokenValid()) {
        try {
          // プロフィール情報を取得
          const response = await AuthService.getProfile();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('認証チェックエラー:', error);
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ログイン処理
  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('ログインに成功しました');
      return response;
    } catch (error) {
      let errorMessage = 'ログインに失敗しました';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  // 登録処理
  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('アカウント登録が完了しました');
      return response;
    } catch (error) {
      let errorMessage = 'アカウント登録に失敗しました';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  // ログアウト処理
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('ログアウトしました');
  };

  // パスワード変更処理
  const changePassword = async (passwordData) => {
    try {
      const response = await AuthService.changePassword(passwordData);
      toast.success('パスワードを変更しました');
      return response;
    } catch (error) {
      let errorMessage = 'パスワード変更に失敗しました';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  // プロフィール更新
  const updateProfile = async (profileData) => {
    try {
      const response = await AuthService.updateProfile(profileData);
      // ユーザー情報を更新
      setUser(prev => ({
        ...prev,
        ...response.user
      }));
      toast.success('プロフィールを更新しました');
      return response;
    } catch (error) {
      let errorMessage = 'プロフィール更新に失敗しました';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  // コンテキスト値を定義
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};