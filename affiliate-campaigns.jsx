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
    image: 'https://via.placeholder.com/150',
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
    image: 'https://via.placeholder.com/150',
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
    image: 'https://via.placeholder.com/150',
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
    image: 'https://via.placeholder.com/150',
    joinStatus: null,
  },
];

// キャンペーンカードコンポーネント
const CampaignCard = ({ campaign, onJoin }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
            {campaign.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{campaign.advertiser}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-1">報酬:</span>
            <span className="text-sm font-bold text-gray-900">
              {campaign.commissionType === 'percentage' 
                ? `${campaign.commission}%` 
                : `¥${campaign.commission.toLocaleString()}`}
            </span>
          </div>
          <span className="text-xs font-medium">
            {campaign.commissionType === 'percentage' ? '成果報酬型' : '固定報酬型'}
          </span>
        </div>
        
        {campaign.joinStatus === null ? (
          <button
            onClick={() => onJoin(campaign.id)}
            className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            参加する
          </button>
        ) : campaign.joinStatus === 'pending' ? (
          <button
            disabled
            className="w-full py-2 px-4 bg-yellow-500 text-white text-sm font-medium rounded-md cursor-not-allowed"
          >
            承認待ち
          </button>
        ) : (
          <button
            className="w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">キャンペーン一覧</h1>
        <p className="text-gray-600">参加可能なキャンペーンを探して、アフィリエイト活動を始めましょう。</p>
      </div>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              キーワード検索
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="キャンペーン名、広告主など"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリー
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">すべてのカテゴリー</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              参加状況
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">すべて</option>
              <option value="joined">参加済み</option>
              <option value="notJoined">未参加</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">該当するキャンペーンが見つかりませんでした。</p>
          <p className="text-gray-500 mt-2">別の検索条件をお試しください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
