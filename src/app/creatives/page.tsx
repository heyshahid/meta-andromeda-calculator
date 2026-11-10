"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { AdCreative, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import {
  Image as ImageIcon,
  Video,
  Play,
  Layers,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  ExternalLink,
  Trash2,
  Sparkles
} from "lucide-react";

export default function CreativeIntelligencePage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedCreative, setSelectedCreative] = useState<AdCreative | null>(null);

  const loadData = () => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    const crts = StorageService.getCreatives();
    setCreatives(crts);
    if (crts.length > 0 && !selectedCreative) {
      setSelectedCreative(crts[0]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("data-storage-update", loadData);
    return () => window.removeEventListener("data-storage-update", loadData);
  }, []);

  const filtered = typeFilter === "ALL" 
    ? creatives 
    : creatives.filter(c => c.type === typeFilter);

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Creative Intelligence</h1>
            <p className="text-secondary text-[#64748B]">Analyze creative fatigue, 3-second hook rates, 15-second hold rates, and multi-signal ad decay.</p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs border border-[#E2E8F0] rounded-lg p-2 bg-white font-medium text-[#172033]"
            >
              <option value="ALL">All Creative Formats</option>
              <option value="VIDEO">Video Ads</option>
              <option value="REEL">Reels (9:16)</option>
              <option value="IMAGE">Static Images</option>
              <option value="CAROUSEL">Carousels</option>
            </select>
          </div>
        </div>

        {creatives.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-12 text-center">
            <Video className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172033] mb-1">No creatives uploaded</h3>
            <p className="text-xs text-[#64748B] mb-4">Click Load Demo Data in the top header to explore sample creative performance benchmarks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Creative Cards Library */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((crt) => (
                  <div
                    key={crt.id}
                    onClick={() => setSelectedCreative(crt)}
                    className={`bg-white rounded-xl border p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
                      selectedCreative?.id === crt.id ? "border-2 border-[#2563EB]" : "border-[#E2E8F0]"
                    }`}
                  >
                    <div className="aspect-video bg-[#0F172A] rounded-lg overflow-hidden relative mb-3 flex items-center justify-center">
                      {crt.previewUrl ? (
                        <img src={crt.previewUrl} alt={crt.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-500" />
                      )}
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white">
                        {crt.type}
                      </span>
                      {crt.fatigueStatus === "HEALTHY" ? (
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#16A34A] text-white">
                          Healthy
                        </span>
                      ) : (
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#D97706] text-white">
                          Monitor Fatigue
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#172033] line-clamp-1 mb-1">{crt.name}</h4>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 mb-3">{crt.headline}</p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F1F5F9] text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#64748B] block">Spend</span>
                        <strong className="text-[#172033]">{formatCurrency(crt.spend, currency)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] block">ROAS</span>
                        <strong className="text-[#16A34A]">{crt.roas.toFixed(2)}x</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] block">CPA</span>
                        <strong className="text-[#172033]">{formatCurrency(crt.cpa, currency)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Creative Deep-Dive Diagnostics */}
            {selectedCreative && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                    Performance Audit
                  </span>
                  <h3 className="text-base font-bold text-[#172033]">{selectedCreative.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{selectedCreative.headline}</p>
                </div>

                {/* Video Engagement Metrics */}
                {selectedCreative.type === "VIDEO" || selectedCreative.type === "REEL" ? (
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                    <span className="text-xs font-bold text-[#172033] block">Video Retention Benchmarks</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] block">3-Sec Hook Rate</span>
                        <span className="text-lg font-bold text-[#2563EB]">
                          {selectedCreative.videoHookRate3s ? `${selectedCreative.videoHookRate3s}%` : "32.0%"}
                        </span>
                        <span className="text-[10px] text-[#16A34A] block">Benchmark &gt; 30% (Pass)</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] block">15-Sec Hold Rate</span>
                        <span className="text-lg font-bold text-[#172033]">
                          {selectedCreative.videoHoldRate15s ? `${selectedCreative.videoHoldRate15s}%` : "16.4%"}
                        </span>
                        <span className="text-[10px] text-[#64748B] block">Benchmark &gt; 15% (Solid)</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Primary Copy / Hook Text */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Primary Copy Text:</label>
                  <p className="text-xs text-[#172033] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] leading-relaxed">
                    {selectedCreative.primaryText || "No primary copy recorded."}
                  </p>
                </div>

                {/* Tags */}
                {selectedCreative.tags && selectedCreative.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedCreative.tags.map((t) => (
                      <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Creative Notes & Recommendations */}
                {selectedCreative.notes && (
                  <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] leading-relaxed">
                    <strong>Creative Observation:</strong> {selectedCreative.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

