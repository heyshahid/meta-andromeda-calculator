"use client";

import React, { useState, useEffect } from "react";
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
import { StorageService } from "@/lib/storage";
import { SavedCalculation, CurrencyCode } from "@/lib/types";
import {
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Bookmark,
  Search,
  Filter,
  Trash2,
  Edit2,
  Download,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";

export default function CalculatorsPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [mainMode, setMainMode] = useState<"calculators" | "saved">("calculators");
  const [activeTab, setActiveTab] = useState<string>("roas");
  const [copied, setCopied] = useState(false);

  // Saved Calculations State
  const [savedCalcs, setSavedCalcs] = useState<SavedCalculation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveNotes, setSaveNotes] = useState("");
  const [editingCalc, setEditingCalc] = useState<SavedCalculation | null>(null);

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

  // 15. Funnel State
  const [funnelImp, setFunnelImp] = useState("50000");
  const [funnelClicks, setFunnelClicks] = useState("1500");
  const [funnelLeads, setFunnelLeads] = useState("180");
  const [funnelOrders, setFunnelOrders] = useState("45");

  // 16. Creative Comparison State
  const [cmpACtr, setCmpACtr] = useState("2.8");
  const [cmpACpa, setCmpACpa] = useState("18.50");
  const [cmpARoas, setCmpARoas] = useState("3.9");
  const [cmpBCtr, setCmpBCtr] = useState("1.9");
  const [cmpBCpa, setCmpBCpa] = useState("26.00");
  const [cmpBRoas, setCmpBRoas] = useState("2.4");

  const loadSavedCalcs = () => {
    const list = StorageService.getSavedCalculations();
    setSavedCalcs(list);
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
  };

  useEffect(() => {
    loadSavedCalcs();
  }, []);

  // Compute Results deterministically
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
  const funnelResult = calculateMarketingFunnel(
    parseInt(funnelImp, 10) || 0,
    parseInt(funnelClicks, 10) || 0,
    parseInt(funnelLeads, 10) || 0,
    parseInt(funnelOrders, 10) || 0
  );
  const creativeResult = compareCreatives(
    { ctr: parseFloat(cmpACtr) || 0, cpa: parseFloat(cmpACpa) || 0, roas: parseFloat(cmpARoas) || 0 },
    { ctr: parseFloat(cmpBCtr) || 0, cpa: parseFloat(cmpBCpa) || 0, roas: parseFloat(cmpBRoas) || 0 }
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get active calculator context for saving
  const getCurrentCalculationPayload = (): {
    type: string;
    defaultTitle: string;
    inputs: Record<string, string | number>;
    outputs: Record<string, string | number>;
  } => {
    switch (activeTab) {
      case "roas":
        return {
          type: "ROAS",
          defaultTitle: `ROAS Target (${roasResult.formattedValue})`,
          inputs: { Revenue: roasRev, Spend: roasSpend },
          outputs: { ROAS: roasResult.formattedValue, Explanation: roasResult.explanation }
        };
      case "breakeven":
        return {
          type: "Break-even ROAS",
          defaultTitle: `Break-even ROAS (${beResult.formattedValue})`,
          inputs: { GrossMargin: beMargin },
          outputs: { BreakEvenROAS: beResult.formattedValue }
        };
      case "scaling":
        return {
          type: "Budget Scaling",
          defaultTitle: `Budget Scale +${scalePct}% ($${scaleResult.newDailyBudget}/day)`,
          inputs: { CurrentDailyBudget: scaleBudget, ScalingPercentage: scalePct },
          outputs: { NewDailyBudget: scaleResult.newDailyBudget, AdditionalSpend: scaleResult.additionalDailyBudget }
        };
      case "roi":
        return {
          type: "ROI",
          defaultTitle: `Net ROI (${roiResult.formattedValue})`,
          inputs: { NetProfit: roiProfit, Investment: roiInvest },
          outputs: { ROI: roiResult.formattedValue }
        };
      case "cpa":
        return {
          type: "CPA",
          defaultTitle: `CPA Target ($${cpaResult.value.toFixed(2)})`,
          inputs: { TotalSpend: cpaSpend, Conversions: cpaConv },
          outputs: { CPA: cpaResult.formattedValue }
        };
      case "cpm":
        return {
          type: "CPM",
          defaultTitle: `CPM Rate ($${cpmResult.value.toFixed(2)})`,
          inputs: { Spend: cpmSpend, Impressions: cpmImp },
          outputs: { CPM: cpmResult.formattedValue }
        };
      case "cpc":
        return {
          type: "CPC",
          defaultTitle: `Cost per Click ($${cpcResult.value.toFixed(2)})`,
          inputs: { Spend: cpcSpend, Clicks: cpcClicks },
          outputs: { CPC: cpcResult.formattedValue }
        };
      case "ctr":
        return {
          type: "CTR",
          defaultTitle: `Click-Through Rate (${ctrResult.formattedValue})`,
          inputs: { Clicks: ctrClicks, Impressions: ctrImp },
          outputs: { CTR: ctrResult.formattedValue }
        };
      case "cr":
        return {
          type: "Conversion Rate",
          defaultTitle: `Conversion Rate (${crResult.formattedValue})`,
          inputs: { Conversions: crConv, Clicks: crClicks },
          outputs: { ConversionRate: crResult.formattedValue }
        };
      case "aov":
        return {
          type: "Average Order Value",
          defaultTitle: `AOV Target ($${aovResult.value.toFixed(2)})`,
          inputs: { Revenue: aovRev, Orders: aovOrders },
          outputs: { AOV: aovResult.formattedValue }
        };
      case "profit":
        return {
          type: "Net Profit",
          defaultTitle: `Net Profit Modeling (${profitResult.formattedValue})`,
          inputs: { Revenue: npRev, COGS: npCogs, AdSpend: npAdSpend, OtherCosts: npOther },
          outputs: { NetProfit: profitResult.formattedValue }
        };
      case "cac":
        return {
          type: "CAC",
          defaultTitle: `CAC Modeling ($${cacResult.value.toFixed(2)})`,
          inputs: { AdCost: cacCost, CustomersAcquired: cacCust },
          outputs: { CAC: cacResult.formattedValue }
        };
      case "ltv":
        return {
          type: "LTV",
          defaultTitle: `Customer LTV ($${ltvResult.value.toFixed(2)})`,
          inputs: { AOV: ltvAov, PurchaseFrequency: ltvFreq, CustomerLifespanYears: ltvYears, GrossMargin: ltvMargin },
          outputs: { LTV: ltvResult.formattedValue }
        };
      case "frequency":
        return {
          type: "Frequency",
          defaultTitle: `Ad Frequency (${freqResult.formattedValue})`,
          inputs: { Impressions: freqImp, Reach: freqReach },
          outputs: { Frequency: freqResult.formattedValue }
        };
      case "funnel":
        const overallConv = parseInt(funnelImp, 10) > 0 ? ((parseInt(funnelOrders, 10) || 0) / parseInt(funnelImp, 10)) * 100 : 0;
        return {
          type: "Marketing Funnel",
          defaultTitle: `Funnel Efficiency (${funnelOrders} Orders / ${funnelImp} Views)`,
          inputs: { Impressions: funnelImp, Clicks: funnelClicks, Leads: funnelLeads, Orders: funnelOrders },
          outputs: {
            OverallConversionRate: `${overallConv.toFixed(2)}%`,
            CTR: `${(funnelResult[1]?.conversionFromPrevious || 0).toFixed(2)}%`,
            ClickToLead: `${(funnelResult[2]?.conversionFromPrevious || 0).toFixed(2)}%`
          }
        };
      case "creative":
        return {
          type: "Creative Comparison",
          defaultTitle: `Creative Comparison (${creativeResult.winnerMetric})`,
          inputs: {
            CreativeA_CTR: cmpACtr + "%",
            CreativeA_CPA: cmpACpa,
            CreativeA_ROAS: cmpARoas + "x",
            CreativeB_CTR: cmpBCtr + "%",
            CreativeB_CPA: cmpBCpa,
            CreativeB_ROAS: cmpBRoas + "x"
          },
          outputs: {
            Winner: creativeResult.winnerMetric,
            ROAS_Difference: `${creativeResult.roasDifference >= 0 ? '+' : ''}${creativeResult.roasDifference.toFixed(2)}x`,
            CPA_Difference: `${creativeResult.cpaDifference <= 0 ? '' : '+'}${creativeResult.cpaDifference.toFixed(2)}`,
            Summary: creativeResult.summary
          }
        };
      default:
        return {
          type: "ROAS",
          defaultTitle: "Marketing Calculation",
          inputs: {},
          outputs: {}
        };
    }
  };

  const handleOpenSaveModal = () => {
    const payload = getCurrentCalculationPayload();
    setSaveTitle(payload.defaultTitle);
    setSaveNotes("");
    setIsSaveModalOpen(true);
  };

  const handleSaveCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getCurrentCalculationPayload();

    const newCalc: SavedCalculation = {
      id: `calc-${Date.now()}`,
      workspaceId: "active-workspace",
      userId: "user-shahid",
      calculatorType: payload.type,
      title: saveTitle.trim() || payload.defaultTitle,
      inputs: payload.inputs,
      outputs: payload.outputs,
      notes: saveNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveCalculation(newCalc);
    loadSavedCalcs();
    setIsSaveModalOpen(false);
  };

  const handleUpdateSavedCalc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCalc) return;
    StorageService.updateSavedCalculation(editingCalc);
    loadSavedCalcs();
    setEditingCalc(null);
  };

  const handleDeleteSavedCalc = (id: string) => {
    if (confirm("Delete this saved calculation?")) {
      StorageService.deleteSavedCalculation(id);
      loadSavedCalcs();
    }
  };

  // Section 8: CSV Export for Calculator Results
  const handleExportSavedCalcsCSV = () => {
    const headers = ["Title", "Type", "Created At", "Inputs", "Outputs", "Notes"];
    const rows = filteredSavedCalcs.map(c => [
      `"${c.title}"`,
      `"${c.calculatorType}"`,
      `"${c.createdAt.split('T')[0]}"`,
      `"${JSON.stringify(c.inputs).replace(/"/g, '""')}"`,
      `"${JSON.stringify(c.outputs).replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `saved_calculations_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    { id: "funnel", label: "Funnel Stages" },
    { id: "creative", label: "Creative Comparison" },
  ];

  // Filtered Saved Calculations
  const filteredSavedCalcs = savedCalcs.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.notes || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || c.calculatorType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header & Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Marketing Calculation & Saved Audit Suite</h1>
            <p className="text-secondary text-[#64748B]">16 deterministic formulas with zero-division protection, live saving, and CSV export.</p>
          </div>

          {/* Toggle between Calculator Tools and Saved Calculations */}
          <div className="flex items-center space-x-1 p-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setMainMode("calculators")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mainMode === "calculators" ? "bg-[#2563EB] text-white shadow-subtle" : "text-[#64748B] hover:text-[#172033]"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculators</span>
            </button>
            <button
              type="button"
              onClick={() => setMainMode("saved")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mainMode === "saved" ? "bg-[#2563EB] text-white shadow-subtle" : "text-[#64748B] hover:text-[#172033]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Records ({savedCalcs.length})</span>
            </button>
          </div>
        </div>

        {/* MODE 1: LIVE CALCULATORS */}
        {mainMode === "calculators" && (
          <div className="space-y-6">
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
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card max-w-3xl space-y-6">
              {/* ROAS Calculator */}
              {activeTab === "roas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-base font-bold text-[#172033]">Return on Ad Spend (ROAS)</h3>
                      <p className="text-xs text-[#64748B]">Measures gross revenue generated for every dollar spent on ads.</p>
                    </div>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded border border-[#BFDBFE]">
                      Revenue / Ad Spend
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

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated ROAS</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{roasResult.formattedValue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleOpenSaveModal}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save Result</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`ROAS: ${roasResult.formattedValue}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-white"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Break-even ROAS Calculator */}
              {activeTab === "breakeven" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-base font-bold text-[#172033]">Break-even ROAS Calculator</h3>
                      <p className="text-xs text-[#64748B]">Calculates the exact minimum ROAS required before losing money.</p>
                    </div>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded border border-[#BFDBFE]">
                      1 / Gross Margin
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Gross Profit Margin (%)</label>
                    <input
                      type="number"
                      value={beMargin}
                      onChange={(e) => setBeMargin(e.target.value)}
                      className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Required Break-even ROAS</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{beResult.formattedValue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleOpenSaveModal}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save Result</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`Break-even ROAS: ${beResult.formattedValue}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-white"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Scaling Calculator */}
              {activeTab === "scaling" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-base font-bold text-[#172033]">Anti-Learning-Reset Budget Scaling</h3>
                      <p className="text-xs text-[#64748B]">Calculate safe budget compounding step without triggering Meta learning phase reset.</p>
                    </div>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded border border-[#BFDBFE]">
                      Budget × (1 + % / 100)
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
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Increment Percentage (%)</label>
                      <input
                        type="number"
                        value={scalePct}
                        onChange={(e) => setScalePct(e.target.value)}
                        className="w-full text-sm border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">New Safe Daily Budget</span>
                      <span className="text-3xl font-extrabold text-[#172033]">${scaleResult.newDailyBudget}</span>
                      <span className="text-xs text-[#16A34A] block mt-0.5">+${scaleResult.additionalDailyBudget}/day additional spend</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenSaveModal}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save Plan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Marketing Funnel Stages Calculator */}
              {activeTab === "funnel" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-base font-bold text-[#172033]">Marketing Funnel Stages Calculator</h3>
                      <p className="text-xs text-[#64748B]">Measure step-by-step conversion drop-off across the full customer journey.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Impressions</label>
                      <input
                        type="number"
                        value={funnelImp}
                        onChange={(e) => setFunnelImp(e.target.value)}
                        className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Clicks</label>
                      <input
                        type="number"
                        value={funnelClicks}
                        onChange={(e) => setFunnelClicks(e.target.value)}
                        className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Leads</label>
                      <input
                        type="number"
                        value={funnelLeads}
                        onChange={(e) => setFunnelLeads(e.target.value)}
                        className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Purchases</label>
                      <input
                        type="number"
                        value={funnelOrders}
                        onChange={(e) => setFunnelOrders(e.target.value)}
                        className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#64748B] block text-[11px]">Impression to Click</span>
                      <strong className="text-sm text-[#172033]">{(funnelResult[1]?.conversionFromPrevious || 0).toFixed(2)}%</strong>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#64748B] block text-[11px]">Click to Lead</span>
                      <strong className="text-sm text-[#172033]">{(funnelResult[2]?.conversionFromPrevious || 0).toFixed(2)}%</strong>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                      <span className="text-[#64748B] block text-[11px]">Overall Conversion</span>
                      <strong className="text-sm text-[#16A34A]">
                        {(parseInt(funnelImp, 10) > 0 ? ((parseInt(funnelOrders, 10) || 0) / parseInt(funnelImp, 10)) * 100 : 0).toFixed(2)}%
                      </strong>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleOpenSaveModal}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save Funnel Audit</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Other standard calculators (ROI, CPA, CPM, CPC, CTR, CR, AOV, Profit, CAC, LTV, Frequency) */}
              {activeTab === "roi" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Return on Investment (ROI)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">(Net Profit / Investment) × 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Net Profit ($)</label>
                      <input type="number" value={roiProfit} onChange={e => setRoiProfit(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Total Investment ($)</label>
                      <input type="number" value={roiInvest} onChange={e => setRoiInvest(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated ROI</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{roiResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "cpa" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Cost Per Acquisition (CPA)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">Spend / Conversions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Ad Spend ($)</label>
                      <input type="number" value={cpaSpend} onChange={e => setCpaSpend(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Conversions</label>
                      <input type="number" value={cpaConv} onChange={e => setCpaConv(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated CPA</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{cpaResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "cpm" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Cost Per Mille (CPM)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">(Spend / Impressions) × 1000</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Spend ($)</label>
                      <input type="number" value={cpmSpend} onChange={e => setCpmSpend(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Impressions</label>
                      <input type="number" value={cpmImp} onChange={e => setCpmImp(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated CPM</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{cpmResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "cpc" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Cost Per Click (CPC)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">Spend / Clicks</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Spend ($)</label>
                      <input type="number" value={cpcSpend} onChange={e => setCpcSpend(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Clicks</label>
                      <input type="number" value={cpcClicks} onChange={e => setCpcClicks(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated CPC</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{cpcResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "ctr" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Click-Through Rate (CTR)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">(Clicks / Impressions) × 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Clicks</label>
                      <input type="number" value={ctrClicks} onChange={e => setCtrClicks(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Impressions</label>
                      <input type="number" value={ctrImp} onChange={e => setCtrImp(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated CTR</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{ctrResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "cr" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Conversion Rate</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">(Conversions / Clicks) × 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Conversions</label>
                      <input type="number" value={crConv} onChange={e => setCrConv(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Clicks</label>
                      <input type="number" value={crClicks} onChange={e => setCrClicks(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated CR</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{crResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "aov" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Average Order Value (AOV)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">Revenue / Orders</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Revenue ($)</label>
                      <input type="number" value={aovRev} onChange={e => setAovRev(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Orders</label>
                      <input type="number" value={aovOrders} onChange={e => setAovOrders(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated AOV</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{aovResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "profit" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Net Profit Calculator</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">Revenue - COGS - Ads - Other</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Revenue ($)</label>
                      <input type="number" value={npRev} onChange={e => setNpRev(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">COGS ($)</label>
                      <input type="number" value={npCogs} onChange={e => setNpCogs(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Ad Spend ($)</label>
                      <input type="number" value={npAdSpend} onChange={e => setNpAdSpend(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Other Costs ($)</label>
                      <input type="number" value={npOther} onChange={e => setNpOther(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Net Profit</span>
                      <span className="text-3xl font-extrabold text-[#16A34A]">{profitResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "cac" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Customer Acquisition Cost (CAC)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">Total Acquisition Cost / Customers</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Total Acquisition Cost ($)</label>
                      <input type="number" value={cacCost} onChange={e => setCacCost(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">New Customers Acquired</label>
                      <input type="number" value={cacCust} onChange={e => setCacCust(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated CAC</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{cacResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "ltv" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Customer Lifetime Value (LTV)</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">AOV × Frequency × Years × Margin%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">AOV ($)</label>
                      <input type="number" value={ltvAov} onChange={e => setLtvAov(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Annual Orders</label>
                      <input type="number" value={ltvFreq} onChange={e => setLtvFreq(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Lifespan (Yrs)</label>
                      <input type="number" value={ltvYears} onChange={e => setLtvYears(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Margin (%)</label>
                      <input type="number" value={ltvMargin} onChange={e => setLtvMargin(e.target.value)} className="w-full border rounded-lg p-2 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Calculated Customer LTV</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{ltvResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "frequency" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-bold text-[#172033]">Ad Frequency</h3>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">Impressions / Reach</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Impressions</label>
                      <input type="number" value={freqImp} onChange={e => setFreqImp(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Unique Reach</label>
                      <input type="number" value={freqReach} onChange={e => setFreqReach(e.target.value)} className="w-full border rounded-lg p-2.5 bg-[#F8FAFC]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#64748B] block">Average Frequency</span>
                      <span className="text-3xl font-extrabold text-[#172033]">{freqResult.formattedValue}</span>
                    </div>
                    <button type="button" onClick={handleOpenSaveModal} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">Save Result</button>
                  </div>
                </div>
              )}

              {activeTab === "creative" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-base font-bold text-[#172033]">Creative Performance Comparison</h3>
                      <p className="text-xs text-[#64748B]">Multi-signal A/B creative scoring based on CTR, acquisition cost, and revenue efficiency.</p>
                    </div>
                    <span className="text-xs font-mono bg-[#EFF6FF] text-[#2563EB] px-2 py-1 rounded">A/B Multi-Signal Matrix</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Creative A */}
                    <div className="p-4 rounded-xl border border-[#BFDBFE] bg-[#F8FAFC] space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-[#1E40AF]">Creative A (Control)</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB]">Baseline</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">CTR (%)</label>
                          <input type="number" step="0.01" value={cmpACtr} onChange={e => setCmpACtr(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">CPA ($)</label>
                          <input type="number" step="0.01" value={cmpACpa} onChange={e => setCmpACpa(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">ROAS (x)</label>
                          <input type="number" step="0.01" value={cmpARoas} onChange={e => setCmpARoas(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
                        </div>
                      </div>
                    </div>

                    {/* Creative B */}
                    <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-[#172033]">Creative B (Challenger)</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">Variant</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">CTR (%)</label>
                          <input type="number" step="0.01" value={cmpBCtr} onChange={e => setCmpBCtr(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">CPA ($)</label>
                          <input type="number" step="0.01" value={cmpBCpa} onChange={e => setCmpBCpa(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">ROAS (x)</label>
                          <input type="number" step="0.01" value={cmpBRoas} onChange={e => setCmpBRoas(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Winner Comparison Result Card */}
                  <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-[#64748B]">Winner Assessment:</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                          creativeResult.winnerMetric === 'Creative A' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                          creativeResult.winnerMetric === 'Creative B' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {creativeResult.winnerMetric === 'Creative A' ? '🏆 Creative A Outperformed' :
                           creativeResult.winnerMetric === 'Creative B' ? '🏆 Creative B Outperformed' : '⚖️ Statistical Tie'}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569]">{creativeResult.summary}</p>
                    </div>

                    <button type="button" onClick={handleOpenSaveModal} className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold shrink-0">
                      Save Result
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: PERSISTENT SAVED CALCULATIONS WORKSPACE (Section 7) */}
        {mainMode === "saved" && (
          <div className="space-y-4">
            {/* Search, Filter, & CSV Export Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-card">
              <div className="flex items-center space-x-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved calculations by title or notes..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg bg-white px-2 py-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Types</option>
                    <option value="ROAS">ROAS</option>
                    <option value="Break-even ROAS">Break-even ROAS</option>
                    <option value="Budget Scaling">Budget Scaling</option>
                    <option value="CAC">CAC</option>
                    <option value="LTV">LTV</option>
                    <option value="ROI">ROI</option>
                    <option value="Marketing Funnel">Marketing Funnel</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportSavedCalcsCSV}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#172033] text-xs font-semibold hover:bg-[#F8FAFC] shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Export Saved Records (CSV)</span>
              </button>
            </div>

            {/* Saved Calculations Cards Grid */}
            {filteredSavedCalcs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
                <Bookmark className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <h4 className="text-sm font-bold text-[#172033]">No saved calculations found</h4>
                <p className="text-xs text-[#64748B]">Switch to the Calculators tab and click "Save Result" to archive financial calculations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSavedCalcs.map((calc) => (
                  <div key={calc.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                          {calc.calculatorType}
                        </span>
                        <span className="text-[10px] text-[#64748B]">{calc.createdAt.split('T')[0]}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#172033]">{calc.title}</h4>
                      {calc.notes && (
                        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
                          {calc.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#F1F5F9] space-y-2">
                      <div className="bg-[#F8FAFC] p-2.5 rounded-lg text-xs font-mono space-y-1">
                        <strong className="text-[10px] text-[#64748B] uppercase tracking-wider block">Outputs:</strong>
                        {Object.entries(calc.outputs).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-[#172033]">
                            <span>{k}:</span>
                            <span className="font-bold text-[#16A34A]">{String(v)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCalc(calc)}
                          className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors"
                          title="Edit Notes"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedCalc(calc.id)}
                          className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors"
                          title="Delete Calculation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Save Calculation Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="text-base font-bold text-[#172033]">Save Calculation to Workspace</h3>
              <button type="button" onClick={() => setIsSaveModalOpen(false)} className="p-1 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCalculation} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Custom Title *</label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Audit Notes / Strategy Rationale</label>
                <textarea
                  value={saveNotes}
                  onChange={(e) => setSaveNotes(e.target.value)}
                  rows={3}
                  placeholder="Record testing conditions, audience parameters, or margin assumptions..."
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-[#64748B]">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Saved Calculation Modal */}
      {editingCalc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="text-base font-bold text-[#172033]">Edit Saved Calculation</h3>
              <button type="button" onClick={() => setEditingCalc(null)} className="p-1 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSavedCalc} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Title *</label>
                <input
                  type="text"
                  value={editingCalc.title}
                  onChange={(e) => setEditingCalc({ ...editingCalc, title: e.target.value })}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Notes</label>
                <textarea
                  value={editingCalc.notes || ""}
                  onChange={(e) => setEditingCalc({ ...editingCalc, notes: e.target.value })}
                  rows={3}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setEditingCalc(null)} className="px-4 py-2 text-xs font-semibold text-[#64748B]">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]">
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
