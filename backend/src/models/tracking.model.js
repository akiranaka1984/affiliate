const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { AffiliateLink } = require('./affiliate-link.model');

// クリックトラッキングモデル
const TrackingClick = sequelize.define('TrackingClick', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  affiliateLinkId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AffiliateLink,
      key: 'id'
    }
  },
  visitorId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isMobile: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isFraud: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fraudReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'tracking_clicks',
  timestamps: true
});

// コンバージョントラッキングモデル
const TrackingConversion = sequelize.define('TrackingConversion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clickId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: TrackingClick,
      key: 'id'
    }
  },
  conversionType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  commission: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isFraud: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fraudReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'tracking_conversions',
  timestamps: true
});

// リレーションシップ
TrackingClick.belongsTo(AffiliateLink, { foreignKey: 'affiliateLinkId' });
TrackingConversion.belongsTo(TrackingClick, { foreignKey: 'clickId' });
TrackingClick.hasMany(TrackingConversion, { foreignKey: 'clickId' });

module.exports = { 
  TrackingClick,
  TrackingConversion
};