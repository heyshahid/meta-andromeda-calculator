"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StorageService } from "@/lib/storage";
import { AndromedaUpdateArticle } from "@/lib/types";
import { Newspaper, ShieldCheck, ExternalLink, Calendar, Tag, CheckCircle2 } from "lucide-react";

export default function AndromedaUpdatesPage() {
  const [articles, setArticles] = useState<AndromedaUpdateArticle[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    setArticles(StorageService.getArticles());
  }, []);

  const filtered = categoryFilter === "ALL"
    ? articles
    : articles.filter(a => a.category === categoryFilter);

  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title text-[#172033] tracking-tight">Meta Andromeda & Algorithmic Updates</h1>
            <p className="text-secondary text-[#64748B]">Curated repository of official Meta announcements, Advantage+ AI shifts, and attribution research.</p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-[#E2E8F0] rounded-lg p-2 bg-white font-medium text-[#172033]"
            >
              <option value="ALL">All Categories</option>
              <option value="Advantage+ AI">Advantage+ AI</option>
              <option value="Creative Scaling">Creative Scaling</option>
              <option value="Measurement & Attribution">Measurement & Attribution</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((art) => (
            <div key={art.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {art.isOfficialMeta ? (
                      <span className="flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Official Meta Announcement</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        Independent Research
                      </span>
                    )}
                    <span className="text-xs text-[#64748B] flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{art.publishedDate}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#172033]">{art.title}</h3>
                </div>

                <a
                  href={art.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs font-semibold text-[#2563EB] hover:underline shrink-0"
                >
                  <span>{art.sourceName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                {art.content}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

