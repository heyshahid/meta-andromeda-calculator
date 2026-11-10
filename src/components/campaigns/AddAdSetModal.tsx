"use client";

import React, { useState } from "react";
import { AdSet, Campaign } from "@/lib/types";
import { StorageService } from "@/lib/storage";
import { X, Check } from "lucide-react";

interface AddAdSetModalProps {
  isOpen: boolean;
  campaigns: Campaign[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAdSetModal({ isOpen, campaigns, onClose, onSuccess }: AddAdSetModalProps) {
  const [name, setName] = useState("");
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || "");
  const [targeting, setTargeting] = useState("Broad Advantage+ US 25-54");
  const [dailyBudget, setDailyBudget] = useState("50");
  const [spend, setSpend] = useState("200");
  const [revenue, setRevenue] = useState("650");
  const [impressions, setImpressions] = useState("12000");
  const [clicks, setClicks] = useState("320");
  const [conversions, setConversions] = useState("15");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Ad Set name is required.");
      return;
    }

    const parentCampaign = campaigns.find(c => c.id === campaignId) || campaigns[0];
    const nSpend = parseFloat(spend) || 0;
    const nRevenue = parseFloat(revenue) || 0;
    const nConversions = parseInt(conversions, 10) || 0;
    const roas = nSpend > 0 ? nRevenue / nSpend : 0;
    const cpa = nConversions > 0 ? nSpend / nConversions : 0;

    const newAdSet: AdSet = {
      id: `as-${Date.now()}`,
      campaignId: parentCampaign?.id || "cmp-001",
      campaignName: parentCampaign?.name || "General Campaign",
      name: name.trim(),
      targeting: targeting.trim(),
      status: "ACTIVE",
      dailyBudget: parseFloat(dailyBudget) || 50,
      spend: nSpend,
      revenue: nRevenue,
      impressions: parseInt(impressions, 10) || 0,
      clicks: parseInt(clicks, 10) || 0,
      conversions: nConversions,
      roas,
      cpa
    };

    StorageService.addAdSet(newAdSet);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-base font-bold text-[#172033]">Create Ad Set</h3>
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
            <label className="block text-xs font-semibold text-[#475569] mb-1">Parent Campaign *</label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Set Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DCT Batch 2 - Value Props"
              className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Targeting Spec</label>
            <input
              type="text"
              value={targeting}
              onChange={(e) => setTargeting(e.target.value)}
              placeholder="e.g. Engaged Shoppers, Broad Demographics"
              className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Daily Budget ($)</label>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Spend ($)</label>
              <input
                type="number"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Revenue ($)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
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
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#64748B]">
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Ad Set</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
