/**
 * Direct-wage estimate for shop material-handling time.
 * Conservative shop-month assumptions — not ROI and not guaranteed savings.
 */

export const WORKDAYS_PER_MONTH = 22;
export const WEEKS_PER_MONTH = 4.33;
export const STAGEVERIFY_FOUNDING_PRICE = 199;

export const CALCULATOR_DEFAULTS = {
  technicians: 5,
  techWage: 30,
  techMinutesPerDay: 6,
  officeWage: 25,
  officeMinutesPerWeek: 20,
  dispatcherWage: 32.5,
  dispatcherMinutesPerWeek: 20,
  managerWage: 37.5,
  managerMinutesPerWeek: 25,
};

const MAX_COUNT = 10_000;
const MAX_WAGE = 10_000;
const MAX_MINUTES = 24 * 60;

/**
 * @param {unknown} value
 * @param {{ min?: number, max?: number }} [opts]
 * @returns {number}
 */
export function sanitizeNumber(value, opts = {}) {
  const min = opts.min ?? 0;
  const max = opts.max ?? Number.MAX_SAFE_INTEGER;
  const raw =
    typeof value === "number" ? value : Number.parseFloat(String(value).replace(/,/g, ""));

  if (!Number.isFinite(raw) || raw < min) return 0;
  if (raw > max) return max;
  return raw;
}

/**
 * @param {Partial<typeof CALCULATOR_DEFAULTS>} [inputs]
 */
export function calculateMaterialProcessCost(inputs = {}) {
  const technicians = sanitizeNumber(inputs.technicians, { max: MAX_COUNT });
  const techWage = sanitizeNumber(inputs.techWage, { max: MAX_WAGE });
  const techMinutesPerDay = sanitizeNumber(inputs.techMinutesPerDay, {
    max: MAX_MINUTES,
  });
  const officeWage = sanitizeNumber(inputs.officeWage, { max: MAX_WAGE });
  const officeMinutesPerWeek = sanitizeNumber(inputs.officeMinutesPerWeek, {
    max: MAX_MINUTES * 7,
  });
  const dispatcherWage = sanitizeNumber(inputs.dispatcherWage, { max: MAX_WAGE });
  const dispatcherMinutesPerWeek = sanitizeNumber(inputs.dispatcherMinutesPerWeek, {
    max: MAX_MINUTES * 7,
  });
  const managerWage = sanitizeNumber(inputs.managerWage, { max: MAX_WAGE });
  const managerMinutesPerWeek = sanitizeNumber(inputs.managerMinutesPerWeek, {
    max: MAX_MINUTES * 7,
  });

  const techMonthlyHours =
    (technicians * techMinutesPerDay * WORKDAYS_PER_MONTH) / 60;
  const techMonthlyCost = techMonthlyHours * techWage;

  const officeMonthlyCost =
    (officeMinutesPerWeek * WEEKS_PER_MONTH) / 60 * officeWage;

  const dispatcherMonthlyCost =
    (dispatcherMinutesPerWeek * WEEKS_PER_MONTH) / 60 * dispatcherWage;

  const managerMonthlyCost =
    (managerMinutesPerWeek * WEEKS_PER_MONTH) / 60 * managerWage;

  const monthlyTotal =
    techMonthlyCost +
    officeMonthlyCost +
    dispatcherMonthlyCost +
    managerMonthlyCost;
  const annualTotal = monthlyTotal * 12;
  const monthlySavingsCeiling = Math.max(0, monthlyTotal - STAGEVERIFY_FOUNDING_PRICE);
  const annualSavingsCeiling = Math.max(0, annualTotal - STAGEVERIFY_FOUNDING_PRICE * 12);

  const result = {
    techMonthlyHours,
    techMonthlyCost,
    officeMonthlyCost,
    dispatcherMonthlyCost,
    managerMonthlyCost,
    monthlyTotal,
    annualTotal,
    monthlySavingsCeiling,
    annualSavingsCeiling,
  };

  for (const [key, value] of Object.entries(result)) {
    if (value === null) continue;
    if (!Number.isFinite(value)) {
      result[key] = 0;
    }
  }

  return result;
}

/**
 * @param {number} value
 * @param {Intl.NumberFormatOptions} [options]
 */
export function formatCurrency(value, options = {}) {
  const n = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 100 ? 0 : 2,
    ...options,
  }).format(n);
}

/**
 * @param {number} value
 */
export function formatHours(value) {
  const n = Number.isFinite(value) ? value : 0;
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(n)} hrs`;
}
