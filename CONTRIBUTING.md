# Contributing to Open MarketingOps

Thank you for your interest in contributing to **Open MarketingOps**!

## How to Contribute

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/open-marketingops.git
   cd open-marketingops
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Ensure all unit tests pass:
   ```bash
   npm test
   ```
6. Commit your changes with clear conventional commit messages:
   ```bash
   git commit -m "feat(calculators): add blended ltv formula"
   ```
7. Push to your branch and open a Pull Request.

## Code Standards
- Strict TypeScript types throughout.
- Keep mathematical calculations deterministic in `src/lib/calculator-engine.ts`.
- Write unit tests in `src/__tests__/` for every new formula or edge case.
