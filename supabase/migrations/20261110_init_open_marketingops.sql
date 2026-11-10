-- Open MarketingOps: Production Relational Schema & Multi-Tenant RLS
-- PostgreSQL / Supabase Schema Definition

-- 1. Workspaces (Tenant Boundary)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspace Members
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Advertising Accounts
CREATE TABLE IF NOT EXISTS advertising_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'Meta Ads', 'Google Ads', 'TikTok Ads'
    account_id VARCHAR(100) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    account_id UUID REFERENCES advertising_accounts(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    objective VARCHAR(100) DEFAULT 'OUTCOME_SALES',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    daily_budget NUMERIC(14, 2) DEFAULT 0.00,
    spend NUMERIC(14, 2) DEFAULT 0.00,
    revenue NUMERIC(14, 2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    roas NUMERIC(10, 4) DEFAULT 0.0000,
    cpa NUMERIC(14, 2) DEFAULT 0.00,
    cpc NUMERIC(14, 2) DEFAULT 0.00,
    cpm NUMERIC(14, 2) DEFAULT 0.00,
    ctr NUMERIC(10, 4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ad Creatives
CREATE TABLE IF NOT EXISTS creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'IMAGE', -- 'IMAGE', 'VIDEO', 'REEL', 'CAROUSEL'
    headline TEXT,
    primary_text TEXT,
    preview_url TEXT,
    landing_page_url TEXT,
    spend NUMERIC(14, 2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    revenue NUMERIC(14, 2) DEFAULT 0.00,
    roas NUMERIC(10, 4) DEFAULT 0.0000,
    cpa NUMERIC(14, 2) DEFAULT 0.00,
    ctr NUMERIC(10, 4) DEFAULT 0.0000,
    video_hook_rate_3s NUMERIC(8, 2),
    video_hold_rate_15s NUMERIC(8, 2),
    fatigue_status VARCHAR(50) DEFAULT 'HEALTHY',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Daily Insights (Time-series)
CREATE TABLE IF NOT EXISTS daily_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    spend NUMERIC(14, 2) DEFAULT 0.00,
    revenue NUMERIC(14, 2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast aggregations
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creatives_workspace ON creatives(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insights_date ON daily_insights(date);

-- Row Level Security (RLS) Enablement
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies (Placeholder for Supabase Auth context)
CREATE POLICY workspace_isolation_campaigns ON campaigns
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY workspace_isolation_creatives ON creatives
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

