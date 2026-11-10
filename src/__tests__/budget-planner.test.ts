import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../lib/storage';
import { BudgetPlan } from '../lib/types';

describe('Budget Planner Scenarios & Math (Section 6)', () => {
  beforeEach(() => {
    StorageService.clearWorkspace();
  });

  it('calculates Conservative, Balanced, and Aggressive scenarios deterministically', () => {
    const monthlyBudget = 6000;
    const durationDays = 30;
    const dailyBudget = monthlyBudget / durationDays;
    const targetROAS = 3.5;
    const targetCPA = 25;
    const expectedCTR = 0.02; // 2%
    const expectedCR = 0.04; // 4%

    // Formulas
    const consRev = monthlyBudget * (targetROAS * 0.82);
    const consConv = Math.round(monthlyBudget / (targetCPA * 1.25));
    const consClicks = Math.round(consConv / expectedCR);
    const consImp = Math.round(consClicks / expectedCTR);

    const balRev = monthlyBudget * targetROAS;
    const balConv = Math.round(monthlyBudget / targetCPA);

    const aggRev = monthlyBudget * (targetROAS * 1.25);
    const aggConv = Math.round(monthlyBudget / (targetCPA * 0.85));

    expect(dailyBudget).toBe(200);
    expect(balRev).toBe(21000);
    expect(balConv).toBe(240);
    expect(consRev).toBeLessThan(balRev);
    expect(aggRev).toBeGreaterThan(balRev);
    expect(consConv).toBeLessThan(balConv);
    expect(aggConv).toBeGreaterThan(balConv);
    expect(consImp).toBeGreaterThan(0);
  });

  it('saves and duplicates budget plans with duplicate naming', () => {
    const plan: BudgetPlan = {
      id: 'bp-1',
      name: 'Black Friday Blitz Blueprint',
      createdAt: new Date().toISOString(),
      monthlyBudget: 15000,
      dailyBudget: 500,
      durationDays: 30,
      targetROAS: 4.0,
      targetCPA: 30,
      expectedCTR: 2.5,
      expectedCR: 4.5,
      aov: 95,
      scenarios: {
        conservative: { spend: 15000, revenue: 49200, roas: 3.28, conversions: 400 },
        balanced: { spend: 15000, revenue: 60000, roas: 4.00, conversions: 500 },
        aggressive: { spend: 15000, revenue: 75000, roas: 5.00, conversions: 588 }
      }
    };

    StorageService.addBudgetPlan(plan);
    expect(StorageService.getBudgetPlans()).toHaveLength(1);

    const duplicated = StorageService.duplicateBudgetPlan('bp-1');
    expect(duplicated).not.toBeNull();
    expect(duplicated?.name).toBe('Black Friday Blitz Blueprint (Copy)');
    expect(StorageService.getBudgetPlans()).toHaveLength(2);
  });
});

