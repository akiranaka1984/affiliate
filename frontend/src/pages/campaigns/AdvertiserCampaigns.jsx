import React, { useState } from 'react';

// モックキャンペーンデータ
const mockCampaigns = [
  {
    id: '1',
    title: 'サマープロモーション',
    description: '夏向け商品のプロモーションキャンペーン。',
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    commissionType: 'cpa',
    commission: 2500,
    category: 'ファッション',
    stats: {
      clicks: 1245,
      conversions: 87,
      revenue: 217500,
      affiliates: 23
    }
  },
  {
    id: '2',
    title: 'スポーツシューズ販促',
    description: '新作スポーツシューズのアフィリエイトプログラム。',
    status: 'active',
    startDate: '2025-04-15',
    endDate: '2025-07-15',
    commissionType: 'percentage',
    commission: 12,
    category: 'スポーツ',
    stats: {
      clicks: 2876,
      conversions: 156,
      revenue: 436800,
      affiliates: 42
    }
  },
  {
    id: '3',
    title: 'ホテル予約キャンペーン',
    description: '夏休みシーズンのホテル予約キャンペーン。',
    status: 'draft',
    startDate: '2025-06-01',
    endDate: '2025-09-30',
    commissionType: 'cpa',
    commission: 1800,
    category: '旅行',
    stats: {
      clicks: 0,
      conversions: 0,
      revenue: 0,
      affiliates: 0
    }
  },
  {
    id: '4',
    title: 'プレミアムサプリメント',
    description: '高品質サプリメントのアフィリエイトプログラム。',
    status: 'paused',
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    commissionType: 'percentage',
    commission: 25,
    category: '健康',
    stats: {
      clicks: 678,
      conversions: 42,
      revenue: 298200,
      affiliates: 15
    }
  },
  {
    id: '5',
    title: 'スマート家電フェア',
    description: '最新のスマート家電製品を紹介するキャンペーン。',
    status: 'completed',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    commissionType: 'percentage',
    commission: 8,
    category: '家電',
    stats: {
      clicks: 3752,
      conversions: 243,
      revenue: 972000,
      affiliates: 65
    }
  },
];

// キャンペーンアイテムコンポーネント
const CampaignItem = ({ campaign, onEdit }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  
  const statusText = {
    active: '実行中',
    draft: '下書き',
    paused: '一時停止',
    completed: '完了'
  };

  return (
    <div className=bg-white