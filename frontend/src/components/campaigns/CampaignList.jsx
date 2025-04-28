import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import CampaignCard from './CampaignCard';
import CampaignService from '../../services/campaigns.service';
import { toast } from 'react-toastify';

const CampaignList = ({ userRole, onCreateClick, onCampaignClick }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [joined, setJoined] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (userRole === 'advertiser') {
        // 広告主向けキャンペーン一覧取得
        result = await CampaignService.getAdvertiserCampaigns({
          page,
          limit: 10,
          search,
          status
        });
      } else if (userRole === 'affiliate') {
        // アフィリエイト向けキャンペーン一覧取得
        result = await CampaignService.getAffiliateCampaigns({
          page,
          limit: 10,
          search,
          category,
          joined
        });
      }
      
      setCampaigns(result.campaigns);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError('キャンペーン一覧の読み込みに失敗しました');
      toast.error('キャンペーン一覧の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await CampaignService.getCategories();
      setCategories(categoriesList);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadCampaigns();
    
    if (userRole === 'affiliate') {
      loadCategories();
    }
  }, [userRole, page, status, category, joined]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchTerm);
    setPage(1);
    loadCampaigns();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setStatus(value);
    } else if (name === 'category') {
      setCategory(value);
    } else if (name === 'joined') {
      setJoined(e.target.checked);
    }
    
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {userRole === 'advertiser' ? 'My Campaigns' : 'Available Campaigns'}
        </h2>
        
        {userRole === 'advertiser' && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            <Plus className="h-5 w-5" />
            <span>Create Campaign</span>
          </button>
        )}
      </div>
      
      {/* 検索・フィルターセクション */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 検索フォーム */}
          <div className="flex-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-0 top-0 mt-2 ml-3 text-gray-400"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          {/* フィルター */}
          <div className="flex flex-col sm:flex-row gap-4">
            {userRole === 'advertiser' && (
              <div className="relative">
                <select
                  name="status"
                  value={status}
                  onChange={handleFilterChange}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            )}
            
            {userRole === 'affiliate' && (
              <>
                <div className="relative">
                  <select
                    name="category"
                    value={category}
                    onChange={handleFilterChange}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="joined"
                    name="joined"
                    checked={joined}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="joined" className="text-sm text-gray-700">
                    My Campaigns
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* キャンペーンリスト */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-500 text-lg">No campaigns found</p>
            {userRole === 'advertiser' && (
              <button
                onClick={onCreateClick}
                className="mt-4 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Campaign</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                userRole={userRole}
                onClick={() => onCampaignClick(campaign.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* ページネーション */}
      {!loading && campaigns.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>
          
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;