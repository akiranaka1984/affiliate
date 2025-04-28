import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * 特定のロールを持つユーザーのみアクセス可能なルートを定義するコンポーネント
 * 認証されていない場合はログインページに、
 * ロールが合わない場合はダッシュボードにリダイレクト
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Array} props.roles - アクセス許可するロールの配列
 */
const RoleRoute = ({ roles }) => {
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
  if (!isAuthenticated) {
    // 認証されていない場合はログインページにリダイレクト
    return <Navigate to="/login" replace />;
  }
  
  // ユーザーのロールがアクセス許可されているか確認
  if (!roles.includes(user.role)) {
    // ロールに基づいてアクセス可能なダッシュボードにリダイレクト
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
  
  // 認証され、適切なロールを持つ場合は子ルートを表示
  return <Outlet />;
};

export default RoleRoute;