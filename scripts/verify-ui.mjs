#!/usr/bin/env node
/**
 * Ephemeral UI smoke test for StageVerify marketing site.
 * Usage: node scripts/verify-ui.mjs [baseUrl]
 * Default: http://localhost:4321 (production build preview)
 */
import { chromium, devices } from "playwright";
import {
  CALCULATOR_DEFAULTS,
  STAGEVERIFY_FOUNDING_PRICE,
  calculateMaterialProcessCost,
  formatCurrency,
} from "../src/utils/costCalculator.js";

const baseUrl =
  process.argv[2]?.replace(/\/$/, "") || "http://localhost:4321";

const HEADLINE = "The material may not be lost. Your labor is.";
const EYEBROW = "DELIVERY → STAGING → PICKUP";
const DESCRIPTION = "Stop wasting labor looking for job materials.";
const SUPPORTING_DESCRIPTION =
  "StageVerify tracks vendor deliveries from shop arrival to field pickup. See what arrived, where it was staged, what is missing, and what is ready.";
const POSITIONING =
  "Know what is ready before dispatch sends a technician to pick it up.";
const SEO_DESCRIPTION = SUPPORTING_DESCRIPTION;

const sections = [
  { id: "labor-cost", heading: "Receiving a delivery still costs money." },
  {
    id: "cost-calculator",
    heading: "How Much Paid Time Goes Into Receiving Deliveries and Hunting for Parts?",
  },
  { id: "how-it-works", heading: "One clear trail from delivery to pickup." },
  {
    id: "catch-all",
    heading: "UPS, FedEx, and USPS drops still need a clear path.",
  },
  {
    id: "features",
    heading: "Four ways to spend less paid time on job material.",
  },
  {
    id: "who-its-for",
    heading:
      "Built for HVAC service shops that receive and stage job materials before field pickup — especially shops that stage by job.",
  },
  { id: "prove-value", heading: "See whether the shop is spending less time on material." },
  { id: "pricing", heading: "Founding Customer Program" },
  { id: "faq", heading: "Straight answers for the shop." },
  { id: "demo", heading: "Request a demo" },
];

const removedIds = ["problem", "low-friction", "scale"];

const removedStrings = [
  "The handoff is where materials get lost.",
  "Start with one shop. Expand to every branch.",
  "Grow with you",
  "Secure Google-authenticated access",
  "StageVerify captures the order",
  "StageVerify tells them where it goes",
  "Dispatch knows when it is ready",
  "The technician gets a guided pickup",
  "Material-related search/coordination incidents per month",
  "Monthly incident coordination cost",
  "being designed",
  "No customer counts are shown here",
  "A restrained look at planned pricing",
  "this is not an offer to start today",
  "Scan QR → PIN → find delivery.",
  "Scan → PIN → released job → staging locations.",
  "Scan → PIN → Find Delivery → Stage → Complete",
  "Scan → PIN → Find Job → Collect → Complete Pickup",
  "No. Vendors and technicians scan a QR code and enter a PIN—no app installation or account setup required.",
  "Show technicians where released material is staged.",
  "Confirm pickup and return locations to available status.",
  "Pickup is recorded and those staging locations become available again.",
  "Catch-All items reconciled",
  "UPS, FedEx, USPS, and unexpected deliveries can go to a Catch-All area until they are identified and staged.",
  "Stop Losing Job Materials Between Delivery and Pickup",
  "POTENTIAL SAVINGS CEILING",
  "Estimated material-handling time saved",
  "Material-handling time trend",
  "operational trends",
  "Material staging control without a full warehouse system.",
  "Give operations a clear material trail",
  "Clear answers for operations teams.",
  "StageVerify should earn its place in your shop.",
  "Not every delivery follows the normal vendor workflow.",
  "Built to keep everyday use simple for vendors and field crews.",
  "Similar trade contractors",
  "When can I request a demo?",
  "Demo scheduling is coming soon.",
];

const navLabels = ["How It Works", "Capabilities", "Who It's For", "Pricing"];

const howItWorksTitles = [
  "Material arrives",
  "The office stays informed",
  "Technicians know where to go",
  "Pickup closes the loop",
];

const howItWorksDescriptions = [
  "Delivered material stays connected to the job and staged correctly.",
  "Delivery status, missing items, and readiness stay visible without relying on phone calls or memory.",
  "Technicians get clear pickup guidance for material assigned to their jobs.",
  "Pickup is recorded so material status stays current and the shop stays organized.",
];

const howItWorksIntro =
  "StageVerify keeps the material handoff clear from vendor delivery to technician pickup.";

const howItWorksBridge = "Who’s on the trail";

const roleCardTexts = [
  "Check in the delivery. No app.",
  "Get pickup guidance for the job. No app.",
  "See what arrived, what’s missing, what’s ready.",
];

const roleCardNames = ["Vendor", "Technician", "Office"];

const supersededRoleCardTexts = [
  "Simple check-in.",
  "No app installation.",
  "Clear pickup guidance.",
  "Office login — vendors and techs don’t need an app.",
];

const primaryCapabilityTitles = [
  "Delivery and staging visibility",
  "Job readiness, missing items, and backorders",
  "Guided technician pickup",
  "Catch-All for unexpected carriers",
];

const primaryCapabilityDescriptions = [
  "See what arrived, which job it belongs to, and where it was staged.",
  "Know what is ready for pickup and what still needs attention before the repair or install.",
  "Send technicians to the right staged material without a hunt through the shop.",
  "Keep UPS, FedEx, USPS, and other unexpected drops visible until they are identified and staged.",
];

const secondaryCapabilityItems = [
  "Multiple vendors and deliveries tied to the same job",
  "Vendor updates kept with the material trail",
  "Pickup verification that closes the handoff",
];

const whoItsForIntro = "It is not a full warehouse WMS.";

const whoItsForSecondary =
  "Also fits other trades with the same workflow: electrical, plumbing, mechanical, controls, and fire protection.";

const tradeLabelsToAssertAbsent = [
  "Electrical",
  "Plumbing",
  "Mechanical",
  "Controls",
  "Fire Protection",
  "Similar trade contractors",
];

const qualifierLines = [
  "vendors regularly deliver job materials to your shop",
  "your shop stages material by job before field pickup",
  "technicians spend time hunting parts or asking where material was staged",
  "jobs involve multiple deliveries, vendors, missing items, or backorders",
  "expensive office, shop, manager, or technician time is spent receiving, locating, checking, or sorting material to jobs",
];

const laborReceivingCostParagraph =
  "Receiving isn't free: figuring out which job a delivery belongs to and staging it is paid office, shop, or manager time—even when someone is there to receive it.";

const laborProductScopeParagraph =
  "StageVerify reduces the paid time spent figuring out what arrived, where it is, what is missing, and what is ready for the repair or install—not just the time it takes to find one part.";

const laborCalculatorLeadInParagraph =
  "Add the time spent receiving deliveries and hunting parts below to see how much direct wage money may be going out the door.";

const customerFitParagraph =
  "Use your own wages and workflow to decide whether StageVerify makes sense for your shop. It fits best when paid time is disappearing into receiving drops, sorting material to jobs, checking readiness, or hunting parts.";

const exclusionConcepts = [
  "payroll burden",
  "vehicle costs",
  "return trips",
  "overtime",
  "lost productive or billable capacity",
  "customer delays",
];

const proveValueIntro =
  "Track deliveries, pickups, backorders, missing items, and estimated paid time so managers can compare shop activity with their own wages and the StageVerify subscription.";

const calculatorDisclaimer =
  "Estimates are based on the time and wage assumptions you enter. They do not include payroll burden, vehicle costs, return trips, overtime, lost billable capacity, customer delays, or the value of additional technician capacity.";

const managementPreviewLabels = [
  "Illustrative example",
  "Example monthly value snapshot",
  "Based on example labor assumptions",
];

const managementMetricValues = ["48", "37", "6", "9.4 hrs"];
const managementMetricLabels = [
  "Deliveries processed",
  "Pickups completed",
  "Backorders identified",
  "Estimated receiving and parts-hunt time",
];

const lineChartTitle = "Receiving and parts-hunt time";
const lineChartValues = ["16.2", "14.8", "13.1", "11.7", "10.3", "9.4"];
const lineChartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const barChartTitle = "Material issues identified";
const barChartCategories = [
  { label: "Backorders", value: "6" },
  { label: "Incomplete deliveries", value: "3" },
  { label: "Other material issues", value: "4" },
];

const illustrativeDataNote =
  "Illustrative example only. This is not customer data and does not represent a customer claim or promised result.";

const demoEyebrow = "Request a demo";
const demoSubcopy = "Tell us how to reach you. We’ll follow up to schedule.";
const demoMessagePlaceholder = "Anything we should know before we follow up?";

const calcInputLabels = [
  "Minutes hunting parts per workday",
  "Minutes receiving or sorting deliveries per week",
  "Minutes checking or coordinating material per week",
  "Minutes receiving, checking, or sorting per week",
];

const calcResultLabels = [
  "Monthly technician hours hunting parts",
  "Monthly technician wages hunting parts",
  "Monthly office/admin wages receiving deliveries",
  "Monthly dispatcher wages checking material",
  "Monthly manager wages receiving or sorting",
  "Estimated monthly wages out the door",
  "Estimated annual wages out the door",
];

const calcResultGroups = [
  "current-process",
  "stageverify-cost",
  "potential-savings-ceiling",
];

const alignmentViewports = [
  { name: "tablet-align", width: 768, height: 1024 },
  { name: "desktop-align", width: 1280, height: 800 },
];

const techAlignInputIds = ["calc-technicians", "calc-tech-wage", "calc-tech-minutes"];

const pricingValues = [
  "Coming Soon",
  "$199/month for the first 12 months",
  "Planned standard price: $399/month",
  "Up to 30 configurable staging locations",
  "No long-term commitment",
  "Cancel anytime",
];

const faqQuestions = [
  "What is StageVerify?",
  "Does it replace my current field-service software?",
  "Do vendors or technicians need accounts or apps?",
  "What happens with UPS/FedEx/USPS deliveries?",
  "Who is StageVerify best for?",
];

const calcInputIds = [
  "calc-technicians",
  "calc-tech-wage",
  "calc-tech-minutes",
  "calc-office-wage",
  "calc-office-minutes",
  "calc-dispatcher-wage",
  "calc-dispatcher-minutes",
  "calc-manager-wage",
  "calc-manager-minutes",
];

const viewports = [
  { name: "mobile", width: 375, height: 812, full: true },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024, full: true },
  { name: "desktop", width: 1280, height: 800, full: true },
];

const mobileHeaderViewports = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-390", width: 390, height: 844 },
];

const narrowCalcViewports = [
  { name: "mobile-320-calc", width: 320, height: 812 },
  { name: "mobile-375-calc", width: 375, height: 812 },
];

const HEADER_OFFSET = { min: 56, max: 120 };

const failures = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
}

const FAVICON_MIN_HEIGHT_FILL = 0.52;
const FAVICON_MIN_WIDTH_FILL = 0.78;
const FAVICON_MAX_HEIGHT_FILL = 0.72;
const FAVICON_MAX_WIDTH_FILL = 0.94;
const FAVICON_MIN_MAX_FILL = 0.85;
const FAVICON_MAX_MAX_FILL = 0.94;
const FAVICON_MIN_INK_RATIO = 0.1;

async function analyzeIconPixels(page, url) {
  return page.evaluate(
    async ({
      iconUrl,
      minHeightFill,
      minWidthFill,
      maxHeightFill,
      maxWidthFill,
      minInkRatio,
      minMaxFill,
      maxMaxFill,
    }) => {
      const isBackground = (r, g, b) => {
        if (r >= 248 && g >= 248 && b >= 248) return true;
        if (r <= 20 && g <= 45 && b <= 65) return true;
        return false;
      };

      const img = new Image();
      img.decoding = "sync";
      img.src = iconUrl;
      await img.decode();

      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, width, height);

      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      let ink = 0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 16) continue;
          if (isBackground(r, g, b)) continue;

          ink++;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      if (ink === 0) {
        return {
          width,
          height,
          heightFill: 0,
          widthFill: 0,
          inkRatio: 0,
          ok: false,
        };
      }

      const heightFill = (maxY - minY + 1) / height;
      const widthFill = (maxX - minX + 1) / width;
      const inkRatio = ink / (width * height);
      const maxFill = Math.max(heightFill, widthFill);

      return {
        width,
        height,
        heightFill,
        widthFill,
        inkRatio,
        maxFill,
        ok:
          heightFill >= minHeightFill &&
          widthFill >= minWidthFill &&
          heightFill <= maxHeightFill &&
          widthFill <= maxWidthFill &&
          maxFill >= minMaxFill &&
          maxFill <= maxMaxFill &&
          inkRatio >= minInkRatio,
      };
    },
    {
      iconUrl: url,
      minHeightFill: FAVICON_MIN_HEIGHT_FILL,
      minWidthFill: FAVICON_MIN_WIDTH_FILL,
      maxHeightFill: FAVICON_MAX_HEIGHT_FILL,
      maxWidthFill: FAVICON_MAX_WIDTH_FILL,
      minInkRatio: FAVICON_MIN_INK_RATIO,
      minMaxFill: FAVICON_MIN_MAX_FILL,
      maxMaxFill: FAVICON_MAX_MAX_FILL,
    },
  );
}

async function checkFavicons(page) {
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel*="icon"]')].map((el) => ({
      rel: el.getAttribute("rel") || "",
      href: el.href,
      sizes: el.getAttribute("sizes") || "",
      type: el.getAttribute("type") || "",
    })),
  );

  const png32 = links.find((l) => l.sizes === "32x32");
  const png16 = links.find((l) => l.sizes === "16x16");
  const svgIcon = links.find((l) => l.type === "image/svg+xml");
  const apple = links.find((l) => l.rel === "apple-touch-icon");

  if (svgIcon && png32 && png16 && apple) {
    pass("[favicon] Head links for SVG, 32/16 PNG, and apple-touch");
  } else {
    fail("[favicon] Missing expected head icon links");
  }

  if (svgIcon?.href) {
    const svgRes = await page.request.get(svgIcon.href);
    if (svgRes.ok()) pass("[favicon] favicon.svg loads (200)");
    else fail(`[favicon] favicon.svg failed (${svgRes.status()})`);
  }

  const assets = [
    { label: "favicon-32x32.png", url: png32?.href, expected: 32 },
    { label: "favicon-16x16.png", url: png16?.href, expected: 16 },
    { label: "apple-touch-icon.png", url: apple?.href, expected: 180 },
  ];

  for (const asset of assets) {
    if (!asset.url) {
      fail(`[favicon] ${asset.label} href missing`);
      continue;
    }
    const res = await page.request.get(asset.url);
    if (res.ok()) pass(`[favicon] ${asset.label} loads (${res.status()})`);
    else fail(`[favicon] ${asset.label} failed (${res.status()})`);
  }

  for (const size of [16, 32]) {
    const link = size === 32 ? png32 : png16;
    if (!link?.href) continue;

    const metrics = await analyzeIconPixels(page, link.href);
    const pct = (n) => `${Math.round(n * 100)}%`;

    if (metrics.width !== size || metrics.height !== size) {
      fail(
        `[favicon] ${size}x${size} dimensions ${metrics.width}x${metrics.height} (expected ${size}x${size})`,
      );
    } else {
      pass(`[favicon] ${size}x${size} dimensions correct`);
    }

    if (metrics.ok) {
      pass(
        `[favicon] ${size}x${size} mark fill height ${pct(metrics.heightFill)}, width ${pct(metrics.widthFill)}, max ${pct(metrics.maxFill)}, ink ${pct(metrics.inkRatio)}`,
      );
    } else {
      fail(
        `[favicon] ${size}x${size} mark out of balance — height ${pct(metrics.heightFill)}, width ${pct(metrics.widthFill)}, max ${pct(metrics.maxFill)}, ink ${pct(metrics.inkRatio)} (target max ${pct(FAVICON_MIN_MAX_FILL)}–${pct(FAVICON_MAX_MAX_FILL)})`,
      );
    }
  }

  const previewUrl = `${baseUrl}/favicon-preview/`;
  const previewRes = await page.request.get(previewUrl);
  if (previewRes.ok()) pass("[favicon] favicon-preview/index.html loads (200)");
  else
    fail(
      `[favicon] favicon-preview/index.html failed (${previewRes.status()})`,
    );
}

async function waitForScrollToSettle(page) {
  let previous = null;
  let stableSamples = 0;
  const deadline = Date.now() + 2000;

  while (Date.now() < deadline) {
    const current = await page.evaluate(() => window.scrollY);

    if (previous !== null && Math.abs(current - previous) < 0.5) {
      stableSamples += 1;
      if (stableSamples >= 2) return;
    } else {
      stableSamples = 0;
    }

    previous = current;
    await page.waitForTimeout(50);
  }

  throw new Error("Page scroll did not settle within 2000ms");
}

async function assertElementInViewport(page, locator, label, viewportWidth) {
  const box = await locator.boundingBox();
  if (!box) {
    fail(`${label} has no bounding box`);
    return;
  }
  const within =
    box.x >= -0.5 &&
    box.y >= -0.5 &&
    box.x + box.width <= viewportWidth + 0.5 &&
    box.height > 0 &&
    box.width > 0;
  if (within) pass(label);
  else
    fail(
      `${label} outside viewport (${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}×${Math.round(box.height)} in ${viewportWidth}px)`,
    );
}

async function checkMobileHeader(browser, { name, width, height }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  try {
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      fail(`[${name}] Page failed to load (${response?.status()})`);
      return;
    }
    pass(`[${name}] Page loads`);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    if (scrollWidth <= clientWidth + 1)
      pass(`[${name}] No horizontal overflow`);
    else
      fail(
        `[${name}] Horizontal overflow (${scrollWidth}px > ${clientWidth}px)`,
      );

    const headerBar = page.locator("header > div").first();
    const headerHeight = await headerBar.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    if (headerHeight >= 60 && headerHeight <= 64)
      pass(`[${name}] Header height ${Math.round(headerHeight)}px`);
    else
      fail(
        `[${name}] Header height ${Math.round(headerHeight)}px (expected 60–64px)`,
      );

    const padding = await headerBar.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        left: parseFloat(style.paddingLeft),
        right: parseFloat(style.paddingRight),
      };
    });
    if (
      padding.left >= 14 &&
      padding.left <= 18 &&
      padding.right >= 14 &&
      padding.right <= 18
    ) {
      pass(`[${name}] Header side padding ~16px`);
    } else {
      fail(
        `[${name}] Header padding ${padding.left}px/${padding.right}px (expected ~16px)`,
      );
    }

    const logo = page.locator('header img[alt="StageVerify"]').first();
    const hamburger = page.locator('summary[aria-label="Open menu"]').first();
    const topDemoCta = page.locator("header > div > .hidden.sm\\:block").first();

    if (await logo.isVisible()) pass(`[${name}] Header logo visible`);
    else fail(`[${name}] Header logo hidden`);

    if (await hamburger.isVisible()) pass(`[${name}] Hamburger visible`);
    else fail(`[${name}] Hamburger hidden`);

    await assertElementInViewport(
      page,
      logo,
      `[${name}] Logo within viewport`,
      width,
    );
    await assertElementInViewport(
      page,
      hamburger,
      `[${name}] Hamburger within viewport`,
      width,
    );

    if (await topDemoCta.isHidden())
      pass(`[${name}] Top-level header demo CTA hidden below 640px`);
    else fail(`[${name}] Top-level header demo CTA should be hidden below 640px`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await hamburger.click();

    const menuPanel = page.locator("header details > div").first();
    const menuDemoCta = page
      .locator("header details nav [data-demo-cta]")
      .filter({ hasText: "Request Demo" });

    if (await menuPanel.isVisible())
      pass(`[${name}] Mobile menu panel visible`);
    else fail(`[${name}] Mobile menu panel not visible`);

    if (await menuDemoCta.isVisible())
      pass(`[${name}] Mobile menu Request Demo visible`);
    else fail(`[${name}] Mobile menu Request Demo hidden`);

    await assertElementInViewport(
      page,
      menuPanel,
      `[${name}] Mobile menu panel within viewport`,
      width,
    );
    await assertElementInViewport(
      page,
      menuDemoCta,
      `[${name}] Mobile menu Request Demo within viewport`,
      width,
    );
  } finally {
    await context.close();
  }
}

const ceilingExplanation =
  "This is the most you could keep if StageVerify removed all of the paid time you entered, after the StageVerify subscription. It is a ceiling, not a forecast; the actual amount depends on how much receiving and parts-hunting time StageVerify cuts.";

const annualFoundingCost = STAGEVERIFY_FOUNDING_PRICE * 12;

const formatCeilingCurrency = (value) =>
  value === 0
    ? formatCurrency(0, { minimumFractionDigits: 0 })
    : formatCurrency(value);

function normalizeCalcText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function approx(actual, expected, tolerance = 0.5) {
  return Math.abs(actual - expected) <= tolerance;
}

async function checkCalculatorDefaults(page, name) {
  if ((await page.locator("#cost-calculator-form").count()) === 0) {
    fail(`[${name}] Missing #cost-calculator-form`);
    return;
  }
  pass(`[${name}] Cost calculator form present`);

  await page.locator("#cost-calculator").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  for (const id of calcInputIds) {
    if ((await page.locator(`#${id}`).count()) > 0)
      pass(`[${name}] Calculator input #${id} present`);
    else fail(`[${name}] Missing calculator input #${id}`);
  }

  if ((await page.locator("#calc-incidents").count()) === 0)
    pass(`[${name}] #calc-incidents removed`);
  else fail(`[${name}] #calc-incidents should not exist`);

  if ((await page.locator("#calc-incident-minutes").count()) === 0)
    pass(`[${name}] #calc-incident-minutes removed`);
  else fail(`[${name}] #calc-incident-minutes should not exist`);

  if ((await page.locator('input[name="incidentsPerMonth"]').count()) === 0)
    pass(`[${name}] incidentsPerMonth input removed`);
  else fail(`[${name}] incidentsPerMonth input should not exist`);

  if ((await page.locator('input[name="minutesPerIncident"]').count()) === 0)
    pass(`[${name}] minutesPerIncident input removed`);
  else fail(`[${name}] minutesPerIncident input should not exist`);

  const currentProcessGroup = page.locator('[data-calc-group="current-process"]');
  const ceilingGroup = page.locator('[data-calc-group="potential-savings-ceiling"]');
  const monthlyEquation = ceilingGroup.locator('[data-calc-equation="monthly"]');
  const annualEquation = ceilingGroup.locator('[data-calc-equation="annual"]');

  const techHoursOut = currentProcessGroup.locator('[data-calc-out="techMonthlyHours"]');
  const techCostOut = currentProcessGroup.locator('[data-calc-out="techMonthlyCost"]');
  const officeCostOut = currentProcessGroup.locator('[data-calc-out="officeMonthlyCost"]');
  const dispatcherCostOut = currentProcessGroup.locator('[data-calc-out="dispatcherMonthlyCost"]');
  const managerCostOut = currentProcessGroup.locator('[data-calc-out="managerMonthlyCost"]');
  const monthlyTotalOut = currentProcessGroup.locator('[data-calc-out="monthlyTotal"]');
  const annualTotalOut = currentProcessGroup.locator('[data-calc-out="annualTotal"]');
  const monthlyLaborOperand = monthlyEquation.locator('[data-calc-out="monthlyTotal"]');
  const annualLaborOperand = annualEquation.locator('[data-calc-out="annualTotal"]');
  const monthlyCeilingOut = monthlyEquation.locator('[data-calc-out="monthlySavingsCeiling"]');
  const annualCeilingOut = annualEquation.locator('[data-calc-out="annualSavingsCeiling"]');
  const monthlySvOperand = monthlyEquation.locator("[data-calc-sv-monthly]");
  const annualSvOperand = annualEquation.locator("[data-calc-sv-annual]");

  const defaultTechHours = (await techHoursOut.textContent())?.trim() ?? "";
  const defaultTechCost = (await techCostOut.textContent())?.trim() ?? "";
  const defaultOfficeCost = (await officeCostOut.textContent())?.trim() ?? "";
  const defaultDispatcherCost = (await dispatcherCostOut.textContent())?.trim() ?? "";
  const defaultManagerCost = (await managerCostOut.textContent())?.trim() ?? "";
  const defaultMonthlyTotal = (await monthlyTotalOut.textContent())?.trim() ?? "";
  const defaultAnnualTotal = (await annualTotalOut.textContent())?.trim() ?? "";

  if (defaultTechHours.includes("11"))
    pass(`[${name}] Default monthly technician hours contains 11`);
  else fail(`[${name}] Default tech hours expected 11, got "${defaultTechHours}"`);

  if ((await page.locator('[data-calc-out="techAnnualHours"]').count()) === 0)
    pass(`[${name}] Annual technician hours output removed`);
  else fail(`[${name}] Annual technician hours output should not exist`);

  if ((await page.locator('[data-calc-out="monthlyDifference"]').count()) === 0)
    pass(`[${name}] monthlyDifference output removed`);
  else fail(`[${name}] monthlyDifference output should not exist`);

  if (defaultTechCost.includes("$330"))
    pass(`[${name}] Default technician monthly wages contains $330`);
  else fail(`[${name}] Default tech cost expected $330, got "${defaultTechCost}"`);

  if (defaultOfficeCost.includes("$36.08"))
    pass(`[${name}] Default office monthly wages contains $36.08`);
  else fail(`[${name}] Default office cost expected $36.08, got "${defaultOfficeCost}"`);

  if (defaultDispatcherCost.includes("$46.91"))
    pass(`[${name}] Default dispatcher monthly wages contains $46.91`);
  else fail(`[${name}] Default dispatcher cost expected $46.91, got "${defaultDispatcherCost}"`);

  if (defaultManagerCost.includes("$67.66"))
    pass(`[${name}] Default manager monthly wages contains $67.66`);
  else fail(`[${name}] Default manager cost expected $67.66, got "${defaultManagerCost}"`);

  if (defaultMonthlyTotal.includes("$481"))
    pass(`[${name}] Default monthly total contains $481`);
  else fail(`[${name}] Default monthly total expected $481, got "${defaultMonthlyTotal}"`);

  if (defaultAnnualTotal.includes("$5,768"))
    pass(`[${name}] Default annual total contains $5,768`);
  else fail(`[${name}] Default annual total expected $5,768, got "${defaultAnnualTotal}"`);

  const calcBody = await page.locator("#cost-calculator").innerText();
  const requiredCalcLabels = [
    "Estimated monthly wages out the door",
    "Estimated annual wages out the door",
    "Founding Customer Program",
    "MOST YOU COULD KEEP (CEILING)",
    "current monthly direct wage cost",
    "current annual direct wage cost",
  ];
  for (const label of requiredCalcLabels) {
    if (calcBody.includes(label))
      pass(`[${name}] Calculator label present: ${label}`);
    else fail(`[${name}] Missing calculator label: ${label}`);
  }

  for (const label of calcInputLabels) {
    if (calcBody.includes(label))
      pass(`[${name}] Calculator input label present: ${label}`);
    else fail(`[${name}] Missing calculator input label: ${label}`);
  }

  for (const label of calcResultLabels) {
    if (calcBody.includes(label))
      pass(`[${name}] Calculator result label present: ${label}`);
    else fail(`[${name}] Missing calculator result label: ${label}`);
  }

  const removedCalcPhrases = [
    "What if you reduced",
    "less wasted time",
    "Potential labor savings",
    "Potential monthly direct labor savings",
    "Potential annual direct labor savings",
    "POTENTIAL SAVINGS OPPORTUNITY",
    "Up to $481/month",
    "Up to $5,768/year",
    "Up to",
    "25%",
    "50%",
    "75%",
  ];
  for (const phrase of removedCalcPhrases) {
    if (!calcBody.includes(phrase))
      pass(`[${name}] Removed calculator phrase absent: ${phrase}`);
    else fail(`[${name}] Removed calculator phrase still present: ${phrase}`);
  }

  const defaultMonthlyLaborOperand = normalizeCalcText(
    (await monthlyLaborOperand.textContent()) ?? "",
  );
  const defaultAnnualLaborOperand = normalizeCalcText(
    (await annualLaborOperand.textContent()) ?? "",
  );
  const defaultMonthlySvOperand = normalizeCalcText(
    (await monthlySvOperand.textContent()) ?? "",
  );
  const defaultAnnualSvOperand = normalizeCalcText(
    (await annualSvOperand.textContent()) ?? "",
  );
  const defaultMonthlyCeiling = normalizeCalcText(
    (await monthlyCeilingOut.textContent()) ?? "",
  );
  const defaultAnnualCeiling = normalizeCalcText(
    (await annualCeilingOut.textContent()) ?? "",
  );
  const defaultMonthlyEquation = normalizeCalcText(
    (await monthlyEquation.innerText()) ?? "",
  );
  const defaultAnnualEquation = normalizeCalcText(
    (await annualEquation.innerText()) ?? "",
  );

  if (defaultMonthlyLaborOperand.includes("$481"))
    pass(`[${name}] Default monthly labor operand contains $481`);
  else
    fail(
      `[${name}] Default monthly labor operand expected $481, got "${defaultMonthlyLaborOperand}"`,
    );

  if (defaultMonthlySvOperand.includes("$199"))
    pass(`[${name}] Default monthly StageVerify operand contains $199`);
  else
    fail(
      `[${name}] Default monthly StageVerify operand expected $199, got "${defaultMonthlySvOperand}"`,
    );

  if (defaultMonthlyCeiling.includes("$282"))
    pass(`[${name}] Default monthly ceiling result contains $282`);
  else
    fail(
      `[${name}] Default monthly ceiling result expected $282, got "${defaultMonthlyCeiling}"`,
    );

  if (defaultAnnualLaborOperand.includes("$5,768"))
    pass(`[${name}] Default annual labor operand contains $5,768`);
  else
    fail(
      `[${name}] Default annual labor operand expected $5,768, got "${defaultAnnualLaborOperand}"`,
    );

  if (defaultAnnualSvOperand.includes("$2,388"))
    pass(`[${name}] Default annual StageVerify operand contains $2,388`);
  else
    fail(
      `[${name}] Default annual StageVerify operand expected $2,388, got "${defaultAnnualSvOperand}"`,
    );

  if (defaultAnnualCeiling.includes("$3,380"))
    pass(`[${name}] Default annual ceiling result contains $3,380`);
  else
    fail(
      `[${name}] Default annual ceiling result expected $3,380, got "${defaultAnnualCeiling}"`,
    );

  if (defaultMonthlyEquation.includes("−") && defaultMonthlyEquation.includes("="))
    pass(`[${name}] Monthly equation shows subtraction and equality operators`);
  else fail(`[${name}] Monthly equation missing visible − or = operators`);

  if (defaultAnnualEquation.includes("−") && defaultAnnualEquation.includes("="))
    pass(`[${name}] Annual equation shows subtraction and equality operators`);
  else fail(`[${name}] Annual equation missing visible − or = operators`);

  if (defaultMonthlyEquation.includes("/month"))
    pass(`[${name}] Monthly equation result suffix /month visible`);
  else fail(`[${name}] Monthly equation missing /month suffix`);

  if (defaultAnnualEquation.includes("/year"))
    pass(`[${name}] Annual equation result suffix /year visible`);
  else fail(`[${name}] Annual equation missing /year suffix`);

  const ceilingText = normalizeCalcText((await ceilingGroup.innerText()) ?? "");
  if (ceilingText.includes(ceilingExplanation))
    pass(`[${name}] Ceiling explanation present beneath equations`);
  else fail(`[${name}] Ceiling explanation missing or incorrect`);

  if ((await page.locator("#cost-calculator input[type='radio']").count()) === 0)
    pass(`[${name}] No radio inputs in calculator`);
  else fail(`[${name}] Calculator still has radio inputs`);

  if ((await page.locator('[role="radiogroup"]').count()) === 0)
    pass(`[${name}] No radiogroup in calculator`);
  else fail(`[${name}] Calculator still has radiogroup`);

  if ((await page.locator('[data-calc-opportunity]').count()) === 0)
    pass(`[${name}] [data-calc-opportunity] absent`);
  else fail(`[${name}] [data-calc-opportunity] should not exist`);

  if ((await page.locator('[data-calc-group="potential-savings-opportunity"]').count()) === 0)
    pass(`[${name}] data-calc-group="potential-savings-opportunity" absent`);
  else fail(`[${name}] data-calc-group="potential-savings-opportunity" should not exist`);

  if ((await page.locator('[data-calc-out="monthlyLaborSaved"]').count()) === 0)
    pass(`[${name}] monthlyLaborSaved output removed`);
  else fail(`[${name}] monthlyLaborSaved output should not exist`);

  if ((await page.locator('[data-calc-out="annualLaborSaved"]').count()) === 0)
    pass(`[${name}] annualLaborSaved output removed`);
  else fail(`[${name}] annualLaborSaved output should not exist`);

  if (calcBody.includes(calculatorDisclaimer))
    pass(`[${name}] Calculator disclaimer exact`);
  else fail(`[${name}] Calculator disclaimer missing or incorrect`);

  if (calcBody.includes("$199/month for the first 12 months"))
    pass(`[${name}] $199/month for the first 12 months present in calculator`);
  else fail(`[${name}] $199/month for the first 12 months missing from calculator`);

  const groupOrder = await page.locator("[data-calc-group]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-calc-group")),
  );
  if (JSON.stringify(groupOrder) === JSON.stringify(calcResultGroups))
    pass(`[${name}] Calculator result groups in correct order`);
  else
    fail(`[${name}] Calculator group order was ${JSON.stringify(groupOrder)}, expected ${JSON.stringify(calcResultGroups)}`);

  if ((await page.locator("[data-calc-break-even]").count()) === 0)
    pass(`[${name}] [data-calc-break-even] absent`);
  else fail(`[${name}] [data-calc-break-even] should not exist`);

  if ((await page.locator('[data-calc-group="break-even"]').count()) === 0)
    pass(`[${name}] data-calc-group="break-even" absent`);
  else fail(`[${name}] data-calc-group="break-even" should not exist`);

  const obsoleteCalcLabels = [
    "Total monthly direct wage cost",
    "Total annual direct wage cost",
    "Selected reduction scenario",
    "Potential monthly labor saved",
    "Potential annual labor saved",
    "Approx. reduction needed to cover $199/month",
  ];
  for (const label of obsoleteCalcLabels) {
    if (!calcBody.includes(label))
      pass(`[${name}] Obsolete calculator label absent: ${label}`);
    else fail(`[${name}] Obsolete calculator label still present: ${label}`);
  }

  const forbiddenCalcPhrases = [
    "Estimated Difference",
    "Estimated Savings",
    "monthly difference",
    "monthly savings",
    "labor recovered",
    "recovered minus StageVerify",
    "Annual technician hours",
    "break-even",
    "break even",
    "ROI",
    "net savings",
    "guaranteed savings",
  ];
  for (const phrase of forbiddenCalcPhrases) {
    if (!calcBody.includes(phrase))
      pass(`[${name}] Forbidden calculator phrase absent: ${phrase}`);
    else fail(`[${name}] Forbidden calculator phrase present: ${phrase}`);
  }

  if (!calcBody.match(/\brecovered\b/i))
    pass(`[${name}] No visible use of recovered`);
  else fail(`[${name}] Visible recovered wording still present`);

  if ((await page.locator("[data-calc-results] .text-emerald-600, [data-calc-results] .text-red-600").count()) === 0)
    pass(`[${name}] No green/red net-result state`);
  else fail(`[${name}] Green/red net-result styling present`);

  await page.locator("#cost-calculator").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await page.locator("#calc-technicians").fill("10");
  await page.locator("#calc-technicians").dispatchEvent("input");
  const doubledTechHours = (await techHoursOut.textContent())?.trim() ?? "";
  if (doubledTechHours.includes("22"))
    pass(`[${name}] Doubled technicians updates monthly technician hours to 22`);
  else
    fail(`[${name}] Doubled tech hours expected 22, got "${doubledTechHours}"`);

  await page.locator("#calc-technicians").fill("5");
  await page.locator("#calc-technicians").dispatchEvent("input");

  await page.locator("#calc-office-minutes").fill("0");
  await page.locator("#calc-dispatcher-minutes").fill("0");
  await page.locator("#calc-manager-minutes").fill("0");
  await page.locator("#calc-office-minutes").dispatchEvent("input");

  await page.locator("#calc-technicians").fill("5");
  await page.locator("#calc-technicians").dispatchEvent("input");
  await page.waitForTimeout(100);

  const fiveTechMonthlyTotal = (await monthlyTotalOut.textContent())?.trim() ?? "";
  const fiveTechAnnualTotal = (await annualTotalOut.textContent())?.trim() ?? "";
  const fiveTechMonthlyLaborOperand = normalizeCalcText(
    (await monthlyLaborOperand.textContent()) ?? "",
  );
  const fiveTechAnnualLaborOperand = normalizeCalcText(
    (await annualLaborOperand.textContent()) ?? "",
  );
  const fiveTechMonthlyCeiling = normalizeCalcText(
    (await monthlyCeilingOut.textContent()) ?? "",
  );
  const fiveTechAnnualCeiling = normalizeCalcText(
    (await annualCeilingOut.textContent()) ?? "",
  );

  const expectedFive = calculateMaterialProcessCost({
    ...CALCULATOR_DEFAULTS,
    technicians: 5,
    officeMinutesPerWeek: 0,
    dispatcherMinutesPerWeek: 0,
    managerMinutesPerWeek: 0,
  });
  const expectedFiveMonthly = formatCurrency(expectedFive.monthlyTotal);
  const expectedFiveAnnual = formatCurrency(expectedFive.annualTotal);
  const expectedFiveMonthlyCeiling = formatCeilingCurrency(
    Math.max(0, expectedFive.monthlyTotal - STAGEVERIFY_FOUNDING_PRICE),
  );
  const expectedFiveAnnualCeiling = formatCeilingCurrency(
    Math.max(0, expectedFive.annualTotal - annualFoundingCost),
  );

  if (fiveTechMonthlyLaborOperand === expectedFiveMonthly)
    pass(`[${name}] Tech-only 5 technicians: monthly labor operand matches recomputed total`);
  else
    fail(
      `[${name}] Tech-only 5 technicians monthly labor operand expected "${expectedFiveMonthly}", got "${fiveTechMonthlyLaborOperand}"`,
    );
  if (fiveTechAnnualLaborOperand === expectedFiveAnnual)
    pass(`[${name}] Tech-only 5 technicians: annual labor operand matches recomputed total`);
  else
    fail(
      `[${name}] Tech-only 5 technicians annual labor operand expected "${expectedFiveAnnual}", got "${fiveTechAnnualLaborOperand}"`,
    );
  if (fiveTechMonthlyCeiling === expectedFiveMonthlyCeiling)
    pass(`[${name}] Tech-only 5 technicians: monthly ceiling matches recomputed value`);
  else
    fail(
      `[${name}] Tech-only 5 technicians monthly ceiling expected "${expectedFiveMonthlyCeiling}", got "${fiveTechMonthlyCeiling}"`,
    );
  if (fiveTechAnnualCeiling === expectedFiveAnnualCeiling)
    pass(`[${name}] Tech-only 5 technicians: annual ceiling matches recomputed value`);
  else
    fail(
      `[${name}] Tech-only 5 technicians annual ceiling expected "${expectedFiveAnnualCeiling}", got "${fiveTechAnnualCeiling}"`,
    );

  await page.locator("#calc-technicians").fill("10");
  await page.locator("#calc-technicians").dispatchEvent("input");
  await page.waitForTimeout(100);

  const tenTechMonthlyTotal = (await monthlyTotalOut.textContent())?.trim() ?? "";
  const tenTechAnnualTotal = (await annualTotalOut.textContent())?.trim() ?? "";
  const tenTechMonthlyLaborOperand = normalizeCalcText(
    (await monthlyLaborOperand.textContent()) ?? "",
  );
  const tenTechAnnualLaborOperand = normalizeCalcText(
    (await annualLaborOperand.textContent()) ?? "",
  );
  const tenTechMonthlyCeiling = normalizeCalcText(
    (await monthlyCeilingOut.textContent()) ?? "",
  );
  const tenTechAnnualCeiling = normalizeCalcText(
    (await annualCeilingOut.textContent()) ?? "",
  );
  const tenTechMonthlySv = normalizeCalcText((await monthlySvOperand.textContent()) ?? "");
  const tenTechAnnualSv = normalizeCalcText((await annualSvOperand.textContent()) ?? "");

  const parseCurrency = (text) =>
    Number.parseFloat(text.replace(/[^0-9.-]/g, "")) || 0;
  const fiveMonthlyNum = parseCurrency(fiveTechMonthlyTotal);
  const tenMonthlyNum = parseCurrency(tenTechMonthlyTotal);
  const fiveAnnualNum = parseCurrency(fiveTechAnnualTotal);
  const tenAnnualNum = parseCurrency(tenTechAnnualTotal);

  const expectedTen = calculateMaterialProcessCost({
    ...CALCULATOR_DEFAULTS,
    technicians: 10,
    officeMinutesPerWeek: 0,
    dispatcherMinutesPerWeek: 0,
    managerMinutesPerWeek: 0,
  });
  const expectedTenMonthlyCeiling = formatCeilingCurrency(
    Math.max(0, expectedTen.monthlyTotal - STAGEVERIFY_FOUNDING_PRICE),
  );
  const expectedTenAnnualCeiling = formatCeilingCurrency(
    Math.max(0, expectedTen.annualTotal - annualFoundingCost),
  );

  if (approx(tenMonthlyNum, fiveMonthlyNum * 2))
    pass(`[${name}] Doubling technicians doubles monthly total (tech-only)`);
  else
    fail(
      `[${name}] Tech-only monthly total did not double: ${fiveMonthlyNum} → ${tenMonthlyNum}`,
    );
  if (approx(tenAnnualNum, fiveAnnualNum * 2))
    pass(`[${name}] Doubling technicians doubles annual total (tech-only)`);
  else
    fail(
      `[${name}] Tech-only annual total did not double: ${fiveAnnualNum} → ${tenAnnualNum}`,
    );
  if (tenTechMonthlyLaborOperand === formatCurrency(expectedTen.monthlyTotal))
    pass(`[${name}] Tech-only 10 technicians: monthly labor operand matches current total`);
  else
    fail(
      `[${name}] Tech-only 10 technicians monthly labor operand expected "${formatCurrency(expectedTen.monthlyTotal)}", got "${tenTechMonthlyLaborOperand}"`,
    );
  if (tenTechAnnualLaborOperand === formatCurrency(expectedTen.annualTotal))
    pass(`[${name}] Tech-only 10 technicians: annual labor operand matches current total`);
  else
    fail(
      `[${name}] Tech-only 10 technicians annual labor operand expected "${formatCurrency(expectedTen.annualTotal)}", got "${tenTechAnnualLaborOperand}"`,
    );
  if (tenTechMonthlyCeiling === expectedTenMonthlyCeiling)
    pass(`[${name}] Tech-only 10 technicians: monthly ceiling matches recomputed value`);
  else
    fail(
      `[${name}] Tech-only 10 technicians monthly ceiling expected "${expectedTenMonthlyCeiling}", got "${tenTechMonthlyCeiling}"`,
    );
  if (tenTechAnnualCeiling === expectedTenAnnualCeiling)
    pass(`[${name}] Tech-only 10 technicians: annual ceiling matches recomputed value`);
  else
    fail(
      `[${name}] Tech-only 10 technicians annual ceiling expected "${expectedTenAnnualCeiling}", got "${tenTechAnnualCeiling}"`,
    );
  if (tenTechMonthlySv === formatCurrency(STAGEVERIFY_FOUNDING_PRICE))
    pass(`[${name}] Tech-only 10 technicians: monthly subscription operand remains $199`);
  else
    fail(
      `[${name}] Tech-only 10 technicians monthly subscription operand expected "${formatCurrency(STAGEVERIFY_FOUNDING_PRICE)}", got "${tenTechMonthlySv}"`,
    );
  if (tenTechAnnualSv === formatCurrency(annualFoundingCost))
    pass(`[${name}] Tech-only 10 technicians: annual subscription operand remains $2,388`);
  else
    fail(
      `[${name}] Tech-only 10 technicians annual subscription operand expected "${formatCurrency(annualFoundingCost)}", got "${tenTechAnnualSv}"`,
    );

  await page.locator("#calc-technicians").fill("0");
  await page.locator("#calc-tech-minutes").fill("0");
  await page.locator("#calc-office-minutes").fill("0");
  await page.locator("#calc-dispatcher-minutes").fill("0");
  await page.locator("#calc-manager-minutes").fill("0");
  await page.locator("#calc-technicians").dispatchEvent("input");
  await page.waitForTimeout(100);

  const zeroMonthlyCeiling = normalizeCalcText((await monthlyCeilingOut.textContent()) ?? "");
  const zeroAnnualCeiling = normalizeCalcText((await annualCeilingOut.textContent()) ?? "");
  const zeroMonthlyEquation = normalizeCalcText((await monthlyEquation.innerText()) ?? "");
  const zeroAnnualEquation = normalizeCalcText((await annualEquation.innerText()) ?? "");

  if (zeroMonthlyCeiling === "$0")
    pass(`[${name}] Zero-labor monthly ceiling renders $0`);
  else fail(`[${name}] Zero-labor monthly ceiling expected "$0", got "${zeroMonthlyCeiling}"`);

  if (zeroAnnualCeiling === "$0")
    pass(`[${name}] Zero-labor annual ceiling renders $0`);
  else fail(`[${name}] Zero-labor annual ceiling expected "$0", got "${zeroAnnualCeiling}"`);

  if (zeroMonthlyEquation.includes("$0/month"))
    pass(`[${name}] Zero-labor monthly equation shows $0/month`);
  else fail(`[${name}] Zero-labor monthly equation missing $0/month`);

  if (zeroAnnualEquation.includes("$0/year"))
    pass(`[${name}] Zero-labor annual equation shows $0/year`);
  else fail(`[${name}] Zero-labor annual equation missing $0/year`);

  await page.locator("#calc-technicians").fill("-5");
  await page.locator("#calc-technicians").dispatchEvent("input");
  const calcOutputs = await page.locator("[data-calc-out]").allTextContents();
  const hasInvalidCalc = calcOutputs.some(
    (text) =>
      text.includes("NaN") ||
      text.includes("Infinity") ||
      text.includes("-$"),
  );
  if (!hasInvalidCalc)
    pass(`[${name}] Negative input still produces no NaN/Infinity/negative savings`);
  else fail(`[${name}] Negative input produced invalid calculator output`);
}

async function checkContentAssertions(page, name) {
  const body = await page.locator("body").innerText();

  for (const id of removedIds) {
    if ((await page.locator(`#${id}`).count()) === 0)
      pass(`[${name}] Removed section #${id} absent`);
    else fail(`[${name}] Removed section #${id} still present`);
  }

  for (const text of removedStrings) {
    if (!body.includes(text))
      pass(`[${name}] Removed string absent: "${text.slice(0, 40)}..."`);
    else fail(`[${name}] Removed string still present: "${text}"`);
  }

  for (const title of howItWorksTitles) {
    if ((await page.locator("#how-it-works").getByText(title, { exact: true }).count()) > 0)
      pass(`[${name}] How It Works step: ${title}`);
    else fail(`[${name}] Missing How It Works step: ${title}`);
  }

  for (const description of howItWorksDescriptions) {
    if ((await page.locator("#how-it-works").getByText(description, { exact: true }).count()) > 0)
      pass(`[${name}] How It Works description present`);
    else fail(`[${name}] Missing How It Works description: ${description}`);
  }

  if ((await page.locator("#how-it-works").getByText(howItWorksIntro, { exact: true }).count()) > 0)
    pass(`[${name}] How It Works intro present`);
  else fail(`[${name}] Missing How It Works intro: ${howItWorksIntro}`);

  if ((await page.locator("#how-it-works").getByText(howItWorksBridge, { exact: true }).count()) > 0)
    pass(`[${name}] How It Works bridge present`);
  else fail(`[${name}] Missing How It Works bridge: ${howItWorksBridge}`);

  for (const text of roleCardTexts) {
    if ((await page.locator("#how-it-works").getByText(text, { exact: true }).count()) > 0)
      pass(`[${name}] Role card text present: ${text}`);
    else fail(`[${name}] Missing role card text: ${text}`);
  }

  for (const roleName of roleCardNames) {
    if ((await page.locator("#how-it-works").getByText(roleName, { exact: true }).count()) > 0)
      pass(`[${name}] Role card name present: ${roleName}`);
    else fail(`[${name}] Missing role card name: ${roleName}`);
  }

  if ((await page.locator("#how-it-works").getByText("Management", { exact: true }).count()) === 0)
    pass(`[${name}] Management role absent from #how-it-works`);
  else fail(`[${name}] Management role still present in #how-it-works`);

  for (const text of supersededRoleCardTexts) {
    if ((await page.locator("#how-it-works").getByText(text, { exact: true }).count()) === 0)
      pass(`[${name}] Superseded role card text absent: ${text}`);
    else fail(`[${name}] Superseded role card text still present: ${text}`);
  }

  for (const label of navLabels) {
    if ((await page.locator("header").getByText(label, { exact: true }).count()) > 0)
      pass(`[${name}] Navigation label: ${label}`);
    else fail(`[${name}] Missing navigation label: ${label}`);
  }

  const catchAll = page.locator("#catch-all");
  const catchAllText = (await catchAll.innerText()).replace(/\s+/g, " ").trim();
  const catchAllHeading = "UPS, FedEx, and USPS drops still need a clear path.";
  const catchAllBody =
    "Catch-All keeps unexpected carrier drops visible until shop staff identify the job and stage the material.";
  if (catchAllText.includes(catchAllHeading) && catchAllText.includes(catchAllBody))
    pass(`[${name}] Catch-All heading and body present`);
  else fail(`[${name}] Catch-All content mismatch`);

  if (!catchAllText.includes("The point is visibility"))
    pass(`[${name}] Catch-All extra paragraph removed`);
  else fail(`[${name}] Catch-All still has extra paragraph`);

  const primaryCapabilityCount = await page.locator("[data-primary-capability]").count();
  if (primaryCapabilityCount === 4)
    pass(`[${name}] Exactly four primary capability cards`);
  else
    fail(`[${name}] Expected 4 primary capability cards, found ${primaryCapabilityCount}`);

  for (const title of primaryCapabilityTitles) {
    if ((await page.locator("#features").getByText(title, { exact: true }).count()) > 0)
      pass(`[${name}] Primary capability: ${title}`);
    else fail(`[${name}] Missing primary capability: ${title}`);
  }

  for (const description of primaryCapabilityDescriptions) {
    if ((await page.locator("#features").getByText(description, { exact: true }).count()) > 0)
      pass(`[${name}] Primary capability description present`);
    else fail(`[${name}] Missing primary capability description: ${description}`);
  }

  if ((await page.locator("#features").getByText("Also includes", { exact: true }).count()) > 0)
    pass(`[${name}] Also includes heading present`);
  else fail(`[${name}] Missing Also includes heading`);

  for (const item of secondaryCapabilityItems) {
    if ((await page.locator("#features").getByText(item, { exact: true }).count()) > 0)
      pass(`[${name}] Secondary capability: ${item}`);
    else fail(`[${name}] Missing secondary capability: ${item}`);
  }

  for (const label of tradeLabelsToAssertAbsent) {
    if ((await page.locator("#who-its-for").getByText(label, { exact: true }).count()) === 0)
      pass(`[${name}] Trade pill absent: ${label}`);
    else fail(`[${name}] Trade pill still present: ${label}`);
  }

  const whoItsForSection = page.locator("#who-its-for");
  if ((await whoItsForSection.getByText(whoItsForIntro, { exact: true }).count()) > 0)
    pass(`[${name}] Who It's For intro present`);
  else fail(`[${name}] Missing Who It's For intro: ${whoItsForIntro}`);

  if ((await whoItsForSection.getByText(whoItsForSecondary, { exact: true }).count()) > 0)
    pass(`[${name}] Who It's For secondary sentence present`);
  else fail(`[${name}] Missing Who It's For secondary sentence`);

  if (
    (await whoItsForSection
      .locator("h2")
      .filter({ hasText: "HVAC" })
      .count()) > 0
  )
    pass(`[${name}] HVAC referenced in Who It's For title`);
  else fail(`[${name}] HVAC missing from Who It's For section`);

  for (const line of qualifierLines) {
    if (body.includes(line))
      pass(`[${name}] Qualifier present`);
    else fail(`[${name}] Missing qualifier: ${line}`);
  }

  const qualifierCount = await page.locator("#who-its-for h3 + ul > li").count();
  if (qualifierCount === 5)
    pass(`[${name}] Exactly five qualification signals`);
  else fail(`[${name}] Expected 5 qualification signals, found ${qualifierCount}`);

  const credibility =
    "If your current process works and nobody is spending meaningful time managing it, you may not need StageVerify yet.";
  if (!body.includes(credibility))
    pass(`[${name}] Old credibility sentence absent`);
  else fail(`[${name}] Old credibility sentence still present`);

  if (body.includes(laborReceivingCostParagraph))
    pass(`[${name}] Labor receiving-cost paragraph present`);
  else fail(`[${name}] Labor receiving-cost paragraph missing`);

  if (body.includes(laborProductScopeParagraph))
    pass(`[${name}] Labor product-scope paragraph present`);
  else fail(`[${name}] Labor product-scope paragraph missing`);

  if (body.includes(laborCalculatorLeadInParagraph))
    pass(`[${name}] Labor calculator lead-in paragraph present`);
  else fail(`[${name}] Labor calculator lead-in paragraph missing`);

  const heroCopyText = (
    await page.locator("section:first-of-type .max-w-xl").innerText()
  ).toLowerCase();
  const laborSectionText = (await page.locator("#labor-cost").innerText()).toLowerCase();
  const calculatorSectionText = (await page.locator("#cost-calculator").innerText()).toLowerCase();
  const howItWorksRoleText = (await page.locator("#how-it-works").innerText()).toLowerCase();
  const scopedCopySections = [
    { label: "hero copy", text: heroCopyText },
    { label: "labor-cost", text: laborSectionText },
    { label: "cost-calculator", text: calculatorSectionText },
    { label: "how-it-works role cards", text: howItWorksRoleText },
  ];
  for (const { label, text } of scopedCopySections) {
    if (!/\bdrops?\b/.test(text))
      pass(`[${name}] Scoped copy absent drop/drops in ${label}`);
    else fail(`[${name}] Scoped copy still contains drop/drops in ${label}`);
    if (!/\blabor tax\b/.test(text) && !/\btax\b/.test(text))
      pass(`[${name}] Scoped copy absent tax/labor tax in ${label}`);
    else fail(`[${name}] Scoped copy still contains tax/labor tax in ${label}`);
  }

  if (body.includes("Not included in this estimate:"))
    pass(`[${name}] Labor exclusion box label present`);
  else fail(`[${name}] Labor exclusion box label missing`);

  for (const concept of exclusionConcepts) {
    if (body.includes(concept))
      pass(`[${name}] Exclusion concept present: ${concept}`);
    else fail(`[${name}] Missing exclusion concept: ${concept}`);
  }

  if (body.includes(customerFitParagraph))
    pass(`[${name}] Customer-fit paragraph present`);
  else fail(`[${name}] Customer-fit paragraph missing`);

  if (
    !body.includes(
      "5 techs × 6 min/day × 22 workdays = 11 tech-hours/month = $330/month at $30/hour.",
    ) &&
    !body.includes("5 techs × 6 min/day")
  )
    pass(`[${name}] Static labor example absent`);
  else fail(`[${name}] Static labor example still present`);

  if (body.includes(proveValueIntro))
    pass(`[${name}] Prove Value intro present`);
  else fail(`[${name}] Prove Value intro missing`);

  const metricCount = await page.locator("[data-example-metric]").count();
  if (metricCount === 4)
    pass(`[${name}] Exactly four management preview metrics`);
  else fail(`[${name}] Expected 4 management preview metrics, found ${metricCount}`);

  for (const value of managementMetricValues) {
    if ((await page.locator("#prove-value").getByText(value, { exact: true }).count()) > 0)
      pass(`[${name}] Management metric value: ${value}`);
    else fail(`[${name}] Missing management metric value: ${value}`);
  }

  for (const label of managementMetricLabels) {
    if ((await page.locator("#prove-value").getByText(label, { exact: true }).count()) > 0)
      pass(`[${name}] Management metric label: ${label}`);
    else fail(`[${name}] Missing management metric label: ${label}`);
  }

  for (const label of managementPreviewLabels) {
    if ((await page.locator("#prove-value").getByText(label, { exact: true }).count()) > 0)
      pass(`[${name}] Management preview label: ${label}`);
    else fail(`[${name}] Missing management preview label: ${label}`);
  }

  if ((await page.locator("[data-line-chart]").count()) > 0)
    pass(`[${name}] Line chart container present`);
  else fail(`[${name}] Missing data-line-chart`);

  if ((await page.locator("[data-bar-chart]").count()) > 0)
    pass(`[${name}] Bar chart container present`);
  else fail(`[${name}] Missing data-bar-chart`);

  if ((await page.locator("#prove-value").getByText(lineChartTitle, { exact: true }).count()) > 0)
    pass(`[${name}] Line chart title present`);
  else fail(`[${name}] Missing line chart title`);

  for (const month of lineChartMonths) {
    if ((await page.locator("[data-line-chart]").getByText(month, { exact: true }).count()) > 0)
      pass(`[${name}] Line chart month: ${month}`);
    else fail(`[${name}] Missing line chart month: ${month}`);
  }

  for (const value of lineChartValues) {
    if ((await page.locator("[data-line-chart]").getByText(value, { exact: true }).count()) > 0)
      pass(`[${name}] Line chart value: ${value}`);
    else fail(`[${name}] Missing line chart value: ${value}`);
  }

  if ((await page.locator("#prove-value").getByText(barChartTitle, { exact: true }).count()) > 0)
    pass(`[${name}] Bar chart title present`);
  else fail(`[${name}] Missing bar chart title`);

  for (const { label, value } of barChartCategories) {
    if ((await page.locator("[data-bar-chart]").getByText(label, { exact: true }).count()) > 0)
      pass(`[${name}] Bar chart category: ${label}`);
    else fail(`[${name}] Missing bar chart category: ${label}`);
    if ((await page.locator("[data-bar-chart]").getByText(value, { exact: true }).count()) > 0)
      pass(`[${name}] Bar chart value: ${value}`);
    else fail(`[${name}] Missing bar chart value: ${value}`);
  }

  if (body.includes(illustrativeDataNote))
    pass(`[${name}] Illustrative data note present`);
  else fail(`[${name}] Illustrative data note missing`);

  const forbiddenProveValuePhrases = [
    "material-handling time",
    "operational trends",
  ];
  const proveValueSectionText = (await page.locator("#prove-value").innerText()).toLowerCase();
  for (const phrase of forbiddenProveValuePhrases) {
    if (!proveValueSectionText.includes(phrase))
      pass(`[${name}] Prove Value absent phrase: ${phrase}`);
    else fail(`[${name}] Prove Value still contains: ${phrase}`);
  }

  const lineChartDesc = await page.locator("[data-line-chart] desc").textContent();
  if (
    lineChartDesc &&
    lineChartDesc.toLowerCase().includes("example paid hours spent receiving and hunting parts")
  )
    pass(`[${name}] Line chart accessible description updated`);
  else fail(`[${name}] Line chart accessible description missing or incorrect`);

  if ((await page.locator("[data-management-preview]").count()) > 0)
    pass(`[${name}] Management preview container present`);
  else fail(`[${name}] Missing data-management-preview`);

  const forbiddenOutcomePhrases = [
    "customer results",
    "guaranteed outcome",
    "guaranteed results",
    "actual StageVerify results",
  ];
  const proveValueText = (await page.locator("#prove-value").innerText()).toLowerCase();
  for (const phrase of forbiddenOutcomePhrases) {
    if (!proveValueText.includes(phrase))
      pass(`[${name}] No implied ${phrase}`);
    else fail(`[${name}] Implied ${phrase} in prove-value section`);
  }

  for (const value of pricingValues) {
    if ((await page.locator("#pricing").getByText(value).count()) > 0)
      pass(`[${name}] Pricing value: ${value}`);
    else fail(`[${name}] Missing pricing value: ${value}`);
  }

  const faqDetails = page.locator("#faq details");
  const faqCount = await faqDetails.count();
  if (faqCount === 5)
    pass(`[${name}] Exactly five FAQ disclosure items`);
  else fail(`[${name}] Expected 5 FAQ items, found ${faqCount}`);

  for (const question of faqQuestions) {
    if ((await page.locator("#faq").getByText(question, { exact: true }).count()) > 0)
      pass(`[${name}] FAQ question present`);
    else fail(`[${name}] Missing FAQ question: ${question}`);
  }

  const faqAnswers = [
    "No. Vendors and technicians do not need to install an app.",
    "UPS, FedEx, USPS, and other unexpected deliveries can be seen and handled through the Catch-All workflow.",
  ];
  for (const answer of faqAnswers) {
    if ((await page.locator("#faq").getByText(answer, { exact: true }).count()) > 0)
      pass(`[${name}] FAQ answer present`);
    else fail(`[${name}] Missing FAQ answer: ${answer}`);
  }

  const prohibitedPatterns = [
    { label: "standalone PIN", pattern: /\bpin\b/i },
    { label: "standalone QR", pattern: /\bqr\b/i },
    { label: "scan/scans/scanned/scanning", pattern: /\bscann?(?:ed|ing|s)?\b/i },
    { label: "Need More Space", pattern: /need more space/i },
    { label: "release/state-machine/location-allocation wording", pattern: /release\/state-machine|location-allocation/i },
    { label: "tokens", pattern: /\btokens?\b/i },
    { label: "email parsing", pattern: /email parsing/i },
    { label: "AI routing", pattern: /ai routing/i },
    { label: "G1/G2/S1 codes", pattern: /\bG[12]\b|\bS1\b/ },
    { label: "You lose", pattern: /\byou lose\b/i },
    { label: "You make", pattern: /\byou make\b/i },
    { label: "Guaranteed savings", pattern: /guaranteed savings/i },
    { label: "ROI", pattern: /\broi\b/i },
    { label: "Profit", pattern: /\bprofit\b/i },
    { label: "released job", pattern: /released job/i },
    { label: "return locations to available status", pattern: /return locations to available status/i },
    { label: "locations become available again", pattern: /locations become available again/i },
  ];
  for (const { label, pattern } of prohibitedPatterns) {
    if (!pattern.test(body))
      pass(`[${name}] Prohibited mechanic absent: ${label}`);
    else fail(`[${name}] Prohibited mechanic still present: ${label}`);
  }
}

async function checkSectionOrder(page, name) {
  const heroTop = await page.evaluate(() => {
    const hero = document.querySelector("section:first-of-type");
    return hero ? hero.getBoundingClientRect().top + window.scrollY : null;
  });

  const tops = [];
  for (const { id } of sections) {
    const top = await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    }, id);
    tops.push({ id, top });
  }

  if (heroTop !== null && tops[0].top !== null && heroTop < tops[0].top)
    pass(`[${name}] Hero precedes first listed section`);
  else fail(`[${name}] Hero should precede #${tops[0]?.id}`);

  for (let i = 1; i < tops.length; i++) {
    if (tops[i].top !== null && tops[i - 1].top !== null && tops[i].top > tops[i - 1].top)
      pass(`[${name}] Section order: #${tops[i - 1].id} before #${tops[i].id}`);
    else
      fail(
        `[${name}] Section order violation: #${tops[i - 1].id} (${tops[i - 1].top}) not before #${tops[i].id} (${tops[i].top})`,
      );
  }
}

async function checkDemoSection(page, name) {
  const demo = page.locator("#demo");

  if ((await demo.count()) === 0) {
    fail(`[${name}] Missing #demo section`);
    return;
  }

  if ((await demo.getByText(demoEyebrow, { exact: true }).count()) > 0)
    pass(`[${name}] Demo eyebrow present`);
  else fail(`[${name}] Missing demo eyebrow: ${demoEyebrow}`);

  const h2Text = (await demo.locator("h2").first().textContent())?.trim();
  if (h2Text === demoEyebrow) pass(`[${name}] Demo H2 present`);
  else fail(`[${name}] Demo H2 mismatch: "${h2Text}"`);

  if ((await demo.getByText(demoSubcopy, { exact: true }).count()) > 0)
    pass(`[${name}] Demo subcopy present`);
  else fail(`[${name}] Missing demo subcopy`);

  const form = demo.locator("#demo-request-form");
  if ((await form.count()) === 1) pass(`[${name}] Demo request form present`);
  else fail(`[${name}] Missing #demo-request-form`);

  const requiredFields = [
    { label: "Name", selector: "#demo-name" },
    { label: "Work email", selector: "#demo-email" },
    { label: "Company", selector: "#demo-company" },
    { label: "Phone", selector: "#demo-phone" },
    { label: "City / State", selector: "#demo-location" },
  ];

  for (const { label, selector } of requiredFields) {
    const field = form.locator(selector);
    if ((await field.count()) === 0) {
      fail(`[${name}] Missing demo field: ${label}`);
      continue;
    }
    if (await field.getAttribute("required") !== null)
      pass(`[${name}] Demo field required: ${label}`);
    else fail(`[${name}] Demo field not required: ${label}`);
  }

  const emailType = await form.locator("#demo-email").getAttribute("type");
  if (emailType === "email") pass(`[${name}] Work email type=email`);
  else fail(`[${name}] Work email type was "${emailType}"`);

  const phoneType = await form.locator("#demo-phone").getAttribute("type");
  if (phoneType === "tel") pass(`[${name}] Phone type=tel`);
  else fail(`[${name}] Phone type was "${phoneType}"`);

  const message = form.locator("#demo-message");
  if ((await message.count()) > 0) pass(`[${name}] Optional Message field present`);
  else fail(`[${name}] Missing Message field`);

  const messageRequired = await message.getAttribute("required");
  if (messageRequired === null) pass(`[${name}] Message field optional`);
  else fail(`[${name}] Message field should be optional`);

  const placeholder = await message.getAttribute("placeholder");
  if (placeholder === demoMessagePlaceholder)
    pass(`[${name}] Message placeholder exact`);
  else
    fail(
      `[${name}] Message placeholder was "${placeholder}", expected "${demoMessagePlaceholder}"`,
    );

  const submitBtn = form.locator('button[type="submit"]');
  const submitText = (await submitBtn.textContent())?.trim();
  if (submitText === "Send request") pass(`[${name}] Submit button text`);
  else fail(`[${name}] Submit button text was "${submitText}"`);

  const mailLink = demo.locator('a[href="mailto:info@stageverify.com"]');
  if ((await mailLink.count()) > 0 && (await mailLink.first().isVisible()))
    pass(`[${name}] Visible info@stageverify.com mail link`);
  else fail(`[${name}] Missing visible info@stageverify.com mail link`);

  if ((await demo.locator("[data-demo-cta]").count()) === 0)
    pass(`[${name}] No [data-demo-cta] inside #demo`);
  else fail(`[${name}] [data-demo-cta] should not exist inside #demo`);

  const demoCtas = page.locator("[data-demo-cta]");
  const demoCtaCount = await demoCtas.count();
  for (let i = 0; i < demoCtaCount; i++) {
    const cta = demoCtas.nth(i);
    const href = await cta.getAttribute("href");
    if (href === "#demo") pass(`[${name}] [data-demo-cta] href="#demo"`);
    else fail(`[${name}] [data-demo-cta] href was "${href}"`);
  }

  if ((await page.locator("#coming-soon-dialog").count()) === 0)
    pass(`[${name}] #coming-soon-dialog absent`);
  else fail(`[${name}] #coming-soon-dialog should not exist`);

  const body = await page.locator("body").innerText();
  if (!body.includes("Demo scheduling is coming soon."))
    pass(`[${name}] Demo scheduling coming-soon string absent`);
  else fail(`[${name}] Demo scheduling coming-soon string still present`);

  const isWideLayout = name === "desktop" || name === "tablet";
  if (isWideLayout) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.locator("header [data-demo-cta]").first().click();
    await waitForSectionAnchor(page, "demo");
    pass(`[${name}] Header Request Demo navigates to #demo`);

    const dialogVisible = await page.locator("#coming-soon-dialog").isVisible().catch(() => false);
    if (!dialogVisible) pass(`[${name}] Request Demo does not open dialog`);
    else fail(`[${name}] Request Demo opened coming-soon dialog`);
  }

  if (name === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.locator('summary[aria-label="Open menu"]').click();
    const menu = page.locator("header details").first();
    const menuOpen = await menu.getAttribute("open");
    if (menuOpen !== null) pass(`[${name}] Mobile menu opens`);
    else fail(`[${name}] Mobile menu did not open`);

    await page
      .locator("header details nav [data-demo-cta]")
      .filter({ hasText: "Request Demo" })
      .click();
    await waitForSectionAnchor(page, "demo");
    pass(`[${name}] Mobile menu Request Demo navigates to #demo`);

    const menuClosed = (await menu.getAttribute("open")) === null;
    if (menuClosed) pass(`[${name}] Mobile menu closes after Request Demo`);
    else fail(`[${name}] Mobile menu still open after Request Demo`);

    const dialogVisible = await page.locator("#coming-soon-dialog").isVisible().catch(() => false);
    if (!dialogVisible) pass(`[${name}] Mobile Request Demo does not open dialog`);
    else fail(`[${name}] Mobile Request Demo opened coming-soon dialog`);
  }
}

async function checkViewport(browser, { name, width, height, full = false }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  try {
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      fail(`[${name}] Page failed to load (${response?.status()})`);
      return;
    }
    pass(`[${name}] Page loads`);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    if (scrollWidth <= clientWidth + 1) pass(`[${name}] No horizontal scroll`);
    else
      fail(`[${name}] Horizontal scroll (${scrollWidth}px > ${clientWidth}px)`);

    if (!full) return;

    const h1 = page.locator("h1");
    const h1Text = (await h1.textContent())?.trim();
    if (h1Text === HEADLINE) pass(`[${name}] H1 headline exact`);
    else fail(`[${name}] H1 mismatch: "${h1Text}"`);

    const heroSection = page.locator("section:first-of-type");
    const heroText = (await heroSection.innerText()).replace(/\s+/g, " ").trim();
    if (heroText.includes(EYEBROW))
      pass(`[${name}] Hero eyebrow exact`);
    else fail(`[${name}] Hero eyebrow missing: expected "${EYEBROW}"`);

    const body = await page.locator("body").innerText();
    if (body.includes(DESCRIPTION))
      pass(`[${name}] Hero body paragraph 1 present`);
    else fail(`[${name}] Hero body paragraph 1 missing`);

    if (body.includes(SUPPORTING_DESCRIPTION))
      pass(`[${name}] Hero body paragraph 2 present`);
    else fail(`[${name}] Hero body paragraph 2 missing`);

    if (body.includes(POSITIONING))
      pass(`[${name}] Hero pull-quote present`);
    else fail(`[${name}] Hero pull-quote missing`);

    const h1Count = await page.locator("h1").count();
    if (h1Count === 1) pass(`[${name}] Single H1`);
    else fail(`[${name}] Expected 1 H1, found ${h1Count}`);

    for (const { id, heading } of sections) {
      const section = page.locator(`#${id}`);
      if ((await section.count()) === 0) {
        fail(`[${name}] Missing section #${id}`);
        continue;
      }
      const h2 = section.locator("h2").first();
      const h2Text = (await h2.textContent())?.trim();
      if (h2Text === heading) pass(`[${name}] Section #${id} heading`);
      else fail(`[${name}] Section #${id} heading mismatch: "${h2Text}"`);
    }

    await checkSectionOrder(page, name);

    const logo = page.locator('header img[alt="StageVerify"]');
    if ((await logo.count()) > 0) {
      const logoOk = await logo.first().evaluate((el) => {
        const img = el;
        return img.complete && img.naturalWidth > 0;
      });
      if (logoOk && (await logo.first().isVisible()))
        pass(`[${name}] Header logo visible`);
      else fail(`[${name}] Header logo broken or hidden`);
    } else {
      fail(`[${name}] Header logo missing`);
    }

    const mockup = page.getByText(
      /Dispatcher view|Ready for Pickup|Job readiness/,
    );
    await mockup.first().scrollIntoViewIfNeeded();
    if (await mockup.first().isVisible()) pass(`[${name}] Hero mockup visible`);
    else fail(`[${name}] Hero mockup not visible`);

    const po45823Card = page.locator("div").filter({ hasText: "PO-45823" }).first();
    const po45823Text = (await po45823Card.innerText()).replace(/\s+/g, " ").trim();
    if (po45823Text.includes("Staged at") && po45823Text.includes("Ground staging"))
      pass(`[${name}] PO-45823 card has Staged at and Ground staging`);
    else fail(`[${name}] PO-45823 card missing Staged at / Ground staging: "${po45823Text.slice(0, 120)}"`);

    if ((await page.locator("#cost-calculator").count()) > 0)
      pass(`[${name}] Cost calculator section present`);
    else fail(`[${name}] Missing #cost-calculator section`);

    await checkContentAssertions(page, name);
    await checkCalculatorDefaults(page, name);
    await checkDemoSection(page, name);
  } finally {
    await context.close();
  }
}

async function checkNarrowCalculatorViewport(browser, { name, width, height }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  try {
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      fail(`[${name}] Page failed to load (${response?.status()})`);
      return;
    }
    pass(`[${name}] Page loads`);

    await page.locator("#cost-calculator-form").scrollIntoViewIfNeeded();

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    if (scrollWidth <= clientWidth + 1)
      pass(`[${name}] No horizontal overflow at ${width}px`);
    else
      fail(
        `[${name}] Horizontal overflow at ${width}px (${scrollWidth}px > ${clientWidth}px)`,
      );

    for (const id of calcInputIds) {
      const input = page.locator(`#${id}`);
      if ((await input.count()) === 0) continue;
      await input.evaluate((el) => el.scrollIntoView({ block: "center", inline: "nearest" }));
      await waitForScrollToSettle(page);
      await assertElementInViewport(
        page,
        input,
        `[${name}] Calculator input #${id} within viewport`,
        width,
      );
    }

  } finally {
    await context.close();
  }
}

async function checkTechnicianInputAlignment(browser, { name, width, height }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  try {
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      fail(`[${name}] Page failed to load (${response?.status()})`);
      return;
    }
    pass(`[${name}] Page loads`);

    await page.locator("#cost-calculator-form").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const tops = [];
    for (const id of techAlignInputIds) {
      const box = await page.locator(`#${id}`).boundingBox();
      if (!box) {
        fail(`[${name}] Missing bounding box for #${id}`);
        return;
      }
      tops.push(box.y);
    }

    const maxDelta = Math.max(...tops) - Math.min(...tops);
    if (maxDelta <= 1)
      pass(`[${name}] Technician inputs aligned within 1px (delta ${maxDelta.toFixed(2)}px)`);
    else
      fail(
        `[${name}] Technician input tops misaligned by ${maxDelta.toFixed(2)}px (tops: ${tops.map((t) => t.toFixed(1)).join(", ")})`,
      );
  } finally {
    await context.close();
  }
}

async function waitForSectionAnchor(page, id) {
  await page.waitForFunction(
    ({ sectionId, min, max }) => {
      const el = document.getElementById(sectionId);
      if (!el) return false;
      const top = el.getBoundingClientRect().top;
      return top >= min && top <= max;
    },
    { sectionId: id, ...HEADER_OFFSET },
    { timeout: 4000 },
  );
}

async function checkSeo(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const meta = await page.evaluate(() => {
      const get = (sel) => document.querySelector(sel)?.getAttribute("content") || "";
      const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
      const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((el) => el.textContent || "")
        .join("\n");
      return {
        description: get('meta[name="description"]'),
        ogTitle: get('meta[property="og:title"]'),
        geoRegion: get('meta[name="geo.region"]'),
        geoPlace: get('meta[name="geo.placename"]'),
        canonical,
        jsonLd,
        body: document.body.innerText,
      };
    });

    if (meta.canonical.includes("stageverify.com"))
      pass("[seo] Canonical points to stageverify.com");
    else fail(`[seo] Canonical missing/wrong: ${meta.canonical}`);

    if (
      meta.description === SEO_DESCRIPTION &&
      !meta.description.toLowerCase().includes("green bay")
    ) {
      pass("[seo] Meta description matches approved seoDescription");
    } else {
      fail(`[seo] Meta description should be "${SEO_DESCRIPTION}"`);
    }

    if (meta.ogTitle.includes("StageVerify") && !meta.ogTitle.includes("Green Bay"))
      pass("[seo] Open Graph title is product-first");
    else fail("[seo] Open Graph title missing or still Green Bay-heavy");

    if (
      meta.jsonLd.includes("FAQPage") &&
      meta.jsonLd.includes("Organization") &&
      meta.jsonLd.includes("Green Bay") &&
      meta.jsonLd.includes("United States")
    ) {
      pass("[seo] JSON-LD includes Organization, FAQ, Green Bay location, US areaServed");
    } else {
      fail("[seo] JSON-LD incomplete");
    }

    if (
      meta.body.includes("Based in Green Bay, Wisconsin") &&
      meta.body.includes("nationwide")
    ) {
      pass("[seo] Visible location line is nationwide + Green Bay HQ");
    } else {
      fail("[seo] Visible nationwide / Green Bay HQ copy missing");
    }

    if (
      meta.jsonLd.includes("FAQPage") &&
      meta.jsonLd.includes("What is StageVerify?") &&
      !meta.jsonLd.includes("When can I request a demo?")
    ) {
      pass("[seo] JSON-LD FAQPage includes updated homepage questions");
    } else {
      fail("[seo] JSON-LD FAQPage missing updated questions");
    }

    for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt"]) {
      const res = await page.request.get(`${baseUrl}${path}`);
      if (res.ok()) pass(`[seo] ${path} loads (${res.status()})`);
      else fail(`[seo] ${path} failed (${res.status()})`);
    }
  } finally {
    await context.close();
  }
}

async function checkScrollBehavior(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(200);
    const reloadScrollY = await page.evaluate(() => window.scrollY);
    if (reloadScrollY <= 8) pass("[scroll] Root reload starts at top");
    else fail(`[scroll] Root reload scrollY=${reloadScrollY} (expected top)`);

    await page.goto(`${baseUrl}/#how-it-works`, { waitUntil: "networkidle" });
    await waitForSectionAnchor(page, "how-it-works");
    pass("[scroll] Hash #how-it-works lands under header");

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page
      .locator('header nav[aria-label="Main navigation"] a[href="#features"]')
      .click();
    await waitForSectionAnchor(page, "features");
    pass("[scroll] Header nav scrolls to #features");

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator('section a[href="#how-it-works"]').first().click();
    await waitForSectionAnchor(page, "how-it-works");
    pass("[scroll] Hero CTA scrolls to #how-it-works");
  } finally {
    await context.close();
  }
}

async function captureMobileScreenshots(browser) {
  const dir = "public/ui-preview";
  const fs = await import("node:fs/promises");
  await fs.mkdir(dir, { recursive: true });

  for (const width of [320, 375, 390, 414, 430]) {
    const context = await browser.newContext({
      viewport: { width, height: 812 },
    });
    const page = await context.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.screenshot({
        path: `${dir}/mobile-${width}.png`,
        fullPage: true,
      });
    } finally {
      await context.close();
    }
  }
  pass("[mobile] Captured preview screenshots in public/ui-preview/");
}

async function main() {
  console.log(`\nStageVerify UI verification → ${baseUrl}\n`);

  let browser;
  try {
    browser = await chromium.launch();
  } catch {
    console.error(
      "Playwright browsers missing. Run: npx playwright install chromium",
    );
    process.exit(2);
  }

  for (const vp of viewports) {
    console.log(`${vp.name} (${vp.width}×${vp.height})`);
    await checkViewport(browser, { ...vp, full: vp.full ?? false });
    console.log("");
  }

  for (const vp of mobileHeaderViewports) {
    console.log(`mobile-header ${vp.name} (${vp.width}×${vp.height})`);
    await checkMobileHeader(browser, vp);
    console.log("");
  }

  for (const vp of narrowCalcViewports) {
    console.log(`${vp.name} (${vp.width}×${vp.height})`);
    await checkNarrowCalculatorViewport(browser, vp);
    console.log("");
  }

  for (const vp of alignmentViewports) {
    console.log(`alignment ${vp.name} (${vp.width}×${vp.height})`);
    await checkTechnicianInputAlignment(browser, vp);
    console.log("");
  }

  console.log("seo");
  await checkSeo(browser);
  console.log("");

  console.log("scroll");
  await checkScrollBehavior(browser);
  console.log("");

  console.log("mobile-screenshots");
  await captureMobileScreenshots(browser);
  console.log("");

  console.log("favicon");
  const favPage = await browser.newPage();
  try {
    const favResponse = await favPage.goto(baseUrl, {
      waitUntil: "networkidle",
    });
    if (!favResponse || !favResponse.ok()) {
      fail("[favicon] Page failed to load for favicon checks");
    } else {
      await checkFavicons(favPage);
    }
  } finally {
    await favPage.close();
  }
  console.log("");

  await browser.close();

  console.log(`Results: ${passes.length} passed, ${failures.length} failed\n`);
  if (failures.length) {
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
