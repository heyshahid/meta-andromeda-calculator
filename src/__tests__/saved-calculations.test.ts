import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../lib/storage';
import { SavedCalculation } from '../lib/types';

describe('Saved Calculations Module (Section 7)', () => {
  beforeEach(() => {
    StorageService.clearWorkspace();
  });

  it('saves, updates, and retrieves calculation audits', () => {
    const calc: SavedCalculation = {
      id: 'calc-test-1',
      workspaceId: 'test-ws',
      userId: 'user-shahid',
      calculatorType: 'ROAS',
      title: 'Q4 Core Scaling ROAS Check',
      inputs: { revenue: 10000, spend: 2500 },
      outputs: { roas: '4.00x' },
      notes: 'Initial test before increasing budget by 20%',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveCalculation(calc);
    const list = StorageService.getSavedCalculations();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Q4 Core Scaling ROAS Check');
    expect(list[0].calculatorType).toBe('ROAS');

    // Update
    const updated: SavedCalculation = {
      ...calc,
      title: 'Q4 Core Scaling ROAS Check (Verified)',
      notes: 'Audit approved by media buying director'
    };
    StorageService.updateSavedCalculation(updated);

    const reloaded = StorageService.getSavedCalculations();
    expect(reloaded[0].title).toBe('Q4 Core Scaling ROAS Check (Verified)');
    expect(reloaded[0].notes).toBe('Audit approved by media buying director');
  });

  it('deletes saved calculations cleanly', () => {
    const calc: SavedCalculation = {
      id: 'calc-del-1',
      workspaceId: 'test-ws',
      userId: 'user-shahid',
      calculatorType: 'Break-even ROAS',
      title: 'Serum Break-Even',
      inputs: { margin: 60 },
      outputs: { breakEvenROAS: '1.67x' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveCalculation(calc);
    expect(StorageService.getSavedCalculations()).toHaveLength(1);

    StorageService.deleteSavedCalculation('calc-del-1');
    expect(StorageService.getSavedCalculations()).toHaveLength(0);
  });
});
