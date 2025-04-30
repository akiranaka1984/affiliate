// frontend/src/pages/advertiser/AffiliateApplications.jsx
import React, { useState, useEffect } from 'react';

// モックデータ
const mockApplications = [
  {
    id: '1',
    affiliateId: '101',
    campaignId: '1',
    affiliateName: '鈴木太郎',
    campaignTitle: 'サマープロモーション',
    email: 'suzuki@example.com',
    website: 'https://suzuki-blog.example.com',
    applicationDate: '2025-04-20',
    status: 'pending',
    message: 'ファッション関連の商品を取り扱うブログを運営しています。夏のプロモーションと親和性が高いと思いますので、ぜひ参加させてください。'
  },
  {
    id: '2',
    affiliateId: '102',
    campaignId: '1',
    affiliateName: '佐藤花子',
    campaignTitle: 'サマープロモーション',
    email: 'sato@example.com',
    website: 'https://fashionista.example.com',
    applicationDate: '2025-04-19',
    status: 'approved',
    message: 'ファッションブログで月間10万PVあります。夏物の特集記事を計画中です。'
  },
  {
    id: '3',
    affiliateId: '103',
    campaignId: '2',
    affiliateName: '田中健太',
    campaignTitle: 'スポーツシューズ販促',
    email: 'tanaka@example.com',
    website: 'https://sports-review.example.com',
    applicationDate: '2025-04-18',
    status: 'pending',
    message: 'スポーツ用品のレビューサイトを運営しています。スポーツシューズの特集記事を書く予定です。'
  },
  {
    id: '4',
    affiliateId: '104',
    campaignId: '1',
    affiliateName: '山田一郎',
    campaignTitle: 'サマープロモーション',
    email: 'yamada@example.com',
    website: 'https://summer-style.example.com',
    applicationDate: '2025-04-17',
    status: 'rejected',
    message: '夏のファッションに特化したブログを運営しています。読者層は20代〜30代の女性が中心です。'
  }
];

const AffiliateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [campaign, setCampaign] = useState('all');
  
  useEffect(() => {
    // APIリクエストの代わりにモックデータを使用
    const fetchApplications = () => {
      setTimeout(() => {
        setApplications(mockApplications);
        setLoading(false);
      }, 800);
    };
    
    fetchApplications();
  }, []);
  
  // フィルタリングされた申請
  const filteredApplications = applications.filter(app => {
    // ステータスフィルター
    if (status !== 'all' && app.status !== status) {
      return false;
    }
    
    // キャンペーンフィルター
    if (campaign !== 'all' && app.campaignId !== campaign) {
      return false;
    }
    
    return true;
  });
  
  // ユニークなキャンペーンのリストを取得
  const uniqueCampaigns = Array.from(
    new Set(applications.map(app => app.campaignId))
  ).map(campaignId => {
    const campaign = applications.find(app => app.campaignId === campaignId);
    return {
      id: campaignId,
      title: campaign ? campaign.campaignTitle : '不明なキャンペーン'
    };
  });
  
  // 申請を承認または拒否する処理
  const handleUpdateStatus = (applicationId, newStatus) => {
    // 実際はAPIを呼び出して更新
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };
  
  // ステータスバッジコンポーネント
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
    
    switch (status) {
      case 'approved':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = '承認済み';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = '承認待ち';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = '拒否';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">アフィリエイト申請</h1>
        <p className="text-gray-600">キャンペーンへの参加申請を管理します。</p>
      </div>
      
      {/* フィルター */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">承認待ち</option>
              <option value="approved">承認済み</option>
              <option value="rejected">拒否</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-1">
              キャンペーン
            </label>
            <select
              id="campaign"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべてのキャンペーン</option>
              {uniqueCampaigns.map(camp => (
                <option key={camp.id} value={camp.id}>
                  {camp.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 申請一覧 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">申請が見つかりません</h3>
          <p className="mt-1 text-gray-500">選択した条件に一致する申請はありません。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map(application => (
            <div key={application.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{application.affiliateName}</h3>
                      <StatusBadge status={application.status} />
                    </div>
                    <p className="text-sm text-gray-600">
                      キャンペーン: <span className="font-medium">{application.campaignTitle}</span>
                    </p>
                    <p className="text-xs text-gray-500">申請日: {application.applicationDate}</p>
                  </div>
                  
                  {application.status === 'pending' && (
                    <div className="mt-4 lg:mt-0 flex space-x-3">
                      <button
                        onClick={() => handleUpdateStatus(application.id, 'approved')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        承認
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(application.id, 'rejected')}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        拒否
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">メールアドレス</p>
                    <p className="text-sm font-medium text-gray-900">{application.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ウェブサイト</p>
                    <a
                      href={application.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {application.website}
                    </a>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-500 mb-1">申請メッセージ</p>
                  <p className="text-sm text-gray-700">{application.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AffiliateApplications;