import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください');
      setLoading(false);
      return;
    }
    
    try {
      const response = await AuthService.requestPasswordReset(email);
      setIsSuccess(true);
      setMessage(response.message || 'パスワードリセット手順が記載されたメールが送信されました');
    } catch (err) {
      setError(err.response?.data?.message || 'パスワードリセットのリクエスト中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">パスワードをお忘れですか？</h2>
          <p className="mt-2 text-center text-gray-600">
            アカウントに関連付けられたメールアドレスを入力してください
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
        
        {isSuccess ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-4">リクエストが送信されました</p>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログインに戻る
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    送信中...
                  </span>
                ) : 'リセットリンクを送信'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                ログインに戻る
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;