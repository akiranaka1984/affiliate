import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// モックデータ - 実際の実装ではAPIから取得
const getMockData = (role) => {
  if (role === 'affiliate') {
    return {
      stats: {
        clicks: 1247,
        conversions: 89,
        earnings: 145800,
        pendingPayments: 43200
      },
      recentActivity: [
        { id: 1, type: 'click', campaign: 'サマープロモーション', date: '2025-04-28', amount: null },
        { id: 2, type: 'conversion', campaign: 'スポーツシューズ販促', date: '2025-04-27', amount: 3600 },
        { id: 3, type: 'conversion', campaign: 'サマープロモーション', date: '2025-04-27', amount: 2500 },
        { id: 4, type: 'payment', campaign: null, date: '2025-04-25', amount: 52000 },
        { id: 5, type: 'click', campaign: 'プレミアムサプリメント', date: '2025-04-24', amount: null }
      ],
      campaigns: [
        { id: 1, name: 'サマープロモーション', clicks: 523, conversions: 41, earnings: 102500 },
        { id: 2, name: 'スポーツシューズ販促', clicks: 427, conversions: 23, earnings: 27600 },
        { id: 3, name: 'プレミアムサプリメント', clicks: 297, conversions: 25, earnings: 15700 }
      ]
    };
  } else if (role === 'advertiser') {
    return {
      stats: {
        impressions: 42568,
        clicks: 3721,
        conversions: 246,
        spent: 568700
      },
      recentActivity: [
        { id: 1, type: 'conversion', campaign: 'サマープロモーション', date: '2025-04-28', amount: 2500 },
        { id: 2, type: 'payment', campaign: null, date: '2025-04-26', amount: 150000 },
        { id: 3, type: 'conversion', campaign: 'スポーツシューズ販促', date: '2025-04-25', amount: 3600 },
        { id: 4, type: 'campaign', campaign: 'ホテル予約キャンペーン', date: '2025-04-25', amount: null },
        { id: 5, type: 'conversion', campaign: 'サマープロモーション', date: '2025-04-23', amount: 2500 }
      ],
      campaigns: [
        { id: 1, name: 'サマープロモーション', clicks: 1852, conversions: 132, spent: 330000 },
        { id: 2, name: 'スポーツシューズ販促', clicks: 978, conversions: 53, spent: 190800 },
        { id: 3, name: 'ホテル予約キャンペーン', clicks: 891, conversions: 61, spent: 109800 }
      ]
    };
  } else {
    // Admin role
    return {
      stats: {
        users: 687,
        campaigns: 124,
        transactions: 9865,
        revenue: 1458000
      },
      recentActivity: [
        { id: 1, type: 'user', user: 'yamada@example.com', role: 'affiliate', date: '2025-04-28' },
        { id: 2, type: 'campaign', campaign: 'ホテル予約キャンペーン', advertiser: 'TravelPlus', date: '2025-04-27' },
        { id: 3, type: 'payment', to: 'tanaka@example.com', amount: 52000, date: '2025-04-26' },
        { id: 4, type: 'payment', from: 'suzuki@example.com', amount: 150000, date: '2025-04-25' },
        { id: 5, type: 'user', user: 'suzuki@example.com', role: 'advertiser', date: '2025-04-24' }
      ]
    };
  }
};

// 統計カードコンポーネント
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.replace('border-', 'bg-').replace('-600', '-100')} ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// 活動履歴アイテムコンポーネント
const ActivityItem = ({ item, role }) => {
  // 活動タイプに応じたアイコンと色
  const getTypeInfo = (type) => {
    switch (type) {
      case 'click':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
          ),
          color: 'text-blue-600 bg-blue-100'
        };
      case 'conversion':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          color: 'text-green-600 bg-green-100'
        };
      case 'payment':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          ),
          color: 'text-purple-600 bg-purple-100'
        };
      case 'campaign':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          color: 'text-yellow-600 bg-yellow-100'
        };
      case 'user':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ),
          color: 'text-indigo-600 bg-indigo-100'
        };
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          ),
          color: 'text-gray-600 bg-gray-100'
        };
    }
  };

  const { icon, color } = getTypeInfo(item.type);
  
  // 活動内容の説明
  const getDescription = () => {
    if (role === 'affiliate') {
      switch (item.type) {
        case 'click':
          return `「${item.campaign}」にクリックが発生しました`;
        case 'conversion':
          return `「${item.campaign}」で成約が発生しました`;
        case 'payment':
          return `¥${item.amount.toLocaleString()}の報酬が支払われました`;
        default:
          return '不明なアクティビティ';
      }
    } else if (role === 'advertiser') {
      switch (item.type) {
        case 'conversion':
          return `「${item.campaign}」で成約が発生しました`;
        case 'payment':
          return `¥${item.amount.toLocaleString()}の支払いが完了しました`;
        case 'campaign':
          return `「${item.campaign}」キャンペーンが承認されました`;
        default:
          return '不明なアクティビティ';
      }
    } else {
      // Admin role
      switch (item.type) {
        case 'user':
          return `${item.role === 'affiliate' ? 'アフィリエイト' : '広告主'}「${item.user}」が登録しました`;
        case 'campaign':
          return `「${item.campaign}」キャンペーンが「${item.advertiser}」により作成されました`;
        case 'payment':
          return item.to 
            ? `「${item.to}」へ¥${item.amount.toLocaleString()}の支払いが完了しました` 
            : `「${item.from}」から¥${item.amount.toLocaleString()}の入金がありました`;
        default:
          return '不明なアクティビティ';
      }
    }
  };

  return (
    <div className="flex items-start py-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${color} mr-3`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-900">{getDescription()}</p>
        <p className="text-xs text-gray-500">{item.date}</p>
      </div>
    </div>
  );
};

// キャンペーン概要テーブル行コンポーネント
const CampaignRow = ({ campaign, role }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{campaign.clicks.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{campaign.conversions.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ¥{(role === 'affiliate' ? campaign.earnings : campaign.spent).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Link
          to={`/${role}/campaigns/${campaign.id}`}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          詳細
        </Link>
      </td>
    </tr>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // APIからデータを取得（モック）
    const fetchData = () => {
      try {
        // 実際の実装ではAPIリクエストになる
        const data = getMockData(user?.role);
        setDashboardData(data);
      } catch (error) {
        console.error('ダッシュボードデータの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);
  
  // ロール別の統計カード設定
  const getStatCards = () => {
    if (!dashboardData) return [];
    
    if (user?.role === 'affiliate') {
      return [
        {
          title: '総クリック数',
          value: dashboardData.stats.clicks.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          ),
          color: 'border-blue-600'
        },
        {
          title: '成約数',
          value: dashboardData.stats.conversions.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'border-green-600'
        },
        {
          title: '獲得報酬',
          value: `¥${dashboardData.stats.earnings.toLocaleString()}`,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'border-purple-600'
        },
        {
          title: '保留中の報酬',
          value: `¥${dashboardData.stats.pendingPayments.toLocaleString()}`,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'border-yellow-600'
        }
      ];
    } else if (user?.role === 'advertiser') {
      return [
        {
          title: 'インプレッション',
          value: dashboardData.stats.impressions.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ),
          color: 'border-blue-600'
        },
        {
          title: 'クリック数',
          value: dashboardData.stats.clicks.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          ),
          color: 'border-green-600'
        },
        {
          title: '成約数',
          value: dashboardData.stats.conversions.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'border-indigo-600'
        },
        {
          title: '総支出',
          value: `¥${dashboardData.stats.spent.toLocaleString()}`,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'border-purple-600'
        }
      ];
    } else {
      // Admin role
      return [
        {
          title: '総ユーザー数',
          value: dashboardData.stats.users.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          color: 'border-blue-600'
        },
        {
          title: 'キャンペーン数',
          value: dashboardData.stats.campaigns.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
          color: 'border-green-600'
        },
        {
          title: '取引数',
          value: dashboardData.stats.transactions.toLocaleString(),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          color: 'border-indigo-600'
        },
        {
          title: '総収益',
          value: `¥${dashboardData.stats.revenue.toLocaleString()}`,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'border-purple-600'
        }
      ];
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-l-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
        <p className="text-gray-600">
          {user?.role === 'affiliate' 
            ? 'あなたのアフィリエイト活動の概要を確認できます。' 
            : user?.role === 'advertiser'
              ? 'キャンペーンのパフォーマンスと統計情報を確認できます。'
              : 'プラットフォーム全体の統計情報と活動を確認できます。'}
        </p>
      </div>
      
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getStatCards().map((card, index) => (
          <StatCard 
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 最近の活動 */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近の活動</h2>
          <div className="divide-y divide-gray-200">
            {dashboardData.recentActivity.map((activity, index) => (
              <ActivityItem key={index} item={activity} role={user?.role} />
            ))}
          </div>
        </div>
        
        {/* キャンペーン概要 */}
        {(user?.role === 'affiliate' || user?.role === 'advertiser') && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">パフォーマンス上位のキャンペーン</h2>
                <Link
                  to={`/${user?.role}/campaigns`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  すべて表示
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      キャンペーン名
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      クリック数
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      成約数
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {user?.role === 'affiliate' ? '獲得報酬' : '支出'}
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">詳細</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.campaigns.map((campaign) => (
                    <CampaignRow key={campaign.id} campaign={campaign} role={user?.role} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* 管理者向けの追加コンテンツ */}
        {user?.role === 'admin' && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">システム概要</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    管理者ダッシュボードは開発中です。今後のリリースでさらに多くの機能が追加される予定です。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;