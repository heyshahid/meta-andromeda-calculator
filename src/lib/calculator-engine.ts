/**
 * Open MarketingOps - Deterministic Marketing Calculation Engine
 * 
 * Implements 16 standard marketing & financial formulas with strict input validation,
 * zero-division safety, edge-case handling, and precision rounding.
 */

export interface CalculationResult {
  value: number;
  formattedValue: string;
  formula: string;
  explanation: string;
  isError: boolean;
  errorMessage?: string;
  notes?: string;
}

/**
 * Format currency or number safely
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  if (isNaN(amount) || !isFinite(amount)) return `${currency} 0.00`;
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PKR: 'Rs ',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'AU$',
    AED: 'AED ',
  };
  const prefix = symbols[currency] || `${currency} `;
  return `${prefix}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(rate: number): string {
  if (isNaN(rate) || !isFinite(rate)) return '0.00%';
  return `${rate.toFixed(2)}%`;
}

export function formatNumber(val: number, decimals = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// 1. ROAS Calculator (Return on Ad Spend)
export function calculateROAS(revenue: number, adSpend: number): CalculationResult {
  if (adSpend <= 0) {
    return {
      value: 0,
      formattedValue: '0.00x',
      formula: 'Revenue / Ad Spend',
      explanation: 'Ad Spend must be greater than zero to calculate ROAS.',
      isError: true,
      errorMessage: 'Ad Spend must be greater than 0.'
    };
  }
  const roas = revenue / adSpend;
  return {
    value: roas,
    formattedValue: `${roas.toFixed(2)}x`,
    formula: 'Revenue / Ad Spend',
    explanation: `For every $1 spent on advertising, you generated $${roas.toFixed(2)} in revenue.`,
    isError: false
  };
}

// 2. ROI Calculator (Return on Investment)
export function calculateROI(netProfit: number, investment: number): CalculationResult {
  if (investment <= 0) {
    return {
      value: 0,
      formattedValue: '0.00%',
      formula: '(Net Profit / Investment) × 100',
      explanation: 'Total Investment must be greater than zero.',
      isError: true,
      errorMessage: 'Investment must be greater than 0.'
    };
  }
  const roi = (netProfit / investment) * 100;
  return {
    value: roi,
    formattedValue: formatPercent(roi),
    formula: '(Net Profit / Investment) × 100',
    explanation: `Your net return on the total capital invested is ${roi.toFixed(2)}%.`,
    isError: false
  };
}

// 3. CPA Calculator (Cost per Acquisition / Action)
export function calculateCPA(adSpend: number, conversions: number, currency = 'USD'): CalculationResult {
  if (conversions <= 0) {
    return {
      value: 0,
      formattedValue: formatCurrency(0, currency),
      formula: 'Ad Spend / Conversions',
      explanation: 'Conversions must be greater than zero to calculate CPA.',
      isError: true,
      errorMessage: 'Conversions must be greater than 0.'
    };
  }
  const cpa = adSpend / conversions;
  return {
    value: cpa,
    formattedValue: formatCurrency(cpa, currency),
    formula: 'Ad Spend / Conversions',
    explanation: `Each conversion cost an average of ${formatCurrency(cpa, currency)} in advertising.`,
    isError: false
  };
}

// 4. CPM Calculator (Cost per Mille / 1,000 Impressions)
export function calculateCPM(adSpend: number, impressions: number, currency = 'USD'): CalculationResult {
  if (impressions <= 0) {
    return {
      value: 0,
      formattedValue: formatCurrency(0, currency),
      formula: '(Ad Spend / Impressions) × 1000',
      explanation: 'Impressions must be greater than zero.',
      isError: true,
      errorMessage: 'Impressions must be greater than 0.'
    };
  }
  const cpm = (adSpend / impressions) * 1000;
  return {
    value: cpm,
    formattedValue: formatCurrency(cpm, currency),
    formula: '(Ad Spend / Impressions) × 1000',
    explanation: `Cost to reach 1,000 ad impressions is ${formatCurrency(cpm, currency)}.`,
    isError: false
  };
}

// 5. CPC Calculator (Cost per Click)
export function calculateCPC(adSpend: number, clicks: number, currency = 'USD'): CalculationResult {
  if (clicks <= 0) {
    return {
      value: 0,
      formattedValue: formatCurrency(0, currency),
      formula: 'Ad Spend / Clicks',
      explanation: 'Clicks must be greater than zero to calculate CPC.',
      isError: true,
      errorMessage: 'Clicks must be greater than 0.'
    };
  }
  const cpc = adSpend / clicks;
  return {
    value: cpc,
    formattedValue: formatCurrency(cpc, currency),
    formula: 'Ad Spend / Clicks',
    explanation: `Average cost per click across campaigns is ${formatCurrency(cpc, currency)}.`,
    isError: false
  };
}

// 6. CTR Calculator (Click-Through Rate)
export function calculateCTR(clicks: number, impressions: number): CalculationResult {
  if (impressions <= 0) {
    return {
      value: 0,
      formattedValue: '0.00%',
      formula: '(Clicks / Impressions) × 100',
      explanation: 'Impressions must be greater than zero to calculate CTR.',
      isError: true,
      errorMessage: 'Impressions must be greater than 0.'
    };
  }
  const ctr = (clicks / impressions) * 100;
  return {
    value: ctr,
    formattedValue: formatPercent(ctr),
    formula: '(Clicks / Impressions) × 100',
    explanation: `${ctr.toFixed(2)}% of people who saw the advertisement clicked on it.`,
    isError: false
  };
}

// 7. Conversion Rate Calculator
export function calculateConversionRate(conversions: number, clicks: number): CalculationResult {
  if (clicks <= 0) {
    return {
      value: 0,
      formattedValue: '0.00%',
      formula: '(Conversions / Clicks) × 100',
      explanation: 'Clicks must be greater than zero to calculate Conversion Rate.',
      isError: true,
      errorMessage: 'Clicks must be greater than 0.'
    };
  }
  const cr = (conversions / clicks) * 100;
  return {
    value: cr,
    formattedValue: formatPercent(cr),
    formula: '(Conversions / Clicks) × 100',
    explanation: `${cr.toFixed(2)}% of visitors who clicked made a conversion.`,
    isError: false
  };
}

// 8. Average Order Value (AOV)
export function calculateAOV(revenue: number, orders: number, currency = 'USD'): CalculationResult {
  if (orders <= 0) {
    return {
      value: 0,
      formattedValue: formatCurrency(0, currency),
      formula: 'Revenue / Orders',
      explanation: 'Total Orders must be greater than zero.',
      isError: true,
      errorMessage: 'Orders must be greater than 0.'
    };
  }
  const aov = revenue / orders;
  return {
    value: aov,
    formattedValue: formatCurrency(aov, currency),
    formula: 'Revenue / Orders',
    explanation: `The average transaction generated ${formatCurrency(aov, currency)} in revenue.`,
    isError: false
  };
}

// 9. Break-even ROAS Calculator
export function calculateBreakEvenROAS(grossMarginPercent: number): CalculationResult {
  if (grossMarginPercent <= 0 || grossMarginPercent > 100) {
    return {
      value: 0,
      formattedValue: '0.00x',
      formula: '1 / (Gross Margin % / 100)',
      explanation: 'Gross Margin must be a positive percentage between 0.1% and 100%.',
      isError: true,
      errorMessage: 'Gross Margin must be between 0.1% and 100%.'
    };
  }
  const marginDecimal = grossMarginPercent / 100;
  const breakEvenROAS = 1 / marginDecimal;
  return {
    value: breakEvenROAS,
    formattedValue: `${breakEvenROAS.toFixed(2)}x`,
    formula: '1 / Gross Margin',
    explanation: `At a ${grossMarginPercent}% gross margin, you must achieve at least ${breakEvenROAS.toFixed(2)}x ROAS to avoid losing money.`,
    notes: 'Note: This gross margin model assumes product margin. Operating expenses, merchant gateway fees (2.9%+30¢), and refund allowances should also be included for full contribution break-even.',
    isError: false
  };
}

// 10. Net Profit Calculator
export function calculateProfit(
  revenue: number,
  productCosts: number,
  adSpend: number,
  otherCosts: number,
  currency = 'USD'
): CalculationResult {
  const netProfit = revenue - productCosts - adSpend - otherCosts;
  return {
    value: netProfit,
    formattedValue: formatCurrency(netProfit, currency),
    formula: 'Revenue - Product Costs - Ad Spend - Other Costs',
    explanation: `Net profit after deducting all advertising, COGS, and operational expenses is ${formatCurrency(netProfit, currency)}.`,
    isError: false
  };
}

// 11. Frequency Calculator
export function calculateFrequency(impressions: number, reach: number): CalculationResult {
  if (reach <= 0) {
    return {
      value: 0,
      formattedValue: '0.00',
      formula: 'Impressions / Reach',
      explanation: 'Reach must be greater than zero.',
      isError: true,
      errorMessage: 'Reach must be greater than 0.'
    };
  }
  const freq = impressions / reach;
  return {
    value: freq,
    formattedValue: freq.toFixed(2),
    formula: 'Impressions / Reach',
    explanation: `On average, each unique person saw your advertisement ${freq.toFixed(2)} times.`,
    isError: false
  };
}

// 12. Customer Acquisition Cost (CAC)
export function calculateCAC(
  marketingAndSalesCosts: number,
  newCustomers: number,
  currency = 'USD'
): CalculationResult {
  if (newCustomers <= 0) {
    return {
      value: 0,
      formattedValue: formatCurrency(0, currency),
      formula: 'Total Acquisition Costs / New Customers',
      explanation: 'New customers count must be greater than zero.',
      isError: true,
      errorMessage: 'New customers must be greater than 0.'
    };
  }
  const cac = marketingAndSalesCosts / newCustomers;
  return {
    value: cac,
    formattedValue: formatCurrency(cac, currency),
    formula: 'Total Acquisition Costs / New Customers',
    explanation: `The blended cost to acquire each new paying customer is ${formatCurrency(cac, currency)}.`,
    isError: false
  };
}

// 13. Customer Lifetime Value (CLV / LTV)
export function calculateLTV(
  averageOrderValue: number,
  purchaseFrequencyPerYear: number,
  customerLifespanYears: number,
  grossMarginPercent = 100,
  currency = 'USD'
): CalculationResult {
  if (averageOrderValue <= 0 || purchaseFrequencyPerYear <= 0 || customerLifespanYears <= 0) {
    return {
      value: 0,
      formattedValue: formatCurrency(0, currency),
      formula: '(AOV × Frequency × Lifespan) × Gross Margin %',
      explanation: 'AOV, frequency, and lifespan must all be greater than zero.',
      isError: true,
      errorMessage: 'All inputs must be greater than 0.'
    };
  }
  const rawRevenue = averageOrderValue * purchaseFrequencyPerYear * customerLifespanYears;
  const ltv = rawRevenue * (Math.max(1, Math.min(100, grossMarginPercent)) / 100);
  return {
    value: ltv,
    formattedValue: formatCurrency(ltv, currency),
    formula: '(AOV × Purchase Frequency × Customer Lifespan) × Margin',
    explanation: `Projected gross profit generated over an average customer lifecycle is ${formatCurrency(ltv, currency)}.`,
    isError: false
  };
}

// 14. Budget Scaling Calculator (Compounding Anti-Learning-Reset Steps)
export function calculateBudgetScaling(
  currentDailyBudget: number,
  increasePercent: number,
  currency = 'USD'
): {
  newDailyBudget: number;
  additionalDailyBudget: number;
  monthlyProjectedSpend: number;
  formattedNewBudget: string;
  formattedAdditional: string;
  formattedMonthly: string;
  riskAssessment: 'Safe' | 'Moderate' | 'High Risk';
  recommendation: string;
} {
  const safeIncrease = Math.max(-100, increasePercent);
  const multiplier = 1 + (safeIncrease / 100);
  const newBudget = currentDailyBudget * multiplier;
  const additionalDaily = newBudget - currentDailyBudget;
  const monthly = newBudget * 30.4;

  let riskAssessment: 'Safe' | 'Moderate' | 'High Risk' = 'Safe';
  let recommendation = 'Safe increment within standard algorithmic limits (≤ 20%).';

  if (safeIncrease > 30) {
    riskAssessment = 'High Risk';
    recommendation = 'Budget increase exceeds 30% in a single step. High likelihood of Meta delivery algorithm resetting back to volatile Learning Phase.';
  } else if (safeIncrease > 20) {
    riskAssessment = 'Moderate';
    recommendation = 'Moderate increase (20-30%). Monitor CPA closely over the next 48 hours for performance degradation.';
  }

  return {
    newDailyBudget: newBudget,
    additionalDailyBudget: additionalDaily,
    monthlyProjectedSpend: monthly,
    formattedNewBudget: formatCurrency(newBudget, currency),
    formattedAdditional: formatCurrency(additionalDaily, currency),
    formattedMonthly: formatCurrency(monthly, currency),
    riskAssessment,
    recommendation
  };
}

// 15. Marketing Funnel Calculator
export interface FunnelStage {
  name: string;
  count: number;
  dropoffRate: number;
  conversionFromPrevious: number;
}

export function calculateMarketingFunnel(
  impressions: number,
  clicks: number,
  leads: number,
  purchases: number
): FunnelStage[] {
  const safeImp = Math.max(0, impressions);
  const safeClicks = Math.min(safeImp, Math.max(0, clicks));
  const safeLeads = Math.min(safeClicks, Math.max(0, leads));
  const safePurchases = Math.min(safeLeads, Math.max(0, purchases));

  return [
    {
      name: 'Impressions',
      count: safeImp,
      dropoffRate: 0,
      conversionFromPrevious: 100
    },
    {
      name: 'Clicks',
      count: safeClicks,
      dropoffRate: safeImp > 0 ? ((safeImp - safeClicks) / safeImp) * 100 : 0,
      conversionFromPrevious: safeImp > 0 ? (safeClicks / safeImp) * 100 : 0
    },
    {
      name: 'Leads / Add to Cart',
      count: safeLeads,
      dropoffRate: safeClicks > 0 ? ((safeClicks - safeLeads) / safeClicks) * 100 : 0,
      conversionFromPrevious: safeClicks > 0 ? (safeLeads / safeClicks) * 100 : 0
    },
    {
      name: 'Purchases / Conversions',
      count: safePurchases,
      dropoffRate: safeLeads > 0 ? ((safeLeads - safePurchases) / safeLeads) * 100 : 0,
      conversionFromPrevious: safeLeads > 0 ? (safePurchases / safeLeads) * 100 : 0
    }
  ];
}

// 16. Creative Comparison Calculator (A vs B)
export interface CreativeComparisonResult {
  winnerMetric: 'Creative A' | 'Creative B' | 'Tie';
  ctrDifference: number;
  cpaDifference: number;
  roasDifference: number;
  summary: string;
}

export function compareCreatives(
  creativeA: { ctr: number; cpa: number; roas: number },
  creativeB: { ctr: number; cpa: number; roas: number }
): CreativeComparisonResult {
  const ctrDiff = creativeA.ctr - creativeB.ctr;
  const cpaDiff = creativeA.cpa - creativeB.cpa; // Lower CPA is better
  const roasDiff = creativeA.roas - creativeB.roas;

  let scoreA = 0;
  let scoreB = 0;

  if (ctrDiff > 0) scoreA++; else if (ctrDiff < 0) scoreB++;
  if (cpaDiff < 0) scoreA++; else if (cpaDiff > 0) scoreB++; // lower cpa = point
  if (roasDiff > 0) scoreA++; else if (roasDiff < 0) scoreB++;

  let winnerMetric: 'Creative A' | 'Creative B' | 'Tie' = 'Tie';
  if (scoreA > scoreB) winnerMetric = 'Creative A';
  if (scoreB > scoreA) winnerMetric = 'Creative B';

  const summary = winnerMetric === 'Tie'
    ? 'Both creatives demonstrate balanced metrics across CTR, CPA, and ROAS.'
    : `${winnerMetric} outperforms its counterpart across key efficiency benchmarks (${winnerMetric === 'Creative A' ? 'Higher ROAS / Lower CPA' : 'Better efficiency'}).`;

  return {
    winnerMetric,
    ctrDifference: ctrDiff,
    cpaDifference: cpaDiff,
    roasDifference: roasDiff,
    summary
  };
}

