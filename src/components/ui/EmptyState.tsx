import React from "react";
import { Plus, Upload, Database, Layers } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddCampaign?: () => void;
  onUploadCSV?: () => void;
  onLoadDemo?: () => void;
}

export function EmptyState({
  title = "No campaigns recorded yet",
  description = "Get started by adding your first campaign manually, importing performance CSV data from Meta or Google Ads, or explore with a sample demo dataset.",
  onAddCampaign,
  onUploadCSV,
  onLoadDemo,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-10 text-center max-w-2xl mx-auto my-8">
      <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center mx-auto text-[#2563EB] mb-4">
        <Layers className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-[#172033] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAddCampaign && (
          <button
            type="button"
            onClick={onAddCampaign}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        )}

        {onUploadCSV && (
          <button
            type="button"
            onClick={onUploadCSV}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#172033] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
        )}

        {onLoadDemo && (
          <button
            type="button"
            onClick={onLoadDemo}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#F1F5F9] text-[#475569] text-xs font-semibold hover:bg-[#E2E8F0] transition-colors"
          >
            <Database className="w-4 h-4 text-[#2563EB]" />
            <span>Load Demo Dataset</span>
          </button>
        )}
      </div>
    </div>
  );
}

