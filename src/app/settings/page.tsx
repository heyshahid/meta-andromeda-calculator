"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { UserSettings, CurrencyCode } from "@/lib/types";
import { Settings, Save, Trash2, Key, Database, RefreshCw, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setSettings(StorageService.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSavedSuccess(true);
    window.dispatchEvent(new Event("currency-change"));
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetWorkspace = () => {
    if (confirm("Are you sure you want to clear all data in this workspace? This cannot be undone.")) {
      StorageService.clearWorkspace();
      window.dispatchEvent(new Event("data-storage-update"));
      alert("Workspace data has been reset.");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-page-title text-[#172033] tracking-tight">Workspace Settings</h1>
          <p className="text-secondary text-[#64748B]">Configure reporting currencies, AI provider credentials, and data isolation.</p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-xs font-semibold text-[#14532D] flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>Settings successfully saved!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#172033] pb-2 border-b border-[#E2E8F0]">General Preferences</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Workspace Name</label>
                <input
                  type="text"
                  value={settings.workspaceName}
                  onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Primary Display Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value as CurrencyCode })}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                >
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="PKR">PKR (Rs - Pakistani Rupee)</option>
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="CAD">CAD ($ - Canadian Dollar)</option>
                  <option value="AUD">AUD ($ - Australian Dollar)</option>
                  <option value="AED">AED (د.إ - UAE Dirham)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#172033] pb-2 border-b border-[#E2E8F0] flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#2563EB]" />
              <span>AI Provider Configuration (Optional)</span>
            </h3>

            <p className="text-xs text-[#64748B]">
              Open MarketingOps remains fully operational without an external AI key. To enable custom LLM queries, provide your API key below (stored securely in local state only).
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">AI Provider</label>
                <select
                  value={settings.aiProvider}
                  onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value as any })}
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                >
                  <option value="gemini">Google Gemini API</option>
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="anthropic">Anthropic Claude</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">API Secret Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste AI Provider Key..."
                  className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2.5 bg-[#F8FAFC]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-[#FEE2E2] p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-[#DC2626]">
            <Trash2 className="w-4 h-4" />
            <h3 className="text-sm font-bold">Danger Zone: Reset Workspace</h3>
          </div>
          <p className="text-xs text-[#64748B]">
            Permanently clear all local campaign records, creatives, budget models, and imported CSV data from your browser storage.
          </p>
          <button
            type="button"
            onClick={handleResetWorkspace}
            className="px-4 py-2 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-xs font-bold hover:bg-[#FCA5A5] transition-colors"
          >
            Clear All Workspace Data
          </button>
        </div>
      </main>
    </>
  );
}

