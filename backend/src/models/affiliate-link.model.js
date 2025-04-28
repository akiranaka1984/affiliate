const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { AffiliateProfile } = require('./affiliate.model');
const { Campaign } = require('./campaign.model');

const AffiliateLink = sequelize.define('AffiliateLink', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  affiliateId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AffiliateProfile,
      key: 'id'
    }
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Campaign,
      key: 'id'
    }
  },
  trackingCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  revenue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'affiliate_links',
  timestamps: true
});

// リレーションシップ
AffiliateLink.belongsTo(AffiliateProfile, { foreignKey: 'affiliateId' });
AffiliateLink.belongsTo(Campaign, { foreignKey: 'campaignId' });

module.exports = { AffiliateLink };