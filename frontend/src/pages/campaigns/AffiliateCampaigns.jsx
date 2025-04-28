import React, { useState } from 'react';

// モックキャンペーンデータ
const mockCampaigns = [
  {
    id: '1',
    title: 'サマープロモーション',
    advertiser: 'BrandX',
    description: '夏向け商品のプロモーションキャンペーン。高単価の報酬が魅力です。',
    commissionType: 'cpa',
    commission: 2500,
    category: 'ファッション',
    status: 'active',
    image: 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Summer+Promotion',
    joinStatus: null,
  },
  {
    id: '2',
    title: 'スポーツシューズ販促',
    advertiser: 'SportsDirect',
    description: '新作スポーツシューズのアフィリエイトプログラム。高いコンバージョン率が特徴です。',
    commissionType: 'percentage',
    commission: 12,
    category: 'スポーツ',
    status: 'active',
    image: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Sports+Shoes',
    joinStatus: 'approved',
  },
  {
    id: '3',
    title: 'ホテル予約キャンペーン',
    advertiser: 'TravelPlus',
    description: '夏休みシーズンのホテル予約キャンペーン。国内旅行に最適です。',
    commissionType: 'cpa',
    commission: 1800,
    category: '旅行',
    status: 'active',
    image: 'https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Hotel+Booking',
    joinStatus: 'pending',
  },
  {
    id: '4',
    title: 'プレミアムサプリメント',
    advertiser: 'HealthLiving',
    description: '高品質サプリメントのアフィリエイトプログラム。リピート率が高い商品です。',
    commissionType: 'percentage',
    commission: 25,
    category: '健康',
    status: 'active',
    image: 'https://via.placeholder.com/400x200/06B6D4/FFFFFF?text=Premium+Supplements',
    joinStatus: null,
  },
];

// キャンペーンカードコンポーネント
const CampaignCard = ({ campaign, onJoin }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white bg-opacity-90 text-blue-800 shadow-sm">
            {campaign.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{campaign.advertiser}</span>
          {campaign.joinStatus === 'approved' && (
            <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-md bg-green-100 text-green-800">
              参加中
            </span>
          )}
          {campaign.joinStatus === 'pending' && (
            <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-md bg-yellow-100 text-yellow-800">
              承認待ち
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
        <p className="text-sm text-gray-600 mb-6 line-clamp-2">{campaign.description}</p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-50 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-500 mb-1">報酬</div>
            <div className="font-bold text-gray-900">
              {campaign.commissionType === 'percentage' 
                ? `${campaign.commission}%` 
                : `¥${campaign.commission.toLocaleString()}`}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-500 mb-1">タイプ</div>
            <div className="font-medium text-gray-900">
              {campaign.commissionType === 'percentage' ? '成果報酬型' : '固定報酬型'}
            </div>
          </div>
        </div>
        
        {campaign.joinStatus === null ? (
          <button
            onClick={() => onJoin(campaign.id)}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            参加する
          </button>
        ) : campaign.joinStatus === 'pending' ? (
          <button
            disabled
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg opacity-90 cursor-not-allowed"
          >
            承認待ち
          </button>
        ) : (
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
          >
            リンク生成
          </button>
        )}
      </div>
    </div>
  );
};

const AffiliateCampaigns = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [filters, setFilters] = useState({
    category: '',
    status: 'all',
    search: '',
  });
  
  // フィルター適用
  const filteredCampaigns = campaigns.filter(campaign => {
    // カテゴリフィルター
    if (filters.category && campaign.category !== filters.category) return false;
    
    // ステータスフィルター
    if (filters.status === 'joined' && !campaign.joinStatus) return false;
    if (filters.status === 'notJoined' && campaign.joinStatus) return false;
    
    // 検索フィルター
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.advertiser.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // カテゴリーリスト取得
  const categories = [...new Set(campaigns.map(c => c.category))];
  
  // キャンペーン参加処理
  const handleJoin = (campaignId) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, joinStatus: 'pending' }
        : campaign
    ));
  };
  
  // フィルター変更ハンドラー
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">キャンペーン一覧</h1>
        <p className="text-lg text-gray-600">参加可能なキャンペーンを探して、アフィリエイト活動を始めましょう。</p>
      </div>
      
      <div className="mb-10 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">検索フィルター</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                キーワード検索
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="キャンペーン名、広告主など"
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">すべてのカテゴリー</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                参加状況
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">すべて</option>
                <option value="joined">参加済み</option>
                <option value="notJoined">未参加</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">該当するキャンペーンが見つかりませんでした</h3>
          <p className="text-gray-600">検索条件を変更して、再度お試しください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onJoin={handleJoin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AffiliateCampaigns;
