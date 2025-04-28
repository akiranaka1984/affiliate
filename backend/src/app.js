const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { loggerMiddleware } = require('./api/middlewares/logger.middleware');

// ルーターのインポート
const authRoutes = require('./api/routes/auth.routes');
const usersRoutes = require('./api/routes/users.routes');
const campaignsRoutes = require('./api/routes/campaigns.routes');
const affiliatesRoutes = require('./api/routes/affiliates.routes');
const trackingRoutes = require('./api/routes/tracking.routes');
const paymentsRoutes = require('./api/routes/payments.routes');

const app = express();

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// ルーティング
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/affiliates', affiliatesRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payments', paymentsRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;