"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/ui/KPICard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";
import { CSVImportWizard } from "@/components/csv/CSVImportWizard";
import { AddCampaignModal } from "@/components/campaigns/AddCampaignModal";
import { StorageService } from "@/lib/storage";
import { Campaign, CurrencyCode, DailyInsight, AdvertisingAccount } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import {
  DollarSign,
  TrendingUp,
  Target,
  MousePointerClick,
  Eye,
  ShoppingBag,
  Layers,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  RotateCcw,
  Calendar,
  Building2
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<AdvertisingAccount[]>([]);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  
  // 5 Functional Filters as required by Section 1
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>("ALL");
  const [campaignFilter, setCampaignFilter] = useState<string>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState<"ALL" | "7d" | "14d" | "30d">("ALL");

  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = () => {
    const loadedCampaigns = StorageService.getCampaigns();
    const loadedAccounts = StorageService.getAccounts();
    const loadedInsights = StorageService.getDailyInsights();
    const settings = StorageService.getSettings();
    setCampaigns(loadedCampaigns);
    setAccounts(loadedAccounts);
    setInsights(loadedInsights);
    setCurrency(settings.currency);
  };

  useEffect(() => {
    loadData();

    const handleStorageUpdate = () => loadData();
    window.addEventListener("data-storage-update", handleStorageUpdate);
    window.addEventListener("currency-change", handleStorageUpdate);

    return () => {
      window.removeEventListener("data-storage-update", handleStorageUpdate);
      window.removeEventListener("currency-change", handleStorageUpdate);
    };
  }, []);

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    setCurrency(newCurr);
    const settings = StorageService.getSettings();
    StorageService.saveSettings({ ...settings, currency: newCurr });
  };

  const handleResetFilters = () => {
    setPlatformFilter("ALL");
    setAccountFilter("ALL");
    setCampaignFilter("ALL");
    setDateRangeFilter("ALL");
  };

  const isFilterActive = platformFilter !== "ALL" || accountFilter !== "ALL" || campaignFilter !== "ALL" || dateRangeFilter !== "ALL";

  // Filter Campaigns based on platform, account, and campaign ID
  const filteredCampaigns = campaigns.filter((c) => {
    if (platformFilter !== "ALL" && c.platform !== platformFilter) return false;
    if (accountFilter !== "ALL" && c.accountId !== accountFilter) return false;
    if (campaignFilter !== "ALL" && c.id !== campaignFilter) return false;
    return true;
  });

  // Filter Insights based on platform and date range
  const filteredInsights = insights
    .filter((item) => {
      if (platformFilter !== "ALL" && item.platform !== platformFilter) return false;
      return true;
    })
    .slice(
      dateRangeFilter === "7d" ? -7 :
      dateRangeFilter === "14d" ? -14 :
      dateRangeFilter === "30d" ? -30 : 0
    );

  // Deterministic KPI aggregations based on filtered campaigns
  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = filteredCampaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalConversions = filteredCampaigns.reduce((acc, c) => acc + c.conversions, 0);
  const totalClicks = filteredCampaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalImpressions = filteredCampaigns.reduce((acc, c) => acc + c.impressions, 0);

  const blendedROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const blendedCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const blendedCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const blendedCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const blendedCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
  const aov = totalConversions > 0 ? totalRevenue / totalConversions : 0;
  const netROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

  // Top performers vs Attention required
  const topCampaigns = [...filteredCampaigns].sort((a, b) => b.roas - a.roas).slice(0, 3);
  const attentionCampaigns = [...filteredCampaigns].filter((c) => c.roas < 2.0 && c.spend > 100);

  return (
    <>
      <Header 
        onDataRefresh={loadData} 
        onOpenAddModal={() => setIsAddOpen(true)} 
      />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Control Bar & Functional Filter Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Executive Dashboard</h1>
            <p className="text-secondary text-[#64748B]">Real-time blended advertising performance, unit economics, and campaign velocity.</p>
          </div>

          {/* 5 Functional Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Date Range Filter */}
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white px-2 py-1.5 text-xs shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value as any)}
                className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="14d">Last 14 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* 2. Platform Filter */}
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white px-2 py-1.5 text-xs shadow-xs">
              <Filter className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={platformFilter}
                onChange={(e) => {
                  setPlatformFilter(e.target.value);
                  setCampaignFilter("ALL"); // Reset campaign if platform changes
                }}
                className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Platforms</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="TikTok Ads">TikTok Ads</option>
              </select>
            </div>

            {/* 3. Advertising Account Filter */}
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white px-2 py-1.5 text-xs shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL">All Accounts</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Campaign Filter */}
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white px-2 py-1.5 text-xs shadow-xs">
              <Layers className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="ALL">All Campaigns ({campaigns.length})</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Currency Selector */}
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white px-2 py-1.5 text-xs shadow-xs">
              <DollarSign className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-transparent font-bold text-[#172033] focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="AED">AED (AED)</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold hover:bg-[#FCA5A5] transition-colors"
                title="Reset all filters to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State when no campaigns exist */}
        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns active in this workspace"
            description="Open MarketingOps operates on deterministic data. Add your campaigns manually, import a CSV export, or load the pre-built demo dataset to explore all features."
            onAddCampaign={() => setIsAddOpen(true)}
            onUploadCSV={() => setIsCSVOpen(true)}
            onLoadDemo={() => {
              StorageService.loadDemoDataset();
              loadData();
            }}
          />
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-[#F59E0B] mx-auto" />
            <h3 className="text-base font-bold text-[#172033]">No campaigns match the selected filters</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Your active filter combination returned 0 campaigns. Reset your filters or change parameter selections to view performance.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              Clear Active Filters
            </button>
          </div>
        ) : (
          <>
            {/* KPI Metrics Grid (10 Core Metrics as specified in Section 1 & Section 3.A) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KPICard
                label="Total Ad Spend"
                value={formatCurrency(totalSpend, currency)}
                subValue={`${filteredCampaigns.length} campaigns`}
                icon={DollarSign}
                tooltip="Sum of all recorded advertising expenditures."
              />
              <KPICard
                label="Total Revenue"
                value={formatCurrency(totalRevenue, currency)}
                subValue={`Net: ${formatCurrency(totalRevenue - totalSpend, currency)}`}
                trend={{ value: "+14.2%", isPositive: true }}
                icon={TrendingUp}
                tooltip="Gross revenue attributed to advertising."
              />
              <KPICard
                label="Blended ROAS"
                value={`${blendedROAS.toFixed(2)}x`}
                subValue={blendedROAS >= 3.0 ? "Scaling Tier" : "Monitor Margin"}
                trend={{ value: `${blendedROAS.toFixed(1)}x`, isPositive: blendedROAS >= 2.5 }}
                icon={Target}
                tooltip="Return on Ad Spend: Revenue / Ad Spend"
              />
              <KPICard
                label="Blended CPA"
                value={formatCurrency(blendedCPA, currency)}
                subValue={`${totalConversions} conversions`}
                icon={ShoppingBag}
                tooltip="Cost Per Acquisition: Total Spend / Conversions"
              />
              <KPICard
                label="Blended ROI"
                value={formatPercent(netROI)}
                subValue="Net Return on Investment"
                icon={TrendingUp}
                tooltip="(Net Profit / Investment) × 100"
              />
              <KPICard
                label="Total Conversions"
                value={totalConversions.toLocaleString()}
                subValue={`AOV: ${formatCurrency(aov, currency)}`}
                icon={CheckCircle2}
                tooltip="Purchases / primary conversion events."
              />
              <KPICard
                label="Average Order Value"
                value={formatCurrency(aov, currency)}
                subValue="Revenue / Total Orders"
                icon={ShoppingBag}
                tooltip="Average cart transaction value."
              />
              <KPICard
                label="Average CTR"
                value={formatPercent(blendedCTR)}
                subValue={`${totalClicks.toLocaleString()} link clicks`}
                icon={MousePointerClick}
                tooltip="Click-Through Rate: (Clicks / Impressions) × 100"
              />
              <KPICard
                label="Average CPC"
                value={formatCurrency(blendedCPC, currency)}
                subValue="Cost per Link Click"
                icon={MousePointerClick}
                tooltip="Ad Spend / Total Clicks"
              />
              <KPICard
                label="Average CPM"
                value={formatCurrency(blendedCPM, currency)}
                subValue={`${totalImpressions.toLocaleString()} views`}
                icon={Eye}
                tooltip="Cost per 1,000 Impressions"
              />
            </div>

            {/* Dynamic Performance Charts with all 5 visualization modes */}
            <PerformanceCharts
              insights={filteredInsights}
              campaigns={filteredCampaigns}
              currencySymbol={currency === "USD" ? "$" : currency + " "}
            />

            {/* Performance Comparison Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Campaigns */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <h4 className="text-sm font-bold text-[#172033]">Top Performing Campaigns</h4>
                  </div>
                  <Link href="/campaigns" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center">
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {topCampaigns.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="min-w-0 pr-3">
                        <span className="block text-xs font-semibold text-[#172033] truncate">{c.name}</span>
                        <span className="text-[11px] text-[#64748B]">{c.platform} • Spend: {formatCurrency(c.spend, currency)}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-bold text-[#16A34A]">{c.roas.toFixed(2)}x ROAS</span>
                        <span className="text-[11px] text-[#64748B]">CPA: {formatCurrency(c.cpa, currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns Requiring Attention */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-[#D97706]" />
                    <h4 className="text-sm font-bold text-[#172033]">Requires Attention</h4>
                  </div>
                  <Link href="/scaling" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center">
                    <span>Scaling Engine</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>

                {attentionCampaigns.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#64748B]">
                    All filtered campaigns are operating above target break-even thresholds.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attentionCampaigns.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
                        <div className="min-w-0 pr-3">
                          <span className="block text-xs font-semibold text-[#172033] truncate">{c.name}</span>
                          <span className="text-[11px] text-[#92400E]">ROAS below 2.0x target threshold</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-xs font-bold text-[#D97706]">{c.roas.toFixed(2)}x</span>
                          <span className="text-[11px] text-[#92400E]">CPA: {formatCurrency(c.cpa, currency)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* CSV Import Wizard Modal */}
      <CSVImportWizard
        isOpen={isCSVOpen}
        onClose={() => setIsCSVOpen(false)}
        onImportComplete={() => {
          loadData();
          setIsCSVOpen(false);
        }}
      />

      {/* Manual Campaign Modal */}
      <AddCampaignModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadData}
      />
    </>
  );
}
