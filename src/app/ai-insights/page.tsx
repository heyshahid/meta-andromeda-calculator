"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { Campaign, AdCreative, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import { Sparkles, MessageSquare, Send, ShieldCheck, Database, Key } from "lucide-react";

export default function AIInsightsPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setCampaigns(StorageService.getCampaigns());
    setCreatives(StorageService.getCreatives());
  }, []);

  const handleAsk = (userPrompt: string) => {
    setIsProcessing(true);
    setResponse(null);

    setTimeout(() => {
      const q = userPrompt.toLowerCase();
      let answer = "";

      if (campaigns.length === 0) {
        answer = "No active campaign data was found in your current workspace. Please load the demo dataset or import a CSV file to generate deterministic insights.";
      } else if (q.includes("highest cpa") || q.includes("highest cost per acquisition")) {
        const highestCpaCampaign = [...campaigns].sort((a, b) => b.cpa - a.cpa)[0];
        answer = `**Campaign with Highest CPA:**\n- **Name:** ${highestCpaCampaign.name}\n- **CPA:** ${formatCurrency(highestCpaCampaign.cpa, currency)}\n- **Ad Spend:** ${formatCurrency(highestCpaCampaign.spend, currency)}\n- **ROAS:** ${highestCpaCampaign.roas.toFixed(2)}x\n\n*Observation:* This campaign has the highest acquisition cost across your portfolio. Consider testing alternative audience segments or revising creative hooks.`;
      } else if (q.includes("best") || q.includes("top") || q.includes("strongest")) {
        const topRoasCampaign = [...campaigns].sort((a, b) => b.roas - a.roas)[0];
        answer = `**Top Performing Campaign:**\n- **Name:** ${topRoasCampaign.name}\n- **ROAS:** ${topRoasCampaign.roas.toFixed(2)}x\n- **Revenue:** ${formatCurrency(topRoasCampaign.revenue, currency)}\n- **CPA:** ${formatCurrency(topRoasCampaign.cpa, currency)}\n\n*Strategic Recommendation:* This campaign represents your primary scaling engine. It can safely absorb compounding +15% to +20% budget increases without algorithm disruption.`;
      } else if (q.includes("spend") || q.includes("total spend")) {
        const total = campaigns.reduce((acc, c) => acc + c.spend, 0);
        const totalRev = campaigns.reduce((acc, c) => acc + c.revenue, 0);
        answer = `**Portfolio Financial Overview:**\n- **Total Recorded Spend:** ${formatCurrency(total, currency)}\n- **Total Attributed Revenue:** ${formatCurrency(totalRev, currency)}\n- **Blended ROAS:** ${(totalRev / (total || 1)).toFixed(2)}x\n- **Active Campaigns Count:** ${campaigns.length}`;
      } else if (q.includes("creative") || q.includes("video")) {
        if (creatives.length > 0) {
          const topCrt = [...creatives].sort((a, b) => b.roas - a.roas)[0];
          answer = `**Top Creative Asset:**\n- **Creative:** ${topCrt.name}\n- **Format:** ${topCrt.type}\n- **ROAS:** ${topCrt.roas.toFixed(2)}x\n- **CPA:** ${formatCurrency(topCrt.cpa, currency)}\n- **3-Sec Hook Rate:** ${topCrt.videoHookRate3s ? topCrt.videoHookRate3s + "%" : "N/A"}\n\n*Creative Audit:* High hook retention (>30%) correlates with lower acquisition costs. Use this concept as a template for your next batch of ad iterations.`;
        } else {
          answer = "No creative assets are currently uploaded to this workspace.";
        }
      } else {
        const total = campaigns.reduce((acc, c) => acc + c.spend, 0);
        const totalRev = campaigns.reduce((acc, c) => acc + c.revenue, 0);
        answer = `**Workspace Context Summary:**\n- **Total Campaigns Analyzed:** ${campaigns.length}\n- **Total Portfolio Spend:** ${formatCurrency(total, currency)}\n- **Total Revenue:** ${formatCurrency(totalRev, currency)}\n- **Blended Efficiency:** ${(totalRev / (total || 1)).toFixed(2)}x ROAS.\n\nYou can query specific insights such as *"Which campaign has the highest CPA?"*, *"Which campaigns are performing best?"*, or *"Analyze my creative performance"*.`;
      }

      setResponse(answer);
      setIsProcessing(false);
    }, 400);
  };

  const SAMPLE_QUERIES = [
    "Which campaign has the highest CPA?",
    "Which campaigns are performing best?",
    "What is my total advertising spend and revenue?",
    "Which creative asset has the strongest ROAS?"
  ];

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-page-title text-[#172033] tracking-tight">AI Diagnostic Insights</h1>
          <p className="text-secondary text-[#64748B]">Deterministic multi-signal natural language querying based exclusively on your workspace data.</p>
        </div>

        {/* Query Input Box */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#2563EB]">
            <Sparkles className="w-4 h-4" />
            <span>Ask Open MarketingOps Intelligence Engine</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) handleAsk(query);
              }}
              placeholder="e.g. Which campaign has the highest CPA?"
              className="flex-1 text-sm border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
            />
            <button
              type="button"
              onClick={() => query.trim() && handleAsk(query)}
              disabled={isProcessing || !query.trim()}
              className="px-5 py-3 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 flex items-center space-x-2 shadow-subtle"
            >
              <span>Analyze</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 pt-1">
            {SAMPLE_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => {
                  setQuery(sq);
                  handleAsk(sq);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* AI Answer Card */}
        {isProcessing && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card text-center text-xs text-[#64748B] animate-pulse">
            Querying workspace database and computing deterministic metrics...
          </div>
        )}

        {response && !isProcessing && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#16A34A]">
              <ShieldCheck className="w-4 h-4" />
              <span>Deterministic Data Analysis Result</span>
            </div>
            <div className="prose text-xs text-[#172033] leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0]">
              {response}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

