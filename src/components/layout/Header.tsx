"use client";

import React, { useState, useEffect } from "react";
import { CurrencyCode } from "@/lib/types";
import { StorageService } from "@/lib/storage";
import {
  DollarSign,
  Database,
  RefreshCw,
  Bell,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Github,
  Star
} from "lucide-react";

interface HeaderProps {
  onDataRefresh?: () => void;
  onOpenAddModal?: () => void;
}

export function Header({ onDataRefresh, onOpenAddModal }: HeaderProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [workspaceName, setWorkspaceName] = useState("Shahid Growth Lab");
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);

  useEffect(() => {
    const settings = StorageService.getSettings();
    setCurrency(settings.currency);
    setWorkspaceName(settings.workspaceName || "Shahid Growth Lab");
    const campaigns = StorageService.getCampaigns();
    setIsDemoLoaded(campaigns.length > 0 && campaigns[0].id.startsWith("demo"));
  }, []);

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    setCurrency(newCurr);
    const settings = StorageService.getSettings();
    settings.currency = newCurr;
    StorageService.saveSettings(settings);
    if (onDataRefresh) onDataRefresh();
    window.dispatchEvent(new Event("currency-change"));
  };

  const handleToggleDemoData = () => {
    if (isDemoLoaded) {
      StorageService.clearWorkspace();
      setIsDemoLoaded(false);
    } else {
      StorageService.loadDemoDataset();
      setIsDemoLoaded(true);
    }
    if (onDataRefresh) onDataRefresh();
    window.dispatchEvent(new Event("data-storage-update"));
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Workspace Indicator & GitHub Follow/Star */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-[#172033]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>{workspaceName}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] font-normal border border-[#E2E8F0]">
            Workspace
          </span>
        </div>

        {/* GitHub Star & Follow Buttons */}
        <div className="hidden sm:flex items-center space-x-2 border-l border-[#E2E8F0] pl-3">
          <a
            href="https://github.com/heyshahid/open-marketingops"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B] transition-all shadow-xs group"
            title="Star Open MarketingOps on GitHub"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>Star</span>
            <Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24] group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="https://github.com/heyshahid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#334155] text-xs font-medium hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
            title="Follow Shahid Akram on GitHub"
          >
            <span>Follow</span>
            <span className="font-semibold text-[#0F172A]">@heyshahid</span>
          </a>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-3">
        {/* Currency Switcher */}
        <div className="flex items-center border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] p-1 text-xs">
          <label htmlFor="currency-select" className="text-[#64748B] px-1 font-medium flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-0.5" />
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            className="bg-transparent font-medium text-[#172033] focus:outline-none cursor-pointer pr-1"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="PKR">PKR (₨)</option>
            <option value="INR">INR (₹)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
            <option value="AED">AED (د.إ)</option>
          </select>
        </div>

        {/* Demo Data Quick Switcher */}
        <button
          type="button"
          onClick={handleToggleDemoData}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDemoLoaded
              ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"
              : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
          }`}
          title={isDemoLoaded ? "Click to clear demo dataset" : "Load sample dataset for exploration"}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isDemoLoaded ? "Demo Dataset (Active)" : "Load Demo Data"}</span>
        </button>

        {/* Add Campaign Button */}
        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        )}
      </div>
    </header>
  );
}

