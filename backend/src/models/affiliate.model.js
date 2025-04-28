const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./user.model');

const AffiliateProfile = sequelize.define('AffiliateProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  niche: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'paypal', 'stripe'),
    allowNull: true
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  parentAffiliateId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'affiliate_profiles',
      key: 'id'
    }
  },
  commissionTier: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'affiliate_profiles',
  timestamps: true
});

// リレーションシップ
AffiliateProfile.belongsTo(User, { foreignKey: 'userId' });
AffiliateProfile.hasMany(AffiliateProfile, { 
  as: 'referredAffiliates',
  foreignKey: 'parentAffiliateId'
});
AffiliateProfile.belongsTo(AffiliateProfile, { 
  as: 'referrer',
  foreignKey: 'parentAffiliateId'
});

module.exports = { AffiliateProfile };