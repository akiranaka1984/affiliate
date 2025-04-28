const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { AffiliateProfile } = require('./affiliate.model');
const { AdvertiserProfile } = require('./advertiser.model');

// 支払い方法モデル
const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('bank_transfer', 'paypal', 'stripe', 'credit_card'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.JSON,
    allowNull: false
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'payment_methods',
  timestamps: true
});

// 支払いモデル（アフィリエイトへの支払い）
const AffiliatePayment = sequelize.define('AffiliatePayment', {
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'JPY'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethodId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: PaymentMethod,
      key: 'id'
    }
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  periodStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  periodEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'affiliate_payments',
  timestamps: true
});

// 広告主支払いモデル（プラットフォームへの支払い）
const AdvertiserPayment = sequelize.define('AdvertiserPayment', {
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'JPY'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethodId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: PaymentMethod,
      key: 'id'
    }
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  invoiceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  periodStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  periodEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'advertiser_payments',
  timestamps: true
});

// リレーションシップ
PaymentMethod.belongsTo(AffiliateProfile, { foreignKey: 'userId', constraints: false });
PaymentMethod.belongsTo(AdvertiserProfile, { foreignKey: 'userId', constraints: false });

AffiliatePayment.belongsTo(AffiliateProfile, { foreignKey: 'affiliateId' });
AffiliatePayment.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });

AdvertiserPayment.belongsTo(AdvertiserProfile, { foreignKey: 'advertiserId' });
AdvertiserPayment.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });

module.exports = {
  PaymentMethod,
  AffiliatePayment,
  AdvertiserPayment
};