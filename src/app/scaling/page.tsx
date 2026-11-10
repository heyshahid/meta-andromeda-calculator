"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { ScalingPlan, CurrencyCode } from "@/lib/types";
import { calculateBudgetScaling, formatCurrency } from "@/lib/calculator-engine";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Save,
  Trash2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";

export default function ScalingIntelligencePage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [plans, setPlans] = useState<ScalingPlan[]>([]);
  const [campaignName, setCampaignName] = useState("Advantage+ Shopping - Winning Creatives");
  const [currentBudget, setCurrentBudget] = useState("200");
  const [currentSpend, setCurrentSpend] = useState("2800");
  const [currentROAS, setCurrentROAS] = useState("3.8");
  const [targetROAS, setTargetROAS] = useState("2.5");
  const [currentCPA, setCurrentCPA] = useState("18.50");
  const [targetCPA, setTargetCPA] = useState("24.00");
  const [conversionVolume, setConversionVolume] = useState("152");
  const [scalingPercentage, setScalingPercentage] = useState<number>(20);

  useEffect(() => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setPlans(StorageService.getScalingPlans());
  }, []);

  const nDaily = parseFloat(currentBudget) || 100;
  const nSpend = parseFloat(currentSpend) || 0;
  const nRoas = parseFloat(currentROAS) || 0;
  const nTargetRoas = parseFloat(targetROAS) || 2;
  const nCpa = parseFloat(currentCPA) || 0;
  const nTargetCpa = parseFloat(targetCPA) || 20;
  const nConv = parseInt(conversionVolume, 10) || 0;

  // Rule-based Algorithmic Decision Engine (Transparent & Explainable)
  let decisionRule = "Stable Performance";
  let recommendation = "Maintain current budget trajectory.";
  let statusBadge: "success" | "warning" | "danger" | "neutral" = "neutral";

  if (nConv < 30) {
    decisionRule = "Insufficient Conversion Data";
    recommendation = `Only ${nConv} conversions recorded in this period. Meta requires ~50 conversions/week per ad set to exit the learning phase. Do not scale aggressively until at least 50 conversions are logged.`;
    statusBadge = "warning";
  } else if (nRoas >= nTargetRoas * 1.3 && nCpa <= nTargetCpa * 0.85) {
    decisionRule = "High-Confidence Scaling Opportunity";
    recommendation = `Current ROAS (${nRoas.toFixed(2)}x) exceeds target (${nTargetRoas.toFixed(2)}x) by >30% while CPA is 15% below threshold. Recommend compounding budget scaling in conservative +15% to +20% intervals every 48 hours.`;
    statusBadge = "success";
  } else if (nRoas < nTargetRoas * 0.85 || nCpa > nTargetCpa * 1.2) {
    decisionRule = "Performance Decline / Rising Acquisition Cost";
    recommendation = `ROAS (${nRoas.toFixed(2)}x) is below target threshold (${nTargetRoas.toFixed(2)}x) or CPA has spiked. Scaling now will amplify losses. Pause underperforming ad sets or refresh creative hooks before adding budget.`;
    statusBadge = "danger";
  } else {
    decisionRule = "Stable Performance Tier";
    recommendation = `Campaign is meeting targets within acceptable variance. Test a modest +10% to +15% budget step and observe CPA over 72 hours.`;
    statusBadge = "neutral";
  }

  const scalingMetrics = calculateBudgetScaling(nDaily, scalingPercentage, currency);

  const handleSavePlan = () => {
    const newPlan: ScalingPlan = {
      id: `sp-${Date.now()}`,
      campaignName,
      createdAt: new Date().toISOString(),
      currentBudget: nDaily,
      currentSpend: nSpend,
      currentROAS: nRoas,
      targetROAS: nTargetRoas,
      currentCPA: nCpa,
      targetCPA: nTargetCpa,
      scalingPercentage,
      newDailyBudget: scalingMetrics.newDailyBudget,
      additionalMonthlySpend: scalingMetrics.additionalDailyBudget * 30.4,
      decisionRule,
      recommendation,
      riskAssessment: scalingMetrics.riskAssessment
    };
    StorageService.addScalingPlan(newPlan);
    setPlans(StorageService.getScalingPlans());
  };

  const handleDeletePlan = (id: string) => {
    StorageService.deleteScalingPlan(id);
    setPlans(StorageService.getScalingPlans());
  };

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-page-title text-[#172033] tracking-tight">Scaling Intelligence</h1>
          <p className="text-secondary text-[#64748B]">Transparent, rule-based algorithmic decision engine for Meta & performance ad spend expansion.</p>
        </div>

        {/* Inputs & Parameters */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="text-base font-bold text-[#172033] border-b border-[#CBD5E1] focus:border-[#2563EB] focus:outline-none w-96"
              />
            </div>
            <button
              type="button"
              onClick={handleSavePlan}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scaling Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Current Daily Budget ($)</label>
              <input type="number" value={currentBudget} onChange={(e) => setCurrentBudget(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Current ROAS (x)</label>
              <input type="number" step="0.1" value={currentROAS} onChange={(e) => setCurrentROAS(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target ROAS (x)</label>
              <input type="number" step="0.1" value={targetROAS} onChange={(e) => setTargetROAS(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Conversion Volume (7d)</label>
              <input type="number" value={conversionVolume} onChange={(e) => setConversionVolume(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Current CPA ($)</label>
              <input type="number" value={currentCPA} onChange={(e) => setCurrentCPA(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target Max Allowable CPA ($)</label>
              <input type="number" value={targetCPA} onChange={(e) => setTargetCPA(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
            </div>
          </div>
        </div>

        {/* Algorithmic Decision Banner */}
        <div className={`p-5 rounded-2xl border ${
          statusBadge === 'success' ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#14532D]' :
          statusBadge === 'danger' ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#7F1D1D]' :
          statusBadge === 'warning' ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#78350F]' :
          'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]'
        }`}>
          <div className="flex items-center space-x-2 mb-1.5">
            {statusBadge === 'success' ? <ShieldCheck className="w-5 h-5 text-[#16A34A]" /> : <ShieldAlert className="w-5 h-5" />}
            <h4 className="text-sm font-bold">Audit Decision: {decisionRule}</h4>
          </div>
          <p className="text-xs leading-relaxed">{recommendation}</p>
        </div>

        {/* Budget Scaling Increment Scenarios */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172033]">Compounding Budget Scenario Selector</h3>
            <span className="text-xs text-[#64748B]">Avoid &gt; 20% shifts per 24 hours to prevent resetting delivery learning.</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {[0, 10, 15, 20, 30, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setScalingPercentage(pct)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  scalingPercentage === pct
                    ? "bg-[#2563EB] text-white shadow-subtle"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#172033]"
                }`}
              >
                {pct === 0 ? "No Change" : `+${pct}%`}
              </button>
            ))}
          </div>

          {/* Projection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs text-[#64748B] block">New Daily Budget</span>
              <span className="text-2xl font-extrabold text-[#172033]">{scalingMetrics.formattedNewBudget}</span>
              <span className="text-[11px] text-[#2563EB] font-medium block mt-1">+{scalingMetrics.formattedAdditional}/day</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs text-[#64748B] block">Estimated 30-Day Run Rate</span>
              <span className="text-2xl font-extrabold text-[#172033]">{scalingMetrics.formattedMonthly}</span>
              <span className="text-[11px] text-[#64748B] block mt-1">Assuming budget remains at this step</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs text-[#64748B] block">Algorithmic Risk Factor</span>
              <span className={`text-2xl font-extrabold ${scalingMetrics.riskAssessment === 'Safe' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                {scalingMetrics.riskAssessment}
              </span>
              <span className="text-[11px] text-[#64748B] block mt-1">{scalingMetrics.recommendation}</span>
            </div>
          </div>
        </div>

        {/* Saved Scaling Plans */}
        {plans.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#172033]">Saved Scaling Roadmaps ({plans.length})</h3>
            <div className="divide-y divide-[#E2E8F0]">
              {plans.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-sm font-semibold text-[#172033] block">{p.campaignName}</strong>
                    <span className="text-[#64748B]">
                      Scale +{p.scalingPercentage}% ➔ New Daily: {formatCurrency(p.newDailyBudget, currency)} • Status: {p.decisionRule}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(p.id)}
                    className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

