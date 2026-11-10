"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AddCampaignModal } from "@/components/campaigns/AddCampaignModal";
import { StorageService } from "@/lib/storage";
import { Campaign, CurrencyCode } from "@/lib/types";
import { formatCurrency } from "@/lib/calculator-engine";
import { Layers, Plus, Trash2, Edit2, Play, Pause, ExternalLink } from "lucide-react";

export default function CampaignManagerPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = () => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setCampaigns(StorageService.getCampaigns());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("data-storage-update", loadData);
    return () => window.removeEventListener("data-storage-update", loadData);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign record?")) {
      StorageService.deleteCampaign(id);
      loadData();
    }
  };

  return (
    <>
      <Header onOpenAddModal={() => setIsAddOpen(true)} />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Campaign Manager</h1>
            <p className="text-secondary text-[#64748B]">Manage campaigns hierarchy: Ad Account ➔ Campaign ➔ Ad Set ➔ Creative.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs text-[#64748B]">
            <span className="font-semibold text-[#172033]">Active Campaign Records ({campaigns.length})</span>
            <span>Local Database Storage Mode</span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No campaigns registered. Click "Create Campaign" or "Load Demo Data" to populate.
              </div>
            ) : (
              campaigns.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      <strong className="text-sm font-semibold text-[#172033]">{c.name}</strong>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        {c.platform}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748B] flex items-center space-x-3">
                      <span>Daily Budget: {formatCurrency(c.dailyBudget, currency)}</span>
                      <span>•</span>
                      <span>Total Spend: {formatCurrency(c.spend, currency)}</span>
                      <span>•</span>
                      <span>Revenue: {formatCurrency(c.revenue, currency)}</span>
                      <span>•</span>
                      <span className="text-[#16A34A] font-bold">{c.roas.toFixed(2)}x ROAS</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
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
      </main>

      <AddCampaignModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadData}
      />
    </>
  );
}

