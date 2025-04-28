const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../../models/user.model');
const { AffiliateProfile } = require('../../models/affiliate.model');
const { AdvertiserProfile } = require('../../models/advertiser.model');
const logger = require('../../config/logger');

// JWTトークン生成
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '24h' }
  );
};

// ユーザー登録
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // メールアドレスが既に使用されているかチェック
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'このメールアドレスは既に登録されています' 
      });
    }
    
    // ユーザー作成
    const user = await User.create({
      email,
      password, // モデルのhook内で自動的にハッシュ化される
      firstName,
      lastName,
      role
    });
    
    // ロールに応じたプロフィール作成
    if (role === 'affiliate') {
      await AffiliateProfile.create({
        userId: user.id
      });
    } else if (role === 'advertiser') {
      await AdvertiserProfile.create({
        userId: user.id,
        companyName: `${firstName} ${lastName}の会社` // 仮の会社名
      });
    }
    
    // JWTトークン生成
    const token = generateToken(user.id);
    
    // パスワードを除外したユーザー情報を返す
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    
    res.status(201).json({
      message: 'ユーザー登録が完了しました',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'ユーザー登録中にエラーが発生しました' });
  }
};

// ユーザーログイン
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ユーザーが存在するかチェック
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }
    
    // パスワードの検証
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }
    
    // 非アクティブユーザーのチェック
    if (!user.isActive) {
      return res.status(401).json({ message: 'このアカウントは現在無効になっています' });
    }
    
    // ログイン日時を更新
    user.lastLogin = new Date();
    await user.save();
    
    // JWTトークン生成
    const token = generateToken(user.id);
    
    // パスワードを除外したユーザー情報を返す
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    
    res.status(200).json({
      message: 'ログインに成功しました',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'ログイン中にエラーが発生しました' });
  }
};

// プロフィール取得
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // ユーザー情報を取得
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    // ロールに応じたプロフィール情報を取得
    let profileData = null;
    
    if (user.role === 'affiliate') {
      profileData = await AffiliateProfile.findOne({
        where: { userId }
      });
    } else if (user.role === 'advertiser') {
      profileData = await AdvertiserProfile.findOne({
        where: { userId }
      });
    }
    
    res.status(200).json({
      user,
      profile: profileData
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'プロフィール取得中にエラーが発生しました' });
  }
};

// パスワード変更
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // ユーザーを取得
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    // 現在のパスワードを検証
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '現在のパスワードが正しくありません' });
    }
    
    // 新しいパスワードを設定（モデルのhook内で自動的にハッシュ化される）
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'パスワードを変更しました' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ message: 'パスワード変更中にエラーが発生しました' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword
};