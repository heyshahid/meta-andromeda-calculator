"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AddCampaignModal } from "@/components/campaigns/AddCampaignModal";
import { StorageService } from "@/lib/storage";
import { AdvertisingAccount, Campaign, AdSet, IndividualAd, CurrencyCode, CampaignStatus } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Play,
  Pause,
  ExternalLink,
  Target,
  ShoppingBag,
  Users,
  CheckCircle2,
  FolderTree
} from "lucide-react";

export default function CampaignManagerPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [activeTab, setActiveTab] = useState<"campaigns" | "adsets" | "ads" | "accounts">("campaigns");
  const [accounts, setAccounts] = useState<AdvertisingAccount[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<IndividualAd[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = () => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setAccounts(StorageService.getAccounts());
    setCampaigns(StorageService.getCampaigns());
    setAdSets(StorageService.getAdSets());
    setAds(StorageService.getAds());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("data-storage-update", loadData);
    return () => window.removeEventListener("data-storage-update", loadData);
  }, []);

  const handleDeleteCampaign = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      StorageService.deleteCampaign(id);
      loadData();
    }
  };

  const toggleCampaignStatus = (c: Campaign) => {
    const updated: Campaign = {
      ...c,
      status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
    };
    const list = campaigns.map(item => item.id === c.id ? updated : item);
    StorageService.saveCampaigns(list);
    loadData();
  };

  return (
    <>
      <Header onOpenAddModal={() => setIsAddOpen(true)} />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Campaign Hierarchy Manager</h1>
            <p className="text-secondary text-[#64748B]">Manage full 4-tier structural depth: Ad Account ➔ Campaign ➔ Ad Set ➔ Individual Ad.</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {/* 4-Tier Hierarchy Navigation Tabs */}
        <div className="flex space-x-2 border-b border-[#E2E8F0] pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("campaigns")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "campaigns"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
            }`}
          >
            Campaigns ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("adsets")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "adsets"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
            }`}
          >
            Ad Sets ({adSets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ads")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "ads"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
            }`}
          >
            Individual Ads ({ads.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("accounts")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "accounts"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
            }`}
          >
            Ad Accounts ({accounts.length})
          </button>
        </div>

        {/* Tab 1: Campaigns */}
        {activeTab === "campaigns" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="divide-y divide-[#F1F5F9]">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No campaigns registered. Click "Create Campaign" or "Load Demo Data" in the top bar.
                </div>
              ) : (
                campaigns.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => toggleCampaignStatus(c)}
                          title={`Click to ${c.status === "ACTIVE" ? "pause" : "activate"}`}
                          className="flex items-center"
                        >
                          {c.status === "ACTIVE" ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] block" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] block" />
                          )}
                        </button>
                        <strong className="text-sm font-semibold text-[#172033]">{c.name}</strong>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          {c.platform}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === "ACTIVE" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-3">
                        <span>Daily Budget: <strong>{formatCurrency(c.dailyBudget, currency)}</strong></span>
                        <span>•</span>
                        <span>Spend: <strong>{formatCurrency(c.spend, currency)}</strong></span>
                        <span>•</span>
                        <span>Revenue: <strong>{formatCurrency(c.revenue, currency)}</strong></span>
                        <span>•</span>
                        <span className="text-[#16A34A] font-bold">{c.roas.toFixed(2)}x ROAS</span>
                        <span>•</span>
                        <span>CPA: {formatCurrency(c.cpa, currency)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(c.id)}
                        className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Ad Sets */}
        {activeTab === "adsets" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="divide-y divide-[#F1F5F9]">
              {adSets.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No Ad Sets configured. Click "Load Demo Data" in the top bar to inspect pre-configured multi-tier Ad Sets.
                </div>
              ) : (
                adSets.map((as) => (
                  <div key={as.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FolderTree className="w-4 h-4 text-[#2563EB]" />
                        <strong className="text-sm font-semibold text-[#172033]">{as.name}</strong>
                        <span className="text-[10px] text-[#64748B]">under {as.campaignName}</span>
                      </div>
                      <div className="text-xs text-[#64748B] flex items-center space-x-3">
                        <span>Targeting: <em className="text-[#172033] font-normal">{as.targeting}</em></span>
                        <span>•</span>
                        <span>Daily Budget: {formatCurrency(as.dailyBudget, currency)}</span>
                        <span>•</span>
                        <span className="text-[#16A34A] font-bold">{as.roas.toFixed(2)}x ROAS</span>
                        <span>•</span>
                        <span>CPA: {formatCurrency(as.cpa, currency)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Individual Ads */}
        {activeTab === "ads" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="divide-y divide-[#F1F5F9]">
              {ads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No individual ads registered yet. Load demo dataset to explore individual ad-level metrics.
                </div>
              ) : (
                ads.map((ad) => (
                  <div key={ad.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
                    <div className="space-y-1">
                      <strong className="text-sm font-semibold text-[#172033] block">{ad.name}</strong>
                      <div className="text-xs text-[#64748B] flex items-center space-x-3">
                        <span>Ad Set: {ad.adSetName}</span>
                        <span>•</span>
                        <span>Creative: {ad.creativeName}</span>
                        <span>•</span>
                        <span>Spend: {formatCurrency(ad.spend, currency)}</span>
                        <span>•</span>
                        <span className="text-[#16A34A] font-bold">{ad.roas.toFixed(2)}x ROAS</span>
                        <span>•</span>
                        <span>CTR: {formatPercent(ad.ctr)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Ad Accounts */}
        {activeTab === "accounts" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="divide-y divide-[#F1F5F9]">
              {accounts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No ad accounts connected.
                </div>
              ) : (
                accounts.map((acc) => (
                  <div key={acc.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                        <strong className="text-sm font-semibold text-[#172033]">{acc.name}</strong>
                        <span className="text-xs text-[#64748B]">({acc.accountId})</span>
                      </div>
                      <span className="text-xs text-[#64748B] block">
                        Platform: {acc.platform} • Lifetime Spend: {formatCurrency(acc.totalSpend, currency)}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-[#DCFCE7] text-[#16A34A] font-bold">
                      {acc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <AddCampaignModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadData}
      />
    </>
  );
}
