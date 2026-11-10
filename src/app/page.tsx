"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/ui/KPICard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";
import { CSVImportWizard } from "@/components/csv/CSVImportWizard";
import { AddCampaignModal } from "@/components/campaigns/AddCampaignModal";
import { StorageService } from "@/lib/storage";
import { Campaign, CurrencyCode, DailyInsight } from "@/lib/types";
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
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = () => {
    const loadedCampaigns = StorageService.getCampaigns();
    const loadedInsights = StorageService.getDailyInsights();
    const settings = StorageService.getSettings();
    setCampaigns(loadedCampaigns);
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

  const filteredCampaigns = platformFilter === "ALL" 
    ? campaigns 
    : campaigns.filter(c => c.platform === platformFilter);

  // Deterministic KPI aggregations
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
  const attentionCampaigns = [...filteredCampaigns].filter(c => c.roas < 2.0 && c.spend > 100);

  return (
    <>
      <Header 
        onDataRefresh={loadData} 
        onOpenAddModal={() => setIsAddOpen(true)} 
      />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Executive Dashboard</h1>
            <p className="text-secondary text-[#64748B]">Real-time blended advertising performance, unit economics, and campaign velocity.</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white p-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#64748B] ml-1 mr-0.5" />
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">All Platforms</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="TikTok Ads">TikTok Ads</option>
              </select>
            </div>
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
        ) : (
          <>
            {/* KPI Metrics Grid (10 Core Metrics as specified in Section 3.A) */}
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

            {/* Performance Charts */}
            <PerformanceCharts insights={insights} currencySymbol={currency === "USD" ? "$" : currency + " "} />

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
                    All active campaigns are currently operating above target break-even thresholds.
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

