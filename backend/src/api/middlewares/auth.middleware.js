// backend/src/api/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.model');
const logger = require('../../config/logger');

/**
 * 認証ミドルウェア
 * JWTトークンを検証し、有効なユーザーであるかチェック
 */
const authenticate = async (req, res, next) => {
  try {
    // ヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認証トークンがありません' });
    }

    const token = authHeader.split(' ')[1];

    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ユーザーを取得（パスワードは除外）
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'ユーザーが見つかりません' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'アカウントが無効になっています' });
    }

    // リクエストにユーザー情報を添付
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '無効または期限切れのトークンです' });
    }

    logger.error('Authentication error:', error);
    res.status(500).json({ message: '認証処理中にエラーが発生しました' });
  }
};

/**
 * 権限確認ミドルウェア
 * ユーザーが指定されたロールを持っているかチェック
 * @param {string|string[]} roles - 許可するロール（単一または配列）
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'このリソースにアクセスする権限がありません' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};