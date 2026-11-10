import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../lib/storage';
import { Campaign } from '../lib/types';

describe('Manual Campaign Management CRUD (Section 2)', () => {
  beforeEach(() => {
    StorageService.clearWorkspace();
  });

  it('creates and retrieves a new campaign with complete fields', () => {
    const campaign: Campaign = {
      id: 'cmp-test-1',
      workspaceId: 'test-workspace',
      accountId: 'act-meta-1',
      name: 'Advantage+ Q4 Test Scale',
      platform: 'Meta Ads',
      accountName: 'Shahid Growth Lab',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 250,
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      spend: 1500,
      revenue: 6000,
      impressions: 50000,
      clicks: 1200,
      conversions: 75,
      roas: 4.0,
      cpa: 20.0,
      cpc: 1.25,
      cpm: 30.0,
      ctr: 2.4,
      notes: 'Initial test of Advantage+ audience broadening',
      updatedAt: new Date().toISOString()
    };

    StorageService.addCampaign(campaign);
    const campaigns = StorageService.getCampaigns();
    expect(campaigns).toHaveLength(1);
    expect(campaigns[0].name).toBe('Advantage+ Q4 Test Scale');
    expect(campaigns[0].roas).toBe(4.0);
    expect(campaigns[0].startDate).toBe('2026-11-01');
  });

  it('updates an existing campaign preserving id and updating timestamps', () => {
    const initial: Campaign = {
      id: 'cmp-test-2',
      workspaceId: 'test-workspace',
      accountId: 'act-meta-1',
      name: 'Original Campaign',
      platform: 'Meta Ads',
      accountName: 'Shahid Growth Lab',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 100,
      spend: 500,
      revenue: 1500,
      impressions: 20000,
      clicks: 500,
      conversions: 20,
      roas: 3.0,
      cpa: 25.0,
      cpc: 1.0,
      cpm: 25.0,
      ctr: 2.5,
      updatedAt: '2026-11-01T00:00:00Z'
    };

    StorageService.addCampaign(initial);

    const updated: Campaign = {
      ...initial,
      name: 'Updated Campaign Scale',
      dailyBudget: 200,
      spend: 1000,
      revenue: 3500,
      roas: 3.5,
      status: 'PAUSED'
    };

    StorageService.updateCampaign(updated);

    const retrieved = StorageService.getCampaign('cmp-test-2');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Updated Campaign Scale');
    expect(retrieved?.dailyBudget).toBe(200);
    expect(retrieved?.status).toBe('PAUSED');
    expect(retrieved?.roas).toBe(3.5);
  });

  it('duplicates an existing campaign with "- Copy" suffix', () => {
    const original: Campaign = {
      id: 'cmp-test-3',
      workspaceId: 'test-workspace',
      accountId: 'act-meta-1',
      name: 'High Margin Funnel',
      platform: 'Meta Ads',
      accountName: 'Shahid Growth Lab',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 150,
      spend: 750,
      revenue: 2250,
      impressions: 30000,
      clicks: 750,
      conversions: 35,
      roas: 3.0,
      cpa: 21.43,
      cpc: 1.0,
      cpm: 25.0,
      ctr: 2.5,
      updatedAt: new Date().toISOString()
    };

    StorageService.addCampaign(original);
    const duplicated = StorageService.duplicateCampaign('cmp-test-3');

    expect(duplicated).not.toBeNull();
    expect(duplicated?.name).toBe('High Margin Funnel (Copy)');
    expect(duplicated?.id).not.toBe('cmp-test-3');

    const all = StorageService.getCampaigns();
    expect(all).toHaveLength(2);
  });

  it('deletes an existing campaign safely', () => {
    const campaign: Campaign = {
      id: 'cmp-test-4',
      workspaceId: 'test-workspace',
      accountId: 'act-meta-1',
      name: 'To Be Deleted',
      platform: 'Meta Ads',
      accountName: 'Shahid Growth Lab',
      objective: 'OUTCOME_SALES',
      status: 'ACTIVE',
      dailyBudget: 50,
      spend: 100,
      revenue: 200,
      impressions: 5000,
      clicks: 100,
      conversions: 5,
      roas: 2.0,
      cpa: 20.0,
      cpc: 1.0,
      cpm: 20.0,
      ctr: 2.0,
      updatedAt: new Date().toISOString()
    };

    StorageService.addCampaign(campaign);
    expect(StorageService.getCampaigns()).toHaveLength(1);

    StorageService.deleteCampaign('cmp-test-4');
    expect(StorageService.getCampaigns()).toHaveLength(0);
  });
});
