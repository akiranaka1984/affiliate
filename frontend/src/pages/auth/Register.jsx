import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'affiliate'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // 既に認証済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // フィールド入力時にエラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 入力検証
  const validateForm = () => {
    const newErrors = {};
    
    // メールアドレス検証
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '有効なメールアドレスを入力してください';
      }
    }
    
    // 名前検証
    if (!formData.firstName.trim()) {
      newErrors.firstName = '名前を入力してください';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '姓を入力してください';
    }
    
    // パスワード検証
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上である必要があります';
    }
    
    // パスワード確認検証
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    // フォーム検証
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      // 登録成功後にダッシュボードへリダイレクト
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(
        err.response?.data?.message || 
        '登録に失敗しました。入力内容を確認してください。'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg'>
        <div className='mb-8'>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>AffiliateHub</h2>
          <p className='mt-3 text-center text-lg text-gray-600'>
            新規アカウント登録
          </p>
        </div>
        
        {generalError && (
          <div className='bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6'>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{generalError}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-5'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-1'>名</label>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                    errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder='名'
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-1'>姓</label>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                    errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder='姓'
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>メールアドレス</label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder='メールアドレス'
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>パスワード</label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder='パスワード（8文字以上）'
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>パスワード（確認）</label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                  errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder='パスワード（確認）'
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className='mt-6'>
              <label className='block text-sm font-medium text-gray-700 mb-3'>アカウントタイプ</label>
              <div className='flex space-x-6'>
                <div className='flex items-center'>
                  <input
                    id='affiliate'
                    name='role'
                    type='radio'
                    value='affiliate'
                    checked={formData.role === 'affiliate'}
                    onChange={handleChange}
                    className='h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300'
                  />
                  <label htmlFor='affiliate' className='ml-3 block text-sm text-gray-900'>
                    アフィリエイト
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    id='advertiser'
                    name='role'
                    type='radio'
                    value='advertiser'
                    checked={formData.role === 'advertiser'}
                    onChange={handleChange}
                    className='h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300'
                  />
                  <label htmlFor='advertiser' className='ml-3 block text-sm text-gray-900'>
                    広告主
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8'>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登録中...
                </span>
              ) : 'アカウントを作成'}
            </button>
          </div>
          
          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              既にアカウントをお持ちですか？ 
              <Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-500 ml-1'>
                ログイン
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;