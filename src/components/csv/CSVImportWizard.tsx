"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { Campaign, CurrencyCode, PlatformType } from "@/lib/types";
import { StorageService } from "@/lib/storage";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle,
  Copy,
  Table,
  Check
} from "lucide-react";

interface CSVImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

interface ValidationRowResult {
  rowIndex: number;
  data: any;
  isValid: boolean;
  isDuplicate: boolean;
  errors: string[];
  sanitizedCampaign?: Campaign;
}

export function CSVImportWizard({ isOpen, onClose, onImportComplete }: CSVImportWizardProps) {
  // Wizard steps: 1: Upload -> 2: Preview & Map Columns -> 3: Validation & Duplicates Preview -> 4: Summary
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile] = useState<File | null>(null);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  
  // Column Mappings
  const [columnMapping, setColumnMapping] = useState<{
    name: string;
    spend: string;
    revenue: string;
    impressions: string;
    clicks: string;
    conversions: string;
    platform: string;
    startDate: string;
    endDate: string;
  }>({
    name: "",
    spend: "",
    revenue: "",
    impressions: "",
    clicks: "",
    conversions: "",
    platform: "",
    startDate: "",
    endDate: ""
  });

  // Validation results
  const [validationResults, setValidationResults] = useState<ValidationRowResult[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [importSummary, setImportSummary] = useState<{
    imported: number;
    skippedDuplicates: number;
    rejected: number;
    errors: { row: number; reason: string }[];
  }>({ imported: 0, skippedDuplicates: 0, rejected: 0, errors: [] });

  if (!isOpen) return null;

  // Step 1: Handle File Upload & Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith(".csv")) {
      alert("Invalid file format. Please upload a standard comma-separated .csv file.");
      return;
    }

    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          alert("The uploaded CSV file is empty. Please select a valid CSV with rows.");
          return;
        }

        setRawRows(results.data as any[]);
        const cols = Object.keys((results.data[0] as object) || {});
        setHeaders(cols);

        // Smart column auto-detection
        const findCol = (regex: RegExp) => cols.find(c => regex.test(c.toLowerCase())) || "";
        setColumnMapping({
          name: findCol(/campaign|name|title/i),
          spend: findCol(/spend|cost|amount/i),
          revenue: findCol(/revenue|conversion_value|purchase_value/i),
          impressions: findCol(/impressions|views/i),
          clicks: findCol(/clicks|link_clicks/i),
          conversions: findCol(/conversions|purchases|orders/i),
          platform: findCol(/platform|source|network/i),
          startDate: findCol(/start|date_start|created/i),
          endDate: findCol(/end|date_stop|finished/i),
        });

        setStep(2);
      },
      error: (error) => {
        alert("Failed to parse CSV file: " + error.message);
      }
    });
  };

  // Step 4: Run Validation & Duplicate Detection
  const handleRunValidation = () => {
    if (!columnMapping.name || !columnMapping.spend) {
      alert("Please map at least 'Campaign Name' and 'Ad Spend' columns to continue.");
      return;
    }

    const existingCampaigns = StorageService.getCampaigns();
    const existingNames = new Set(existingCampaigns.map(c => `${c.name.toLowerCase()}_${c.platform.toLowerCase()}`));
    const seenInFile = new Set<string>();

    const results: ValidationRowResult[] = [];
    const accounts = StorageService.getAccounts();
    const defaultAccountId = accounts[0]?.id || "act-001";

    rawRows.forEach((row, idx) => {
      const rowIndex = idx + 1;
      const errors: string[] = [];

      // 1. Validate Campaign Name
      const rawName = row[columnMapping.name];
      if (!rawName || String(rawName).trim() === "") {
        errors.push("Missing required campaign name.");
      }
      const name = String(rawName || "").trim();

      // 2. Validate Platform
      const rawPlatform = String(row[columnMapping.platform] || "Meta Ads").trim();
      const platform: PlatformType = rawPlatform.toLowerCase().includes("google")
        ? "Google Ads"
        : rawPlatform.toLowerCase().includes("tiktok")
        ? "TikTok Ads"
        : "Meta Ads";

      // 3. Clean & Validate Currency & Numbers
      const cleanNumber = (val: any) => {
        if (val === undefined || val === null || val === "") return 0;
        const cleaned = String(val).replace(/[^0-9.-]+/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      };

      const rawSpend = cleanNumber(row[columnMapping.spend]);
      if (rawSpend === null) {
        errors.push("Invalid numeric format for Ad Spend.");
      } else if (rawSpend < 0) {
        errors.push("Negative Ad Spend is not allowed.");
      }
      const spend = rawSpend !== null && rawSpend >= 0 ? rawSpend : 0;

      const rawRev = cleanNumber(row[columnMapping.revenue]);
      if (rawRev !== null && rawRev < 0) {
        errors.push("Negative Revenue is not allowed.");
      }
      const revenue = rawRev !== null && rawRev >= 0 ? rawRev : 0;

      const rawImp = cleanNumber(row[columnMapping.impressions]);
      const impressions = rawImp !== null && rawImp >= 0 ? Math.round(rawImp) : 0;

      const rawClicks = cleanNumber(row[columnMapping.clicks]);
      const clicks = rawClicks !== null && rawClicks >= 0 ? Math.round(rawClicks) : 0;

      const rawConv = cleanNumber(row[columnMapping.conversions]);
      const conversions = rawConv !== null && rawConv >= 0 ? Math.round(rawConv) : 0;

      // 4. Validate Dates
      const startDate = row[columnMapping.startDate] ? String(row[columnMapping.startDate]).trim() : undefined;
      const endDate = row[columnMapping.endDate] ? String(row[columnMapping.endDate]).trim() : undefined;

      // 5. Detect Duplicates
      const key = `${name.toLowerCase()}_${platform.toLowerCase()}`;
      const isDuplicate = existingNames.has(key) || seenInFile.has(key);
      seenInFile.add(key);

      const isValid = errors.length === 0;

      let sanitizedCampaign: Campaign | undefined;
      if (isValid) {
        const roas = spend > 0 ? revenue / spend : 0;
        const cpa = conversions > 0 ? spend / conversions : 0;
        const cpc = clicks > 0 ? spend / clicks : 0;
        const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        sanitizedCampaign = {
          id: `csv-${Date.now()}-${idx}`,
          workspaceId: "active-workspace",
          accountId: defaultAccountId,
          name,
          platform,
          accountName: "Imported CSV Source",
          objective: "OUTCOME_SALES",
          status: "ACTIVE",
          dailyBudget: Math.round(spend / 30) || 50,
          startDate,
          endDate,
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
          notes: `Imported from CSV file "${file?.name || 'upload.csv'}" on ${new Date().toLocaleDateString()}`,
          updatedAt: new Date().toISOString()
        };
      }

      results.push({
        rowIndex,
        data: row,
        isValid,
        isDuplicate,
        errors,
        sanitizedCampaign
      });
    });

    setValidationResults(results);
    setStep(3);
  };

  // Step 8: Confirm and Execute Ingestion
  const handleExecuteImport = () => {
    let imported = 0;
    let skippedDuplicates = 0;
    let rejected = 0;
    const errorsList: { row: number; reason: string }[] = [];
    const validCampaignsToSave: Campaign[] = [];

    validationResults.forEach((res) => {
      if (!res.isValid) {
        rejected++;
        errorsList.push({ row: res.rowIndex, reason: res.errors.join("; ") });
        return;
      }

      if (res.isDuplicate && skipDuplicates) {
        skippedDuplicates++;
        errorsList.push({ row: res.rowIndex, reason: `Duplicate skipped: Campaign already exists in workspace.` });
        return;
      }

      if (res.sanitizedCampaign) {
        validCampaignsToSave.push(res.sanitizedCampaign);
        imported++;
      }
    });

    if (validCampaignsToSave.length > 0) {
      const existing = StorageService.getCampaigns();
      StorageService.saveCampaigns([...validCampaignsToSave, ...existing]);
      StorageService.logActivity("CSV_IMPORTED", `Successfully ingested ${imported} campaigns via CSV wizard`);
    }

    setImportSummary({
      imported,
      skippedDuplicates,
      rejected,
      errors: errorsList
    });

    setStep(4);
  };

  // Download Example CSV Template
  const handleDownloadSample = () => {
    const csvContent =
      "Campaign Name,Platform,Ad Spend,Revenue,Impressions,Clicks,Conversions,Start Date,End Date\n" +
      '"Advantage+ Shopping - Q4 Catalog","Meta Ads",3450.00,14145.00,142000,3420,165,2026-10-15,2026-11-30\n' +
      '"Dynamic Creative Testing - Angles","Meta Ads",1200.00,3360.00,68000,1490,48,2026-10-20,2026-11-25\n' +
      '"Google Search - High Intent Brand","Google Ads",2100.00,11550.00,28400,2150,142,2026-10-01,2026-12-31\n' +
      '"TikTok Spark Ads - Creator UGC","TikTok Ads",850.00,1870.00,92000,1840,31,2026-11-01,2026-11-20\n';

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "open_marketingops_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validCount = validationResults.filter(r => r.isValid && (!r.isDuplicate || !skipDuplicates)).length;
  const duplicateCount = validationResults.filter(r => r.isValid && r.isDuplicate).length;
  const errorCount = validationResults.filter(r => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Wizard Header & Progress */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-[#172033]">CSV Ingestion Wizard</h3>
            <p className="text-xs text-[#64748B]">Step {step} of 4: {
              step === 1 ? "Upload CSV & Sample" :
              step === 2 ? "Preview & Map Columns" :
              step === 3 ? "Validation & Duplicate Check" : "Import Summary"
            }</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#64748B] hover:text-[#172033]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Upload CSV */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 text-center hover:border-[#2563EB] transition-colors bg-[#F8FAFC]">
                <Upload className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[#172033]">Choose or drag a CSV campaign export file</h4>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  Supports Meta Ads Manager, Google Ads, TikTok Ads, and Shopify CSV exports.
                </p>
                <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] cursor-pointer shadow-subtle">
                  <span>Browse Local File</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
                <div className="flex items-center space-x-2 text-xs text-[#1E3A8A]">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>Need an exact CSV formatting reference?</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#2563EB] text-[#2563EB] text-xs font-semibold hover:bg-[#F8FAFC]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Template</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Preview & Column Mapping */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">File: <strong>{file?.name}</strong></span>
                <span className="text-[#16A34A] font-semibold">{rawRows.length} total rows detected</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Column Mapping Specification</h4>
                <p className="text-xs text-[#64748B] mb-3">Map columns from your CSV to standard Open MarketingOps analytics fields:</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Campaign Name *</label>
                    <select
                      value={columnMapping.name}
                      onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Ad Spend ($) *</label>
                    <select
                      value={columnMapping.spend}
                      onChange={(e) => setColumnMapping({ ...columnMapping, spend: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Revenue ($)</label>
                    <select
                      value={columnMapping.revenue}
                      onChange={(e) => setColumnMapping({ ...columnMapping, revenue: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Platform</label>
                    <select
                      value={columnMapping.platform}
                      onChange={(e) => setColumnMapping({ ...columnMapping, platform: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Impressions</label>
                    <select
                      value={columnMapping.impressions}
                      onChange={(e) => setColumnMapping({ ...columnMapping, impressions: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Clicks</label>
                    <select
                      value={columnMapping.clicks}
                      onChange={(e) => setColumnMapping({ ...columnMapping, clicks: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Conversions</label>
                    <select
                      value={columnMapping.conversions}
                      onChange={(e) => setColumnMapping({ ...columnMapping, conversions: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#475569] mb-1">Start Date</label>
                    <select
                      value={columnMapping.startDate}
                      onChange={(e) => setColumnMapping({ ...columnMapping, startDate: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-[#F8FAFC]"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sample 2 Rows Preview */}
              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block mb-1">Raw CSV Preview (First 2 rows):</span>
                <div className="p-3 bg-[#F1F5F9] rounded-lg text-[11px] font-mono text-[#334155] overflow-x-auto max-h-24">
                  {rawRows.slice(0, 2).map((r, i) => (
                    <div key={i} className="truncate">{JSON.stringify(r)}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Validation & Duplicates Preview */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-[#DCFCE7] rounded-xl border border-[#BBF7D0]">
                  <span className="text-[11px] text-[#166534] block">Valid Ready to Import</span>
                  <strong className="text-base text-[#16A34A]">{validCount}</strong>
                </div>
                <div className="p-3 bg-[#FEF3C7] rounded-xl border border-[#FDE68A]">
                  <span className="text-[11px] text-[#92400E] block">Duplicate Campaigns</span>
                  <strong className="text-base text-[#D97706]">{duplicateCount}</strong>
                </div>
                <div className="p-3 bg-[#FEE2E2] rounded-xl border border-[#FECACA]">
                  <span className="text-[11px] text-[#991B1B] block">Rejected (Invalid Rows)</span>
                  <strong className="text-base text-[#DC2626]">{errorCount}</strong>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <input
                  type="checkbox"
                  id="skipDupCheck"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded text-[#2563EB]"
                />
                <label htmlFor="skipDupCheck" className="text-xs text-[#172033] font-medium cursor-pointer">
                  Skip duplicate campaigns (protects existing campaigns with the same name and platform)
                </label>
              </div>

              {/* Row validation list preview */}
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">Rows Audit Preview:</span>
                <div className="border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0] max-h-48 overflow-y-auto text-xs">
                  {validationResults.slice(0, 10).map((r) => (
                    <div key={r.rowIndex} className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 pr-2">
                        {r.isValid ? (
                          r.isDuplicate ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#FEF3C7] text-[#92400E] font-bold">DUP</span>
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          )
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        )}
                        <span className="font-semibold text-[#172033] truncate">
                          Row {r.rowIndex}: {r.sanitizedCampaign?.name || r.data[columnMapping.name] || 'Empty Name'}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        {r.isValid ? (
                          <span className="text-[#16A34A] font-medium">Valid (${r.sanitizedCampaign?.spend.toLocaleString()} spend)</span>
                        ) : (
                          <span className="text-[#DC2626] text-[11px]">{r.errors[0]}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Import Summary */}
          {step === 4 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#172033]">Import Process Completed</h4>
                <p className="text-xs text-[#64748B]">All valid records have been deterministically synced to your workspace database.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-left max-w-md mx-auto">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Imported</span>
                  <strong className="text-sm font-bold text-[#16A34A]">{importSummary.imported}</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Duplicates Skipped</span>
                  <strong className="text-sm font-bold text-[#D97706]">{importSummary.skippedDuplicates}</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Rejected</span>
                  <strong className="text-sm font-bold text-[#DC2626]">{importSummary.rejected}</strong>
                </div>
              </div>

              {importSummary.errors.length > 0 && (
                <div className="text-left bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl max-h-32 overflow-y-auto text-[11px]">
                  <strong className="text-[#92400E] block mb-1">Skipped / Rejected Records Log:</strong>
                  {importSummary.errors.map((err, i) => (
                    <div key={i} className="text-[#B45309]">Row {err.row}: {err.reason}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#172033]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleRunValidation}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              <span>Validate & Check Duplicates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleExecuteImport}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] shadow-subtle"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Ingest {validCount} Campaigns</span>
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={() => {
                onImportComplete(importSummary.imported);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              Close & View Ingested Campaigns
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
