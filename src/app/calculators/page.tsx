"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  calculateROAS,
  calculateROI,
  calculateCPA,
  calculateCPM,
  calculateCPC,
  calculateCTR,
  calculateConversionRate,
  calculateAOV,
  calculateBreakEvenROAS,
  calculateProfit,
  calculateFrequency,
  calculateCAC,
  calculateLTV,
  calculateBudgetScaling,
  calculateMarketingFunnel,
  compareCreatives,
  formatCurrency,
  formatPercent
} from "@/lib/calculator-engine";
import { Calculator, RotateCcw, Copy, Check, Info, HelpCircle } from "lucide-react";

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<string>("roas");
  const [copied, setCopied] = useState(false);

  // 1. ROAS State
  const [roasRev, setRoasRev] = useState("5000");
  const [roasSpend, setRoasSpend] = useState("1250");

  // 2. ROI State
  const [roiProfit, setRoiProfit] = useState("3750");
  const [roiInvest, setRoiInvest] = useState("1250");

  // 3. CPA State
  const [cpaSpend, setCpaSpend] = useState("1500");
  const [cpaConv, setCpaConv] = useState("60");

  // 4. CPM State
  const [cpmSpend, setCpmSpend] = useState("750");
  const [cpmImp, setCpmImp] = useState("35000");

  // 5. CPC State
  const [cpcSpend, setCpcSpend] = useState("1000");
  const [cpcClicks, setCpcClicks] = useState("1200");

  // 6. CTR State
  const [ctrClicks, setCtrClicks] = useState("850");
  const [ctrImp, setCtrImp] = useState("35000");

  // 7. Conversion Rate State
  const [crConv, setCrConv] = useState("45");
  const [crClicks, setCrClicks] = useState("1500");

  // 8. AOV State
  const [aovRev, setAovRev] = useState("12500");
  const [aovOrders, setAovOrders] = useState("150");

  // 9. Break-even ROAS State
  const [beMargin, setBeMargin] = useState("40");

  // 10. Net Profit State
  const [npRev, setNpRev] = useState("20000");
  const [npCogs, setNpCogs] = useState("6000");
  const [npAdSpend, setNpAdSpend] = useState("5000");
  const [npOther, setNpOther] = useState("2000");

  // 11. Frequency State
  const [freqImp, setFreqImp] = useState("80000");
  const [freqReach, setFreqReach] = useState("25000");

  // 12. CAC State
  const [cacCost, setCacCost] = useState("8500");
  const [cacCust, setCacCust] = useState("170");

  // 13. LTV State
  const [ltvAov, setLtvAov] = useState("95");
  const [ltvFreq, setLtvFreq] = useState("3.5");
  const [ltvYears, setLtvYears] = useState("2");
  const [ltvMargin, setLtvMargin] = useState("55");

  // 14. Scaling State
  const [scaleBudget, setScaleBudget] = useState("200");
  const [scalePct, setScalePct] = useState("15");

  // Results computed deterministically
  const roasResult = calculateROAS(parseFloat(roasRev) || 0, parseFloat(roasSpend) || 0);
  const roiResult = calculateROI(parseFloat(roiProfit) || 0, parseFloat(roiInvest) || 0);
  const cpaResult = calculateCPA(parseFloat(cpaSpend) || 0, parseFloat(cpaConv) || 0);
  const cpmResult = calculateCPM(parseFloat(cpmSpend) || 0, parseFloat(cpmImp) || 0);
  const cpcResult = calculateCPC(parseFloat(cpcSpend) || 0, parseFloat(cpcClicks) || 0);
  const ctrResult = calculateCTR(parseFloat(ctrClicks) || 0, parseFloat(ctrImp) || 0);
  const crResult = calculateConversionRate(parseFloat(crConv) || 0, parseFloat(crClicks) || 0);
  const aovResult = calculateAOV(parseFloat(aovRev) || 0, parseFloat(aovOrders) || 0);
  const beResult = calculateBreakEvenROAS(parseFloat(beMargin) || 0);
  const profitResult = calculateProfit(parseFloat(npRev) || 0, parseFloat(npCogs) || 0, parseFloat(npAdSpend) || 0, parseFloat(npOther) || 0);
  const freqResult = calculateFrequency(parseFloat(freqImp) || 0, parseFloat(freqReach) || 0);
  const cacResult = calculateCAC(parseFloat(cacCost) || 0, parseFloat(cacCust) || 0);
  const ltvResult = calculateLTV(parseFloat(ltvAov) || 0, parseFloat(ltvFreq) || 0, parseFloat(ltvYears) || 0, parseFloat(ltvMargin) || 100);
  const scaleResult = calculateBudgetScaling(parseFloat(scaleBudget) || 0, parseFloat(scalePct) || 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CALCULATOR_TABS = [
    { id: "roas", label: "ROAS" },
    { id: "breakeven", label: "Break-even ROAS" },
    { id: "scaling", label: "Budget Scaling" },
    { id: "roi", label: "ROI" },
    { id: "cpa", label: "CPA" },
    { id: "cpm", label: "CPM" },
    { id: "cpc", label: "CPC" },
    { id: "ctr", label: "CTR" },
    { id: "cr", label: "Conversion Rate" },
    { id: "aov", label: "AOV" },
    { id: "profit", label: "Net Profit" },
    { id: "cac", label: "CAC" },
    { id: "ltv", label: "LTV" },
    { id: "frequency", label: "Frequency" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-page-title text-[#172033] tracking-tight">Marketing Calculation Engine</h1>
          <p className="text-secondary text-[#64748B]">16 deterministic financial & efficiency formulas with zero-division safety and formula proofs.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-xl shadow-subtle overflow-x-auto">
          {CALCULATOR_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[#2563EB] text-white shadow-subtle"
                  : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Calculator Box */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card max-w-3xl">
          {activeTab === "roas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#172033]">Return on Ad Spend (ROAS)</h3>
                  <p className="text-xs text-[#64748B]">Measures gross revenue generated for every dollar spent on ads.</p>
                </div>
                <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded border border-[#BFDBFE]">
                  Formula: Revenue / Ad Spend
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Gross Revenue ($)</label>
                  <input
                    type="number"
                    value={roasRev}
                    onChange={(e) => setRoasRev(e.target.value)}
                    className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Total Ad Spend ($)</label>
                  <input
                    type="number"
                    value={roasSpend}
                    onChange={(e) => setRoasSpend(e.target.value)}
                    className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  />
                </div>
              </div>

              {/* Live Output */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#64748B] block">Calculated ROAS</span>
                  <span className="text-3xl font-extrabold text-[#172033]">{roasResult.formattedValue}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`ROAS: ${roasResult.formattedValue}`)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="text-xs text-[#64748B] flex items-start space-x-2 bg-[#EFF6FF] p-3 rounded-lg border border-[#BFDBFE]">
                <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>{roasResult.explanation}</span>
              </div>
            </div>
          )}

          {activeTab === "breakeven" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#172033]">Break-even ROAS Calculator</h3>
                  <p className="text-xs text-[#64748B]">The absolute minimum ROAS needed before ad campaigns become unprofitable.</p>
                </div>
                <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded border border-[#BFDBFE]">
                  Formula: 1 / Gross Margin
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Gross Margin (%)</label>
                <input
                  type="number"
                  value={beMargin}
                  onChange={(e) => setBeMargin(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#64748B] block">Required Break-even ROAS</span>
                  <span className="text-3xl font-extrabold text-[#172033]">{beResult.formattedValue}</span>
                </div>
              </div>

              <div className="text-xs text-[#64748B] space-y-2 bg-[#FFFBEB] p-3.5 rounded-lg border border-[#FDE68A]">
                <p className="font-semibold text-[#92400E] flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-[#D97706]" />
                  <span>Important Financial Nuance</span>
                </p>
                <p className="text-[#78350F]">{beResult.notes}</p>
              </div>
            </div>
          )}

          {activeTab === "scaling" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#172033]">Anti-Learning-Reset Budget Scaling</h3>
                  <p className="text-xs text-[#64748B]">Calculate safe compounding budget ladders to protect Meta algorithm delivery stability.</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${scaleResult.riskAssessment === 'Safe' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                  {scaleResult.riskAssessment} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Current Daily Budget ($)</label>
                  <input
                    type="number"
                    value={scaleBudget}
                    onChange={(e) => setScaleBudget(e.target.value)}
                    className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Proposed Increase (%)</label>
                  <input
                    type="number"
                    value={scalePct}
                    onChange={(e) => setScalePct(e.target.value)}
                    className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <span className="text-[11px] text-[#64748B] block">New Daily Budget</span>
                  <span className="text-lg font-bold text-[#172033]">{scaleResult.formattedNewBudget}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] block">Daily Net Increase</span>
                  <span className="text-lg font-bold text-[#2563EB]">+{scaleResult.formattedAdditional}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] block">Est. 30-Day Run Rate</span>
                  <span className="text-lg font-bold text-[#172033]">{scaleResult.formattedMonthly}</span>
                </div>
              </div>

              <div className="text-xs p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]">
                <strong>Rule Recommendation:</strong> {scaleResult.recommendation}
              </div>
            </div>
          )}

          {activeTab === "roi" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Return on Investment (ROI)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Net Profit ($)</label>
                  <input type="number" value={roiProfit} onChange={(e) => setRoiProfit(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Total Investment ($)</label>
                  <input type="number" value={roiInvest} onChange={(e) => setRoiInvest(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated ROI</span>
                <span className="text-3xl font-extrabold text-[#172033]">{roiResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "cpa" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Cost per Acquisition (CPA)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Spend ($)</label>
                  <input type="number" value={cpaSpend} onChange={(e) => setCpaSpend(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Conversions</label>
                  <input type="number" value={cpaConv} onChange={(e) => setCpaConv(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated CPA</span>
                <span className="text-3xl font-extrabold text-[#172033]">{cpaResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "cpm" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Cost per 1,000 Impressions (CPM)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Spend ($)</label>
                  <input type="number" value={cpmSpend} onChange={(e) => setCpmSpend(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Impressions</label>
                  <input type="number" value={cpmImp} onChange={(e) => setCpmImp(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated CPM</span>
                <span className="text-3xl font-extrabold text-[#172033]">{cpmResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "cpc" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Cost per Click (CPC)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Spend ($)</label>
                  <input type="number" value={cpcSpend} onChange={(e) => setCpcSpend(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Clicks</label>
                  <input type="number" value={cpcClicks} onChange={(e) => setCpcClicks(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated CPC</span>
                <span className="text-3xl font-extrabold text-[#172033]">{cpcResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "ctr" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Click-Through Rate (CTR)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Clicks</label>
                  <input type="number" value={ctrClicks} onChange={(e) => setCtrClicks(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Impressions</label>
                  <input type="number" value={ctrImp} onChange={(e) => setCtrImp(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated CTR</span>
                <span className="text-3xl font-extrabold text-[#172033]">{ctrResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "cr" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Conversion Rate (%)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Conversions</label>
                  <input type="number" value={crConv} onChange={(e) => setCrConv(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Clicks</label>
                  <input type="number" value={crClicks} onChange={(e) => setCrClicks(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated Conversion Rate</span>
                <span className="text-3xl font-extrabold text-[#172033]">{crResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "aov" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Average Order Value (AOV)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Total Revenue ($)</label>
                  <input type="number" value={aovRev} onChange={(e) => setAovRev(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Total Orders</label>
                  <input type="number" value={aovOrders} onChange={(e) => setAovOrders(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Calculated AOV</span>
                <span className="text-3xl font-extrabold text-[#172033]">{aovResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "profit" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Net Contribution Profit</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Gross Revenue ($)</label>
                  <input type="number" value={npRev} onChange={(e) => setNpRev(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Product Costs / COGS ($)</label>
                  <input type="number" value={npCogs} onChange={(e) => setNpCogs(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Ad Spend ($)</label>
                  <input type="number" value={npAdSpend} onChange={(e) => setNpAdSpend(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Shipping & Gateway Fees ($)</label>
                  <input type="number" value={npOther} onChange={(e) => setNpOther(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">True Net Profit</span>
                <span className="text-3xl font-extrabold text-[#172033]">{profitResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "cac" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Customer Acquisition Cost (CAC)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Total Sales & Marketing Costs ($)</label>
                  <input type="number" value={cacCost} onChange={(e) => setCacCost(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">New Customers Acquired</label>
                  <input type="number" value={cacCust} onChange={(e) => setCacCust(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Blended CAC</span>
                <span className="text-3xl font-extrabold text-[#172033]">{cacResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "ltv" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Customer Lifetime Value (LTV)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Average Order Value ($)</label>
                  <input type="number" value={ltvAov} onChange={(e) => setLtvAov(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Purchases Per Year</label>
                  <input type="number" value={ltvFreq} onChange={(e) => setLtvFreq(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Customer Lifespan (Years)</label>
                  <input type="number" value={ltvYears} onChange={(e) => setLtvYears(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Gross Margin (%)</label>
                  <input type="number" value={ltvMargin} onChange={(e) => setLtvMargin(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Expected Gross Lifetime Value</span>
                <span className="text-3xl font-extrabold text-[#172033]">{ltvResult.formattedValue}</span>
              </div>
            </div>
          )}

          {activeTab === "frequency" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#172033]">Ad Frequency</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Impressions</label>
                  <input type="number" value={freqImp} onChange={(e) => setFreqImp(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Unique Reach</label>
                  <input type="number" value={freqReach} onChange={(e) => setFreqReach(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Average Frequency</span>
                <span className="text-3xl font-extrabold text-[#172033]">{freqResult.formattedValue}x</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

