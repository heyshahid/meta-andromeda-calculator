"use client";

import React from "react";
import { Campaign, AdSet, IndividualAd, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import { X, Calendar, Layers, DollarSign, Target, ShoppingBag, Eye, MousePointerClick, Edit, Copy, Trash2, FolderTree } from "lucide-react";

interface CampaignDetailsModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  adSets: AdSet[];
  ads: IndividualAd[];
  currency?: CurrencyCode;
  onClose: () => void;
  onEdit: (c: Campaign) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CampaignDetailsModal({
  isOpen,
  campaign,
  adSets,
  ads,
  currency = "USD",
  onClose,
  onEdit,
  onDuplicate,
  onDelete
}: CampaignDetailsModalProps) {
  if (!isOpen || !campaign) return null;

  const childAdSets = adSets.filter(a => a.campaignId === campaign.id);
  const childAds = ads.filter(a => a.campaignId === campaign.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${campaign.status === "ACTIVE" ? "bg-[#16A34A]" : "bg-[#94A3B8]"}`} />
            <h3 className="text-base font-bold text-[#172033]">{campaign.name}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              {campaign.platform}
            </span>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#64748B] hover:text-[#172033]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] text-xs">
            <div>
              <span className="text-[#64748B] block text-[11px]">Ad Account</span>
              <strong className="text-[#172033]">{campaign.accountName}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">Daily Budget</span>
              <strong className="text-[#172033]">{formatCurrency(campaign.dailyBudget, currency)}/day</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">Start Date</span>
              <strong className="text-[#172033]">{campaign.startDate || "Ongoing"}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">End Date</span>
              <strong className="text-[#172033]">{campaign.endDate || "No end date"}</strong>
            </div>
          </div>

          {/* Core Metric Cards */}
          <div>
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Performance Snapshot</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">Ad Spend</span>
                <span className="text-sm font-bold text-[#172033]">{formatCurrency(campaign.spend, currency)}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">Attributed Revenue</span>
                <span className="text-sm font-bold text-[#172033]">{formatCurrency(campaign.revenue, currency)}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">ROAS</span>
                <span className="text-sm font-bold text-[#16A34A]">{campaign.roas.toFixed(2)}x</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">Cost Per Acquisition</span>
                <span className="text-sm font-bold text-[#172033]">{formatCurrency(campaign.cpa, currency)}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">Conversions</span>
                <span className="text-sm font-bold text-[#172033]">{campaign.conversions}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">CTR</span>
                <span className="text-sm font-bold text-[#172033]">{formatPercent(campaign.ctr)}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">CPC</span>
                <span className="text-sm font-bold text-[#172033]">{formatCurrency(campaign.cpc, currency)}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                <span className="text-[11px] text-[#64748B] block">CPM</span>
                <span className="text-sm font-bold text-[#172033]">{formatCurrency(campaign.cpm, currency)}</span>
              </div>
            </div>
          </div>

          {/* Strategy Notes */}
          {campaign.notes && (
            <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
              <span className="text-[11px] font-bold text-[#1E40AF] block mb-1">Strategy & Media Buying Notes</span>
              <p className="text-xs text-[#1E3A8A] leading-relaxed">{campaign.notes}</p>
            </div>
          )}

          {/* Child Ad Sets */}
          <div>
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Attached Ad Sets ({childAdSets.length})</span>
            </h4>
            {childAdSets.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#F8FAFC] text-center text-xs text-[#64748B] border border-[#E2E8F0]">
                No explicit child Ad Sets mapped to this campaign yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
                {childAdSets.map((as) => (
                  <div key={as.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#172033] flex items-center space-x-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{as.name}</span>
                      </div>
                      <span className="text-[11px] text-[#64748B]">Targeting: {as.targeting}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#16A34A] block">{as.roas.toFixed(2)}x ROAS</span>
                      <span className="text-[11px] text-[#64748B]">{formatCurrency(as.spend, currency)} spend</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${campaign.name}"? This cannot be undone.`)) {
                onDelete(campaign.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Campaign</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onDuplicate(campaign.id);
                onClose();
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#172033] hover:bg-[#F1F5F9]"
            >
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Duplicate</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onEdit(campaign);
                onClose();
              }}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Campaign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
