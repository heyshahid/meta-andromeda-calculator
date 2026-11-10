"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AddCampaignModal } from "@/components/campaigns/AddCampaignModal";
import { EditCampaignModal } from "@/components/campaigns/EditCampaignModal";
import { CampaignDetailsModal } from "@/components/campaigns/CampaignDetailsModal";
import { AddAdSetModal } from "@/components/campaigns/AddAdSetModal";
import { AddAdModal } from "@/components/campaigns/AddAdModal";
import { StorageService } from "@/lib/storage";
import { AdvertisingAccount, Campaign, AdSet, IndividualAd, CurrencyCode, CampaignStatus } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Info,
  Calendar,
  Target,
  ShoppingBag,
  Users,
  CheckCircle2,
  FolderTree,
  ExternalLink,
  Building2
} from "lucide-react";

export default function CampaignManagerPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [activeTab, setActiveTab] = useState<"campaigns" | "adsets" | "ads" | "accounts">("campaigns");
  const [accounts, setAccounts] = useState<AdvertisingAccount[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<IndividualAd[]>([]);

  // Modals state
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isAddAdSetOpen, setIsAddAdSetOpen] = useState(false);
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [inspectingCampaign, setInspectingCampaign] = useState<Campaign | null>(null);

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

  const handleDuplicateCampaign = (id: string) => {
    const dup = StorageService.duplicateCampaign(id);
    if (dup) {
      loadData();
    }
  };

  const toggleCampaignStatus = (c: Campaign) => {
    const updated: Campaign = {
      ...c,
      status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
    };
    StorageService.updateCampaign(updated);
    loadData();
  };

  const handleDeleteAdSet = (id: string) => {
    if (confirm("Delete this Ad Set?")) {
      StorageService.deleteAdSet(id);
      loadData();
    }
  };

  const handleDeleteAd = (id: string) => {
    if (confirm("Delete this Ad?")) {
      StorageService.deleteAd(id);
      loadData();
    }
  };

  return (
    <>
      <Header onOpenAddModal={() => setIsAddCampaignOpen(true)} />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Campaign Hierarchy Manager</h1>
            <p className="text-secondary text-[#64748B]">Manage full 4-tier structural depth: Ad Account ➔ Campaign ➔ Ad Set ➔ Individual Ad.</p>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === "campaigns" && (
              <button
                type="button"
                onClick={() => setIsAddCampaignOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Campaign</span>
              </button>
            )}
            {activeTab === "adsets" && (
              <button
                type="button"
                onClick={() => setIsAddAdSetOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Ad Set</span>
              </button>
            )}
            {activeTab === "ads" && (
              <button
                type="button"
                onClick={() => setIsAddAdOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Ad</span>
              </button>
            )}
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
                  No campaigns registered. Click "Create Campaign" or "Load Demo Dataset" in the top bar.
                </div>
              ) : (
                campaigns.map((c) => (
                  <div key={c.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
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
                        <button
                          type="button"
                          onClick={() => setInspectingCampaign(c)}
                          className="text-sm font-semibold text-[#172033] hover:text-[#2563EB] hover:underline text-left truncate"
                        >
                          {c.name}
                        </button>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          {c.platform}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === "ACTIVE" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                          {c.status}
                        </span>
                        {c.startDate && (
                          <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {c.startDate} {c.endDate ? `to ${c.endDate}` : ""}
                          </span>
                        )}
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

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectingCampaign(c)}
                        className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                        title="View Full Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCampaign(c)}
                        className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                        title="Edit Campaign"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateCampaign(c.id)}
                        className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                        title="Duplicate Campaign"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
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
                  No Ad Sets configured. Click "Create Ad Set" to add one under an active campaign.
                </div>
              ) : (
                adSets.map((as) => (
                  <div key={as.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FolderTree className="w-4 h-4 text-[#2563EB]" />
                        <strong className="text-sm font-semibold text-[#172033]">{as.name}</strong>
                        <span className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">Campaign: {as.campaignName}</span>
                      </div>
                      <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-3">
                        <span>Targeting: <em className="text-[#172033] font-normal">{as.targeting}</em></span>
                        <span>•</span>
                        <span>Daily Budget: {formatCurrency(as.dailyBudget, currency)}</span>
                        <span>•</span>
                        <span className="text-[#16A34A] font-bold">{as.roas.toFixed(2)}x ROAS</span>
                        <span>•</span>
                        <span>CPA: {formatCurrency(as.cpa, currency)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAdSet(as.id)}
                      className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                      title="Delete Ad Set"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                  No individual ads registered yet. Click "Create Ad" to attach ads to an Ad Set.
                </div>
              ) : (
                ads.map((ad) => (
                  <div key={ad.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        <strong className="text-sm font-semibold text-[#172033]">{ad.name}</strong>
                        <span className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">Ad Set: {ad.adSetName}</span>
                      </div>
                      <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-3">
                        <span>Spend: {formatCurrency(ad.spend, currency)}</span>
                        <span>•</span>
                        <span className="text-[#16A34A] font-bold">{ad.roas.toFixed(2)}x ROAS</span>
                        <span>•</span>
                        <span>CPA: {formatCurrency(ad.cpa, currency)}</span>
                        <span>•</span>
                        <span>CTR: {formatPercent(ad.ctr)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              {accounts.map((acc) => (
                <div key={acc.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC]">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#2563EB]" />
                      <strong className="text-sm font-semibold text-[#172033]">{acc.name}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        {acc.platform}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748B] flex items-center space-x-3">
                      <span>ID: <code>{acc.accountId}</code></span>
                      <span>•</span>
                      <span>Currency: {acc.currency}</span>
                      <span>•</span>
                      <span>Total Cumulative Spend: <strong>{formatCurrency(acc.totalSpend, currency)}</strong></span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    {acc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Campaign Modal */}
      <AddCampaignModal
        isOpen={isAddCampaignOpen}
        onClose={() => setIsAddCampaignOpen(false)}
        onSuccess={loadData}
      />

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        isOpen={!!editingCampaign}
        campaign={editingCampaign}
        onClose={() => setEditingCampaign(null)}
        onSuccess={loadData}
      />

      {/* View Campaign Details Modal */}
      <CampaignDetailsModal
        isOpen={!!inspectingCampaign}
        campaign={inspectingCampaign}
        adSets={adSets}
        ads={ads}
        currency={currency}
        onClose={() => setInspectingCampaign(null)}
        onEdit={(c) => {
          setInspectingCampaign(null);
          setEditingCampaign(c);
        }}
        onDuplicate={handleDuplicateCampaign}
        onDelete={handleDeleteCampaign}
      />

      {/* Create Ad Set Modal */}
      <AddAdSetModal
        isOpen={isAddAdSetOpen}
        campaigns={campaigns}
        onClose={() => setIsAddAdSetOpen(false)}
        onSuccess={loadData}
      />

      {/* Create Ad Modal */}
      <AddAdModal
        isOpen={isAddAdOpen}
        adSets={adSets}
        campaigns={campaigns}
        onClose={() => setIsAddAdOpen(false)}
        onSuccess={loadData}
      />
    </>
  );
}
