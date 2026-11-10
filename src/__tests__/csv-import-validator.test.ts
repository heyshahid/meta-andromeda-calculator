import { describe, it, expect } from 'vitest';

describe('CSV Import Engine Validation & Duplicate Rules (Section 3)', () => {
  // Pure validation rules extracted from CSVImportWizard
  function validateRow(row: any, mapping: any, existingKeys: Set<string>, seenInFile: Set<string>) {
    const errors: string[] = [];
    const rawName = row[mapping.name];
    if (!rawName || String(rawName).trim() === '') {
      errors.push('Missing required campaign name.');
    }
    const name = String(rawName || '').trim();

    const rawPlatform = String(row[mapping.platform] || 'Meta Ads').trim();
    const platform = rawPlatform.toLowerCase().includes('google')
      ? 'Google Ads'
      : rawPlatform.toLowerCase().includes('tiktok')
      ? 'TikTok Ads'
      : 'Meta Ads';

    const cleanNumber = (val: any) => {
      if (val === undefined || val === null || val === '') return 0;
      const cleaned = String(val).replace(/[^0-9.-]+/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    };

    const rawSpend = cleanNumber(row[mapping.spend]);
    if (rawSpend === null) {
      errors.push('Invalid numeric format for Ad Spend.');
    } else if (rawSpend < 0) {
      errors.push('Negative Ad Spend is not allowed.');
    }

    const rawRev = cleanNumber(row[mapping.revenue]);
    if (rawRev !== null && rawRev < 0) {
      errors.push('Negative Revenue is not allowed.');
    }

    const key = `${name.toLowerCase()}_${platform.toLowerCase()}`;
    const isDuplicate = existingKeys.has(key) || seenInFile.has(key);
    seenInFile.add(key);

    return {
      isValid: errors.length === 0,
      isDuplicate,
      errors,
      name,
      platform,
      spend: rawSpend,
      revenue: rawRev
    };
  }

  const defaultMapping = {
    name: 'Campaign Name',
    spend: 'Ad Spend',
    revenue: 'Revenue',
    platform: 'Platform'
  };

  it('validates a normal, clean CSV row properly', () => {
    const row = {
      'Campaign Name': 'Advantage+ Retargeting',
      'Ad Spend': '1250.00',
      'Revenue': '5000.00',
      'Platform': 'Meta Ads'
    };
    const result = validateRow(row, defaultMapping, new Set(), new Set());
    expect(result.isValid).toBe(true);
    expect(result.isDuplicate).toBe(false);
    expect(result.spend).toBe(1250.0);
    expect(result.revenue).toBe(5000.0);
  });

  it('cleans currency symbols ($1,450.50) without error', () => {
    const row = {
      'Campaign Name': 'Google Search Brand',
      'Ad Spend': '$1,450.50',
      'Revenue': '$4,351.50',
      'Platform': 'Google Ads'
    };
    const result = validateRow(row, defaultMapping, new Set(), new Set());
    expect(result.isValid).toBe(true);
    expect(result.spend).toBe(1450.5);
    expect(result.revenue).toBe(4351.5);
  });

  it('rejects rows with missing campaign name', () => {
    const row = {
      'Campaign Name': '   ',
      'Ad Spend': '500.00',
      'Revenue': '1500.00',
      'Platform': 'Meta Ads'
    };
    const result = validateRow(row, defaultMapping, new Set(), new Set());
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required campaign name.');
  });

  it('rejects rows with negative spend or invalid numeric values', () => {
    const row = {
      'Campaign Name': 'Broken Data Row',
      'Ad Spend': '-500.00',
      'Revenue': 'N/A',
      'Platform': 'Meta Ads'
    };
    const result = validateRow(row, defaultMapping, new Set(), new Set());
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Negative Ad Spend is not allowed.');
  });

  it('detects duplicate campaigns against existing workspace records and within file', () => {
    const existing = new Set(['existing campaign_meta ads']);
    const seen = new Set<string>();

    const row1 = {
      'Campaign Name': 'Existing Campaign',
      'Ad Spend': '200.00',
      'Revenue': '600.00',
      'Platform': 'Meta Ads'
    };
    const result1 = validateRow(row1, defaultMapping, existing, seen);
    expect(result1.isValid).toBe(true);
    expect(result1.isDuplicate).toBe(true);

    const row2 = {
      'Campaign Name': 'Fresh Campaign',
      'Ad Spend': '100.00',
      'Revenue': '300.00',
      'Platform': 'Meta Ads'
    };
    const result2 = validateRow(row2, defaultMapping, existing, seen);
    expect(result2.isDuplicate).toBe(false);

    // Same row again in the same file
    const result3 = validateRow(row2, defaultMapping, existing, seen);
    expect(result3.isDuplicate).toBe(true);
  });
});

