import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * 認証済みユーザーのみアクセス可能なルートを定義するコンポーネント
 * 認証されていない場合はログインページにリダイレクト
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // 認証状態が読み込み中の場合はローディング表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 認証されているか確認
  if (!isAuthenticated) {
    // 認証されていない場合はログインページにリダイレクト
    return <Navigate to="/login" replace />;
  }
  
  // 認証されている場合は子ルートを表示
  return <Outlet />;
};

export default PrivateRoute;