-- Open MarketingOps Phase 2: Functional MVP Schema Upgrade
-- Multi-Tenant Relational Entities, Foreign Keys & Row Level Security (RLS)

-- 1. Extend campaigns table with start_date, end_date, notes
ALTER TABLE IF EXISTS campaigns 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Ad Sets Table (Child of Campaign)
CREATE TABLE IF NOT EXISTS ad_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    targeting TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    daily_budget NUMERIC(14, 2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    spend NUMERIC(14, 2) DEFAULT 0.00,
    revenue NUMERIC(14, 2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    roas NUMERIC(10, 4) DEFAULT 0.0000,
    cpa NUMERIC(14, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Individual Ads Table (Child of Ad Set)
CREATE TABLE IF NOT EXISTS individual_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    creative_id UUID REFERENCES creatives(id) ON DELETE SET NULL,
    spend NUMERIC(14, 2) DEFAULT 0.00,
    revenue NUMERIC(14, 2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    roas NUMERIC(10, 4) DEFAULT 0.0000,
    cpa NUMERIC(14, 2) DEFAULT 0.00,
    ctr NUMERIC(10, 4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Budget Plans Table
CREATE TABLE IF NOT EXISTS budget_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    monthly_budget NUMERIC(14, 2) NOT NULL,
    daily_budget NUMERIC(14, 2) NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    target_roas NUMERIC(10, 4) NOT NULL DEFAULT 2.5000,
    target_cpa NUMERIC(14, 2) NOT NULL DEFAULT 25.00,
    expected_ctr NUMERIC(10, 4) DEFAULT 2.0000,
    expected_cr NUMERIC(10, 4) DEFAULT 3.0000,
    aov NUMERIC(14, 2) DEFAULT 50.00,
    scenarios JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Saved Calculations Table (Persistent calculation audits)
CREATE TABLE IF NOT EXISTS saved_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID,
    calculator_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    inputs JSONB NOT NULL,
    outputs JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_ad_sets_campaign ON ad_sets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_sets_workspace ON ad_sets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_individual_ads_ad_set ON individual_ads(ad_set_id);
CREATE INDEX IF NOT EXISTS idx_individual_ads_campaign ON individual_ads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_budget_plans_workspace ON budget_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_saved_calcs_workspace ON saved_calculations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_saved_calcs_type ON saved_calculations(calculator_type);

-- 7. Row Level Security (RLS) Enablement
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- 8. Multi-tenant RLS Policies
CREATE POLICY ad_sets_tenant_isolation ON ad_sets
    FOR ALL
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY individual_ads_tenant_isolation ON individual_ads
    FOR ALL
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY budget_plans_tenant_isolation ON budget_plans
    FOR ALL
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY saved_calcs_tenant_isolation ON saved_calculations
    FOR ALL
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));
