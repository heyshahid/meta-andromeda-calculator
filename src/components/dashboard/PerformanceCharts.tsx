"use client";

import React from "react";
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
  Cell
} from "recharts";
import { DailyInsight } from "@/lib/types";

interface PerformanceChartsProps {
  insights: DailyInsight[];
  currencySymbol?: string;
}

const COLORS = ["#2563EB", "#10B981", "#A855F7", "#F59E0B"];

export function PerformanceCharts({ insights, currencySymbol = "$" }: PerformanceChartsProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-xs text-[#64748B]">
        No trend data available for the selected period.
      </div>
    );
  }

  // Aggregate Platform Share
  const platformSpendMap: Record<string, number> = {};
  insights.forEach((item) => {
    platformSpendMap[item.platform] = (platformSpendMap[item.platform] || 0) + item.spend;
  });

  const pieData = Object.entries(platformSpendMap).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Spend vs Revenue Area Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-[#172033]">Spend vs. Revenue Velocity</h4>
            <p className="text-xs text-[#64748B]">Daily performance trend across active channels</p>
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
            <AreaChart data={insights} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
      </div>

      {/* Platform Allocation Share */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card">
        <h4 className="text-sm font-bold text-[#172033] mb-1">Platform Share</h4>
        <p className="text-xs text-[#64748B] mb-4">Budget distribution across networks</p>

        <div className="h-44 w-full">
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
        </div>

        <div className="space-y-2 mt-2">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-[#475569] font-medium">{item.name}</span>
              </div>
              <span className="font-semibold text-[#172033]">{currencySymbol}{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

