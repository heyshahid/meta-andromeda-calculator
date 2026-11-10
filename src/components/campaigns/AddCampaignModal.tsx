"use client";

import React, { useState, useEffect } from "react";
import { Campaign, PlatformType, CampaignObjective, AdvertisingAccount } from "@/lib/types";
import { StorageService } from "@/lib/storage";
import { X, Check } from "lucide-react";

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCampaignModal({ isOpen, onClose, onSuccess }: AddCampaignModalProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("Meta Ads");
  const [accountId, setAccountId] = useState("act-001");
  const [accounts, setAccounts] = useState<AdvertisingAccount[]>([]);
  const [objective, setObjective] = useState<CampaignObjective>("OUTCOME_SALES");
  const [dailyBudget, setDailyBudget] = useState("100");
  const [spend, setSpend] = useState("500");
  const [revenue, setRevenue] = useState("2000");
  const [impressions, setImpressions] = useState("25000");
  const [clicks, setClicks] = useState("650");
  const [conversions, setConversions] = useState("28");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const accs = StorageService.getAccounts();
      setAccounts(accs);
      if (accs.length > 0) {
        setAccountId(accs[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Campaign name is required.");
      return;
    }

    const nSpend = parseFloat(spend) || 0;
    const nRevenue = parseFloat(revenue) || 0;
    const nImpressions = parseInt(impressions, 10) || 0;
    const nClicks = parseInt(clicks, 10) || 0;
    const nConversions = parseInt(conversions, 10) || 0;
    const nBudget = parseFloat(dailyBudget) || 50;

    const roas = nSpend > 0 ? nRevenue / nSpend : 0;
    const cpa = nConversions > 0 ? nSpend / nConversions : 0;
    const cpc = nClicks > 0 ? nSpend / nClicks : 0;
    const cpm = nImpressions > 0 ? (nSpend / nImpressions) * 1000 : 0;
    const ctr = nImpressions > 0 ? (nClicks / nImpressions) * 100 : 0;

    const selectedAcc = accounts.find(a => a.id === accountId);

    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      workspaceId: "active-workspace",
      accountId: accountId || "act-001",
      name: name.trim(),
      platform,
      accountName: selectedAcc ? selectedAcc.name : "Primary Ad Account",
      objective,
      status: "ACTIVE",
      dailyBudget: nBudget,
      spend: nSpend,
      revenue: nRevenue,
      impressions: nImpressions,
      clicks: nClicks,
      conversions: nConversions,
      roas,
      cpa,
      cpc,
      cpm,
      ctr,
      updatedAt: new Date().toISOString()
    };

    StorageService.addCampaign(newCampaign);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-base font-bold text-[#172033]">Add Campaign</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#64748B] hover:text-[#172033]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Campaign Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Advantage+ Scaling"
              className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              >
                {accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.platform})
                    </option>
                  ))
                ) : (
                  <option value="act-001">Primary Ad Account (act-001)</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformType)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              >
                <option value="Meta Ads">Meta Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="TikTok Ads">TikTok Ads</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Campaign Objective</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              >
                <option value="OUTCOME_SALES">Sales / Conversions</option>
                <option value="OUTCOME_LEADS">Leads Generation</option>
                <option value="OUTCOME_TRAFFIC">Traffic / Link Clicks</option>
                <option value="OUTCOME_ENGAGEMENT">Engagement</option>
                <option value="OUTCOME_AWARENESS">Brand Awareness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Daily Budget ($)</label>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Spend ($)</label>
              <input
                type="number"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Revenue Generated ($)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Impressions</label>
              <input
                type="number"
                value={impressions}
                onChange={(e) => setImpressions(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Clicks</label>
              <input
                type="number"
                value={clicks}
                onChange={(e) => setClicks(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Conversions</label>
              <input
                type="number"
                value={conversions}
                onChange={(e) => setConversions(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] shadow-subtle"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Campaign</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

