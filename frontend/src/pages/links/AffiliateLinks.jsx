// frontend/src/pages/links/AffiliateLinks.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Link as LinkIcon, Copy, ExternalLink, Trash2 } from 'lucide-react';
import CampaignService from '../../services/campaign.service';

// リンクアイテムコンポーネント
const LinkItem = ({ link, onCopy, onDelete }) => {
  // リンクの状態に応じたスタイルとラベルを設定
  const getStatusBadge = () => {
    switch(link.status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">承認済み</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">承認待ち</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">拒否</span>;
      default:
        return null;
    }
  };

  // トラッキングリンクのURL生成（実際の環境に合わせて調整）
  const trackingUrl = `${window.location.origin}/click/${link.trackingCode}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 truncate">{link.name || link.campaign.title}</h3>
          {getStatusBadge()}
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {link.campaign.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            {link.campaign.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
            {link.campaign.commissionType === 'percentage' 
              ? `${link.campaign.commissionAmount}%` 
              : `¥${parseInt(link.campaign.commissionAmount).toLocaleString()}`}
          </span>
        </div>
        
        <div className="relative mt-4 mb-2">
          <div className="flex items-center">
            <input
              type="text"
              value={trackingUrl}
              readOnly
              className="block w-full pr-10 py-2 pl-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm overflow-x-auto"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                onClick={() => onCopy(trackingUrl)}
                className="text-gray-500 hover:text-gray-700"
                title="URLをコピー"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          作成日: {new Date(link.createdAt).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(link.campaign.targetUrl, '_blank')}
            className="text-gray-600 hover:text-gray-900"
            title="ターゲットURLを開く"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="text-red-600 hover:text-red-800"
            title="リンクを削除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 統計カードコンポーネント
const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// リンク追加モーダルコンポーネント
const AddLinkModal = ({ isOpen, onClose, onSubmit, campaignId, campaigns }) => {
  const [formData, setFormData] = useState({
    campaignId: campaignId || '',
    name: '',
    customUrl: ''
  });

  useEffect(() => {
    if (campaignId) {
      setFormData(prev => ({ ...prev, campaignId }));
    }
  }, [campaignId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">新しいアフィリエイトリンク</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">閉じる</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="campaignId" className="block text-sm font-medium text-gray-700 mb-1">
              キャンペーン
            </label>
            <select
              id="campaignId"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">キャンペーンを選択</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              リンク名 (任意)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例: サマーセールリンク"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              リンクを識別するための名前です。指定しない場合はキャンペーン名が使用されます。
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="customUrl" className="block text-sm font-medium text-gray-700 mb-1">
              カスタムURL (任意)
            </label>
            <input
              type="text"
              id="customUrl"
              name="customUrl"
              value={formData.customUrl}
              onChange={handleChange}
              placeholder="例: summer-sale"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              URLをカスタマイズする場合に入力します。英数字、ハイフン、アンダースコアのみ使用可能です。
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// メインコンポーネント
const AffiliateLinks = () => {
  const [links, setLinks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalLinks: 0,
    activeLinks: 0,
    totalClicks: 0,
    totalConversions: 0
  });
  const [modalOpen, setModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // URLクエリパラメータからキャンペーンIDを取得
  const queryParams = new URLSearchParams(location.search);
  const campaignId = queryParams.get('campaignId');
  
  // リンク一覧を取得
  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await CampaignService.getAffiliateLinks({
        search: searchTerm,
        campaignId: campaignId || ''
      });
      
      setLinks(response.links || []);
      setStats({
        totalLinks: response.totalLinks || 0,
        activeLinks: response.links?.filter(link => link.status === 'approved').length || 0,
        totalClicks: response.links?.reduce((sum, link) => sum + (link.clickCount || 0), 0) || 0,
        totalConversions: response.links?.reduce((sum, link) => sum + (link.conversionCount || 0), 0) || 0
      });
    } catch (err) {
      console.error('Failed to fetch affiliate links:', err);
      setError('アフィリエイトリンクの読み込みに失敗しました');
      toast.error('アフィリエイトリンクの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  // 参加済みキャンペーン一覧を取得
  const fetchCampaigns = async () => {
    try {
      const response = await CampaignService.getAffiliateCampaigns({
        joined: true
      });
      setCampaigns(response.campaigns || []);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    }
  };
  
  // コンポーネントマウント時に初期データを取得
  useEffect(() => {
    fetchLinks();
    fetchCampaigns();
    
    // キャンペーンIDがURLに含まれている場合はモーダルを開く
    if (campaignId) {
      setModalOpen(true);
    }
  }, [campaignId]);
  
  // 検索実行ハンドラー
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLinks();
  };
  
  // URLコピー処理
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URLをコピーしました');
    }).catch(() => {
      toast.error('URLのコピーに失敗しました');
    });
  };
  
  // リンク削除処理
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('このリンクを削除してもよろしいですか？')) {
      return;
    }
    
    try {
      await CampaignService.deleteAffiliateLink(linkId);
      toast.success('アフィリエイトリンクを削除しました');
      fetchLinks();
    } catch (err) {
      console.error('Failed to delete affiliate link:', err);
      toast.error('アフィリエイトリンクの削除に失敗しました');
    }
  };
  
  // リンク作成処理
  const handleCreateLink = async (formData) => {
    try {
      await CampaignService.generateAffiliateLink(formData.campaignId, {
        name: formData.name,
        customUrl: formData.customUrl
      });
      toast.success('アフィリエイトリンクを作成しました');
      setModalOpen(false);
      
      // URLからキャンペーンIDを削除
      if (campaignId) {
        navigate('/affiliate/links');
      }
      
      fetchLinks();
    } catch (err) {
      console.error('Failed to create affiliate link:', err);
      let errorMessage = 'アフィリエイトリンクの作成に失敗しました';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">アフィリエイトリンク</h1>
        <p className="text-lg text-gray-600">
          キャンペーンのアフィリエイトリンクを管理し、成果を追跡しましょう。
        </p>
      </div>
      
      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatsCard
          title="総リンク数"
          value={stats.totalLinks}
          icon={<LinkIcon className="h-6 w-6 text-blue-500" />}
          color="bg-blue-100"
        />
        <StatsCard
          title="有効リンク数"
          value={stats.activeLinks}
          icon={<svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>}
          color="bg-green-100"
        />
        <StatsCard
          title="総クリック数"
          value={stats.totalClicks}
          icon={<svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>}
          color="bg-yellow-100"
        />
        <StatsCard
          title="総コンバージョン数"
          value={stats.totalConversions}
          icon={<svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>}
          color="bg-purple-100"
        />
      </div>
      
      {/* アクションバー */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="リンクを検索..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button type="submit" className="hidden">検索</button>
          </form>
          
          <button
            onClick={() => setModalOpen(true)}
            className="w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新しいリンクを作成
            </span>
          </button>
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
      
      {/* リンク一覧 */}
      {!loading && !error && (
        <div>
          {links.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <LinkIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">アフィリエイトリンクがありません</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 
                  `「${searchTerm}」に一致するリンクは見つかりませんでした。` : 
                  'キャンペーンに参加して、最初のアフィリエイトリンクを作成しましょう。'}
              </p>
              <button
                onClick={() => navigate('/affiliate/campaigns')}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンペーンを探す
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {links.map(link => (
                <LinkItem 
                  key={link.id} 
                  link={link} 
                  onCopy={handleCopyUrl}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* リンク作成モーダル */}
      <AddLinkModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // URLからキャンペーンIDを削除
          if (campaignId) {
            navigate('/affiliate/links');
          }
        }}
        onSubmit={handleCreateLink}
        campaignId={campaignId}
        campaigns={campaigns}
      />
    </div>
  );
};

export default AffiliateLinks;