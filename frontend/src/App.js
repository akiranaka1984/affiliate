import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">AffiliateHub</h1>
        <p className="text-gray-600 text-center mb-6">
          アフィリエイトマーケティング管理プラットフォーム
        </p>
        <div className="flex flex-col gap-3 mt-8">
          <div className="bg-blue-500 text-white p-4 rounded-md">
            開発中：この画面はプレースホルダーです
          </div>
          <p className="text-sm text-gray-500 mt-2">
            フロントエンド開発を進めるにつれて、ここに機能が追加されていきます。
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
