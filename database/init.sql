-- AffiliateHub データベース初期化

-- データベース作成（Docker Composeで自動作成されます）
-- CREATE DATABASE IF NOT EXISTS affiliatehub;
-- USE affiliatehub;

-- テーブル作成は Sequelize の自動マイグレーションで行うことが推奨されますが、
-- 手動で初期化する場合は以下のスクリプトが使用できます

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'advertiser', 'affiliate') NOT NULL DEFAULT 'affiliate',
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  isActive BOOLEAN DEFAULT TRUE,
  lastLogin DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- アフィリエイトプロフィールテーブル
CREATE TABLE IF NOT EXISTS affiliate_profiles (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  companyName VARCHAR(255),
  website VARCHAR(255),
  niche VARCHAR(255),
  bio TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  taxId VARCHAR(255),
  paymentMethod ENUM('bank_transfer', 'paypal', 'stripe'),
  paymentDetails JSON,
  parentAffiliateId VARCHAR(36),
  commissionTier INT DEFAULT 1,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentAffiliateId) REFERENCES affiliate_profiles(id) ON DELETE SET NULL
);

-- 広告主プロフィールテーブル
CREATE TABLE IF NOT EXISTS advertiser_profiles (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  companyName VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  industry VARCHAR(255),
  description TEXT,
  logo VARCHAR(255),
  billingAddress JSON,
  taxId VARCHAR(255),
  paymentMethod ENUM('credit_card', 'bank_transfer', 'paypal'),
  paymentDetails JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- キャンペーンテーブル
CREATE TABLE IF NOT EXISTS campaigns (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  advertiserId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  targetUrl VARCHAR(255) NOT NULL,
  paymentType ENUM('CPC', 'CPA', 'CPS') NOT NULL,
  commissionType ENUM('fixed', 'percentage') NOT NULL,
  commissionAmount DECIMAL(10, 2) NOT NULL,
  cookieDuration INT NOT NULL DEFAULT 30,
  status ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
  startDate DATETIME,
  endDate DATETIME,
  category VARCHAR(255),
  terms TEXT,
  isPublic BOOLEAN DEFAULT FALSE,
  approvalRequired BOOLEAN DEFAULT TRUE,
  allowedTrafficSources JSON,
  targetCountries JSON,
  budget DECIMAL(10, 2),
  enableTiers BOOLEAN DEFAULT FALSE,
  tierCommissions JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (advertiserId) REFERENCES advertiser_profiles(id) ON DELETE CASCADE
);

-- アフィリエイトリンクテーブル
CREATE TABLE IF NOT EXISTS affiliate_links (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  affiliateId VARCHAR(36) NOT NULL,
  campaignId VARCHAR(36) NOT NULL,
  trackingCode VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  name VARCHAR(255),
  customUrl VARCHAR(255),
  clickCount INT DEFAULT 0,
  conversionCount INT DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (affiliateId) REFERENCES affiliate_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (campaignId) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- クリックトラッキングテーブル
CREATE TABLE IF NOT EXISTS tracking_clicks (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  affiliateLinkId VARCHAR(36) NOT NULL,
  visitorId VARCHAR(255),
  ipAddress VARCHAR(50),
  userAgent TEXT,
  referer VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  device VARCHAR(100),
  browser VARCHAR(100),
  os VARCHAR(100),
  isMobile BOOLEAN,
  metadata JSON,
  isFraud BOOLEAN DEFAULT FALSE,
  fraudReason VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (affiliateLinkId) REFERENCES affiliate_links(id) ON DELETE CASCADE
);

-- コンバージョントラッキングテーブル
CREATE TABLE IF NOT EXISTS tracking_conversions (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  clickId VARCHAR(36) NOT NULL,
  conversionType VARCHAR(255),
  amount DECIMAL(10, 2),
  orderId VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  commission DECIMAL(10, 2),
  metadata JSON,
  isFraud BOOLEAN DEFAULT FALSE,
  fraudReason VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (clickId) REFERENCES tracking_clicks(id) ON DELETE CASCADE
);

-- 支払い方法テーブル
CREATE TABLE IF NOT EXISTS payment_methods (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  type ENUM('bank_transfer', 'paypal', 'stripe', 'credit_card') NOT NULL,
  name VARCHAR(255) NOT NULL,
  details JSON NOT NULL,
  isDefault BOOLEAN DEFAULT FALSE,
  isVerified BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- アフィリエイト支払いテーブル
CREATE TABLE IF NOT EXISTS affiliate_payments (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  affiliateId VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'JPY',
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  paymentMethodId VARCHAR(36),
  transactionId VARCHAR(255),
  periodStart DATETIME NOT NULL,
  periodEnd DATETIME NOT NULL,
  paidAt DATETIME,
  note TEXT,
  metadata JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (affiliateId) REFERENCES affiliate_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id) ON DELETE SET NULL
);

-- 広告主支払いテーブル
CREATE TABLE IF NOT EXISTS advertiser_payments (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  advertiserId VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'JPY',
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  paymentMethodId VARCHAR(36),
  transactionId VARCHAR(255),
  invoiceId VARCHAR(255),
  periodStart DATETIME,
  periodEnd DATETIME,
  paidAt DATETIME,
  note TEXT,
  metadata JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (advertiserId) REFERENCES advertiser_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id) ON DELETE SET NULL
);

-- 通知テーブル
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  metadata JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 不正検知アラートテーブル
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  entityType ENUM('click', 'conversion', 'affiliate', 'campaign') NOT NULL,
  entityId VARCHAR(36) NOT NULL,
  alertType VARCHAR(50) NOT NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL,
  details TEXT,
  status ENUM('open', 'investigating', 'resolved', 'false_positive') DEFAULT 'open',
  resolvedBy VARCHAR(36),
  resolvedAt DATETIME,
  metadata JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (resolvedBy) REFERENCES users(id) ON DELETE SET NULL
);

-- 統計データテーブル（キャンペーンパフォーマンス）
CREATE TABLE IF NOT EXISTS campaign_performance (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  campaignId VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  cost DECIMAL(10, 2) DEFAULT 0,
  ctr DECIMAL(10, 4) DEFAULT 0,
  cr DECIMAL(10, 4) DEFAULT 0,
  epc DECIMAL(10, 4) DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (campaignId) REFERENCES campaigns(id) ON DELETE CASCADE,
  UNIQUE KEY (campaignId, date)
);

-- 統計データテーブル（アフィリエイト統計）
CREATE TABLE IF NOT EXISTS affiliate_stats (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  affiliateId VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  cr DECIMAL(10, 4) DEFAULT 0,
  epc DECIMAL(10, 4) DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (affiliateId) REFERENCES affiliate_profiles(id) ON DELETE CASCADE,
  UNIQUE KEY (affiliateId, date)
);

-- 管理者アカウント作成
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
  UUID(),
  'admin@example.com',
  '$2a$10$XVOCXSwCvfXZJi/ZdxgYLe2f1QkR0UrdVkjM4eC3hkDT/R7Snyxzi', -- password: admin123
  'Admin',
  'User',
  'admin',
  1,
  NOW(),
  NOW()
);