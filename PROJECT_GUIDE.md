# Open MarketingOps — Project Architecture & Deployment Guide

> **Tagline**: *Understand Performance. Make Better Decisions. Scale Smarter.*  
> **Author**: Shahid Akram ([@heyshahid](https://github.com/heyshahid))  
> **Live Web App**: [https://heyshahid.github.io/open-marketingops/](https://heyshahid.github.io/open-marketingops/)  
> **GitHub Repository**: [https://github.com/heyshahid/open-marketingops](https://github.com/heyshahid/open-marketingops)

---

## 1. Project Overview

**Open MarketingOps** is a production-grade open-source marketing analytics, campaign optimization, budget planning, and deterministic financial calculation suite.

Built with:
- **Next.js 14 (App Router)** & TypeScript
- **Tailwind CSS** with Enterprise SaaS Design System (`#F7F9FC` background, `#FFFFFF` cards, `#14213D` navy, `#2563EB` blue)
- **Recharts** dual-axis velocity charts and budget allocation donuts
- **Vitest** automated unit and integration test suite (100% passing tests)
- **Supabase** multi-tenant PostgreSQL schema with Row Level Security (RLS)

---

## 2. Core Modules

1. **Executive Dashboard (`/`)**: 10 financial KPIs, 5 dynamic charts, 5 real-time filters (Date, Platform, Account, Campaign, Currency).
2. **Campaign Analytics (`/analytics`)**: Granular multi-tier table (Campaigns, Ad Sets, Individual Ads), 17 metrics, objective filters, column sorting, pagination, and CSV export.
3. **16 Marketing Calculators (`/calculators`)**: ROAS, Break-Even ROAS, ROI, CPA, CAC, LTV, CPM, CPC, CTR, Conversion Rate, AOV, Profit, Funnel, Creative comparisons, and persistent saved calculation records.
4. **Budget Planner (`/budget-planner`)**: Multi-scenario forecasting (Conservative, Balanced, Aggressive), daily/monthly sync, save/duplicate/export plans.
5. **Scaling Intelligence (`/scaling`)**: Compounding budget scaling (+10% to +50%), anti-learning-reset health checks, and rule-based decision engine.
6. **Creative Intelligence (`/creatives`)**: Video 3s hook rate, 15s hold rate, creative fatigue alerts, and side-by-side A/B matrix.
7. **Campaign Manager (`/campaigns`)**: Full 4-tier hierarchy (Ad Account ➔ Campaign ➔ Ad Set ➔ Ad ➔ Creative) with live CRUD modals.
8. **AI Diagnostic Insights (`/ai-insights`)**: Deterministic natural language query engine with zero factual hallucinations.
9. **Meta Andromeda Updates (`/andromeda-updates`)**: Curated Meta algorithm intelligence distinguishing official announcements from empirical media buying research.
10. **Executive Reports (`/reports`)**: Audit-ready printable 1-page PDF media plan proposals and CSV reports.
11. **Integrations Hub (`/integrations`)**: Meta Graph API v21.0 adapter, rate limit monitor, manual sync trigger, and audit logging.
12. **Settings (`/settings`)**: Multi-currency switcher, API keys, and workspace backup.

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run automated tests
npm test

# Build static production export for GitHub Pages
npm run build
```
The application will run locally at `http://localhost:3000`.
