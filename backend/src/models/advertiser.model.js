const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./user.model');

const AdvertiserProfile = sequelize.define('AdvertiserProfile', {
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
    allowNull: false
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billingAddress: {
    type: DataTypes.JSON,
    allowNull: true
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'bank_transfer', 'paypal'),
    allowNull: true
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'advertiser_profiles',
  timestamps: true
});

// リレーションシップ
AdvertiserProfile.belongsTo(User, { foreignKey: 'userId' });

module.exports = { AdvertiserProfile };