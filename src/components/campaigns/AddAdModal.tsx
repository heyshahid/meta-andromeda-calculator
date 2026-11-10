"use client";

import React, { useState } from "react";
import { IndividualAd, AdSet, Campaign } from "@/lib/types";
import { StorageService } from "@/lib/storage";
import { X, Check } from "lucide-react";

interface AddAdModalProps {
  isOpen: boolean;
  adSets: AdSet[];
  campaigns: Campaign[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAdModal({ isOpen, adSets, campaigns, onClose, onSuccess }: AddAdModalProps) {
  const [name, setName] = useState("");
  const [adSetId, setAdSetId] = useState(adSets[0]?.id || "");
  const [spend, setSpend] = useState("100");
  const [revenue, setRevenue] = useState("350");
  const [impressions, setImpressions] = useState("6500");
  const [clicks, setClicks] = useState("180");
  const [conversions, setConversions] = useState("8");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Ad name is required.");
      return;
    }

    const parentAdSet = adSets.find(as => as.id === adSetId) || adSets[0];
    const nSpend = parseFloat(spend) || 0;
    const nRevenue = parseFloat(revenue) || 0;
    const nImp = parseInt(impressions, 10) || 0;
    const nClicks = parseInt(clicks, 10) || 0;
    const nConv = parseInt(conversions, 10) || 0;
    const roas = nSpend > 0 ? nRevenue / nSpend : 0;
    const cpa = nConv > 0 ? nSpend / nConv : 0;
    const ctr = nImp > 0 ? (nClicks / nImp) * 100 : 0;

    const newAd: IndividualAd = {
      id: `ad-${Date.now()}`,
      adSetId: parentAdSet?.id || "as-001",
      adSetName: parentAdSet?.name || "General Ad Set",
      campaignId: parentAdSet?.campaignId || campaigns[0]?.id || "cmp-001",
      name: name.trim(),
      status: "ACTIVE",
      spend: nSpend,
      revenue: nRevenue,
      impressions: nImp,
      clicks: nClicks,
      conversions: nConv,
      roas,
      cpa,
      ctr
    };

    StorageService.addAd(newAd);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-base font-bold text-[#172033]">Create Individual Ad</h3>
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
            <label className="block text-xs font-semibold text-[#475569] mb-1">Parent Ad Set *</label>
            <select
              value={adSetId}
              onChange={(e) => setAdSetId(e.target.value)}
              className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
            >
              {adSets.map((as) => (
                <option key={as.id} value={as.id}>{as.name} ({as.campaignName})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Video Hook 2 - Founder Story"
              className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Spend ($)</label>
              <input
                type="number"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Revenue ($)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Views</label>
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
              <label className="block text-xs font-semibold text-[#475569] mb-1">Orders</label>
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
              <span>Save Ad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
