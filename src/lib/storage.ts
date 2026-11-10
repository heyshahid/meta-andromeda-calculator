import {
  AdvertisingAccount,
  Campaign,
  AdSet,
  IndividualAd,
  AdCreative,
  BudgetPlan,
  ScalingPlan,
  UserSettings,
  DailyInsight,
  AndromedaUpdateArticle,
  ActivityLog
} from './types';
import {
  DEMO_ACCOUNTS,
  DEMO_CAMPAIGNS,
  DEMO_ADSETS,
  DEMO_ADS,
  DEMO_CREATIVES,
  DEMO_DAILY_INSIGHTS,
  DEMO_ANDROMEDA_ARTICLES,
  DEMO_ACTIVITY_LOGS
} from './mock-data';

const STORAGE_KEYS = {
  ACCOUNTS: 'open_mops_ad_accounts',
  CAMPAIGNS: 'open_mops_campaigns',
  ADSETS: 'open_mops_ad_sets',
  ADS: 'open_mops_individual_ads',
  CREATIVES: 'open_mops_creatives',
  BUDGET_PLANS: 'open_mops_budget_plans',
  SCALING_PLANS: 'open_mops_scaling_plans',
  CALCULATIONS: 'open_mops_saved_calculations',
  SETTINGS: 'open_mops_user_settings',
  DAILY_INSIGHTS: 'open_mops_daily_insights',
  ARTICLES: 'open_mops_andromeda_articles',
  ACTIVITY_LOGS: 'open_mops_activity_logs',
};

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'USD',
  dateFormat: 'YYYY-MM-DD',
  theme: 'light',
  enableAIInsights: false,
  aiProvider: 'gemini',
  workspaceName: 'Shahid Growth Lab',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Accounts
  getAccounts(): AdvertisingAccount[] {
    return getStoredItem<AdvertisingAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
  },
  saveAccounts(accounts: AdvertisingAccount[]): void {
    setStoredItem(STORAGE_KEYS.ACCOUNTS, accounts);
  },
  addAccount(acc: AdvertisingAccount): void {
    const list = this.getAccounts();
    this.saveAccounts([acc, ...list]);
  },

  // Campaigns
  getCampaigns(): Campaign[] {
    return getStoredItem<Campaign[]>(STORAGE_KEYS.CAMPAIGNS, []);
  },
  saveCampaigns(campaigns: Campaign[]): void {
    setStoredItem(STORAGE_KEYS.CAMPAIGNS, campaigns);
  },
  addCampaign(campaign: Campaign): void {
    const list = this.getCampaigns();
    this.saveCampaigns([campaign, ...list]);
    this.logActivity('CAMPAIGN_CREATED', `Created campaign "${campaign.name}" (${campaign.platform})`);
  },
  deleteCampaign(id: string): void {
    const list = this.getCampaigns().filter(c => c.id !== id);
    this.saveCampaigns(list);
  },

  // Ad Sets
  getAdSets(): AdSet[] {
    return getStoredItem<AdSet[]>(STORAGE_KEYS.ADSETS, []);
  },
  saveAdSets(adSets: AdSet[]): void {
    setStoredItem(STORAGE_KEYS.ADSETS, adSets);
  },
  addAdSet(adSet: AdSet): void {
    const list = this.getAdSets();
    this.saveAdSets([adSet, ...list]);
  },
  deleteAdSet(id: string): void {
    const list = this.getAdSets().filter(a => a.id !== id);
    this.saveAdSets(list);
  },

  // Individual Ads
  getAds(): IndividualAd[] {
    return getStoredItem<IndividualAd[]>(STORAGE_KEYS.ADS, []);
  },
  saveAds(ads: IndividualAd[]): void {
    setStoredItem(STORAGE_KEYS.ADS, ads);
  },
  addAd(ad: IndividualAd): void {
    const list = this.getAds();
    this.saveAds([ad, ...list]);
  },
  deleteAd(id: string): void {
    const list = this.getAds().filter(a => a.id !== id);
    this.saveAds(list);
  },

  // Daily Insights
  getDailyInsights(): DailyInsight[] {
    return getStoredItem<DailyInsight[]>(STORAGE_KEYS.DAILY_INSIGHTS, []);
  },
  saveDailyInsights(insights: DailyInsight[]): void {
    setStoredItem(STORAGE_KEYS.DAILY_INSIGHTS, insights);
  },

  // Creatives
  getCreatives(): AdCreative[] {
    return getStoredItem<AdCreative[]>(STORAGE_KEYS.CREATIVES, []);
  },
  saveCreatives(creatives: AdCreative[]): void {
    setStoredItem(STORAGE_KEYS.CREATIVES, creatives);
  },
  addCreative(creative: AdCreative): void {
    const list = this.getCreatives();
    this.saveCreatives([creative, ...list]);
  },
  deleteCreative(id: string): void {
    const list = this.getCreatives().filter(c => c.id !== id);
    this.saveCreatives(list);
  },

  // Budget Plans
  getBudgetPlans(): BudgetPlan[] {
    return getStoredItem<BudgetPlan[]>(STORAGE_KEYS.BUDGET_PLANS, []);
  },
  saveBudgetPlans(plans: BudgetPlan[]): void {
    setStoredItem(STORAGE_KEYS.BUDGET_PLANS, plans);
  },
  addBudgetPlan(plan: BudgetPlan): void {
    const list = this.getBudgetPlans();
    this.saveBudgetPlans([plan, ...list]);
    this.logActivity('BUDGET_SAVED', `Saved budget plan "${plan.name}"`);
  },
  deleteBudgetPlan(id: string): void {
    const list = this.getBudgetPlans().filter(p => p.id !== id);
    this.saveBudgetPlans(list);
  },

  // Scaling Plans
  getScalingPlans(): ScalingPlan[] {
    return getStoredItem<ScalingPlan[]>(STORAGE_KEYS.SCALING_PLANS, []);
  },
  saveScalingPlans(plans: ScalingPlan[]): void {
    setStoredItem(STORAGE_KEYS.SCALING_PLANS, plans);
  },
  addScalingPlan(plan: ScalingPlan): void {
    const list = this.getScalingPlans();
    this.saveScalingPlans([plan, ...list]);
    this.logActivity('SCALING_AUDITED', `Audited +${plan.scalingPercentage}% scaling plan for "${plan.campaignName}"`);
  },
  deleteScalingPlan(id: string): void {
    const list = this.getScalingPlans().filter(p => p.id !== id);
    this.saveScalingPlans(list);
  },

  // Activity Logs
  getActivityLogs(): ActivityLog[] {
    return getStoredItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
  },
  logActivity(type: ActivityLog['type'], description: string): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      actor: 'Shahid Akram'
    };
    setStoredItem(STORAGE_KEYS.ACTIVITY_LOGS, [newLog, ...logs.slice(0, 24)]);
  },

  // Andromeda Updates
  getArticles(): AndromedaUpdateArticle[] {
    return getStoredItem<AndromedaUpdateArticle[]>(STORAGE_KEYS.ARTICLES, DEMO_ANDROMEDA_ARTICLES);
  },
  saveArticles(articles: AndromedaUpdateArticle[]): void {
    setStoredItem(STORAGE_KEYS.ARTICLES, articles);
  },

  // Settings
  getSettings(): UserSettings {
    return getStoredItem<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings: UserSettings): void {
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
    this.logActivity('SETTINGS_UPDATED', `Updated workspace settings (${settings.currency})`);
  },

  // Demo Dataset Loader
  loadDemoDataset(): void {
    this.saveAccounts(DEMO_ACCOUNTS);
    this.saveCampaigns(DEMO_CAMPAIGNS);
    this.saveAdSets(DEMO_ADSETS);
    this.saveAds(DEMO_ADS);
    this.saveCreatives(DEMO_CREATIVES);
    this.saveDailyInsights(DEMO_DAILY_INSIGHTS);
    this.saveArticles(DEMO_ANDROMEDA_ARTICLES);
    setStoredItem(STORAGE_KEYS.ACTIVITY_LOGS, DEMO_ACTIVITY_LOGS);
  },

  // Clear workspace
  clearWorkspace(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.ADSETS);
    localStorage.removeItem(STORAGE_KEYS.ADS);
    localStorage.removeItem(STORAGE_KEYS.CREATIVES);
    localStorage.removeItem(STORAGE_KEYS.DAILY_INSIGHTS);
    localStorage.removeItem(STORAGE_KEYS.BUDGET_PLANS);
    localStorage.removeItem(STORAGE_KEYS.SCALING_PLANS);
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
  }
};
