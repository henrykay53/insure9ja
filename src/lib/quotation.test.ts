import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getAnnuityPayout,
  getNonRefundablePremium,
  getRefundablePremium,
  parseCurrencyAmount,
} from './quotation';

const FIXED_NOW = new Date('2026-03-06T12:00:00.000Z');

describe('quotation parsing and calculations', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('parses currency input safely', () => {
    expect(parseCurrencyAmount('₦12,500,000')).toBe(12500000);
    expect(parseCurrencyAmount('20,000,000')).toBe(20000000);
    expect(parseCurrencyAmount('')).toBe(0);
  });

  it('computes non-refundable premium from term assurance table', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    // Issue age resolves to 20; term=1 from single premium table has rate 3.46 per 1000.
    const premium = getNonRefundablePremium('1,000,000', '2006-03-07');
    expect(premium).toBe(3460);
  });

  it('computes refundable 5-year path premium from lifetime harvest table', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    // Issue age resolves to 20; mapped term slot uses 6-year column with rate 165.824359... per 1000.
    const premium = getRefundablePremium('1,000,000', '2006-03-07', '5-years');
    expect(premium).toBe(165824);
  });

  it('computes refundable 3-years-9 path premium from lifetime harvest table', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    // Issue age resolves to 20; 9-year column rate is 110.880565... per 1000.
    const premium = getRefundablePremium('1,000,000', '2006-03-07', '3-years-9');
    expect(premium).toBe(110881);
  });

  it('computes annuity payout for lower premium band', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    // Age 40, pfa maps to option 2; band A factor is 134577.418... (3% commission table).
    const quote = getAnnuityPayout('4,000,000', '1986-03-07', 'pfa');
    expect(quote.annual).toBe(538310);
    expect(quote.monthly).toBe(44859);
  });

  it('computes annuity payout for middle premium band', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    // Age 40, lump-sum maps to option 1; band B factor is 135756.652... .
    const quote = getAnnuityPayout('10,000,000', '1986-03-07', 'lump-sum');
    expect(quote.annual).toBe(1357567);
    expect(quote.monthly).toBe(113131);
  });

  it('computes annuity payout for upper premium band', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    // Age 40, deferred maps to option 4; band C factor is 89491.968... .
    const quote = getAnnuityPayout('25,000,000', '1986-03-07', 'deferred');
    expect(quote.annual).toBe(2237299);
    expect(quote.monthly).toBe(186442);
  });
});
