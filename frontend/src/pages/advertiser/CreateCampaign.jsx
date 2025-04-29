// frontend/src/pages/advertiser/CreateCampaign.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    category: '',
    commissionType: 'percentage',
    commission: '',
    cookieDuration: 30,
    terms: '',
    allowedTrafficSources: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // フォーム送信ハンドラ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // モック処理（実際はAPIを呼び出す）
    setTimeout(() => {
      // 成功を想定
      setLoading(false);
      navigate('/advertiser/campaigns');
    }, 1000);
  };
  
  // 入力変更ハンドラ
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const sources = [...formData.allowedTrafficSources];
      if (checked) {
        sources.push(value);
      } else {
        const index = sources.indexOf(value);
        if (index !== -1) {
          sources.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        allowedTrafficSources: sources
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
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
        <h1 className="text-2xl font-bold text-gray-900">新しいキャンペーンを作成</h1>
      </div>
      
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
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              キャンペーンタイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
              リンク先URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="targetUrl"
              name="targetUrl"
              value={formData.targetUrl}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://example.com/product"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリー
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">カテゴリーを選択</option>
              <option value="ファッション">ファッション</option>
              <option value="スポーツ">スポーツ</option>
              <option value="旅行">旅行</option>
              <option value="健康">健康</option>
              <option value="食品">食品</option>
              <option value="家電">家電</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">報酬設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="commissionType" className="block text-sm font-medium text-gray-700 mb-1">
                報酬タイプ <span className="text-red-500">*</span>
              </label>
              <select
                id="commissionType"
                name="commissionType"
                value={formData.commissionType}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="percentage">成果報酬型（%）</option>
                <option value="fixed">固定報酬型（円）</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-1">
                報酬額 <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="commission"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  min="0"
                  step={formData.commissionType === 'percentage' ? '0.01' : '1'}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {formData.commissionType === 'percentage' ? '%' : '円'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="cookieDuration" className="block text-sm font-medium text-gray-700 mb-1">
                Cookie有効期間（日）
              </label>
              <input
                type="number"
                id="cookieDuration"
                name="cookieDuration"
                value={formData.cookieDuration}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="1"
                max="365"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">その他の設定</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              許可するトラフィックソース
            </label>
            <div className="space-y-2">
              {['ブログ', 'SNS', 'メールマガジン', 'YouTube', 'その他Webサイト'].map((source) => (
                <div key={source} className="flex items-center">
                  <input
                    id={`source-${source}`}
                    name="allowedTrafficSources"
                    value={source}
                    type="checkbox"
                    checked={formData.allowedTrafficSources.includes(source)}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`source-${source}`} className="ml-2 text-sm text-gray-700">
                    {source}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
              利用規約
            </label>
            <textarea
              id="terms"
              name="terms"
              rows={5}
              value={formData.terms}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="アフィリエイトパートナーに対する規約や注意事項を入力してください。"
            />
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </>
            ) : 'キャンペーンを作成'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;