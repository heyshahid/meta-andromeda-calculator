"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { Campaign, CurrencyCode } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/calculator-engine";
import {
  BarChart3,
  Search,
  Download,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AnalyticsPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<keyof Campaign>("roas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const handleSort = (field: keyof Campaign) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filtered = campaigns
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.platform.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const exportTableCSV = () => {
    if (campaigns.length === 0) return;
    const headers = ["Name", "Platform", "Spend", "Revenue", "ROAS", "Conversions", "CPA", "CTR", "CPC", "CPM"];
    const rows = campaigns.map(c => [
      `"${c.name}"`,
      c.platform,
      c.spend.toFixed(2),
      c.revenue.toFixed(2),
      c.roas.toFixed(2),
      c.conversions,
      c.cpa.toFixed(2),
      c.ctr.toFixed(2) + "%",
      c.cpc.toFixed(2),
      c.cpm.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `open_marketingops_analytics_${new Date().toISOString().split("T")[0]}.csv`);
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
            <h1 className="text-page-title text-[#172033] tracking-tight">Campaign Analytics</h1>
            <p className="text-secondary text-[#64748B]">Granular performance table with multi-metric sorting, filtering, and CSV export.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={exportTableCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#172033] text-xs font-semibold hover:bg-[#F8FAFC] shadow-subtle"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-card">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns or platforms..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <span className="text-xs text-[#64748B]">Showing {filtered.length} of {campaigns.length} campaigns</span>
        </div>

        {/* Analytics Table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold select-none">
                <tr>
                  <th onClick={() => handleSort("name")} className="p-3.5 cursor-pointer hover:text-[#172033]">
                    <div className="flex items-center space-x-1"><span>Campaign</span><ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th onClick={() => handleSort("platform")} className="p-3.5 cursor-pointer hover:text-[#172033]">Platform</th>
                  <th onClick={() => handleSort("spend")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">Spend</th>
                  <th onClick={() => handleSort("revenue")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">Revenue</th>
                  <th onClick={() => handleSort("roas")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">ROAS</th>
                  <th onClick={() => handleSort("conversions")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">Conv.</th>
                  <th onClick={() => handleSort("cpa")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">CPA</th>
                  <th onClick={() => handleSort("ctr")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">CTR</th>
                  <th onClick={() => handleSort("cpc")} className="p-3.5 cursor-pointer hover:text-[#172033] text-right">CPC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#64748B]">
                      No campaigns found matching your query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="p-3.5 font-semibold text-[#172033]">{c.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          {c.platform}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-medium">{formatCurrency(c.spend, currency)}</td>
                      <td className="p-3.5 text-right font-medium">{formatCurrency(c.revenue, currency)}</td>
                      <td className="p-3.5 text-right font-bold text-[#16A34A]">{c.roas.toFixed(2)}x</td>
                      <td className="p-3.5 text-right font-medium">{c.conversions}</td>
                      <td className="p-3.5 text-right font-medium">{formatCurrency(c.cpa, currency)}</td>
                      <td className="p-3.5 text-right font-medium">{formatPercent(c.ctr)}</td>
                      <td className="p-3.5 text-right font-medium">{formatCurrency(c.cpc, currency)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

