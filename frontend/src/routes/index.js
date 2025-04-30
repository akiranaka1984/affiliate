// frontend/src/routes/index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import AffiliateCampaigns from '../pages/campaigns/AffiliateCampaigns';
import AffiliateLinks from '../pages/affiliate/AffiliateLinks';
import ProfileSettings from '../pages/settings/ProfileSettings';
import PrivateRoute from '../components/routing/PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AuthProvider } from '../contexts/AuthContext';
import AdvertiserCampaigns from '../pages/advertiser/AdvertiserCampaigns';
import CreateCampaign from '../pages/advertiser/CreateCampaign';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 公開ルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* ダッシュボードレイアウトを使用した保護されたルート */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* アフィリエイト向けルート */}
            <Route path="/affiliate/campaigns" element={<AffiliateCampaigns />} />
            <Route path="/affiliate/links" element={<AffiliateLinks />} />
            
            {/* 広告主向けルート */}
            <Route path="/advertiser/campaigns" element={<AdvertiserCampaigns />} />
            <Route path="/advertiser/campaigns/create" element={<CreateCampaign />} />
            
            {/* 共通設定ルート */}
            <Route path="/settings" element={<ProfileSettings />} />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          {/* その他のルート */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;