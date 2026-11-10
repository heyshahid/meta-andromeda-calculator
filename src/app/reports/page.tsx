"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { Campaign, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import { FileText, Download, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ReportsPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setCampaigns(StorageService.getCampaigns());
  }, []);

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalConv = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const blendedROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const blendedCPA = totalConv > 0 ? totalSpend / totalConv : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ["Campaign Name", "Platform", "Spend", "Revenue", "ROAS", "Conversions", "CPA"];
    const rows = campaigns.map(c => [
      `"${c.name}"`,
      c.platform,
      c.spend.toFixed(2),
      c.revenue.toFixed(2),
      c.roas.toFixed(2),
      c.conversions,
      c.cpa.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `open_marketingops_executive_report_${new Date().toISOString().split("T")[0]}.csv`);
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
            <h1 className="text-page-title text-[#172033] tracking-tight">Executive Reports & Audits</h1>
            <p className="text-secondary text-[#64748B]">Generate audit-ready 1-page financial reports for clients and executive stakeholders.</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#172033] text-xs font-semibold hover:bg-[#F8FAFC]"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Printable Executive Report Container */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-card space-y-6 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
          {/* Official Report Header */}
          <div className="flex justify-between items-start pb-6 border-b border-[#E2E8F0]">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#2563EB] uppercase tracking-wider block">
                Official Financial & Media Audit
              </span>
              <h2 className="text-xl font-bold text-[#172033] mt-1">Open MarketingOps Performance Report</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Workspace: Shahid Growth Lab • Audit Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deterministic Verified</span>
              </span>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-4 gap-4 p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <span className="text-[11px] text-[#64748B] block">Total Ad Spend</span>
              <strong className="text-xl font-extrabold text-[#172033]">{formatCurrency(totalSpend, currency)}</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] block">Attributed Revenue</span>
              <strong className="text-xl font-extrabold text-[#172033]">{formatCurrency(totalRevenue, currency)}</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] block">Blended ROAS</span>
              <strong className="text-xl font-extrabold text-[#16A34A]">{blendedROAS.toFixed(2)}x</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] block">Blended CPA</span>
              <strong className="text-xl font-extrabold text-[#172033]">{formatCurrency(blendedCPA, currency)}</strong>
            </div>
          </div>

          {/* Campaigns Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Channel Portfolio Breakdown</h4>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Campaign</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3 text-right">Spend</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#172033]">{c.name}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">{c.platform}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(c.spend, currency)}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(c.revenue, currency)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#16A34A]">{c.roas.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature & Disclaimer Block */}
          <div className="pt-6 border-t border-[#E2E8F0] flex justify-between items-center text-[11px] text-[#64748B]">
            <div>
              <span>Prepared by <strong>Shahid Akram</strong> (Systems Lead & Paid Media Architect)</span>
            </div>
            <div>
              <span>Open MarketingOps • MIT Licensed Open-Source</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

