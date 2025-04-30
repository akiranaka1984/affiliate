// frontend/src/pages/campaigns/AffiliateCampaigns.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CampaignService from '../../services/campaign.service';
import { Search } from 'lucide-react';

// キャンペーンカードコンポーネント
const CampaignCard = ({ campaign, onJoin }) => {
  // キャンペーンの状態に基づくボタン表示を決定
  const getActionButton = () => {
    if (campaign.joinStatus === null) {
      return (
        <button
          onClick={() => onJoin(campaign.id)}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          参加する
        </button>
      );
    } else if (campaign.joinStatus === 'pending') {
      return (
        <button
          disabled
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg opacity-90 cursor-not-allowed"
        >
          承認待ち
        </button>
      );
    } else {
      return (
        <button
          onClick={() => window.location.href = `/affiliate/links?campaignId=${campaign.id}`}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
        >
          リンク生成
        </button>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={campaign.image || `https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(campaign.title)}`} 
          alt={campaign.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(campaign.title)}`;
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white bg-opacity-90 text-blue-800 shadow-sm">
            {campaign.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {campaign.advertiser?.companyName || campaign.advertiser}
          </span>
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
                ? `${campaign.commissionAmount}%` 
                : `¥${parseInt(campaign.commissionAmount).toLocaleString()}`}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-500 mb-1">タイプ</div>
            <div className="font-medium text-gray-900">
              {campaign.commissionType === 'percentage' ? '成果報酬型' : '固定報酬型'}
            </div>
          </div>
        </div>
        
        {getActionButton()}
      </div>
    </div>
  );
};

// キャンペーン一覧が空の場合に表示するコンポーネント
const EmptyCampaignState = ({ filters }) => {
  return (
    <div className="bg-white p-12 rounded-xl shadow-md text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">該当するキャンペーンが見つかりませんでした</h3>
      <p className="text-gray-600">
        {filters.search ? 
          `「${filters.search}」に一致するキャンペーンはありません。` : 
          'フィルター条件を変更して、再度お試しください。'}
      </p>
    </div>
  );
};

// メインコンポーネント
const AffiliateCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: 'all',
    search: '',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);

  // キャンペーン一覧を取得
  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { category, status, search, page, limit } = filters;
      const joined = status === 'joined' ? true : undefined;
      
      // APIからキャンペーン一覧を取得
      const response = await CampaignService.getAffiliateCampaigns({
        page,
        limit,
        search,
        category,
        joined
      });
      
      setCampaigns(response.campaigns);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError('キャンペーン一覧の読み込みに失敗しました');
      toast.error('キャンペーン一覧の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // カテゴリ一覧を取得
  const fetchCategories = async () => {
    try {
      const categories = await CampaignService.getCategories();
      setCategories(categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // コンポーネントマウント時に初期データを取得
  useEffect(() => {
    fetchCampaigns();
    fetchCategories();
  }, []);

  // フィルター変更時にキャンペーン一覧を再取得
  useEffect(() => {
    fetchCampaigns();
  }, [filters.category, filters.status, filters.page]);

  // キャンペーン参加処理
  const handleJoin = async (campaignId) => {
    try {
      setLoading(true);
      await CampaignService.joinCampaign(campaignId);
      toast.success('キャンペーンへの参加リクエストを送信しました');
      
      // キャンペーン一覧を再取得して状態を更新
      await fetchCampaigns();
    } catch (err) {
      console.error('Failed to join campaign:', err);
      let errorMessage = 'キャンペーンへの参加に失敗しました';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // フィルター変更ハンドラー
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // フィルター変更時は1ページ目に戻す
    }));
  };

  // 検索実行ハンドラー
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  // ページ変更ハンドラー
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
    }
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
              <form onSubmit={handleSearch} className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
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
                <button type="submit" className="hidden">検索</button>
              </form>
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
      
      {/* ローディングインジケーター */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* エラーメッセージ */}
      {error && !loading && (
        <div className="bg-red-50 p-4 rounded-xl shadow-md mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>ページを更新するか、しばらくしてからお試しください。</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* キャンペーン一覧 */}
      {!loading && !error && (
        <>
          {campaigns.length === 0 ? (
            <EmptyCampaignState filters={filters} />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map(campaign => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  onJoin={handleJoin}
                />
              ))}
            </div>
          )}
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">前へ</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {filters.page} / {totalPages}
                </div>
                
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">次へ</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AffiliateCampaigns;