/**
 * Open MarketingOps - Comprehensive Domain Data Types & Schemas
 */

export type PlatformType = 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'Google Analytics 4' | 'Shopify' | 'WooCommerce';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'CAD' | 'AUD' | 'AED';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export type CampaignObjective = 
  | 'OUTCOME_SALES' 
  | 'OUTCOME_LEADS' 
  | 'OUTCOME_TRAFFIC' 
  | 'OUTCOME_AWARENESS' 
  | 'OUTCOME_ENGAGEMENT';

export interface AdvertisingAccount {
  id: string;
  workspaceId: string;
  name: string;
  platform: PlatformType;
  accountId: string;
  currency: CurrencyCode;
  totalSpend: number;
  status: 'CONNECTED' | 'DISCONNECTED';
}

export interface Campaign {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  platform: PlatformType;
  accountName: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  dailyBudget: number;
  startDate?: string;
  endDate?: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpa: number;
  cpc: number;
  cpm: number;
  ctr: number;
  notes?: string;
  updatedAt: string;
}

export interface AdSet {
  id: string;
  campaignId: string;
  campaignName: string;
  name: string;
  targeting: string;
  status: CampaignStatus;
  dailyBudget: number;
  startDate?: string;
  endDate?: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpa: number;
}

export interface IndividualAd {
  id: string;
  adSetId: string;
  adSetName: string;
  campaignId: string;
  name: string;
  status: CampaignStatus;
  creativeId?: string;
  creativeName?: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpa: number;
  ctr: number;
}

export interface AdCreative {
  id: string;
  workspaceId: string;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL';
  headline: string;
  primaryText: string;
  description?: string;
  previewUrl: string;
  landingPageUrl: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roas: number;
  cpa: number;
  ctr: number;
  videoHookRate3s?: number; // Hook rate %
  videoHoldRate15s?: number; // Hold rate %
  tags: string[];
  notes?: string;
  fatigueStatus?: 'HEALTHY' | 'MONITOR' | 'FATIGUED';
  createdAt: string;
}

export interface DailyInsight {
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  clicks: number;
  impressions: number;
  platform: PlatformType;
}

export interface BudgetPlan {
  id: string;
  name: string;
  createdAt: string;
  monthlyBudget: number;
  dailyBudget: number;
  durationDays: number;
  targetROAS: number;
  targetCPA: number;
  expectedCTR: number;
  expectedCR: number;
  aov: number;
  scenarios: {
    conservative: { spend: number; revenue: number; roas: number; conversions: number };
    balanced: { spend: number; revenue: number; roas: number; conversions: number };
    aggressive: { spend: number; revenue: number; roas: number; conversions: number };
  };
}

export interface SavedCalculation {
  id: string;
  workspaceId: string;
  userId: string;
  calculatorType: string;
  title: string;
  inputs: Record<string, number | string>;
  outputs: Record<string, number | string>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScalingPlan {
  id: string;
  campaignName: string;
  createdAt: string;
  currentBudget: number;
  currentSpend: number;
  currentROAS: number;
  targetROAS: number;
  currentCPA: number;
  targetCPA: number;
  scalingPercentage: number;
  newDailyBudget: number;
  additionalMonthlySpend: number;
  decisionRule: string;
  recommendation: string;
  riskAssessment: 'Safe' | 'Moderate' | 'High Risk';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'CAMPAIGN_CREATED' | 'CSV_IMPORTED' | 'BUDGET_SAVED' | 'SCALING_AUDITED' | 'SETTINGS_UPDATED';
  description: string;
  actor: string;
}

export interface AndromedaUpdateArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Official Meta' | 'Advantage+ AI' | 'Measurement & Attribution' | 'Creative Scaling' | 'API & Architecture';
  publishedDate: string;
  sourceName: string;
  sourceUrl: string;
  content: string;
  isOfficialMeta: boolean;
  isVerified: boolean;
}

export interface UserSettings {
  currency: CurrencyCode;
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  theme: 'light' | 'dark';
  enableAIInsights: boolean;
  aiProvider: 'gemini' | 'openai' | 'anthropic';
  workspaceName: string;
}
