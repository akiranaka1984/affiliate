import React, { createContext, useState, useEffect } from 'react';

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
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 仮実装: トークンがあれば認証済みとする
          const userStr = localStorage.getItem('user');
          if (userStr) {
            setUser(JSON.parse(userStr));
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          // 認証エラー時はローカルストレージをクリア
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ログイン処理
  const login = async (credentials) => {
    try {
      // API呼び出し（仮実装）
      // 本来はここでバックエンドAPIにリクエストを送る
      console.log('Login with:', credentials);
      
      // 仮のユーザーデータとトークン
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123',
          email: credentials.email,
          name: 'Test User',
          role: credentials.email.includes('admin') ? 'admin' : 
                 credentials.email.includes('advertiser') ? 'advertiser' : 'affiliate'
        }
      };
      
      // トークンとユーザー情報を保存
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      return mockResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 登録処理
  const register = async (userData) => {
    try {
      // API呼び出し（仮実装）
      console.log('Register with:', userData);
      
      // 仮のユーザーデータとトークン
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123',
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          role: userData.role
        }
      };
      
      // トークンとユーザー情報を保存
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      return mockResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // コンテキスト値を定義
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
