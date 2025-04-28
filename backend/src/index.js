require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // データベース接続テスト
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // サーバー起動
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();