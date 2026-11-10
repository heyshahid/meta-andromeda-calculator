<div align="center">
  <img src="https://raw.githubusercontent.com/heyshahid/heyshahid/main/andromeda-logo.png" width="90" height="90" alt="Open MarketingOps Logo" />
  
  # Open MarketingOps
  
  <p><strong>Understand Performance. Make Better Decisions. Scale Smarter.</strong></p>
  
  <p>An enterprise-ready open-source marketing analytics, deterministic calculations, budget planning, and campaign optimization platform.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
  [![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Vitest](https://img.shields.io/badge/Vitest-Passed_100%25-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
  [![Author: Shahid Akram](https://img.shields.io/badge/Author-Shahid_Akram-1E293B?style=for-the-badge&logo=github)](https://github.com/heyshahid)
</div>

---

## 🌟 Executive Overview

**Open MarketingOps** is a production-grade, open-source marketing analytics suite built for performance marketers, media buyers, advertising consultants, and agencies. 

Unlike black-box dashboards or simplistic calculators, Open MarketingOps provides **100% deterministic mathematical calculations**, multi-channel CSV ingestion, rule-based scaling intelligence (protecting against Meta algorithmic learning resets), and audit-ready client proposals.

---

## 🚀 Key Modules & Architecture

### 1. 📊 Executive Performance Dashboard
- **10 Core Blended KPIs:** Total Spend, Attributed Revenue, ROAS, CPA, Net ROI, Total Conversions, AOV, CTR, CPC, and CPM.
- **Velocity Visualization:** Daily Spend vs Revenue trajectory and platform allocation pie charts.
- **Performance Filtering:** Real-time multi-platform filters (Meta Ads, Google Ads, TikTok Ads) and currency toggles (USD, EUR, GBP, PKR, INR, CAD, AUD, AED).

### 2. 🧮 Deterministic Marketing Calculation Engine
Implements 16 unit-tested mathematical formulas with zero-division safety:
1. **ROAS Calculator:** `Revenue / Ad Spend`
2. **Break-Even ROAS Engine:** `1 / Gross Margin`
3. **Budget Scaling Ladder:** Anti-Learning-Reset compounding steps (+15% to +20%).
4. **ROI Calculator:** `(Net Profit / Investment) × 100`
5. **CPA Calculator:** `Ad Spend / Conversions`
6. **CPM Calculator:** `(Ad Spend / Impressions) × 1,000`
7. **CPC Calculator:** `Ad Spend / Clicks`
8. **CTR Calculator:** `(Clicks / Impressions) × 100`
9. **Conversion Rate:** `(Conversions / Clicks) × 100`
10. **Average Order Value (AOV):** `Revenue / Orders`
11. **Net Contribution Profit:** `Revenue - COGS - Ad Spend - Fees`
12. **Ad Frequency:** `Impressions / Reach`
13. **Customer Acquisition Cost (CAC):** `Acquisition Costs / New Customers`
14. **Customer Lifetime Value (LTV):** `(AOV × Frequency × Lifespan) × Margin`
15. **Marketing Funnel:** Drop-off attrition rates across funnel stages.
16. **Creative Head-to-Head Comparison:** A vs B creative efficiency benchmarks.

### 3. 📈 Scaling Intelligence
- Transparent rule-based algorithmic decision engine.
- Identifies **Insufficient Data (<50 conversions)**, **Scaling Opportunities**, and **Rising Acquisition Costs**.
- Compounding budget intervals (+10%, +15%, +20%, +30%, +50%) protecting Meta algorithm stability.

### 4. 🎨 Creative Intelligence
- Tracks video engagement benchmarks: **3-Second Hook Rate %** and **15-Second Hold Rate %**.
- Creative decay indicators monitoring frequency spikes, CTR deterioration, and CPA inflation.

### 5. 📁 4-Step CSV Import Wizard
- Auto-detects column headers from Meta Ads Manager, Google Ads, TikTok, or custom spreadsheets.
- Type validation and preview before database ingestion.

### 6. 📄 1-Page Official Executive PDF & CSV Reports
- Clean, printable single-page audits formatted for founders, CFOs, and client pitch decks.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS & Enterprise Fintech Design System
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **CSV Engine:** PapaParse
- **Automated Testing:** Vitest
- **Database:** PostgreSQL / Supabase Schema with Row Level Security (RLS)

---

## 💻 Quick Start & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` (v24 supported)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/heyshahid/open-marketingops.git
cd open-marketingops

# Install dependencies
npm install

# Run automated calculation tests
npm test

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

Run Open MarketingOps in an isolated container:

```bash
# Build & start container
docker-compose up --build -d
```

---

## 🧪 Testing

Open MarketingOps enforces strict automated testing across all financial calculation formulas:

```bash
npm test
```

---

## 👤 Author & Architecture Lead

**Shahid Akram**  
*Paid Ads Architect & Systems Lead*  
- Portfolio: [byshahid.vercel.app](https://byshahid.vercel.app/)  
- GitHub: [@heyshahid](https://github.com/heyshahid)  
- LinkedIn: [linkedin.com/in/shahidakram](https://linkedin.com/in/shahidakram)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
