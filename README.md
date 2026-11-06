# Meta Andromeda ROAS & Ad Scaling Calculator

[![Live App](https://img.shields.io/badge/Live_App-heyshahid.github.io%2Fmeta--andromeda--calculator-6366F1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://heyshahid.github.io/meta-andromeda-calculator/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_Offline-10B981?style=for-the-badge&logo=pwa&logoColor=white)](https://heyshahid.github.io/meta-andromeda-calculator/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)
[![Author: Shahid Akram](https://img.shields.io/badge/Author-Shahid_Akram-1E293B?style=for-the-badge&logo=github&logoColor=white)](https://github.com/heyshahid)

> **Precision Break-Even ROAS, Max Allowable CAC, and Meta Machine Learning Scaling Engine.**  
> A mobile-first Progressive Web App (PWA) built for e-commerce founders, media buyers, performance marketers, and growth agencies to scale ad spend profitably without triggering Meta's algorithmic learning resets.

---

## Live Web Application
Launch Tool: [https://heyshahid.github.io/meta-andromeda-calculator/](https://heyshahid.github.io/meta-andromeda-calculator/)  
*(Installable directly to iOS, Android, macOS, and Windows home screens with zero app store downloads).*

---

## The Problem It Solves

Most e-commerce brands and media buyers scale paid media incorrectly:
1. **Flawed Break-Even ROAS:** Traditional calculators use `1 / Margin`, ignoring merchant processing fees (2.9% + $0.30), return rates, and shipping costs. Brands think they are profitable at a 1.8x ROAS when they are actually bleeding cash.
2. **Algorithmic Learning Phase Resets:** Increasing Meta ad budgets by more than 20% in a single day shocks Meta’s delivery system, re-entering the campaign into the volatile learning phase and spiking Cost Per Acquisition (CPA).
3. **No Executive Client Reporting:** Media buyers lack a fast, clean way to export a professional 1-page scaling roadmap and financial audit for founders and CFOs.

**Meta Andromeda Calculator** solves all three with zero bloat and 100% offline capability.

---

## Core Calculation Engines

### 1. Unit Economics & True Break-Even ROAS
- **Inputs:** Average Order Value (AOV), Cost of Goods Sold (COGS), Pick/Pack/Shipping, Merchant Gateway Fee (%), Return/Refund Rate (%).
- **Outputs:**
  - **Net Contribution Margin ($ & %):** Real profit per order before advertising spend.
  - **Break-Even ROAS:** The exact minimum ROAS required to avoid losing money.
  - **Max Allowable CAC (Customer Acquisition Cost):** The absolute ceiling you can afford to pay for a new customer.
  - **Target ROAS at Desired Margin (10%, 20%, 30%):** Exact ROAS needed to hit specific bottom-line profit targets.

### 2. Andromeda Machine Learning Scaling Trajectory
- **Safe Scaling Increments:** Automatically models day-by-day +15% and +20% compounding budget steps to scale from $100/day to $5,000+/day without throwing campaigns back into the learning phase.
- **70 / 20 / 10 Budget Allocation:**
  - **70% Core Scaling:** Meta Advantage+ Shopping Campaigns (ASC) and proven winning CBOs.
  - **20% Creative Testing:** Dynamic Creative Ad sets (DCT) testing new hooks and visual angles.
  - **10% Moonshot / Retargeting:** High-leverage angles, whitelisting, or bottom-of-funnel conversion boosters.
- **Projected Revenue & Profit at Scale:** Models forecasted blended ROAS degradation as budgets expand.

### 3. Reverse Target Profit Simulator
- Enter your **Monthly Net Profit Target** (e.g. $20,000/month).
- Instantly computes:
  - Required Monthly Ad Spend.
  - Minimum blended ROAS required.
  - Total monthly orders and daily unit volume needed.

### 4. 1-Page Executive Scaling Proposal (PDF Export)
- Prints a polished, professional single-page audit formatted with:
  - Client & brand details.
  - Unit economics breakdown.
  - 14-day budget scaling trajectory table.
  - Agency / Media Buyer recommendations and client sign-off block.

---

## Formulas & Financial Logic

$$\text{Net Margin (\%)} = \frac{\text{AOV} - (\text{COGS} + \text{Shipping} + \text{Payment Fee} + \text{Return Allowance})}{\text{AOV}}$$

$$\text{Break-Even ROAS} = \frac{1}{\text{Net Margin (\%)}} = \frac{\text{AOV}}{\text{Net Margin (\$)}} = \frac{\text{AOV}}{\text{Max Allowable CAC}}$$

$$\text{Daily Scaled Budget}_{t+1} = \text{Budget}_t \times (1 + \text{Scaling Factor}) \quad \text{where } \text{Scaling Factor} \le 0.20$$

---

## Progressive Web App (PWA) Features
- **Offline First:** Cached via Service Worker (`sw.js`). Operates seamlessly mid-flight or on spotty connections.
- **Instant Load Time:** Built with zero runtime JavaScript frameworks (vanilla JavaScript logic) and styled with Tailwind CSS for 60 FPS performance.
- **Local Storage Vault:** Stores recent audits and scaling models locally in your browser with zero data sent to external servers.

---

## Installation & Local Development

No Node.js or build steps required. Clone and open:

```bash
git clone https://github.com/heyshahid/meta-andromeda-calculator.git
cd meta-andromeda-calculator
# Open index.html directly in any modern browser
open index.html # On macOS
start index.html # On Windows
```

---

## Search & Topic Tags
`meta-ads`, `roas-calculator`, `facebook-ads`, `andromeda-scaling`, `break-even-roas`, `cpa-calculator`, `performance-marketing`, `media-buying`, `ad-spend-calculator`, `ecommerce-growth`, `pwa`, `progressive-web-app`

---

## Author & Architecture
**Shahid Akram**  
*Paid Ads Architect & Systems Lead*  
- Portfolio: [byshahid.vercel.app](https://byshahid.vercel.app/)  
- GitHub: [github.com/heyshahid](https://github.com/heyshahid)  
- LinkedIn: [linkedin.com/in/shahidakram](https://linkedin.com/in/shahidakram)  
- Blogger: [byshahid.blogspot.com](https://byshahid.blogspot.com/)  
- Substack: [byshahidakram.substack.com](https://byshahidakram.substack.com/)  
- Email: [heyshahidakram@gmail.com](mailto:heyshahidakram@gmail.com)

---

## License
This project is open-source under the [MIT License](LICENSE).
