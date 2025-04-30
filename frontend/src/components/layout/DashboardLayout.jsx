// frontend/src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Lucide Reactからのアイコンインポート
import { 
  Menu as MenuIcon,
  X as XIcon,
  Home as HomeIcon,
  Users as UsersIcon,
  CreditCard,
  Settings as CogIcon,
  Link as LinkIcon,
  LogOut as LogoutIcon,
  PieChart as ChartPieIcon,
  Bell as BellIcon,
  Search as SearchIcon,
  UserCircle as UserCircleIcon
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ユーザーロールに基づいたナビゲーション項目
  const getNavItems = () => {
    const baseNavItems = [
      { name: 'ダッシュボード', path: '/dashboard', icon: HomeIcon },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseNavItems,
        { name: 'ユーザー管理', path: '/admin/users', icon: UsersIcon },
        { name: 'キャンペーン管理', path: '/admin/campaigns', icon: ChartPieIcon },
        { name: '支払い管理', path: '/admin/payments', icon: CreditCard },
        { name: '設定', path: '/settings', icon: CogIcon },
      ];
    } else if (user?.role === 'advertiser') {
      return [
        ...baseNavItems,
        { name: 'キャンペーン管理', path: '/advertiser/campaigns', icon: ChartPieIcon },
        { name: 'アフィリエイト', path: '/advertiser/affiliates', icon: UsersIcon },
        { name: '支払い履歴', path: '/advertiser/payments', icon: CreditCard },
        { name: '設定', path: '/settings', icon: CogIcon },
      ];
    } else {
      return [
        ...baseNavItems,
        { name: 'キャンペーン一覧', path: '/affiliate/campaigns', icon: ChartPieIcon },
        { name: 'アフィリエイトリンク', path: '/affiliate/links', icon: LinkIcon },
        { name: '報酬履歴', path: '/affiliate/earnings', icon: CreditCard },
        { name: '設定', path: '/settings', icon: CogIcon },
      ];
    }
  };

  const navItems = getNavItems();

  // ログアウト処理
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* モバイルサイドバー */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-[#1a237e] to-[#0d1b42] shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Close sidebar</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-6 pb-6 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6">
              <h1 className="text-xl font-bold text-white">AffiliateHub</h1>
            </div>
            <nav className="mt-10 px-4 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-5 py-4 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-[#303f9f] text-white'
                        : 'text-indigo-100 hover:bg-[#303f9f]'
                    }`}
                  >
                    <Icon className="mr-4 h-5 w-5 text-indigo-300" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-[#303f9f] p-6">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full text-left"
            >
              <div className="flex items-center px-5 py-4 text-sm font-medium rounded-lg text-indigo-100 hover:bg-[#303f9f] transition-colors">
                <LogoutIcon className="mr-4 h-5 w-5 text-indigo-300" aria-hidden="true" />
                ログアウト
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* デスクトップサイドバー */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-[#1a237e] to-[#0d1b42]">
            <div className="flex-1 flex flex-col pt-6 pb-6 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6">
                <h1 className="text-xl font-bold text-white">AffiliateHub</h1>
              </div>
              <div className="mt-10">
                <div className="px-6 mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 text-indigo-300" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs font-medium text-indigo-200 truncate">
                        {user?.role === 'affiliate' ? 'アフィリエイト' : 
                        user?.role === 'advertiser' ? '広告主' : '管理者'}
                      </p>
                    </div>
                  </div>
                </div>
                <nav className="px-4 space-y-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group flex items-center px-5 py-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'bg-[#303f9f] text-white shadow-lg'
                            : 'text-indigo-100 hover:bg-[#303f9f] hover:text-white'
                        }`}
                      >
                        <Icon className={`mr-4 h-5 w-5 ${
                          location.pathname === item.path
                            ? 'text-white'
                            : 'text-indigo-300 group-hover:text-white'
                        }`} aria-hidden="true" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
            <div className="flex-shrink-0 p-6">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-5 py-4 text-sm font-medium rounded-lg text-white bg-[#3949ab] hover:bg-[#303f9f] transition-colors"
              >
                <LogoutIcon className="mr-4 h-5 w-5" aria-hidden="true" />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* コンテンツ */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 md:hidden text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="max-w-2xl w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    placeholder="検索..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">通知を見る</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* プロフィールドロップダウン */}
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">プロフィールメニューを開く</span>
                    <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8 px-6 sm:px-8 md:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;