"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { Campaign, CurrencyCode } from "@/lib/types";
import { StorageService } from "@/lib/storage";
import { Upload, FileText, CheckCircle2, AlertTriangle, Download, ArrowRight, X } from "lucide-react";

interface CSVImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export function CSVImportWizard({ isOpen, onClose, onImportComplete }: CSVImportWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<{
    name: string;
    spend: string;
    revenue: string;
    impressions: string;
    clicks: string;
    conversions: string;
    platform: string;
  }>({
    name: "",
    spend: "",
    revenue: "",
    impressions: "",
    clicks: "",
    conversions: "",
    platform: ""
  });
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [importSummary, setImportSummary] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  }>({ imported: 0, skipped: 0, errors: [] });

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setRawRows(results.data as any[]);
          const cols = Object.keys((results.data[0] as object) || {});
          setHeaders(cols);

          // Auto-detect common column names
          const findCol = (regex: RegExp) => cols.find(c => regex.test(c.toLowerCase())) || "";
          setColumnMapping({
            name: findCol(/campaign|name|title/i),
            spend: findCol(/spend|cost|amount/i),
            revenue: findCol(/revenue|conversion_value|purchase_value/i),
            impressions: findCol(/impressions|views/i),
            clicks: findCol(/clicks|link_clicks/i),
            conversions: findCol(/conversions|purchases|orders/i),
            platform: findCol(/platform|source|network/i),
          });

          setStep(2);
        }
      },
      error: (error) => {
        alert("Failed to parse CSV: " + error.message);
      }
    });
  };

  const handleExecuteImport = () => {
    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    const newCampaigns: Campaign[] = [];

    rawRows.forEach((row, index) => {
      const name = String(row[columnMapping.name] || `Imported Campaign #${index + 1}`).trim();
      const rawSpend = parseFloat(String(row[columnMapping.spend] || "0").replace(/[^0-9.-]+/g, ""));
      const rawRevenue = parseFloat(String(row[columnMapping.revenue] || "0").replace(/[^0-9.-]+/g, ""));
      const rawImp = parseInt(String(row[columnMapping.impressions] || "0").replace(/[^0-9]+/g, ""), 10);
      const rawClicks = parseInt(String(row[columnMapping.clicks] || "0").replace(/[^0-9]+/g, ""), 10);
      const rawConv = parseInt(String(row[columnMapping.conversions] || "0").replace(/[^0-9]+/g, ""), 10);
      const rawPlatform = String(row[columnMapping.platform] || "Meta Ads").trim();

      if (isNaN(rawSpend) || rawSpend < 0) {
        skippedCount++;
        errors.push(`Row ${index + 1}: Invalid spend value skipped.`);
        return;
      }

      const spend = isNaN(rawSpend) ? 0 : rawSpend;
      const revenue = isNaN(rawRevenue) ? 0 : rawRevenue;
      const impressions = isNaN(rawImp) ? 0 : rawImp;
      const clicks = isNaN(rawClicks) ? 0 : rawClicks;
      const conversions = isNaN(rawConv) ? 0 : rawConv;

      const roas = spend > 0 ? revenue / spend : 0;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

      newCampaigns.push({
        id: `csv-${Date.now()}-${index}`,
        workspaceId: "active-workspace",
        name,
        platform: (rawPlatform.includes("Google") ? "Google Ads" : rawPlatform.includes("TikTok") ? "TikTok Ads" : "Meta Ads"),
        accountName: "Imported CSV Source",
        objective: "OUTCOME_SALES",
        status: "ACTIVE",
        dailyBudget: Math.round(spend / 30) || 50,
        spend,
        revenue,
        impressions,
        clicks,
        conversions,
        roas,
        cpa,
        cpc,
        cpm,
        ctr,
        updatedAt: new Date().toISOString()
      });

      importedCount++;
    });

    const current = StorageService.getCampaigns();
    StorageService.saveCampaigns([...newCampaigns, ...current]);
    setImportSummary({ imported: importedCount, skipped: skippedCount, errors });
    setStep(4);
    onImportComplete(importedCount);
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Campaign Name,Platform,Spend,Revenue,Impressions,Clicks,Conversions\nQ4 Advantage+ Shopping,Meta Ads,1500.00,6200.00,62000,1850,75\nBrand Search Terms,Google Ads,800.00,4500.00,12000,980,60\nUGC TikTok Blitz,TikTok Ads,600.00,1400.00,55000,1200,22";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "open_marketingops_sample_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <h3 className="text-base font-bold text-[#172033]">CSV Campaign Import Wizard</h3>
            <p className="text-xs text-[#64748B]">Step {step} of 4: {step === 1 ? 'Select File' : step === 2 ? 'Column Mapping' : step === 3 ? 'Review & Validate' : 'Import Complete'}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer bg-[#F8FAFC]">
                <Upload className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#172033] mb-1">Click to browse or drag and drop CSV file</p>
                <p className="text-xs text-[#64748B] mb-4">Supports exports from Meta Ads Manager, Google Ads, TikTok Ads, Shopify</p>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-file-input" />
                <label htmlFor="csv-file-input" className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle">
                  <span>Choose CSV File</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs">
                <span className="text-[#1E40AF]">Need a standard CSV format? Download our pre-built template.</span>
                <button type="button" onClick={downloadSampleTemplate} className="flex items-center space-x-1 font-semibold text-[#2563EB] hover:underline">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample CSV</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[#64748B]">Match your CSV columns with Open MarketingOps data schema:</p>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {Object.entries({
                  name: "Campaign Name *",
                  spend: "Ad Spend *",
                  revenue: "Revenue *",
                  impressions: "Impressions",
                  clicks: "Clicks",
                  conversions: "Conversions",
                  platform: "Platform"
                }).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#475569]">{label}</label>
                    <select
                      value={(columnMapping as any)[key]}
                      onChange={(e) => setColumnMapping({ ...columnMapping, [key]: e.target.value })}
                      className="w-full text-xs border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="">-- Select Column --</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033]">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]">
                  <span>Review Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#172033]">Data Preview ({rawRows.length} rows found)</span>
                <span className="text-xs text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded font-medium">Validated</span>
              </div>
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden max-h-48 overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Spend</th>
                      <th className="p-2">Revenue</th>
                      <th className="p-2">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawRows.slice(0, 3).map((r, i) => (
                      <tr key={i} className="border-b border-[#F1F5F9]">
                        <td className="p-2 font-medium">{r[columnMapping.name]}</td>
                        <td className="p-2">${r[columnMapping.spend]}</td>
                        <td className="p-2">${r[columnMapping.revenue]}</td>
                        <td className="p-2">{r[columnMapping.clicks]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033]">Back</button>
                <button type="button" onClick={handleExecuteImport} className="px-5 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] shadow-subtle">
                  Confirm & Import Data
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#172033]">Import Successfully Completed!</h4>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Imported <strong className="text-[#172033]">{importSummary.imported}</strong> campaigns into your active workspace.
                {importSummary.skipped > 0 && ` (${importSummary.skipped} rows skipped due to invalid formats).`}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

