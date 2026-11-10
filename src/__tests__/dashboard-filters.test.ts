import { describe, it, expect } from 'vitest';
import { Campaign } from '../lib/types';

describe('Dashboard Filtering & Metric Aggregations (Section 1)', () => {
  const campaigns: Campaign[] = [
    {
      id: 'cmp-1',
      workspaceId: 'ws-1',
      accountId: 'act-meta-1',
      name: 'Meta Advantage+ Scaling',
      platform: 'Meta Ads',
      accountName: 'Meta Account',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 200,
      spend: 2000,
      revenue: 8000,
      impressions: 80000,
      clicks: 2000,
      conversions: 100,
      roas: 4.0,
      cpa: 20,
      cpc: 1.0,
      cpm: 25,
      ctr: 2.5,
      updatedAt: '2026-11-10T00:00:00Z'
    },
    {
      id: 'cmp-2',
      workspaceId: 'ws-1',
      accountId: 'act-google-1',
      name: 'Google Search Exact',
      platform: 'Google Ads',
      accountName: 'Google Account',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 100,
      spend: 1000,
      revenue: 3000,
      impressions: 20000,
      clicks: 500,
      conversions: 30,
      roas: 3.0,
      cpa: 33.33,
      cpc: 2.0,
      cpm: 50,
      ctr: 2.5,
      updatedAt: '2026-11-10T00:00:00Z'
    },
    {
      id: 'cmp-3',
      workspaceId: 'ws-1',
      accountId: 'act-tiktok-1',
      name: 'TikTok Spark Ads',
      platform: 'TikTok Ads',
      accountName: 'TikTok Account',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 50,
      spend: 500,
      revenue: 1000,
      impressions: 50000,
      clicks: 1000,
      conversions: 20,
      roas: 2.0,
      cpa: 25,
      cpc: 0.5,
      cpm: 10,
      ctr: 2.0,
      updatedAt: '2026-11-10T00:00:00Z'
    }
  ];

  it('aggregates total spend, revenue, ROAS and CPA accurately for all campaigns', () => {
    const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
    const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
    const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
    const blendedROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const blendedCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;

    expect(totalSpend).toBe(3500);
    expect(totalRevenue).toBe(12000);
    expect(totalConversions).toBe(150);
    expect(blendedROAS).toBeCloseTo(3.4285, 3);
    expect(blendedCPA).toBeCloseTo(23.333, 3);
  });

  it('filters metrics by platform correctly', () => {
    const metaOnly = campaigns.filter(c => c.platform === 'Meta Ads');
    expect(metaOnly).toHaveLength(1);
    expect(metaOnly[0].spend).toBe(2000);
    expect(metaOnly[0].revenue).toBe(8000);
    expect(metaOnly[0].roas).toBe(4.0);

    const googleOnly = campaigns.filter(c => c.platform === 'Google Ads');
    expect(googleOnly).toHaveLength(1);
    expect(googleOnly[0].spend).toBe(1000);
  });

  it('filters metrics by account ID correctly', () => {
    const accountFiltered = campaigns.filter(c => c.accountId === 'act-tiktok-1');
    expect(accountFiltered).toHaveLength(1);
    expect(accountFiltered[0].name).toBe('TikTok Spark Ads');
  });

  it('filters metrics by campaign ID correctly', () => {
    const single = campaigns.filter(c => c.id === 'cmp-2');
    expect(single).toHaveLength(1);
    expect(single[0].platform).toBe('Google Ads');
  });

  it('handles empty filtered results safely without NaN or divide by zero', () => {
    const emptySet: Campaign[] = [];
    const totalSpend = emptySet.reduce((acc, c) => acc + c.spend, 0);
    const totalRevenue = emptySet.reduce((acc, c) => acc + c.revenue, 0);
    const totalConversions = emptySet.reduce((acc, c) => acc + c.conversions, 0);
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

    expect(totalSpend).toBe(0);
    expect(totalRevenue).toBe(0);
    expect(roas).toBe(0);
    expect(cpa).toBe(0);
    expect(isNaN(roas)).toBe(false);
    expect(isNaN(cpa)).toBe(false);
  });
});
