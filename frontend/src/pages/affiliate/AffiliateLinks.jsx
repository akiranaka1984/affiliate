import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// モックデータ - 実際の実装ではAPIから取得
const mockLinks = [
  {
    id: '1',
    name: '夏のクーポンコード',
    campaign: {
      id: '1',
      title: 'サマープロモーション',
      advertiser: 'BrandX'
    },
    trackingCode: 'SUMMER25XYZ',
    customUrl: 'summer-promo',
    status: 'approved',
    createdAt: '2025-03-15',
    stats: {
      clicks: 423,
      conversions: 38,
      revenue: 95000,
      conversionRate: 8.98,
      epc: 224.59
    }
  },
  {
    id: '2',
    name: 'スポーツシューズリンク',
    campaign: {
      id: '2',
      title: 'スポーツシューズ販促',
      advertiser: 'SportsDirect'
    },
    trackingCode: 'SHOES12ABC',
    customUrl: 'new-shoes-deal',
    status: 'approved',
    createdAt: '2025-04-02',
    stats: {
      clicks: 287,
      conversions: 24,
      revenue: 28800,
      conversionRate: 8.36,
      epc: 100.35
    }
  },
  {
    id: '3',
    name: '旅行予約キャンペーン',
    campaign: {
      id: '3',
      title: 'ホテル予約キャンペーン',
      advertiser: 'TravelPlus'
    },
    trackingCode: 'TRAVEL8DEF',
    customUrl: 'hotel-booking',
    status: 'pending',
    createdAt: '2025-04-18',
    stats: {
      clicks: 0,
      conversions: 0,
      revenue: 0,
      conversionRate: 0,
      epc: 0
    }
  },
  {
    id: '4',
    name: 'サプリメントアフィリエイト',
    campaign: {
      id: '4',
      title: 'プレミアムサプリメント',
      advertiser: 'HealthLiving'
    },
    trackingCode: 'HEALTH5GHI',
    customUrl: 'premium-supplements',
    status: 'approved',
    createdAt: '2025-04-10',
    stats: {
      clicks: 156,
      conversions: 19,
      revenue: 11875,
      conversionRate: 12.18,
      epc: 76.12
    }
  }
];

const AffiliateLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [copyMessage, setCopyMessage] = useState('');
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // API呼び出しのシミュレーション
    const fetchLinks = () => {
      setTimeout(() => {
        setLinks(mockLinks);
        setLoading(false);
      }, 500);
    };
    
    fetchLinks();
    
    // クリーンアップ
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // 検索およびフィルタリング
  const filteredLinks = links.filter(link => {
    // ステータスフィルタリング
    if (status !== 'all' && link.status !== status) {
      return false;
    }
    
    // 検索
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        link.name.toLowerCase().includes(searchLower) ||
        link.campaign.title.toLowerCase().includes(searchLower) ||
        link.campaign.advertiser.toLowerCase().includes(searchLower) ||
        link.trackingCode.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // ソート
  const sortedLinks = [...filteredLinks].sort((a, b) => {
    let valueA, valueB;
    
    // ソートフィールドに基づいて値を取得
    if (sortField === 'campaignTitle') {
      valueA = a.campaign.title;
      valueB = b.campaign.title;
    } else if (sortField === 'advertiser') {
      valueA = a.campaign.advertiser;
      valueB = b.campaign.advertiser;
    } else if (sortField === 'clicks') {
      valueA = a.stats.clicks;
      valueB = b.stats.clicks;
    } else if (sortField === 'conversions') {
      valueA = a.stats.conversions;
      valueB = b.stats.conversions;
    } else if (sortField === 'revenue') {
      valueA = a.stats.revenue;
      valueB = b.stats.revenue;
    } else if (sortField === 'conversionRate') {
      valueA = a.stats.conversionRate;
      valueB = b.stats.conversionRate;
    } else if (sortField === 'epc') {
      valueA = a.stats.epc;
      valueB = b.stats.epc;
    } else {
      valueA = a[sortField];
      valueB = b[sortField];
    }
    
    // ソート方向
    return sortDirection === 'asc'
      ? valueA > valueB ? 1 : -1
      : valueA < valueB ? 1 : -1;
  });
  
  // ソートハンドラー
  const handleSort = (field) => {
    if (field === sortField) {
      // 同じフィールドの場合、ソート方向を切り替え
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 新しいフィールドの場合、デフォルトは降順
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // ソートアイコン
  const SortIcon = ({ field }) => {
    if (field !== sortField) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };
  
  // リンクのコピー処理
  const copyLink = (trackingCode) => {
    // ベースURLは実際のサービスに合わせて調整
    const fullUrl = `https://affiliatehub.example.com/aff/${trackingCode}`;
    
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        setCopyMessage('リンクをコピーしました！');
        
        // 2秒後にメッセージをクリア
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setCopyMessage('');
        }, 2000);
      })
      .catch(() => {
        setCopyMessage('コピーに失敗しました');
      });
  };
  
  // ステータスバッジ
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">アフィリエイトリンク</h1>
          <p className="text-gray-600">生成したアフィリエイトリンクとそのパフォーマンスを管理します。</p>
        </div>
        
        <Link
          to="/affiliate/campaigns"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          新しいリンクを作成
        </Link>
      </div>
      
      {/* 検索 & フィルター */}
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
                placeholder="キャンペーン名、広告主、リンク名で検索"
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
              <option value="approved">承認済み</option>
              <option value="pending">承認待ち</option>
              <option value="rejected">拒否</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* リンク一覧テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">リンク情報を読み込み中...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">リンクがありません</h3>
            <p className="mt-1 text-gray-500">条件に一致するリンクはありません。</p>
            <div className="mt-6">
              <Link
                to="/affiliate/campaigns"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                リンクを作成する
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">リンク名</span>
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('campaignTitle')}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">キャンペーン</span>
                        <SortIcon field="campaignTitle" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ステータス
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('clicks')}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">クリック</span>
                        <SortIcon field="clicks" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('conversions')}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">コンバージョン</span>
                        <SortIcon field="conversions" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('revenue')}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">収益</span>
                        <SortIcon field="revenue" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('conversionRate')}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">CR%</span>
                        <SortIcon field="conversionRate" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.name}</div>
                        <div className="text-xs text-gray-500">{link.trackingCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.campaign.title}</div>
                        <div className="text-xs text-gray-500">{link.campaign.advertiser}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={link.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.stats.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.stats.conversions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{link.stats.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.stats.conversionRate.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => copyLink(link.trackingCode)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          リンクをコピー
                        </button>
                        <Link
                          to={`/affiliate/links/${link.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* コピーメッセージのトースト */}
            {copyMessage && (
              <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
                {copyMessage}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AffiliateLinks;