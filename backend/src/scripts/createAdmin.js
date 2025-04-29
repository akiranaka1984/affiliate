// backend/src/scripts/createAdmin.js
require('dotenv').config();
const { User } = require('../models/user.model');
const { sequelize } = require('../config/database');

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('データベース接続に成功しました。');

    // 管理者アカウントがすでに存在するか確認
    const existingAdmin = await User.findOne({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('管理者アカウントはすでに存在します。');
      return;
    }

    // 管理者アカウント作成
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'Admin@123',  // この値は実際の環境では変更してください
      firstName: 'システム',
      lastName: '管理者',
      role: 'admin',
      isActive: true
    });

    console.log('管理者アカウントの作成に成功しました:', adminUser.email);
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    process.exit();
  }
};

createAdminUser();