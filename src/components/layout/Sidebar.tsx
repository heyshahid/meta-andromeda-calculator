"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Calculator,
  CalendarDays,
  TrendingUp,
  Image,
  Layers,
  Sparkles,
  Newspaper,
  FileText,
  Boxes,
  Settings,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Calculators", href: "/calculators", icon: Calculator },
  { label: "Budget Planner", href: "/budget-planner", icon: CalendarDays },
  { label: "Scaling Intelligence", href: "/scaling", icon: TrendingUp },
  { label: "Creative Intelligence", href: "/creatives", icon: Image },
  { label: "Campaign Manager", href: "/campaigns", icon: Layers },
  { label: "AI Insights", href: "/ai-insights", icon: Sparkles, badge: "Beta" },
  { label: "Andromeda Updates", href: "/andromeda-updates", icon: Newspaper },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Integrations", href: "/integrations", icon: Boxes },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen select-none z-30">
      <div className="flex flex-col h-full overflow-hidden">
        {/* App Branding */}
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] shrink-0 bg-white">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#14213D] flex items-center justify-center text-white font-bold text-sm shadow-subtle group-hover:bg-[#2563EB] transition-colors">
              OM
            </div>
            <div>
              <span className="block font-bold text-sm text-[#172033] tracking-tight leading-tight">
                Open MarketingOps
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                Scale Smarter
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-secondary transition-all ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                    : "text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2563EB]" : "text-[#64748B]"}`} />
                  <span className="text-[13px]">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Open-Source Badge */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="font-medium text-[11px]">MIT Open-Source</span>
            </div>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 border border-[#E2E8F0] rounded">v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

