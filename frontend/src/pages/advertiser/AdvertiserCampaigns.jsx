// frontend/src/pages/advertiser/AdvertiserCampaigns.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// モックデータ
const mockCampaigns = [
  {
    id: '1',
    title: 'サマープロモーション',
    description: '夏向け商品のプロモーションキャンペーン。',
    status: 'active',
    createdAt: '2025-03-15',
    stats: {
      impressions: 18523,
      clicks: 1852,
      conversions: 132,
      spent: 330000
    }
  },
  {
    id: '2',
    title: 'スポーツシューズ販促',
    description: '新作スポーツシューズのアフィリエイトプログラム。',
    status: 'active',
    createdAt: '2025-04-02',
    stats: {
      impressions: 9456,
      clicks: 978,
      conversions: 53,
      spent: 190800
    }
  },
  {
    id: '3',
    title: 'ホテル予約キャンペーン',
    description: '夏休みシーズンのホテル予約キャンペーン。',
    status: 'draft',
    createdAt: '2025-04-18',
    stats: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spent: 0
    }
  }
];

const AdvertiserCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  
  useEffect(() => {
    // APIリクエストの代わりにモックデータを使用
    const fetchCampaigns = () => {
      setTimeout(() => {
        setCampaigns(mockCampaigns);
        setLoading(false);
      }, 800);
    };
    
    fetchCampaigns();
  }, []);
  
  // フィルタリングされたキャンペーン
  const filteredCampaigns = campaigns.filter(campaign => {
    // ステータスフィルター
    if (status !== 'all' && campaign.status !== status) {
      return false;
    }
    
    // 検索フィルター
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // ステータスバッジコンポーネント
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
    
    switch (status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = '実行中';
        break;
      case 'draft':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = '下書き';
        break;
      case 'paused':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = '一時停止';
        break;
      case 'completed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        label = '完了';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = status;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">キャンペーン管理</h1>
          <p className="text-gray-600">アフィリエイトキャンペーンを作成・管理できます。</p>
        </div>
        
        <Link
          to="/advertiser/campaigns/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          新しいキャンペーンを作成
        </Link>
      </div>
      
      {/* 検索・フィルター */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="キャンペーン名、説明で検索"
              />
            </div>
          </div>
          
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">実行中</option>
              <option value="draft">下書き</option>
              <option value="paused">一時停止</option>
              <option value="completed">完了</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* キャンペーン一覧 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">キャンペーンが見つかりません</h3>
          <p className="mt-1 text-gray-500">フィルター条件に一致するキャンペーンがありません。</p>
          <div className="mt-6">
            <Link
              to="/advertiser/campaigns/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              新しいキャンペーンを作成
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{campaign.title}</h3>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{campaign.description}</p>
                    <p className="mt-2 text-xs text-gray-500">作成日: {campaign.createdAt}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/advertiser/campaigns/${campaign.id}/edit`)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => navigate(`/advertiser/campaigns/${campaign.id}`)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      詳細
                    </button>
                  </div>
                </div>
                
                {/* キャンペーン統計情報 */}
                {campaign.status !== 'draft' && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">インプレッション</p>
                      <p className="font-semibold text-gray-900">{campaign.stats.impressions.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">クリック数</p>
                      <p className="font-semibold text-gray-900">{campaign.stats.clicks.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">コンバージョン数</p>
                      <p className="font-semibold text-gray-900">{campaign.stats.conversions.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">合計支出</p>
                      <p className="font-semibold text-gray-900">¥{campaign.stats.spent.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertiserCampaigns;