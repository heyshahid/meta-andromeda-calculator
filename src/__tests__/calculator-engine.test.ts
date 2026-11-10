import { describe, it, expect } from "vitest";
import {
  calculateROAS,
  calculateROI,
  calculateCPA,
  calculateCPM,
  calculateCPC,
  calculateCTR,
  calculateConversionRate,
  calculateAOV,
  calculateBreakEvenROAS,
  calculateProfit,
  calculateFrequency,
  calculateCAC,
  calculateLTV,
  calculateBudgetScaling,
  calculateMarketingFunnel,
  compareCreatives,
  formatCurrency,
  formatPercent,
} from "../lib/calculator-engine";

describe("Open MarketingOps Calculation Engine Tests", () => {
  describe("ROAS Calculator", () => {
    it("calculates accurate ROAS for normal values", () => {
      const res = calculateROAS(5000, 1000);
      expect(res.value).toBe(5);
      expect(res.formattedValue).toBe("5.00x");
      expect(res.isError).toBe(false);
    });

    it("handles zero ad spend safely without throwing NaN", () => {
      const res = calculateROAS(5000, 0);
      expect(res.value).toBe(0);
      expect(res.isError).toBe(true);
      expect(res.errorMessage).toBe("Ad Spend must be greater than 0.");
    });
  });

  describe("ROI Calculator", () => {
    it("calculates accurate ROI percentage", () => {
      const res = calculateROI(2500, 5000);
      expect(res.value).toBe(50);
      expect(res.formattedValue).toBe("50.00%");
      expect(res.isError).toBe(false);
    });

    it("handles zero investment gracefully", () => {
      const res = calculateROI(1000, 0);
      expect(res.value).toBe(0);
      expect(res.isError).toBe(true);
    });
  });

  describe("CPA & CPC & CPM Calculators", () => {
    it("calculates CPA correctly", () => {
      const res = calculateCPA(1000, 50, "USD");
      expect(res.value).toBe(20);
      expect(res.formattedValue).toBe("$20.00");
    });

    it("calculates CPM per 1,000 impressions correctly", () => {
      const res = calculateCPM(250, 10000, "USD");
      expect(res.value).toBe(25);
      expect(res.formattedValue).toBe("$25.00");
    });

    it("calculates CPC per click", () => {
      const res = calculateCPC(500, 250, "USD");
      expect(res.value).toBe(2);
      expect(res.formattedValue).toBe("$2.00");
    });
  });

  describe("CTR & Conversion Rate", () => {
    it("calculates CTR percentage", () => {
      const res = calculateCTR(200, 10000);
      expect(res.value).toBe(2);
      expect(res.formattedValue).toBe("2.00%");
    });

    it("calculates Conversion Rate percentage", () => {
      const res = calculateConversionRate(25, 500);
      expect(res.value).toBe(5);
      expect(res.formattedValue).toBe("5.00%");
    });
  });

  describe("Break-even ROAS", () => {
    it("calculates 1 / Gross Margin correctly for 40% margin", () => {
      const res = calculateBreakEvenROAS(40);
      expect(res.value).toBe(2.5);
      expect(res.formattedValue).toBe("2.50x");
      expect(res.isError).toBe(false);
      expect(res.notes).toBeDefined();
    });

    it("flags invalid negative or 0% margin", () => {
      const res = calculateBreakEvenROAS(0);
      expect(res.isError).toBe(true);
    });
  });

  describe("Net Profit & Frequency & LTV", () => {
    it("calculates net profit deducting all costs", () => {
      const res = calculateProfit(10000, 3000, 2000, 1000, "USD");
      expect(res.value).toBe(4000);
      expect(res.formattedValue).toBe("$4,000.00");
    });

    it("calculates frequency from impressions and reach", () => {
      const res = calculateFrequency(15000, 5000);
      expect(res.value).toBe(3);
      expect(res.formattedValue).toBe("3.00");
    });

    it("calculates LTV considering AOV, frequency, lifespan, and gross margin", () => {
      const res = calculateLTV(100, 4, 3, 50, "USD");
      // 100 * 4 * 3 = 1200 * 50% = 600
      expect(res.value).toBe(600);
      expect(res.formattedValue).toBe("$600.00");
    });
  });

  describe("Budget Scaling & Anti-Learning-Reset", () => {
    it("flags increments above 30% as High Risk", () => {
      const plan = calculateBudgetScaling(500, 50, "USD");
      expect(plan.newDailyBudget).toBe(750);
      expect(plan.riskAssessment).toBe("High Risk");
    });

    it("marks standard 15% increase as Safe", () => {
      const plan = calculateBudgetScaling(500, 15, "USD");
      expect(plan.newDailyBudget).toBe(575);
      expect(plan.riskAssessment).toBe("Safe");
    });
  });

  describe("Marketing Funnel Calculator", () => {
    it("constructs full funnel with dropoff rates", () => {
      const funnel = calculateMarketingFunnel(10000, 500, 50, 10);
      expect(funnel.length).toBe(4);
      expect(funnel[0].name).toBe("Impressions");
      expect(funnel[1].count).toBe(500);
      expect(funnel[3].count).toBe(10);
    });
  });

  describe("Creative Comparison", () => {
    it("picks winning creative based on efficiency", () => {
      const result = compareCreatives(
        { ctr: 2.5, cpa: 15, roas: 3.5 },
        { ctr: 1.2, cpa: 30, roas: 1.8 }
      );
      expect(result.winnerMetric).toBe("Creative A");
      expect(result.ctrDifference).toBe(1.3);
    });
  });

  describe("Formatting Utilities", () => {
    it("formats multiple currencies correctly", () => {
      expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
      expect(formatCurrency(1234.56, "GBP")).toBe("£1,234.56");
      expect(formatCurrency(1234.56, "PKR")).toBe("Rs 1,234.56");
      expect(formatPercent(12.3456)).toBe("12.35%");
    });
  });
});

