// frontend/src/routes/index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import AffiliateCampaigns from '../pages/campaigns/AffiliateCampaigns';
import AffiliateLinks from '../pages/links/AffiliateLinks';
import PrivateRoute from '../components/routing/PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AuthProvider } from '../contexts/AuthContext';

/**
 * アプリケーションのルーティングを定義するコンポーネント
 * 認証状態に基づいて適切なルートへのアクセスを制御します
 */
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 公開ルート - ログインなしでアクセス可能 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ダッシュボードレイアウトを使用した保護されたルート - ログインが必要 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* ダッシュボード */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* アフィリエイト関連ページ */}
            <Route path="/affiliate/campaigns" element={<AffiliateCampaigns />} />
            <Route path="/affiliate/links" element={<AffiliateLinks />} />
            
            {/* ルートパスへのアクセスはダッシュボードにリダイレクト */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 他のルートは今後追加 */}
          </Route>
          
          {/* 定義されていないパスへのアクセスはログインページにリダイレクト */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;