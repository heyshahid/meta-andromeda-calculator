"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Boxes, CheckCircle2, Shield, Lock, ExternalLink, RefreshCw, AlertCircle, FileSpreadsheet } from "lucide-react";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const INTEGRATIONS = [
    {
      id: "csv",
      name: "CSV & Excel Spreadsheet Importer",
      category: "Data Import",
      status: "ACTIVE",
      description: "Direct offline file parser for Meta Ads Manager, Google Ads, TikTok, and custom spreadsheets with auto-mapping.",
      isCore: true
    },
    {
      id: "meta",
      name: "Meta Marketing API (Ads Insights)",
      category: "Ad Network",
      status: "CONFIG_READY",
      description: "Official Graph API connector requesting read-only ads_read scope for campaigns, ad sets, and video retention metrics.",
      isCore: false
    },
    {
      id: "google",
      name: "Google Ads API",
      category: "Ad Network",
      status: "PLANNED",
      description: "OAuth 2.0 sync for Google Search, Shopping, and YouTube Performance Max campaign spend and conversion metrics.",
      isCore: false
    },
    {
      id: "tiktok",
      name: "TikTok Marketing API",
      category: "Ad Network",
      status: "PLANNED",
      description: "Sync Spark Ads, UGC campaign spend, and video completion rate metrics directly into Creative Intelligence.",
      isCore: false
    },
    {
      id: "shopify",
      name: "Shopify Store Connector",
      category: "E-Commerce",
      status: "PLANNED",
      description: "First-party unit economics reconciliation for true Net Margin, COGS, shipping deductions, and merchant gateway fees.",
      isCore: false
    },
    {
      id: "ga4",
      name: "Google Analytics 4 (GA4)",
      category: "Analytics",
      status: "PLANNED",
      description: "Multi-touch attribution and event measurement cross-referencing landing page sessions with ad spend.",
      isCore: false
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-page-title text-[#172033] tracking-tight">Platform Integrations</h1>
          <p className="text-secondary text-[#64748B]">Connect advertising networks, e-commerce storefronts, and analytics data streams.</p>
        </div>

        {/* Integration Status Notice */}
        <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start space-x-3 text-xs text-[#1E40AF]">
          <Shield className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Open-Source First Architecture:</strong>
            <p>
              Open MarketingOps core analytics operates 100% offline via manual campaign logging and CSV imports without requiring external API approvals or third-party tokens. Official Graph API connectors are structured with isolated adapters for zero data leakage.
            </p>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTEGRATIONS.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{item.category}</span>
                  {item.status === "ACTIVE" ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Operational</span>
                    </span>
                  ) : item.status === "CONFIG_READY" ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#D97706]">
                      Ready for API Key
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                      Roadmap Adapter
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#172033]">{item.name}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                {item.id === "csv" ? (
                  <span className="text-[#16A34A] font-semibold flex items-center space-x-1">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Built-in Wizard</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => alert(`To configure ${item.name}, provide your official developer app credentials in the .env or Settings file.`)}
                    className="text-xs font-semibold text-[#2563EB] hover:underline"
                  >
                    View Setup Guide →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

