import { Campaign, AdCreative, BudgetPlan, ScalingPlan, UserSettings, DailyInsight, AndromedaUpdateArticle } from './types';
import { DEMO_CAMPAIGNS, DEMO_CREATIVES, DEMO_DAILY_INSIGHTS, DEMO_ANDROMEDA_ARTICLES } from './mock-data';

const STORAGE_KEYS = {
  CAMPAIGNS: 'open_mops_campaigns',
  CREATIVES: 'open_mops_creatives',
  BUDGET_PLANS: 'open_mops_budget_plans',
  SCALING_PLANS: 'open_mops_scaling_plans',
  CALCULATIONS: 'open_mops_saved_calculations',
  SETTINGS: 'open_mops_user_settings',
  DAILY_INSIGHTS: 'open_mops_daily_insights',
  ARTICLES: 'open_mops_andromeda_articles',
};

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'USD',
  dateFormat: 'YYYY-MM-DD',
  theme: 'light',
  enableAIInsights: false,
  aiProvider: 'gemini',
  workspaceName: 'Default Workspace',
};

// Safe LocalStorage Helper
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
  },
  deleteCampaign(id: string): void {
    const list = this.getCampaigns().filter(c => c.id !== id);
    this.saveCampaigns(list);
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
  },
  deleteScalingPlan(id: string): void {
    const list = this.getScalingPlans().filter(p => p.id !== id);
    this.saveScalingPlans(list);
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
  },

  // Demo Dataset Loader
  loadDemoDataset(): void {
    this.saveCampaigns(DEMO_CAMPAIGNS);
    this.saveCreatives(DEMO_CREATIVES);
    this.saveDailyInsights(DEMO_DAILY_INSIGHTS);
    this.saveArticles(DEMO_ANDROMEDA_ARTICLES);
  },

  // Clear workspace
  clearWorkspace(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.CREATIVES);
    localStorage.removeItem(STORAGE_KEYS.DAILY_INSIGHTS);
    localStorage.removeItem(STORAGE_KEYS.BUDGET_PLANS);
    localStorage.removeItem(STORAGE_KEYS.SCALING_PLANS);
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
  }
};

