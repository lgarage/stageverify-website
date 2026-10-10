#!/usr/bin/env node
/**
 * Unit-style checks for costCalculator.js formulas.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CALCULATOR_DEFAULTS,
  STAGEVERIFY_FOUNDING_PRICE,
  WORKDAYS_PER_MONTH,
  WEEKS_PER_MONTH,
  calculateMaterialProcessCost,
  formatCurrency,
  sanitizeNumber,
} from "../src/utils/costCalculator.js";

const failures = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures.push(msg);
  console.error(`FAIL: ${msg}`);
}

function assert(condition, passMsg, failMsg) {
  if (condition) pass(passMsg);
  else fail(failMsg);
}

function approx(actual, expected, tolerance = 0.0001) {
  return Math.abs(actual - expected) <= tolerance;
}

const defaults = calculateMaterialProcessCost(CALCULATOR_DEFAULTS);

assert(
  WORKDAYS_PER_MONTH === 22,
  "WORKDAYS_PER_MONTH === 22",
  `WORKDAYS_PER_MONTH was ${WORKDAYS_PER_MONTH}, expected 22`,
);

assert(
  WEEKS_PER_MONTH === 4.33,
  "WEEKS_PER_MONTH === 4.33 exactly",
  `WEEKS_PER_MONTH was ${WEEKS_PER_MONTH}, expected 4.33`,
);

assert(
  STAGEVERIFY_FOUNDING_PRICE === 199,
  "STAGEVERIFY_FOUNDING_PRICE === 199",
  `STAGEVERIFY_FOUNDING_PRICE was ${STAGEVERIFY_FOUNDING_PRICE}, expected 199`,
);

assert(
  CALCULATOR_DEFAULTS.techMinutesPerDay === 6,
  "default techMinutesPerDay === 6",
  `default techMinutesPerDay was ${CALCULATOR_DEFAULTS.techMinutesPerDay}, expected 6`,
);

assert(
  defaults.techMonthlyHours === 11,
  "default techMonthlyHours === 11",
  `default techMonthlyHours was ${defaults.techMonthlyHours}, expected 11`,
);

assert(
  defaults.techMonthlyCost === 330,
  "default techMonthlyCost === 330",
  `default techMonthlyCost was ${defaults.techMonthlyCost}, expected 330`,
);

assert(
  approx(defaults.officeMonthlyCost, 36.08333333333333),
  "default officeMonthlyCost ≈ 36.08333333333333",
  `default officeMonthlyCost was ${defaults.officeMonthlyCost}, expected ≈ 36.08333333333333`,
);

assert(
  approx(defaults.dispatcherMonthlyCost, 46.90833333333333),
  "default dispatcherMonthlyCost ≈ 46.90833333333333",
  `default dispatcherMonthlyCost was ${defaults.dispatcherMonthlyCost}, expected ≈ 46.90833333333333`,
);

assert(
  approx(defaults.managerMonthlyCost, 67.65625),
  "default managerMonthlyCost ≈ 67.65625",
  `default managerMonthlyCost was ${defaults.managerMonthlyCost}, expected ≈ 67.65625`,
);

assert(
  approx(defaults.monthlyTotal, 480.6479166666667),
  "default monthlyTotal ≈ 480.6479166666667",
  `default monthlyTotal was ${defaults.monthlyTotal}, expected ≈ 480.6479166666667`,
);

assert(
  approx(defaults.annualTotal, 5767.775),
  "default annualTotal ≈ 5767.775",
  `default annualTotal was ${defaults.annualTotal}, expected ≈ 5767.775`,
);

assert(
  approx(defaults.monthlySavingsCeiling, 281.6479166666667),
  "default monthlySavingsCeiling ≈ 281.6479166666667",
  `default monthlySavingsCeiling was ${defaults.monthlySavingsCeiling}, expected ≈ 281.6479166666667`,
);

assert(
  approx(defaults.annualSavingsCeiling, 3379.775),
  "default annualSavingsCeiling ≈ 3379.775",
  `default annualSavingsCeiling was ${defaults.annualSavingsCeiling}, expected ≈ 3379.775`,
);

assert(
  approx(defaults.monthlySavingsCeiling, Math.max(0, defaults.monthlyTotal - 199)),
  "monthlySavingsCeiling follows Math.max(0, monthlyTotal - 199)",
  `monthlySavingsCeiling was ${defaults.monthlySavingsCeiling}, expected Math.max(0, ${defaults.monthlyTotal} - 199)`,
);

assert(
  approx(defaults.annualSavingsCeiling, Math.max(0, defaults.annualTotal - 2388)),
  "annualSavingsCeiling follows Math.max(0, annualTotal - 2388)",
  `annualSavingsCeiling was ${defaults.annualSavingsCeiling}, expected Math.max(0, ${defaults.annualTotal} - 2388)`,
);

const belowSubscription = calculateMaterialProcessCost({
  ...CALCULATOR_DEFAULTS,
  technicians: 1,
  techMinutesPerDay: 1,
  officeMinutesPerWeek: 0,
  dispatcherMinutesPerWeek: 0,
  managerMinutesPerWeek: 0,
});
assert(
  belowSubscription.monthlyTotal < STAGEVERIFY_FOUNDING_PRICE,
  "below-subscription fixture has monthlyTotal < 199",
  `below-subscription monthlyTotal was ${belowSubscription.monthlyTotal}, expected < 199`,
);
assert(
  belowSubscription.monthlySavingsCeiling === 0,
  "below-subscription fixture monthlySavingsCeiling === 0",
  `below-subscription monthlySavingsCeiling was ${belowSubscription.monthlySavingsCeiling}, expected 0`,
);
assert(
  belowSubscription.annualSavingsCeiling === 0,
  "below-subscription fixture annualSavingsCeiling === 0",
  `below-subscription annualSavingsCeiling was ${belowSubscription.annualSavingsCeiling}, expected 0`,
);

const defaultsFinite = Object.values(defaults).every((value) => Number.isFinite(value));
assert(
  defaultsFinite,
  "default calculator results are all finite",
  "default calculator results contain non-finite values",
);

assert(
  formatCurrency(0, { minimumFractionDigits: 0 }) === "$0",
  "formatCurrency(0, { minimumFractionDigits: 0 }) renders $0",
  `formatCurrency zero ceiling was "${formatCurrency(0, { minimumFractionDigits: 0 })}", expected "$0"`,
);

assert(
  formatCurrency(281.6479166666667) === "$282",
  "formatCurrency unchanged for nonzero ceiling values",
  `formatCurrency(281.6479166666667) was "${formatCurrency(281.6479166666667)}", expected "$282"`,
);

const wageSum =
  defaults.techMonthlyCost +
  defaults.officeMonthlyCost +
  defaults.dispatcherMonthlyCost +
  defaults.managerMonthlyCost;
assert(
  approx(defaults.monthlyTotal, wageSum),
  "monthlyTotal is sum of technician, office/admin, dispatcher, and manager wage costs",
  `monthlyTotal was ${defaults.monthlyTotal}, expected ${wageSum}`,
);

const doubled = calculateMaterialProcessCost({
  ...CALCULATOR_DEFAULTS,
  technicians: 10,
});
assert(
  doubled.techMonthlyHours === 22,
  "Doubling technicians from 5 to 10 doubles technician hours to 22",
  `Doubled tech hours was ${doubled.techMonthlyHours}, expected 22`,
);

assert(
  !("reductionPercent" in CALCULATOR_DEFAULTS),
  "CALCULATOR_DEFAULTS does not contain reductionPercent",
  "CALCULATOR_DEFAULTS still contains reductionPercent",
);

assert(
  !("monthlyLaborSaved" in defaults),
  "calculator results do not contain monthlyLaborSaved",
  "calculator results still contain monthlyLaborSaved",
);

assert(
  !("annualLaborSaved" in defaults),
  "calculator results do not contain annualLaborSaved",
  "calculator results still contain annualLaborSaved",
);

assert(
  !("breakEvenReductionPercent" in defaults),
  "calculator results do not contain breakEvenReductionPercent",
  "calculator results still contain breakEvenReductionPercent",
);

const techOnlyDoublingBase = {
  ...CALCULATOR_DEFAULTS,
  officeMinutesPerWeek: 0,
  dispatcherMinutesPerWeek: 0,
  managerMinutesPerWeek: 0,
};

const techOnlyFive = calculateMaterialProcessCost({
  ...techOnlyDoublingBase,
  technicians: 5,
});
const techOnlyTen = calculateMaterialProcessCost({
  ...techOnlyDoublingBase,
  technicians: 10,
});
assert(
  approx(techOnlyTen.monthlyTotal, techOnlyFive.monthlyTotal * 2),
  "tech-only fixture: doubling technicians doubles monthlyTotal",
  `tech-only monthlyTotal was ${techOnlyTen.monthlyTotal}, expected ${techOnlyFive.monthlyTotal * 2}`,
);
assert(
  approx(techOnlyTen.annualTotal, techOnlyFive.annualTotal * 2),
  "tech-only fixture: doubling technicians doubles annualTotal",
  `tech-only annualTotal was ${techOnlyTen.annualTotal}, expected ${techOnlyFive.annualTotal * 2}`,
);

const negativeInputs = calculateMaterialProcessCost({
  ...CALCULATOR_DEFAULTS,
  technicians: -5,
  techWage: NaN,
  officeWage: Infinity,
});
const negativeFinite = Object.values(negativeInputs).every((value) =>
  Number.isFinite(value),
);
assert(
  negativeFinite,
  "Negative/non-finite inputs cannot produce NaN or Infinity",
  "Negative/non-finite inputs produced invalid values",
);

assert(
  !("incidentsPerMonth" in CALCULATOR_DEFAULTS),
  "CALCULATOR_DEFAULTS does not contain incidentsPerMonth",
  "CALCULATOR_DEFAULTS still contains incidentsPerMonth",
);

assert(
  !("minutesPerIncident" in CALCULATOR_DEFAULTS),
  "CALCULATOR_DEFAULTS does not contain minutesPerIncident",
  "CALCULATOR_DEFAULTS still contains minutesPerIncident",
);

assert(
  !("incidentMonthlyCost" in defaults),
  "calculator results do not contain incidentMonthlyCost",
  "calculator results still contain incidentMonthlyCost",
);

assert(
  !("techAnnualHours" in defaults),
  "calculator results do not contain techAnnualHours",
  "calculator results still contain techAnnualHours",
);

assert(
  !("monthlyDifference" in defaults),
  "calculator results do not contain monthlyDifference",
  "calculator results still contain monthlyDifference",
);

assert(
  sanitizeNumber(-1) === 0 && sanitizeNumber(NaN) === 0 && sanitizeNumber(Infinity) === 0,
  "sanitizeNumber: negative / NaN / non-finite → 0",
  "sanitizeNumber did not normalize invalid inputs to 0",
);

/** Inputs that yield an exact monthlyTotal of 555 (tech-only). */
const exact555Base = {
  technicians: 1,
  techMinutesPerDay: 60,
  techWage: 555 / 22,
  officeWage: 0,
  officeMinutesPerWeek: 0,
  dispatcherWage: 0,
  dispatcherMinutesPerWeek: 0,
  managerWage: 0,
  managerMinutesPerWeek: 0,
};

const at555 = calculateMaterialProcessCost(exact555Base);
assert(
  at555.monthlyTotal === 555,
  "exact555 monthlyTotal === 555",
  `exact555 monthlyTotal was ${at555.monthlyTotal}, expected 555`,
);
assert(
  at555.annualTotal === 6660,
  "exact555 annualTotal === 6660",
  `exact555 annualTotal was ${at555.annualTotal}, expected 6660`,
);

const zeroTotal = calculateMaterialProcessCost({
  ...CALCULATOR_DEFAULTS,
  technicians: 0,
  techMinutesPerDay: 0,
  officeMinutesPerWeek: 0,
  dispatcherMinutesPerWeek: 0,
  managerMinutesPerWeek: 0,
});
assert(
  zeroTotal.monthlyTotal === 0,
  "zero inputs → monthlyTotal === 0",
  `monthlyTotal was ${zeroTotal.monthlyTotal}, expected 0`,
);
const zeroFinite = Object.entries(zeroTotal)
  .filter(([, value]) => value !== null)
  .every(([, value]) => Number.isFinite(value));
assert(
  zeroFinite,
  "zero monthlyTotal does not produce NaN or Infinity",
  "zero monthlyTotal produced invalid values",
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const calcSource = readFileSync(
  join(__dirname, "../src/components/sections/CostCalculator.astro"),
  "utf8",
);

const requiredCalcSourceLabels = [
  "Monthly technician hours hunting parts",
  "Monthly technician wages hunting parts",
  "Monthly office/admin wages receiving deliveries",
  "Minutes receiving or sorting deliveries per week",
  "Monthly dispatcher wages checking material",
  "Monthly manager wages receiving or sorting",
  "Estimated monthly wages out the door",
  "Estimated annual wages out the door",
  "Founding Customer Program",
  "{formatCurrency(STAGEVERIFY_FOUNDING_PRICE)}/month for the first 12 months",
  "MOST YOU COULD KEEP (CEILING)",
  'data-calc-group="potential-savings-ceiling"',
  'data-calc-equation="monthly"',
  'data-calc-equation="annual"',
  "monthlySavingsCeiling",
  "annualSavingsCeiling",
  "current monthly direct wage cost",
  "current annual direct wage cost",
  "StageVerify annual founding cost",
  "/month",
  "/year",
  "This is the most you could keep if StageVerify removed all of the paid time you entered, after the StageVerify subscription. It is a ceiling, not a forecast; the actual amount depends on how much receiving and parts-hunting time StageVerify cuts.",
  'data-calc-out="monthlyTotal"',
  'data-calc-out="annualTotal"',
  'data-calc-out="monthlySavingsCeiling"',
  'data-calc-out="annualSavingsCeiling"',
];
for (const label of requiredCalcSourceLabels) {
  assert(
    calcSource.includes(label),
    `CostCalculator.astro contains: ${label}`,
    `CostCalculator.astro missing: ${label}`,
  );
}

const absentOpportunityPatterns = [
  "POTENTIAL SAVINGS OPPORTUNITY",
  'data-calc-group="potential-savings-opportunity"',
  "data-calc-opportunity",
  "Up to",
];
for (const pattern of absentOpportunityPatterns) {
  assert(
    !calcSource.includes(pattern),
    `CostCalculator.astro absent: ${pattern}`,
    `CostCalculator.astro still contains: ${pattern}`,
  );
}

const absentReductionPatterns = [
  'type="radio"',
  'role="radiogroup"',
  'name="reductionPercent"',
  "What if you reduced",
  "less wasted time",
  "Potential labor savings",
  "monthlyLaborSaved",
  "annualLaborSaved",
];
for (const pattern of absentReductionPatterns) {
  assert(
    !calcSource.includes(pattern),
    `CostCalculator.astro absent: ${pattern}`,
    `CostCalculator.astro still contains: ${pattern}`,
  );
}

const absentCalcSourcePatterns = [
  "Total monthly direct wage cost",
  "Total annual direct wage cost",
  "Selected reduction scenario",
  "Potential monthly labor saved",
  "Potential annual labor saved",
  "Approx. reduction needed to cover $199/month",
  "data-calc-break-even",
  'data-calc-group="break-even"',
  'data-calc-group="selected-reduction"',
  "breakEvenRounded",
];
for (const pattern of absentCalcSourcePatterns) {
  assert(
    !calcSource.includes(pattern),
    `CostCalculator.astro absent: ${pattern}`,
    `CostCalculator.astro still contains: ${pattern}`,
  );
}

console.log(`\nResults: ${passes.length} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
