import React, { useState } from 'react';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      // 登録成功後にダッシュボードへリダイレクト
      navigate('/dashboard');
    } catch (err) {
      setError('登録に失敗しました。入力内容を確認してください。');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md'>
        <div className='mb-8'>
          <h2 className='text-center text-3xl font-bold text-gray-900'>AffiliateHub</h2>
          <p className='mt-3 text-center text-sm text-gray-600'>
            新規アカウント登録
          </p>
        </div>
        
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6'>
            {error}
          </div>
        )}
        
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-5'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-1'>姓</label>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  required
                  className='appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                  placeholder='姓'
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-1'>名</label>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  required
                  className='appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                  placeholder='名'
                  value={formData.lastName}
                  onChange={handleChange}
                />
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
                className='appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='メールアドレス'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>パスワード</label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='パスワード'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>パスワード（確認）</label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='パスワード（確認）'
                value={formData.confirmPassword}
                onChange={handleChange}
              />
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
                    className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300'
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
                    className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300'
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
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {loading ? '登録中...' : 'アカウントを作成'}
            </button>
          </div>
          
          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              既にアカウントをお持ちですか？ 
              <Link to='/login' className='font-medium text-blue-600 hover:text-blue-500 ml-1'>
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
