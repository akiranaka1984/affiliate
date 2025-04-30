// backend/src/api/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.model');
const logger = require('../../config/logger');

/**
 * 認証ミドルウェア - JWTトークンの検証を行います
 * @param {Object} req - リクエストオブジェクト
 * @param {Object} res - レスポンスオブジェクト
 * @param {Function} next - 次のミドルウェア関数
 */
const authenticate = async (req, res, next) => {
  try {
    // Authorization ヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: '認証トークンがありません' });
    }
    
    // Bearer トークン形式を確認
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: '認証トークン形式が不正です' });
    }
    
    const token = parts[1];
    
    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production');
    
    // ユーザーIDからユーザー情報を取得
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'ユーザーが存在しません' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'アカウントが無効化されています' });
    }
    
    // リクエストオブジェクトにユーザー情報を追加
    req.user = user;
    
    // 次のミドルウェアへ
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '認証トークンの有効期限が切れています' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '認証トークンが無効です' });
    }
    
    logger.error('認証エラー:', error);
    return res.status(500).json({ message: '認証処理中にエラーが発生しました' });
  }
};

/**
 * 認可ミドルウェア - 特定のロールのみアクセスを許可します
 * @param {...String} roles - アクセスを許可するロール
 * @returns {Function} ミドルウェア関数
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // authenticate ミドルウェアが先に実行されている必要があります
    if (!req.user) {
      return res.status(500).json({ message: '認証ミドルウェアが実行されていません' });
    }
    
    // ユーザーのロールをチェック
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'このリソースにアクセスする権限がありません' });
    }
    
    // アクセス許可
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};