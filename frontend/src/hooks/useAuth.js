import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// 認証コンテキストを簡単に使うためのカスタムフック
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
