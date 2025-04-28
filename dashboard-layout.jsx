import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ユーザーロールに基づいたナビゲーション項目
  const getNavItems = () => {
    const baseNavItems = [
      { name: 'ダッシュボード', path: '/dashboard', icon: 'chart-bar' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseNavItems,
        { name: 'ユーザー管理', path: '/admin/users', icon: 'users' },
        { name: 'キャンペーン管理', path: '/admin/campaigns', icon: 'chart-pie' },
        { name: '支払い管理', path: '/admin/payments', icon: 'credit-card' },
        { name: '設定', path: '/settings', icon: 'cog' },
      ];
    } else if (user?.role === 'advertiser') {
      return [
        ...baseNavItems,
        { name: 'キャンペーン管理', path: '/advertiser/campaigns', icon: 'chart-pie' },
        { name: 'アフィリエイト', path: '/advertiser/affiliates', icon: 'users' },
        { name: '支払い履歴', path: '/advertiser/payments', icon: 'credit-card' },
        { name: '設定', path: '/settings', icon: 'cog' },
      ];
    } else {
      return [
        ...baseNavItems,
        { name: 'キャンペーン一覧', path: '/affiliate/campaigns', icon: 'chart-pie' },
        { name: 'アフィリエイトリンク', path: '/affiliate/links', icon: 'link' },
        { name: '報酬履歴', path: '/affiliate/earnings', icon: 'cash' },
        { name: '設定', path: '/settings', icon: 'cog' },
      ];
    }
  };

  const navItems = getNavItems();

  // ログアウト処理
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // アイコンコンポーネント
  const Icon = ({ name }) => {
    // 簡易的なアイコン表示（実際のプロジェクトではアイコンライブラリを使用）
    return (
      <span className="inline-block w-5 h-5 mr-3 bg-current opacity-80"></span>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* モバイルサイドバーオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">AffiliateHub</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block text-red-600 hover:text-red-800"
              >
                <div className="flex items-center">
                  <div>
                    <Icon name="logout" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">ログアウト</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* サイドバー（デスクトップ） */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">AffiliateHub</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group flex items-center text-sm font-medium text-red-600 hover:text-red-800"
              >
                <Icon name="logout" />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg 
              className="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.name || 'ダッシュボード'}
                </h2>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">{user?.email}</span>
                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
