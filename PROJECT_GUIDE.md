# Meta Andromeda Updates & Ad Scaling Cockpit

## Project Overview
Modern SaaS web application and PWA for Meta Ads media buyers. Provides real-time interactive calculators (Scaling Calculator, Budget Planner, ROAS Calculator, Break-even Calculator), 2026 AI Engine updates insights, dual-axis performance charts, campaign management, and 1-click printable PDF audit export.

- **Type**: Interactive Web Application / PWA
- **Live URL**: https://heyshahid.github.io/meta-andromeda-calculator/
- **GitHub Repository**: https://github.com/heyshahid/meta-andromeda-calculator
- **Branch**: main

## Project Structure
- `index.html`: Complete single-page SaaS dashboard and calculator application.
- `sw.js`: Service worker for offline PWA support and instant caching.
- `manifest.json`: Progressive Web App manifest definition.
- `meta-andromeda-cover.webp`: High-resolution official Andromeda cosmic cover asset.
- `icons/`: App icons, favicons, and SVG monograms.
- `core/`: Python unit economics & scaling algorithm reference models.
- `docs/`: Andromeda Playbook and documentation.
- `deploy.py`: 1-Click deployment script to push updates directly to GitHub Pages.

## How to Work on this Project
1. Edit `index.html` to modify UI, styles, or calculator formulas.
2. Run locally using Python:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser.
3. Deploy changes to GitHub Pages:
   ```bash
   python deploy.py
   ```
