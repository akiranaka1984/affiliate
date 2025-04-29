import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// モックキャンペーンデータ
const mockCampaign = {
  id: '2',
  title: 'スポーツシューズ販促',
  advertiser: 'SportsDirect',
  description: '新作スポーツシューズのアフィリエイトプログラム。高いコンバージョン率が特徴です。',
  commissionType: 'percentage',
  commission: 12,
  category: 'スポーツ',
  status: 'active',
  image: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Sports+Shoes',
  targetUrl: 'https://example.com/sport-shoes',
  cookieDuration: 30,
  terms: `
1. アフィリエイトパートナーは、当社のブランドガイドラインに従う必要があります。
2. 虚偽または誤解を招く広告は禁止されています。
3. スパム行為や不正なトラフィックは禁止されています。
4. コンバージョンは購入完了後に計上されます。
5. 報酬は毎月15日に前月分が支払われます。
  `,
  allowedTrafficSources: ['ブログ', 'SNS', 'メールマガジン', 'YouTube']
};

const GenerateLink = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkData, setLinkData] = useState({
    name: '',
    customUrl: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  useEffect(() => {
    // 本番環境ではAPIからキャンペーン詳細を取得
    const fetchCampaign = () => {
      // API呼び出しのシミュレーション
      setTimeout(() => {
        // 実際にはcampaignIdに基づいてAPIから取得
        setCampaign(mockCampaign);
        setLoading(false);
      }, 500);
    };
    
    fetchCampaign();
  }, [campaignId]);
  
  // 入力変更ハンドラー
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'customUrl') {
      // URLスラグとして使用するため、特殊文字を除去し、スペースをハイフンに変換
      const sanitizedValue = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // 英数字、スペース、ハイフン以外を削除
        .replace(/\s+/g, '-')      // スペースをハイフンに変換
        .replace(/-+/g, '-');      // 連続したハイフンを単一のハイフンに変換
      
      setLinkData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setLinkData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // リンク生成ハンドラー
  const handleGenerateLink = async (e) => {
    e.preventDefault();
    
    // 入力検証
    if (!linkData.name.trim()) {
      setError('リンク名を入力してください');
      return;
    }
    
    if (!agreed) {
      setError('利用規約に同意してください');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // 実際にはAPIを呼び出してリンクを生成
      // const response = await api.post(`/campaigns/${campaignId}/generate-link`, linkData);
      
      // API呼び出しのシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成されたトラッキングコード（本番環境ではAPIからの応答を使用）
      const trackingCode = `SPORT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      setGeneratedCode(trackingCode);
      setSuccess(true);
    } catch (err) {
      setError('リンクの生成中にエラーが発生しました。もう一度お試しください。');
      console.error('Link generation error:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // リンクのコピー
  const copyLink = () => {
    // ベースURLは実際のサービスに合わせて調整
    const fullUrl = `https://affiliatehub.example.com/aff/${generatedCode}`;
    
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        alert('リンクをコピーしました！');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        alert('リンクのコピーに失敗しました。手動でコピーしてください。');
      });
  };
  
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                キャンペーンが見つかりませんでした。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">アフィリエイトリンクの生成</h1>
      </div>
      
      {success ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 bg-green-50 border-b border-green-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">リンクが正常に生成されました！</h3>
                <p className="mt-1 text-sm text-green-700">
                  アフィリエイトリンクが正常に生成されました。以下のリンクを使用してプロモーションを開始できます。
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">アフィリエイトリンク情報</h2>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500">リンク名</p>
                <p className="text-base font-medium text-gray-900">{linkData.name}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">キャンペーン</p>
                <p className="text-base font-medium text-gray-900">{campaign.title}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">トラッキングコード</p>
                <p className="text-base font-medium text-gray-900">{generatedCode}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">アフィリエイトURL</p>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow">
                    <input
                      type="text"
                      readOnly
                      value={`https://affiliatehub.example.com/aff/${generatedCode}`}
                      className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span>コピー</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-blue-800 mb-2">次のステップ</h3>
                <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>このリンクをあなたのWebサイト、SNS、またはメールに追加してください</li>
                  <li>アフィリエイトダッシュボードでパフォーマンスを追跡できます</li>
                  <li>アフィリエイトリンク一覧ページですべてのリンクを管理できます</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-green-800 mb-2">収益の詳細</h3>
                <dl className="text-sm">
                  <div className="grid grid-cols-2 gap-1 mb-1">
                    <dt className="text-green-700">報酬タイプ:</dt>
                    <dd className="text-green-800 font-medium">
                      {campaign.commissionType === 'percentage' ? '成果報酬型' : '固定報酬'}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-1">
                    <dt className="text-green-700">報酬額:</dt>
                    <dd className="text-green-800 font-medium">
                      {campaign.commissionType === 'percentage' 
                        ? `${campaign.commission}%` 
                        : `¥${campaign.commission.toLocaleString()}`}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <dt className="text-green-700">Cookie有効期間:</dt>
                    <dd className="text-green-800 font-medium">{campaign.cookieDuration}日</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/affiliate/links')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                リンク一覧に戻る
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/affiliate/campaigns')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                他のキャンペーンを探す
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">リンク生成</h2>
              </div>
              
              <div className="p-6">
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleGenerateLink}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      リンク名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={linkData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="例: サマーセールプロモーション"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      このリンクを識別するための名前。自分だけが見ることができます。
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="customUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      カスタムURL（オプション）
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                        affiliatehub.example.com/aff/
                      </span>
                      <input
                        type="text"
                        id="customUrl"
                        name="customUrl"
                        value={linkData.customUrl}
                        onChange={handleChange}
                        className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="your-custom-url"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      英数字、ハイフンのみ使用可能。空白の場合は自動生成されます。
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          利用規約に同意します
                        </label>
                        <p className="text-gray-500">
                          このキャンペーンに参加することで、キャンペーンの利用規約に同意したことになります。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          処理中...
                        </>
                      ) : 'リンクを生成'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">キャンペーン情報</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                  <p className="text-sm text-gray-600">{campaign.advertiser}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700">{campaign.description}</p>
                </div>
                
                <div className="mb-6 bg-gray-50 p-4 rounded-md">
                  <h4 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">報酬詳細</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">報酬タイプ</p>
                      <p className="font-medium text-gray-900">
                        {campaign.commissionType === 'percentage' ? '成果報酬型' : '固定報酬'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">報酬額</p>
                      <p className="font-medium text-gray-900">
                        {campaign.commissionType === 'percentage' 
                          ? `${campaign.commission}%` 
                          : `¥${campaign.commission.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">許可されたトラフィックソース</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.allowedTrafficSources.map((source, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">利用規約</h2>
              </div>
              
              <div className="p-6">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {campaign.terms}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateLink;