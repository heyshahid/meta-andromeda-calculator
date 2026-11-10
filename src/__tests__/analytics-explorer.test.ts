import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../lib/storage';
import { Campaign, AdSet, IndividualAd } from '../lib/types';

describe('Analytics Multi-Tier Explorer', () => {
  beforeEach(() => {
    StorageService.clearWorkspace();
    StorageService.loadDemoDataset();
  });

  it('aggregates campaigns correctly across platforms', () => {
    const campaigns = StorageService.getCampaigns();
    expect(campaigns.length).toBeGreaterThan(0);

    const metaCampaigns = campaigns.filter(c => c.platform === 'Meta Ads');
    const googleCampaigns = campaigns.filter(c => c.platform === 'Google Ads');

    expect(metaCampaigns.length).toBeGreaterThan(0);
    expect(googleCampaigns.length).toBeGreaterThan(0);

    const totalMetaSpend = metaCampaigns.reduce((sum, c) => sum + c.spend, 0);
    expect(totalMetaSpend).toBeGreaterThan(0);
  });

  it('verifies ad sets parent-child relationship with campaigns', () => {
    const campaigns = StorageService.getCampaigns();
    const adSets = StorageService.getAdSets();

    expect(adSets.length).toBeGreaterThan(0);
    const firstAdSet = adSets[0];
    const parentCampaign = campaigns.find(c => c.id === firstAdSet.campaignId);
    expect(parentCampaign).toBeDefined();
    expect(firstAdSet.campaignName).toBe(parentCampaign?.name);
  });

  it('verifies individual ads parent-child relationship with ad sets', () => {
    const adSets = StorageService.getAdSets();
    const ads = StorageService.getAds();

    expect(ads.length).toBeGreaterThan(0);
    const firstAd = ads[0];
    const parentAdSet = adSets.find(s => s.id === firstAd.adSetId);
    expect(parentAdSet).toBeDefined();
    expect(firstAd.adSetName).toBe(parentAdSet?.name);
  });
});

