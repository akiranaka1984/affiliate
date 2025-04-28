import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * 未認証ユーザーがアクセスするパブリックルートを定義するコンポーネント
 * すでに認証済みの場合は適切なダッシュボードにリダイレクト
 */
const PublicRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // 認証状態が読み込み中の場合はローディング表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 認証されているか確認
  if (isAuthenticated) {
    // すでに認証されている場合は、ロールに応じたダッシュボードにリダイレクト
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'affiliate':
        return <Navigate to="/affiliate/dashboard" replace />;
      case 'advertiser':
        return <Navigate to="/advertiser/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  // 認証されていない場合は子ルートを表示
  return <Outlet />;
};

export default PublicRoute;