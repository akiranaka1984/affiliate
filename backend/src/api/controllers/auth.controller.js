// backend/src/api/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../../models/user.model');
const { AffiliateProfile } = require('../../models/affiliate.model');
const { AdvertiserProfile } = require('../../models/advertiser.model');
const { sequelize } = require('../../config/database');
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
      password, // モデルのフックで自動的にハッシュ化される
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
        companyName: `${firstName} ${lastName}` // 初期値として名前を設定
      });
    }

    // トークン生成
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
      message: 'ユーザーが正常に登録されました',
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

    // ユーザーの検索
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // アカウントが有効かチェック
    if (!user.isActive) {
      return res.status(401).json({ message: 'このアカウントは無効になっています' });
    }

    // パスワードの検証
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // 最終ログイン日時を更新
    await user.update({ lastLogin: new Date() });

    // トークン生成
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

    // ユーザー情報を取得（パスワードを除く）
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    // ロールに応じたプロフィール情報を取得
    let profileData = {};
    if (user.role === 'affiliate') {
      const affiliateProfile = await AffiliateProfile.findOne({
        where: { userId }
      });
      if (affiliateProfile) {
        profileData = {
          profileId: affiliateProfile.id,
          companyName: affiliateProfile.companyName,
          website: affiliateProfile.website,
          niche: affiliateProfile.niche,
          bio: affiliateProfile.bio,
          status: affiliateProfile.status
        };
      }
    } else if (user.role === 'advertiser') {
      const advertiserProfile = await AdvertiserProfile.findOne({
        where: { userId }
      });
      if (advertiserProfile) {
        profileData = {
          profileId: advertiserProfile.id,
          companyName: advertiserProfile.companyName,
          website: advertiserProfile.website,
          industry: advertiserProfile.industry,
          description: advertiserProfile.description,
          logo: advertiserProfile.logo,
          status: advertiserProfile.status
        };
      }
    }

    res.status(200).json({
      user: {
        ...user.toJSON(),
        ...profileData
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'プロフィール取得中にエラーが発生しました' });
  }
};

// プロフィール更新
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, ...profileData } = req.body;

    // トランザクション開始
    await sequelize.transaction(async (t) => {
      // ユーザー基本情報の更新
      const user = await User.findByPk(userId, { transaction: t });
      
      if (!user) {
        return res.status(404).json({ message: 'ユーザーが見つかりません' });
      }
      
      // 基本情報の更新
      if (firstName || lastName || phone !== undefined) {
        await user.update(
          { 
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phone: phone !== undefined ? phone : user.phone
          }, 
          { transaction: t }
        );
      }
      
      // ロールに応じたプロフィール情報を更新
      if (user.role === 'affiliate') {
        let affiliateProfile = await AffiliateProfile.findOne({
          where: { userId },
          transaction: t
        });
        
        if (affiliateProfile) {
          // プロフィール情報のみを抽出
          const { 
            companyName, website, niche, bio, 
            taxId, paymentMethod, paymentDetails 
          } = profileData;
          
          // 必要なフィールドのみ更新
          await affiliateProfile.update({
            companyName,
            website,
            niche,
            bio,
            taxId,
            paymentMethod,
            paymentDetails
          }, { transaction: t });
        }
      } else if (user.role === 'advertiser') {
        let advertiserProfile = await AdvertiserProfile.findOne({
          where: { userId },
          transaction: t
        });
        
        if (advertiserProfile) {
          // プロフィール情報のみを抽出
          const { 
            companyName, website, industry, description, 
            logo, billingAddress, taxId, paymentMethod, paymentDetails 
          } = profileData;
          
          // 必要なフィールドのみ更新
          await advertiserProfile.update({
            companyName,
            website,
            industry,
            description,
            logo,
            billingAddress,
            taxId,
            paymentMethod,
            paymentDetails
          }, { transaction: t });
        }
      }
    });
    
    // 更新後のプロフィール情報を取得して返す
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    // ロールに応じたプロフィール情報を取得
    let updatedProfileData = {};
    if (updatedUser.role === 'affiliate') {
      const affiliateProfile = await AffiliateProfile.findOne({
        where: { userId }
      });
      if (affiliateProfile) {
        updatedProfileData = {
          profileId: affiliateProfile.id,
          companyName: affiliateProfile.companyName,
          website: affiliateProfile.website,
          niche: affiliateProfile.niche,
          bio: affiliateProfile.bio,
          status: affiliateProfile.status,
          paymentMethod: affiliateProfile.paymentMethod
        };
      }
    } else if (updatedUser.role === 'advertiser') {
      const advertiserProfile = await AdvertiserProfile.findOne({
        where: { userId }
      });
      if (advertiserProfile) {
        updatedProfileData = {
          profileId: advertiserProfile.id,
          companyName: advertiserProfile.companyName,
          website: advertiserProfile.website,
          industry: advertiserProfile.industry,
          description: advertiserProfile.description,
          logo: advertiserProfile.logo,
          status: advertiserProfile.status,
          paymentMethod: advertiserProfile.paymentMethod
        };
      }
    }
    
    res.status(200).json({
      message: 'プロフィールが正常に更新されました',
      user: {
        ...updatedUser.toJSON(),
        ...updatedProfileData
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ message: 'プロフィール更新中にエラーが発生しました' });
  }
};

// パスワード変更
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // ユーザーの検索
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    // 現在のパスワードを検証
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '現在のパスワードが正しくありません' });
    }

    // 新しいパスワードが現在のパスワードと同じでないことを確認
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: '新しいパスワードは現在のパスワードと異なる必要があります' });
    }

    // パスワードを更新（モデルのフックで自動的にハッシュ化される）
    await user.update({ password: newPassword });

    res.status(200).json({ message: 'パスワードが正常に変更されました' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ message: 'パスワード変更中にエラーが発生しました' });
  }
};

// パスワードリセットリクエスト
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // ユーザーの存在確認
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // セキュリティ上の理由で、ユーザーが存在しない場合も成功を返す
      return res.status(200).json({ 
        message: 'パスワードリセット手順が送信されました（メールが存在する場合）' 
      });
    }
    
    // リセットトークンを生成
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // リセットトークンの有効期限（1時間）
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    
    // ユーザーにリセットトークンを保存
    await user.update({
      resetToken: resetTokenHash,
      resetTokenExpiry
    });
    
    // 実際のアプリでは、ここでメール送信のロジックを追加
    // 今回はデモのため、リセットリンクのログ出力でシミュレート
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    logger.info(`Password reset link for ${email}: ${resetUrl}`);
    
    res.status(200).json({ 
      message: 'パスワードリセット手順が送信されました（メールが存在する場合）' 
    });
  } catch (error) {
    logger.error('Password reset request error:', error);
    res.status(500).json({ message: 'パスワードリセットリクエスト中にエラーが発生しました' });
  }
};

// パスワードリセット
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // トークンをハッシュ化して照合
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // トークンとその有効期限をチェック
    const user = await User.findOne({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpiry: { [Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({ 
        message: '無効またはリセットトークンの期限が切れています' 
      });
    }
    
    // パスワードを更新（モデルのフックでハッシュ化される）
    await user.update({
      password,
      resetToken: null,
      resetTokenExpiry: null
    });
    
    res.status(200).json({ 
      message: 'パスワードがリセットされました。ログインしてください。' 
    });
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ message: 'パスワードリセット中にエラーが発生しました' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword
};