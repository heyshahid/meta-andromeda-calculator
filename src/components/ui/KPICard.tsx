import React from "react";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  tooltip?: string;
  icon?: React.ElementType;
}

export function KPICard({ label, value, subValue, trend, tooltip, icon: Icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-center justify-between text-[#64748B] mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="text-[13px] font-medium text-[#64748B]">{label}</span>
          {tooltip && (
            <span title={tooltip} className="cursor-help text-[#94A3B8] hover:text-[#64748B]">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl font-bold text-[#172033] tracking-tight">{value}</div>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {subValue && (
        <div className="text-xs text-[#64748B] mt-1 font-normal">
          {subValue}
        </div>
      )}
    </div>
  );
}

