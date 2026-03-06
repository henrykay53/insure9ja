import { CALCULATOR_TABLES } from '@/data/calculatorTables';
import type { AnnuityOption, RefundSchedule } from '@/components/application/ApplicationFlow';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const parseDate = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

const dateToUtc = (d: { year: number; month: number; day: number }) =>
  Date.UTC(d.year, d.month - 1, d.day);

const getTodayParts = () => {
  const now = new Date();
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate(),
  };
};

const addMonthsUtc = (date: { year: number; month: number; day: number }, months: number) => {
  const utc = new Date(Date.UTC(date.year, date.month - 1 + months, date.day));
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
};

const fullYearsBetween = (dob: { year: number; month: number; day: number }, today = getTodayParts()) => {
  let years = today.year - dob.year;
  if (today.month < dob.month || (today.month === dob.month && today.day < dob.day)) {
    years -= 1;
  }
  return Math.max(0, years);
};

const issueAgeNextBirthday = (dob: string) => {
  const parsed = parseDate(dob);
  if (!parsed) return null;
  return fullYearsBetween(parsed) + 1;
};

const issueAgeHalfYearRule = (dob: string) => {
  const parsed = parseDate(dob);
  if (!parsed) return null;

  const today = getTodayParts();
  const years = fullYearsBetween(parsed, today);
  const birthdayReached = { year: parsed.year + years, month: parsed.month, day: parsed.day };

  let months = 0;
  for (let m = 1; m <= 11; m += 1) {
    const candidate = addMonthsUtc(birthdayReached, m);
    if (dateToUtc(candidate) <= dateToUtc(today)) {
      months = m;
    } else {
      break;
    }
  }

  const afterMonths = addMonthsUtc(birthdayReached, months);
  const remainingDays = Math.floor(
    (dateToUtc(today) - dateToUtc(afterMonths)) / (1000 * 60 * 60 * 24),
  );

  return months >= 6 && remainingDays > 0 ? years + 1 : years;
};

export const parseCurrencyAmount = (value: string) => {
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const findAgeIndex = (ages: readonly number[], issueAge: number) => {
  const minAge = ages[0];
  const maxAge = ages[ages.length - 1];
  const safeAge = clamp(issueAge, minAge, maxAge);
  return ages.indexOf(safeAge);
};

const findTermIndex = (terms: readonly number[], term: number) => {
  const idx = terms.indexOf(term);
  return idx >= 0 ? idx : 0;
};

export const getNonRefundablePremium = (coverageAmount: string, dob: string) => {
  const amount = parseCurrencyAmount(coverageAmount);
  const issueAge = issueAgeNextBirthday(dob);
  if (!amount || !issueAge) return 0;

  const { ages, singleTerms, singleRates } = CALCULATOR_TABLES.termAssurance;
  const ageIdx = findAgeIndex(ages, issueAge);
  const termIdx = findTermIndex(singleTerms, 1);
  const ratePerThousand = singleRates[ageIdx][termIdx] ?? 0;
  return Math.round((amount * ratePerThousand) / 1000);
};

const getLifetimeTermFromSchedule = (schedule: RefundSchedule) => {
  if (schedule === '3-years-9') return 9;
  // Spreadsheet term options are 6, 9, 12... ; 5-year product maps to the 6-year table slot.
  return 6;
};

export const getRefundablePremium = (coverageAmount: string, dob: string, schedule: RefundSchedule) => {
  const amount = parseCurrencyAmount(coverageAmount);
  const issueAge = issueAgeHalfYearRule(dob);
  if (!amount || !issueAge) return 0;

  const { ages, terms, levelRates } = CALCULATOR_TABLES.lifetimeHarvest;
  const ageIdx = findAgeIndex(ages, issueAge);
  const termIdx = findTermIndex(terms, getLifetimeTermFromSchedule(schedule));
  const ratePerThousand = levelRates[ageIdx][termIdx] ?? 0;
  return Math.round((amount * ratePerThousand) / 1000);
};

const getAnnuityOptionNumber = (option: AnnuityOption) => {
  if (option === 'lump-sum') return 1;
  if (option === 'deferred') return 4;
  return 2;
};

export const getAnnuityPayout = (contributionAmount: string, dob: string, option: AnnuityOption) => {
  const premium = parseCurrencyAmount(contributionAmount);
  const issueAge = issueAgeHalfYearRule(dob);
  if (!premium || !issueAge) return { annual: 0, monthly: 0 };

  const { ages, options, bandA, bandB, bandC, n5m, n20m, perMil } = CALCULATOR_TABLES.annuity;
  const ageIdx = findAgeIndex(ages, issueAge);
  const optionIdx = Math.max(0, options.indexOf(getAnnuityOptionNumber(option)));
  const band = premium < n5m ? bandA : premium <= n20m ? bandB : bandC;
  const factor = band[ageIdx][optionIdx] ?? 0;
  const annual = Math.round((premium * factor) / perMil);
  return {
    annual,
    monthly: Math.round(annual / 12),
  };
};
