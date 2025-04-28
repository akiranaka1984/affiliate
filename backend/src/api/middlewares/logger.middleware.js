const logger = require('../../config/logger');

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

module.exports = { loggerMiddleware };