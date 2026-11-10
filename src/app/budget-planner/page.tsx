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
  Edit2,
  Download,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  Check,
  X
} from "lucide-react";

export default function BudgetPlannerPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  
  // Inputs as required by Section 6
  const [name, setName] = useState("Q4 Holiday Scaling Blueprint");
  const [monthlyBudget, setMonthlyBudget] = useState("6000");
  const [dailyBudget, setDailyBudget] = useState("200");
  const [durationDays, setDurationDays] = useState("30");
  const [targetROAS, setTargetROAS] = useState("3.5");
  const [targetCPA, setTargetCPA] = useState("25");
  const [expectedCTR, setExpectedCTR] = useState("2.2");
  const [expectedCR, setExpectedCR] = useState("4.0");
  const [aov, setAov] = useState("85");

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const loadPlans = () => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setPlans(StorageService.getBudgetPlans());
  };

  useEffect(() => {
    loadPlans();
  }, []);

  // Synchronize Monthly and Daily budget changes
  const handleMonthlyChange = (val: string) => {
    setMonthlyBudget(val);
    const m = parseFloat(val) || 0;
    const d = parseInt(durationDays, 10) || 30;
    if (d > 0) setDailyBudget((m / d).toFixed(0));
  };

  const handleDailyChange = (val: string) => {
    setDailyBudget(val);
    const dVal = parseFloat(val) || 0;
    const d = parseInt(durationDays, 10) || 30;
    setMonthlyBudget((dVal * d).toFixed(0));
  };

  const handleDurationChange = (val: string) => {
    setDurationDays(val);
    const d = parseInt(val, 10) || 30;
    const m = parseFloat(monthlyBudget) || 0;
    if (d > 0) setDailyBudget((m / d).toFixed(0));
  };

  // Math models for 3 Scenarios
  const nMonthly = parseFloat(monthlyBudget) || 0;
  const nDays = parseInt(durationDays, 10) || 30;
  const nDaily = nDays > 0 ? nMonthly / nDays : 0;
  const nRoas = parseFloat(targetROAS) || 1;
  const nCpa = parseFloat(targetCPA) || 1;
  const nCtr = (parseFloat(expectedCTR) || 1) / 100;
  const nCr = (parseFloat(expectedCR) || 1) / 100;
  const nAov = parseFloat(aov) || 50;

  // 1. Conservative (80% efficiency)
  const consSpend = nMonthly;
  const consRevenue = nMonthly * (nRoas * 0.82);
  const consConversions = Math.round(nMonthly / (nCpa * 1.25));
  const consRoas = consSpend > 0 ? consRevenue / consSpend : 0;
  const consCpa = consConversions > 0 ? consSpend / consConversions : 0;
  const consClicks = nCr > 0 ? Math.round(consConversions / nCr) : 0;
  const consImpressions = nCtr > 0 ? Math.round(consClicks / nCtr) : 0;
  const consRemaining = 0; // fully allocated

  // 2. Balanced (100% target baseline)
  const balSpend = nMonthly;
  const balRevenue = nMonthly * nRoas;
  const balConversions = Math.round(nMonthly / nCpa);
  const balRoas = nRoas;
  const balCpa = nCpa;
  const balClicks = nCr > 0 ? Math.round(balConversions / nCr) : 0;
  const balImpressions = nCtr > 0 ? Math.round(balClicks / nCtr) : 0;
  const balRemaining = 0;

  // 3. Aggressive (125% efficiency / scale boost)
  const aggSpend = nMonthly;
  const aggRevenue = nMonthly * (nRoas * 1.25);
  const aggConversions = Math.round(nMonthly / (nCpa * 0.85));
  const aggRoas = aggSpend > 0 ? aggRevenue / aggSpend : 0;
  const aggCpa = aggConversions > 0 ? aggSpend / aggConversions : 0;
  const aggClicks = nCr > 0 ? Math.round(aggConversions / nCr) : 0;
  const aggImpressions = nCtr > 0 ? Math.round(aggClicks / nCtr) : 0;
  const aggRemaining = 0;

  const handleSavePlan = () => {
    if (editingPlanId) {
      const existing = plans.find(p => p.id === editingPlanId);
      if (existing) {
        const updated: BudgetPlan = {
          ...existing,
          name: name.trim() || "Updated Budget Plan",
          monthlyBudget: nMonthly,
          dailyBudget: nDaily,
          durationDays: nDays,
          targetROAS: nRoas,
          targetCPA: nCpa,
          expectedCTR: parseFloat(expectedCTR),
          expectedCR: parseFloat(expectedCR),
          aov: nAov,
          scenarios: {
            conservative: { spend: consSpend, revenue: consRevenue, roas: consRoas, conversions: consConversions },
            balanced: { spend: balSpend, revenue: balRevenue, roas: balRoas, conversions: balConversions },
            aggressive: { spend: aggSpend, revenue: aggRevenue, roas: aggRoas, conversions: aggConversions }
          }
        };
        StorageService.updateBudgetPlan(updated);
        setEditingPlanId(null);
      }
    } else {
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
          conservative: { spend: consSpend, revenue: consRevenue, roas: consRoas, conversions: consConversions },
          balanced: { spend: balSpend, revenue: balRevenue, roas: balRoas, conversions: balConversions },
          aggressive: { spend: aggSpend, revenue: aggRevenue, roas: aggRoas, conversions: aggConversions }
        }
      };
      StorageService.addBudgetPlan(newPlan);
    }
    loadPlans();
  };

  const handleLoadPlanToEdit = (p: BudgetPlan) => {
    setEditingPlanId(p.id);
    setName(p.name);
    setMonthlyBudget(String(p.monthlyBudget));
    setDailyBudget(String(p.dailyBudget));
    setDurationDays(String(p.durationDays));
    setTargetROAS(String(p.targetROAS));
    setTargetCPA(String(p.targetCPA));
    setExpectedCTR(String(p.expectedCTR));
    setExpectedCR(String(p.expectedCR));
    setAov(String(p.aov));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDuplicatePlan = (id: string) => {
    StorageService.duplicateBudgetPlan(id);
    loadPlans();
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Delete this budget plan?")) {
      StorageService.deleteBudgetPlan(id);
      loadPlans();
    }
  };

  // Section 8: Export Budget Plans to CSV
  const handleExportCSV = () => {
    const headers = [
      "Plan Name", "Monthly Budget", "Daily Budget", "Duration Days", "Target ROAS", "Target CPA",
      "Cons Revenue", "Cons ROAS", "Bal Revenue", "Bal ROAS", "Agg Revenue", "Agg ROAS"
    ];
    const rows = plans.map(p => [
      `"${p.name}"`,
      p.monthlyBudget.toFixed(2),
      p.dailyBudget.toFixed(2),
      p.durationDays,
      p.targetROAS.toFixed(2),
      p.targetCPA.toFixed(2),
      p.scenarios.conservative.revenue.toFixed(2),
      p.scenarios.conservative.roas.toFixed(2),
      p.scenarios.balanced.revenue.toFixed(2),
      p.scenarios.balanced.roas.toFixed(2),
      p.scenarios.aggressive.revenue.toFixed(2),
      p.scenarios.aggressive.roas.toFixed(2),
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `budget_plans_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Advertising Budget Planner</h1>
            <p className="text-secondary text-[#64748B]">Multi-scenario capital allocation modeling (Conservative, Balanced, Aggressive).</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#172033] text-xs font-semibold hover:bg-[#F8FAFC]"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export Plans (CSV)</span>
            </button>
          </div>
        </div>

        {/* Input Parameters Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">
                {editingPlanId ? "Editing Saved Plan" : "Configure Forecasting Assumptions"}
              </h3>
              <p className="text-xs text-[#64748B]">
                Outputs below are calculated deterministically from your financial targets.
              </p>
            </div>
            {editingPlanId && (
              <button
                type="button"
                onClick={() => setEditingPlanId(null)}
                className="text-xs text-[#DC2626] font-semibold hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#475569] mb-1">Plan Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Monthly Budget ($)</label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => handleMonthlyChange(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Daily Budget ($)</label>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => handleDailyChange(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Duration (Days)</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target ROAS (x)</label>
              <input
                type="number"
                step="0.1"
                value={targetROAS}
                onChange={(e) => setTargetROAS(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Target CPA ($)</label>
              <input
                type="number"
                value={targetCPA}
                onChange={(e) => setTargetCPA(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Expected CTR (%)</label>
              <input
                type="number"
                step="0.1"
                value={expectedCTR}
                onChange={(e) => setExpectedCTR(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Conversion Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={expectedCR}
                onChange={(e) => setExpectedCR(e.target.value)}
                className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#F1F5F9]">
            <span className="text-[11px] text-[#64748B] italic">
              * Note: Projections are estimates based strictly on user-provided performance targets.
            </span>
            <button
              type="button"
              onClick={handleSavePlan}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] shadow-subtle"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingPlanId ? "Update Plan" : "Save Budget Plan"}</span>
            </button>
          </div>
        </div>

        {/* 3 Scenario Comparison Grid (Conservative, Balanced, Aggressive) */}
        <div>
          <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
            Multi-Scenario Forecasting Comparison
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conservative Scenario */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">Conservative Scenario</h4>
                  <span className="text-[11px] text-[#64748B]">82% efficiency safety margin</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                  Safe Lower Bound
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Monthly Spend:</span>
                  <strong className="text-[#172033]">{formatCurrency(consSpend, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Daily Budget:</span>
                  <strong className="text-[#172033]">{formatCurrency(nDaily, currency)}/day</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Revenue:</span>
                  <strong className="text-[#16A34A]">{formatCurrency(consRevenue, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. ROAS:</span>
                  <strong className="text-[#16A34A]">{consRoas.toFixed(2)}x</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. CPA:</span>
                  <strong className="text-[#172033]">{formatCurrency(consCpa, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Conversions:</span>
                  <strong className="text-[#172033]">{consConversions.toLocaleString()} orders</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Clicks:</span>
                  <strong className="text-[#172033]">{consClicks.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Impressions:</span>
                  <strong className="text-[#172033]">{consImpressions.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Remaining Budget:</span>
                  <strong className="text-[#172033]">{formatCurrency(consRemaining, currency)}</strong>
                </div>
              </div>
            </div>

            {/* Balanced Scenario */}
            <div className="bg-white rounded-2xl border-2 border-[#2563EB] p-5 shadow-card space-y-4 relative">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider">
                Recommended Baseline
              </span>

              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">Balanced Scenario</h4>
                  <span className="text-[11px] text-[#64748B]">100% target objective achievement</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Monthly Spend:</span>
                  <strong className="text-[#172033]">{formatCurrency(balSpend, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Daily Budget:</span>
                  <strong className="text-[#172033]">{formatCurrency(nDaily, currency)}/day</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Revenue:</span>
                  <strong className="text-[#16A34A]">{formatCurrency(balRevenue, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. ROAS:</span>
                  <strong className="text-[#16A34A]">{balRoas.toFixed(2)}x</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. CPA:</span>
                  <strong className="text-[#172033]">{formatCurrency(balCpa, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Conversions:</span>
                  <strong className="text-[#172033]">{balConversions.toLocaleString()} orders</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Clicks:</span>
                  <strong className="text-[#172033]">{balClicks.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Impressions:</span>
                  <strong className="text-[#172033]">{balImpressions.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Remaining Budget:</span>
                  <strong className="text-[#172033]">{formatCurrency(balRemaining, currency)}</strong>
                </div>
              </div>
            </div>

            {/* Aggressive Scenario */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">Aggressive Scenario</h4>
                  <span className="text-[11px] text-[#64748B]">125% performance acceleration</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A]">
                  Scale Target
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Monthly Spend:</span>
                  <strong className="text-[#172033]">{formatCurrency(aggSpend, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Daily Budget:</span>
                  <strong className="text-[#172033]">{formatCurrency(nDaily, currency)}/day</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Revenue:</span>
                  <strong className="text-[#16A34A]">{formatCurrency(aggRevenue, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. ROAS:</span>
                  <strong className="text-[#16A34A]">{aggRoas.toFixed(2)}x</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. CPA:</span>
                  <strong className="text-[#172033]">{formatCurrency(aggCpa, currency)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Conversions:</span>
                  <strong className="text-[#172033]">{aggConversions.toLocaleString()} orders</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Clicks:</span>
                  <strong className="text-[#172033]">{aggClicks.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">Est. Impressions:</span>
                  <strong className="text-[#172033]">{aggImpressions.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Remaining Budget:</span>
                  <strong className="text-[#172033]">{formatCurrency(aggRemaining, currency)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Budget Plans List */}
        <div>
          <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
            Saved Budget Blueprints ({plans.length})
          </h4>

          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center text-xs text-[#64748B]">
              No budget plans saved yet. Configure assumptions above and click "Save Budget Plan".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold text-[#172033]">{p.name}</strong>
                      <span className="text-[11px] text-[#64748B]">{p.createdAt.split('T')[0]}</span>
                    </div>
                    <div className="text-xs text-[#64748B] mt-1 space-x-2">
                      <span>Budget: <strong>{formatCurrency(p.monthlyBudget, currency)}/mo</strong></span>
                      <span>•</span>
                      <span>Target: <strong className="text-[#16A34A]">{p.targetROAS.toFixed(2)}x ROAS</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-lg text-xs text-center border border-[#E2E8F0]">
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Conservative</span>
                      <strong className="text-[#172033]">{formatCurrency(p.scenarios.conservative.revenue, currency)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#2563EB] font-bold block">Balanced</span>
                      <strong className="text-[#2563EB]">{formatCurrency(p.scenarios.balanced.revenue, currency)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#16A34A] block">Aggressive</span>
                      <strong className="text-[#16A34A]">{formatCurrency(p.scenarios.aggressive.revenue, currency)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={() => handleLoadPlanToEdit(p)}
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicatePlan(p.id)}
                      className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="Duplicate Plan"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(p.id)}
                      className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
