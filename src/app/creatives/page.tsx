"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { AdCreative, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent, compareCreatives } from "@/lib/calculator-engine";
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
  Sparkles,
  ArrowRight,
  Trophy,
  X
} from "lucide-react";

export default function CreativeIntelligencePage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedCreative, setSelectedCreative] = useState<AdCreative | null>(null);

  // Comparison State
  const [creativeAId, setCreativeAId] = useState<string>("");
  const [creativeBId, setCreativeBId] = useState<string>("");

  // Add Creative Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<AdCreative["type"]>("VIDEO");
  const [newHeadline, setNewHeadline] = useState("");
  const [newPrimaryText, setNewPrimaryText] = useState("");
  const [newLandingUrl, setNewLandingUrl] = useState("https://byshahid.com");
  const [newSpend, setNewSpend] = useState("500");
  const [newRevenue, setNewRevenue] = useState("2000");
  const [newImpressions, setNewImpressions] = useState("20000");
  const [newClicks, setNewClicks] = useState("600");
  const [newConversions, setNewConversions] = useState("25");
  const [newHookRate, setNewHookRate] = useState("34.5");
  const [newHoldRate, setNewHoldRate] = useState("16.2");
  const [newTags, setNewTags] = useState("Founder, UGC, Hook-1");

  const loadData = () => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    const crts = StorageService.getCreatives();
    setCreatives(crts);
    if (crts.length > 0) {
      if (!selectedCreative) setSelectedCreative(crts[0]);
      if (!creativeAId && crts[0]) setCreativeAId(crts[0].id);
      if (!creativeBId && crts[1]) setCreativeBId(crts[1].id);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("data-storage-update", loadData);
    return () => window.removeEventListener("data-storage-update", loadData);
  }, []);

  const handleCreateCreative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const spend = parseFloat(newSpend) || 0;
    const revenue = parseFloat(newRevenue) || 0;
    const impressions = parseInt(newImpressions, 10) || 0;
    const clicks = parseInt(newClicks, 10) || 0;
    const conversions = parseInt(newConversions, 10) || 0;

    const roas = spend > 0 ? revenue / spend : 0;
    const cpa = conversions > 0 ? spend / conversions : 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

    const newCrt: AdCreative = {
      id: `crt-${Date.now()}`,
      workspaceId: "active-workspace",
      name: newName.trim(),
      type: newType,
      headline: newHeadline.trim(),
      primaryText: newPrimaryText.trim(),
      previewUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
      landingPageUrl: newLandingUrl.trim(),
      spend,
      impressions,
      clicks,
      conversions,
      revenue,
      roas,
      cpa,
      ctr,
      videoHookRate3s: parseFloat(newHookRate) || 30,
      videoHoldRate15s: parseFloat(newHoldRate) || 15,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      fatigueStatus: "HEALTHY",
      createdAt: new Date().toISOString()
    };

    StorageService.addCreative(newCrt);
    loadData();
    setIsAddModalOpen(false);
  };

  const filtered = typeFilter === "ALL" 
    ? creatives 
    : creatives.filter(c => c.type === typeFilter);

  // Creative Comparison Computation
  const crtA = creatives.find(c => c.id === creativeAId);
  const crtB = creatives.find(c => c.id === creativeBId);
  const comparison = crtA && crtB ? compareCreatives(crtA, crtB) : null;

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Creative Intelligence & Asset Lab</h1>
            <p className="text-secondary text-[#64748B]">Analyze creative fatigue, 3-second hook rates, 15-second hold rates, and multi-signal ad decay.</p>
          </div>

          <div className="flex items-center space-x-3">
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

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Creative Asset</span>
            </button>
          </div>
        </div>

        {/* Head-to-Head Creative Comparison Tool (Section 3.C & 3.G requirement) */}
        {creatives.length >= 2 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-bold text-[#172033]">Creative A/B Head-to-Head Comparison Matrix</h3>
              </div>
              <span className="text-xs text-[#64748B]">Multi-metric scoring across CTR, CPA, and ROAS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Select Creative A</label>
                <select
                  value={creativeAId}
                  onChange={(e) => setCreativeAId(e.target.value)}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                >
                  {creatives.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.roas.toFixed(2)}x ROAS)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Select Creative B</label>
                <select
                  value={creativeBId}
                  onChange={(e) => setCreativeBId(e.target.value)}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                >
                  {creatives.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.roas.toFixed(2)}x ROAS)</option>
                  ))}
                </select>
              </div>
            </div>

            {comparison && crtA && crtB && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#172033]">
                    <span className="px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A]">Winner: {comparison.winnerMetric}</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#64748B]">CTR Delta: {comparison.ctrDifference > 0 ? `+${comparison.ctrDifference.toFixed(2)}%` : `${comparison.ctrDifference.toFixed(2)}%`}</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#64748B]">ROAS Delta: {comparison.roasDifference > 0 ? `+${comparison.roasDifference.toFixed(2)}x` : `${comparison.roasDifference.toFixed(2)}x`}</span>
                  </div>
                </div>
                <p className="text-xs text-[#475569]">{comparison.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Creative Cards Library */}
        {creatives.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-12 text-center">
            <Video className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172033] mb-1">No creatives uploaded</h3>
            <p className="text-xs text-[#64748B] mb-4">Click Load Demo Data in the top header or click Add Creative Asset above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                {/* Video Retention Benchmarks */}
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

                {/* Landing Page Link */}
                {selectedCreative.landingPageUrl && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#64748B]">Destination:</span>
                    <a href={selectedCreative.landingPageUrl} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline flex items-center space-x-1">
                      <span className="truncate max-w-[200px]">{selectedCreative.landingPageUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

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

      {/* Add Creative Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="text-base font-bold text-[#172033]">Add Creative Asset</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1 text-[#64748B] hover:text-[#172033]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCreative} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Asset Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Founder Story Hook 3 (Problem/Agitation)"
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Creative Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  >
                    <option value="VIDEO">Video Ad</option>
                    <option value="REEL">Reel (9:16)</option>
                    <option value="IMAGE">Static Image</option>
                    <option value="CAROUSEL">Carousel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Landing Page Destination</label>
                  <input
                    type="url"
                    value={newLandingUrl}
                    onChange={(e) => setNewLandingUrl(e.target.value)}
                    className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Headline</label>
                <input
                  type="text"
                  value={newHeadline}
                  onChange={(e) => setNewHeadline(e.target.value)}
                  placeholder="e.g. Stop Burning Margin on Flawed ROAS Formulas"
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Primary Text / Hook Copy</label>
                <textarea
                  value={newPrimaryText}
                  onChange={(e) => setNewPrimaryText(e.target.value)}
                  rows={2}
                  placeholder="Write primary ad copy..."
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">3-Sec Hook Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newHookRate}
                    onChange={(e) => setNewHookRate(e.target.value)}
                    className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">15-Sec Hold Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newHoldRate}
                    onChange={(e) => setNewHoldRate(e.target.value)}
                    className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Spend ($)</label>
                  <input type="number" value={newSpend} onChange={(e) => setNewSpend(e.target.value)} className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Revenue ($)</label>
                  <input type="number" value={newRevenue} onChange={(e) => setNewRevenue(e.target.value)} className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Conversions</label>
                  <input type="number" value={newConversions} onChange={(e) => setNewConversions(e.target.value)} className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Founder, Problem-Hook, Skincare"
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                >
                  Save Creative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
