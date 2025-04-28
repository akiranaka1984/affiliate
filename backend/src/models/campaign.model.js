const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { AdvertiserProfile } = require('./advertiser.model');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  advertiserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AdvertiserProfile,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  targetUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentType: {
    type: DataTypes.ENUM('CPC', 'CPA', 'CPS'),
    allowNull: false
  },
  commissionType: {
    type: DataTypes.ENUM('fixed', 'percentage'),
    allowNull: false
  },
  commissionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cookieDuration: {
    type: DataTypes.INTEGER, // days
    allowNull: false,
    defaultValue: 30
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'completed'),
    defaultValue: 'draft'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvalRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowedTrafficSources: {
    type: DataTypes.JSON,
    allowNull: true
  },
  targetCountries: {
    type: DataTypes.JSON,
    allowNull: true
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  // マルチティア設定
  enableTiers: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tierCommissions: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'campaigns',
  timestamps: true
});

// リレーションシップ
Campaign.belongsTo(AdvertiserProfile, { foreignKey: 'advertiserId' });

module.exports = { Campaign };