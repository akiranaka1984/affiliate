import React from 'react';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ようこそ</h2>
        <p className="text-gray-600 mb-4">
          アカウントタイプ: {
            user?.role === 'affiliate' ? 'アフィリエイト' : 
            user?.role === 'advertiser' ? '広告主' : 
            user?.role === 'admin' ? '管理者' : 'ユーザー'
          }
        </p>
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            ダッシュボードは開発中です。今後のアップデートでさらに機能が追加されます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
