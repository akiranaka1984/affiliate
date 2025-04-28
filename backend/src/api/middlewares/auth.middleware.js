// backend/src/api/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.model');
const logger = require('../../config/logger');

// 認証ミドルウェア
const authenticate = async (req, res, next) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認証が必要です' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ユーザーをデータベースから検索
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: '認証が無効です' });
    }
    
    // リクエストオブジェクトにユーザー情報を追加
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: '認証に失敗しました' });
  }
};

// 権限チェックミドルウェア
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }
    
    // 文字列または配列として渡された役割をチェック
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    if (!roleArray.includes(req.user.role)) {
      return res.status(403).json({ message: 'この操作を行う権限がありません' });
    }
    
    next();
  };
};

// ロギングミドルウェア
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // リクエスト受信時のログ
  logger.info({
    message: `Request received: ${req.method} ${req.originalUrl}`,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id
  });

  // レスポンス送信時のログ
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      message: `Response sent: ${res.statusCode}`,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
  });

  next();
};

module.exports = { 
  authenticate, 
  authorize,
  loggerMiddleware 
};