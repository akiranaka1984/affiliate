import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import AffiliateCampaigns from '../pages/campaigns/AffiliateCampaigns';
import PrivateRoute from '../components/routing/PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AuthProvider } from '../contexts/AuthContext';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 公開ルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
            <Route path="/affiliate/campaigns" element={<AffiliateCampaigns />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 他のルートは今後追加 */}
          </Route>
          
          {/* その他のルート */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
