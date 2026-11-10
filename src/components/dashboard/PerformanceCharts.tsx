"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine
} from "recharts";
import { DailyInsight, Campaign } from "@/lib/types";
import { TrendingUp, BarChart3, PieChart as PieIcon, LineChart as LineIcon } from "lucide-react";

interface PerformanceChartsProps {
  insights: DailyInsight[];
  campaigns?: Campaign[];
  currencySymbol?: string;
}

const COLORS = ["#2563EB", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];

export function PerformanceCharts({
  insights,
  campaigns = [],
  currencySymbol = "$"
}: PerformanceChartsProps) {
  const [activeChartTab, setActiveChartTab] = useState<"spend-revenue" | "roas-trend" | "conversions" | "campaign-compare">("spend-revenue");

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-xs text-[#64748B]">
        No trend data available for the selected filters. Try broadening your filter parameters.
      </div>
    );
  }

  // 1. Platform Share Calculation
  const platformSpendMap: Record<string, number> = {};
  insights.forEach((item) => {
    platformSpendMap[item.platform] = (platformSpendMap[item.platform] || 0) + item.spend;
  });

  const pieData = Object.entries(platformSpendMap).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  // 2. Daily ROAS & CPA Calculation for Trend Line
  const dailyMetrics = insights.map((item) => {
    const roas = item.spend > 0 ? parseFloat((item.revenue / item.spend).toFixed(2)) : 0;
    const cpa = item.conversions > 0 ? parseFloat((item.spend / item.conversions).toFixed(2)) : 0;
    return {
      ...item,
      roas,
      cpa
    };
  });

  // 3. Campaign Comparison Data
  const campaignCompareData = campaigns.slice(0, 8).map((c) => ({
    name: c.name.length > 20 ? c.name.substring(0, 18) + "..." : c.name,
    spend: Math.round(c.spend),
    revenue: Math.round(c.revenue),
    roas: parseFloat(c.roas.toFixed(2)),
    conversions: c.conversions
  }));

  return (
    <div className="space-y-4">
      {/* Chart Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setActiveChartTab("spend-revenue")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeChartTab === "spend-revenue"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Spend vs. Revenue</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveChartTab("roas-trend")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeChartTab === "roas-trend"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9]"
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>ROAS Velocity</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveChartTab("conversions")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeChartTab === "conversions"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Daily Conversions & CPA</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveChartTab("campaign-compare")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeChartTab === "campaign-compare"
                ? "bg-[#2563EB] text-white shadow-subtle"
                : "text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9]"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Campaign Comparison</span>
          </button>
        </div>

        <span className="text-[11px] text-[#64748B] font-medium hidden sm:inline">
          Interactive Recharts Engine • {insights.length} Days Sampled
        </span>
      </div>

      {/* Main Chart Views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dynamic Primary Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card">
          {/* TAB 1: Spend vs Revenue Area Chart */}
          {activeChartTab === "spend-revenue" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">Spend vs. Revenue Velocity</h4>
                  <p className="text-xs text-[#64748B]">Blended daily advertising performance and top-line return</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                    <span className="text-[#64748B]">Revenue</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
                    <span className="text-[#64748B]">Ad Spend</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={insights} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748B" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `${currencySymbol}${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                      formatter={(val: any) => [`${currencySymbol}${Number(val).toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                    <Area type="monotone" dataKey="spend" stroke="#64748B" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" name="Ad Spend" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* TAB 2: ROAS Trend Line Chart */}
          {activeChartTab === "roas-trend" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">ROAS Trend & Benchmark</h4>
                  <p className="text-xs text-[#64748B]">Daily Return on Ad Spend against a 2.50x target benchmark</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                    <span className="text-[#64748B]">Actual ROAS</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-0.5 bg-[#EF4444]"></span>
                    <span className="text-[#64748B]">Target 2.50x</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}x`} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                      formatter={(val: any) => [`${Number(val).toFixed(2)}x ROAS`, ""]}
                    />
                    <ReferenceLine y={2.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Target 2.5x", fill: "#EF4444", fontSize: 10, position: "insideTopLeft" }} />
                    <Line type="monotone" dataKey="roas" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: "#10B981" }} activeDot={{ r: 5 }} name="Daily ROAS" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* TAB 3: Daily Conversions & CPA Bar Chart */}
          {activeChartTab === "conversions" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">Daily Conversion Volume</h4>
                  <p className="text-xs text-[#64748B]">Units sold / goal events achieved by date</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                    <span className="text-[#64748B]">Conversions</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                      formatter={(val: any, name: string) => [val, name === "conversions" ? "Conversions" : "CPA"]}
                    />
                    <Bar dataKey="conversions" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* TAB 4: Campaign Head-to-Head Comparison */}
          {activeChartTab === "campaign-compare" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">Campaign Comparison (Spend vs. Revenue)</h4>
                  <p className="text-xs text-[#64748B]">Side-by-side volume across active campaigns</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
                    <span className="text-[#64748B]">Spend</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                    <span className="text-[#64748B]">Revenue</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignCompareData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `${currencySymbol}${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                      formatter={(val: any) => [`${currencySymbol}${Number(val).toLocaleString()}`, ""]}
                    />
                    <Bar dataKey="spend" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Ad Spend" />
                    <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Right: Budget & Platform Distribution */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#172033] mb-1">Budget Distribution</h4>
            <p className="text-xs text-[#64748B] mb-4">Channel capital allocation share</p>

            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                    formatter={(val: any) => [`${currencySymbol}${Number(val).toLocaleString()}`, "Spend"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-[#64748B] font-medium">Total Spend</span>
                <span className="text-xs font-bold text-[#172033]">
                  {currencySymbol}{pieData.reduce((acc, p) => acc + p.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-[#F1F5F9]">
            {pieData.map((item, index) => {
              const total = pieData.reduce((acc, p) => acc + p.value, 0);
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-[#475569] font-medium">{item.name}</span>
                  </div>
                  <span className="text-[#172033] font-semibold">{pct}% ({currencySymbol}{item.value.toLocaleString()})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
