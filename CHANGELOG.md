# Changelog

All notable changes to **Open MarketingOps** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-10

### Added
- **Full Architecture Transition:** Transformed into production-grade Next.js 14 App Router application with TypeScript and Tailwind CSS.
- **Deterministic Calculation Engine:** 16 unit-tested marketing formulas in `src/lib/calculator-engine.ts` (ROAS, ROI, CPA, CPM, CPC, CTR, CR, AOV, Break-Even ROAS, Profit, CAC, LTV, Scaling, Funnel, Creative Comparison).
- **Executive Dashboard:** 10 core blended KPIs, daily velocity charts (Spend vs Revenue), platform share pie chart, top performers and attention monitoring.
- **CSV Ingestion Wizard:** 4-step interactive CSV parser with column mapping, data validation, and template generator.
- **Budget Planner:** 3-scenario forecasting model (Conservative, Balanced, Aggressive).
- **Scaling Intelligence:** Anti-Learning-Reset compounding scaling ladders with rule-based algorithmic recommendations.
- **Creative Intelligence:** Creative fatigue diagnostics, 3-second hook rate %, and 15-second hold rate tracking.
- **Andromeda Updates:** Curated repository separating official Meta announcements from independent analysis.
- **AI Insights:** Workspace-bound deterministic natural language query engine.
- **Executive Reporting:** Single-page print/PDF audit proposal and CSV data export.
- **Relational Schema:** PostgreSQL / Supabase multi-tenant database migrations with Row Level Security (RLS).
- **Automated CI/CD:** GitHub Actions workflow with 100% automated test coverage.
