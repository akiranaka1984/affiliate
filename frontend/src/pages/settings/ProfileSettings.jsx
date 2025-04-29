import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const ProfileSettings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  // 基本情報のフォームステート
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // プロフィール情報のフォームステート（ロールに基づいて動的に設定）
  const [profileInfo, setProfileInfo] = useState({});
  
  // パスワード変更のフォームステート
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 処理ステート
  const [loading, setLoading] = useState({
    basic: false,
    profile: false,
    password: false
  });
  
  // エラーと成功メッセージのステート
  const [messages, setMessages] = useState({
    basic: { error: '', success: '' },
    profile: { error: '', success: '' },
    password: { error: '', success: '' }
  });
  
  // ユーザー情報の初期化
  useEffect(() => {
    if (user) {
      // 基本情報を設定
      setBasicInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      
      // ロールに基づいてプロフィール情報を設定
      if (user.role === 'affiliate') {
        setProfileInfo({
          companyName: user.companyName || '',
          website: user.website || '',
          niche: user.niche || '',
          bio: user.bio || ''
        });
      } else if (user.role === 'advertiser') {
        setProfileInfo({
          companyName: user.companyName || '',
          website: user.website || '',
          industry: user.industry || '',
          description: user.description || ''
        });
      }
    }
  }, [user]);
  
  // 基本情報の変更ハンドラ
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // エラーメッセージをクリア
    setMessages(prev => ({
      ...prev,
      basic: { ...prev.basic, error: '' }
    }));
  };
  
  // プロフィール情報の変更ハンドラ
  const handleProfileInfoChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // エラーメッセージをクリア
    setMessages(prev => ({
      ...prev,
      profile: { ...prev.profile, error: '' }
    }));
  };
  
  // パスワード変更の入力ハンドラ
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // エラーメッセージをクリア
    setMessages(prev => ({
      ...prev,
      password: { ...prev.password, error: '' }
    }));
  };
  
  // 基本情報の保存ハンドラ
  const handleSaveBasicInfo = async (e) => {
    e.preventDefault();
    
    // 入力検証
    if (!basicInfo.firstName.trim() || !basicInfo.lastName.trim()) {
      setMessages(prev => ({
        ...prev,
        basic: { ...prev.basic, error: '名前と姓は必須項目です' }
      }));
      return;
    }
    
    setLoading(prev => ({ ...prev, basic: true }));
    
    try {
      // APIを呼び出してプロフィールを更新
      await updateProfile(basicInfo);
      
      setMessages(prev => ({
        ...prev,
        basic: { error: '', success: '基本情報が正常に更新されました' }
      }));
      
      // 成功メッセージを5秒後にクリア
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          basic: { ...prev.basic, success: '' }
        }));
      }, 5000);
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        basic: { ...prev.basic, error: error.response?.data?.message || '基本情報の更新中にエラーが発生しました' }
      }));
    } finally {
      setLoading(prev => ({ ...prev, basic: false }));
    }
  };
  
  // プロフィール情報の保存ハンドラ
  const handleSaveProfileInfo = async (e) => {
    e.preventDefault();
    
    setLoading(prev => ({ ...prev, profile: true }));
    
    try {
      // APIを呼び出してプロフィールを更新
      await updateProfile(profileInfo);
      
      setMessages(prev => ({
        ...prev,
        profile: { error: '', success: 'プロフィール情報が正常に更新されました' }
      }));
      
      // 成功メッセージを5秒後にクリア
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          profile: { ...prev.profile, success: '' }
        }));
      }, 5000);
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        profile: { ...prev.profile, error: error.response?.data?.message || 'プロフィール情報の更新中にエラーが発生しました' }
      }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };
  
  // パスワード変更ハンドラ
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // 入力検証
    if (!passwordData.currentPassword) {
      setMessages(prev => ({
        ...prev,
        password: { ...prev.password, error: '現在のパスワードを入力してください' }
      }));
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessages(prev => ({
        ...prev,
        password: { ...prev.password, error: '新しいパスワードは8文字以上である必要があります' }
      }));
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessages(prev => ({
        ...prev,
        password: { ...prev.password, error: 'パスワードが一致しません' }
      }));
      return;
    }
    
    setLoading(prev => ({ ...prev, password: true }));
    
    try {
      // APIを呼び出してパスワードを変更
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessages(prev => ({
        ...prev,
        password: { error: '', success: 'パスワードが正常に変更されました' }
      }));
      
      // フォームをリセット
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // 成功メッセージを5秒後にクリア
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          password: { ...prev.password, success: '' }
        }));
      }, 5000);
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        password: { ...prev.password, error: error.response?.data?.message || 'パスワード変更中にエラーが発生しました' }
      }));
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };
  
  // メッセージアラートコンポーネント
  const Alert = ({ type, message }) => {
    if (!message) return null;
    
    const colors = type === 'error' 
      ? 'bg-red-50 border-red-400 text-red-700'
      : 'bg-green-50 border-green-400 text-green-700';
    
    return (
      <div className={`mb-4 p-4 border-l-4 rounded-md ${colors}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {type === 'error' ? (
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">アカウント設定</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 基本情報 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
            
            <Alert type="error" message={messages.basic.error} />
            <Alert type="success" message={messages.basic.success} />
            
            <form onSubmit={handleSaveBasicInfo}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  名
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={basicInfo.firstName}
                  onChange={handleBasicInfoChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  姓
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={basicInfo.lastName}
                  onChange={handleBasicInfoChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={basicInfo.email}
                  disabled
                  className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  メールアドレスは変更できません
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={basicInfo.phone}
                  onChange={handleBasicInfoChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading.basic}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading.basic ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* プロフィール情報 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {user?.role === 'affiliate' ? 'アフィリエイトプロフィール' : 'ブランドプロフィール'}
            </h2>
            
            <Alert type="error" message={messages.profile.error} />
            <Alert type="success" message={messages.profile.success} />
            
            <form onSubmit={handleSaveProfileInfo}>
              <div className="mb-4">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  会社名/ブランド名
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={profileInfo.companyName || ''}
                  onChange={handleProfileInfoChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Webサイト
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={profileInfo.website || ''}
                  onChange={handleProfileInfoChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              {user?.role === 'affiliate' ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
                      ニッチ/カテゴリー
                    </label>
                    <input
                      type="text"
                      id="niche"
                      name="niche"
                      value={profileInfo.niche || ''}
                      onChange={handleProfileInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      自己紹介
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profileInfo.bio || ''}
                      onChange={handleProfileInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      業種
                    </label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={profileInfo.industry || ''}
                      onChange={handleProfileInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      会社概要
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={profileInfo.description || ''}
                      onChange={handleProfileInfoChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={loading.profile}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading.profile ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* パスワード変更 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">パスワード変更</h2>
            
            <Alert type="error" message={messages.password.error} />
            <Alert type="success" message={messages.password.success} />
            
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  現在のパスワード
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  パスワードは8文字以上にしてください
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading.password}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading.password ? '変更中...' : 'パスワードを変更'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;