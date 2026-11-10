"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/ui/KPICard";
import { StorageService } from "@/lib/storage";
import { BudgetPlan, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import {
  CalendarDays,
  Target,
  DollarSign,
  TrendingUp,
  Save,
  Trash2,
  Copy,
  CheckCircle2,
  Layers,
  Sparkles
} from "lucide-react";

export default function BudgetPlannerPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  const [name, setName] = useState("Q4 Holiday Scaling Blueprint");
  const [monthlyBudget, setMonthlyBudget] = useState("6000");
  const [durationDays, setDurationDays] = useState("30");
  const [targetROAS, setTargetROAS] = useState("3.5");
  const [targetCPA, setTargetCPA] = useState("25");
  const [expectedCTR, setExpectedCTR] = useState("2.2");
  const [expectedCR, setExpectedCR] = useState("4.0");
  const [aov, setAov] = useState("85");

  useEffect(() => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setPlans(StorageService.getBudgetPlans());
  }, []);

  const nMonthly = parseFloat(monthlyBudget) || 0;
  const nDays = parseInt(durationDays, 10) || 30;
  const nDaily = nDays > 0 ? nMonthly / nDays : 0;
  const nRoas = parseFloat(targetROAS) || 1;
  const nCpa = parseFloat(targetCPA) || 1;
  const nCtr = (parseFloat(expectedCTR) || 1) / 100;
  const nCr = (parseFloat(expectedCR) || 1) / 100;
  const nAov = parseFloat(aov) || 50;

  // Compute 3 Scenarios
  // Conservative (80% efficiency)
  const consRevenue = nMonthly * (nRoas * 0.85);
  const consConversions = Math.round(nMonthly / (nCpa * 1.25));
  const consRoas = nMonthly > 0 ? consRevenue / nMonthly : 0;

  // Balanced (100% target)
  const balRevenue = nMonthly * nRoas;
  const balConversions = Math.round(nMonthly / nCpa);
  const balRoas = nRoas;

  // Aggressive (120% efficiency)
  const aggRevenue = nMonthly * (nRoas * 1.25);
  const aggConversions = Math.round(nMonthly / (nCpa * 0.85));
  const aggRoas = nMonthly > 0 ? aggRevenue / nMonthly : 0;

  const handleSavePlan = () => {
    const newPlan: BudgetPlan = {
      id: `bp-${Date.now()}`,
      name: name.trim() || "Untitled Budget Plan",
      createdAt: new Date().toISOString(),
      monthlyBudget: nMonthly,
      dailyBudget: nDaily,
      durationDays: nDays,
      targetROAS: nRoas,
      targetCPA: nCpa,
      expectedCTR: parseFloat(expectedCTR),
      expectedCR: parseFloat(expectedCR),
      aov: nAov,
      scenarios: {
        conservative: { spend: nMonthly, revenue: consRevenue, roas: consRoas, conversions: consConversions },
        balanced: { spend: nMonthly, revenue: balRevenue, roas: balRoas, conversions: balConversions },
        aggressive: { spend: nMonthly, revenue: aggRevenue, roas: aggRoas, conversions: aggConversions }
      }
    };

    StorageService.addBudgetPlan(newPlan);
    setPlans(StorageService.getBudgetPlans());
  };

  const handleDeletePlan = (id: string) => {
    StorageService.deleteBudgetPlan(id);
    setPlans(StorageService.getBudgetPlans());
  };

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-page-title text-[#172033] tracking-tight">Advertising Budget Planner</h1>
          <p className="text-secondary text-[#64748B]">Model multi-scenario advertising expenditure, expected conversions, and revenue velocity.</p>
        </div>

        {/* Input Parameters Form */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Plan Identifier / Campaign Group</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base font-bold text-[#172033] border-b border-[#CBD5E1] focus:border-[#2563EB] focus:outline-none w-80"
              />
            </div>
            <button
              type="button"
              onClick={handleSavePlan}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Budget Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Total Monthly Budget ($)</label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Duration (Days)</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target ROAS (x)</label>
              <input
                type="number"
                step="0.1"
                value={targetROAS}
                onChange={(e) => setTargetROAS(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target CPA ($)</label>
              <input
                type="number"
                value={targetCPA}
                onChange={(e) => setTargetCPA(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Expected CTR (%)</label>
              <input
                type="number"
                step="0.1"
                value={expectedCTR}
                onChange={(e) => setExpectedCTR(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Expected Conversion Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={expectedCR}
                onChange={(e) => setExpectedCR(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Average Order Value ($)</label>
              <input
                type="number"
                value={aov}
                onChange={(e) => setAov(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
          </div>
        </div>

        {/* 3 Scenarios Comparison Table (Section 3.E requirement) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172033]">Forecast Scenarios (Conservative vs Balanced vs Aggressive)</h3>
            <span className="text-xs text-[#64748B] italic">All outputs are deterministic projections based on user-provided assumptions.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conservative */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Conservative</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#E2E8F0] text-[#475569] font-medium">-15% Cushion</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#64748B] block">Projected Revenue</span>
                <span className="text-2xl font-extrabold text-[#172033]">{formatCurrency(consRevenue, currency)}</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] text-xs space-y-1 text-[#475569]">
                <div className="flex justify-between"><span>Spend:</span><strong>{formatCurrency(nMonthly, currency)}</strong></div>
                <div className="flex justify-between"><span>ROAS:</span><strong>{consRoas.toFixed(2)}x</strong></div>
                <div className="flex justify-between"><span>Conversions:</span><strong>{consConversions}</strong></div>
              </div>
            </div>

            {/* Balanced (Target) */}
            <div className="p-4 rounded-xl border-2 border-[#2563EB] bg-[#EFF6FF] space-y-3 relative shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Balanced (Target)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2563EB] text-white font-medium">Recommended</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#1E40AF] block">Projected Revenue</span>
                <span className="text-2xl font-extrabold text-[#172033]">{formatCurrency(balRevenue, currency)}</span>
              </div>
              <div className="pt-2 border-t border-[#BFDBFE] text-xs space-y-1 text-[#1E3A8A]">
                <div className="flex justify-between"><span>Spend:</span><strong>{formatCurrency(nMonthly, currency)}</strong></div>
                <div className="flex justify-between"><span>ROAS:</span><strong>{balRoas.toFixed(2)}x</strong></div>
                <div className="flex justify-between"><span>Conversions:</span><strong>{balConversions}</strong></div>
              </div>
            </div>

            {/* Aggressive */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">Aggressive</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A] font-medium">+25% Outperformance</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#64748B] block">Projected Revenue</span>
                <span className="text-2xl font-extrabold text-[#172033]">{formatCurrency(aggRevenue, currency)}</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] text-xs space-y-1 text-[#475569]">
                <div className="flex justify-between"><span>Spend:</span><strong>{formatCurrency(nMonthly, currency)}</strong></div>
                <div className="flex justify-between"><span>ROAS:</span><strong>{aggRoas.toFixed(2)}x</strong></div>
                <div className="flex justify-between"><span>Conversions:</span><strong>{aggConversions}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Plans List */}
        {plans.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#172033]">Saved Budget Plans ({plans.length})</h3>
            <div className="divide-y divide-[#E2E8F0]">
              {plans.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-sm font-semibold text-[#172033] block">{p.name}</strong>
                    <span className="text-[#64748B]">
                      {p.durationDays} Days • Spend: {formatCurrency(p.monthlyBudget, currency)} • Target ROAS: {p.targetROAS}x
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(p.id)}
                    className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                    title="Delete Plan"
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

