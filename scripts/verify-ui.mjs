#!/usr/bin/env node
/**
 * Ephemeral UI smoke test for StageVerify marketing site.
 * Usage: node scripts/verify-ui.mjs [baseUrl]
 * Default: http://localhost:4321/stageverify-website (production build preview)
 */
import { chromium, devices } from "playwright";

const baseUrl =
  process.argv[2]?.replace(/\/$/, "") ||
  "http://localhost:4322/stageverify-website";

const HEADLINE = "Stop Losing Job Materials Between Delivery and Pickup";
const DESCRIPTION =
  "StageVerify tracks vendor deliveries from drop-off to shop staging to field pickup, so trade contractors know what arrived, where it is, whether it is complete, and when it was picked up.";

const sections = [
  { id: "problem", heading: "The handoff is where materials get lost." },
  { id: "how-it-works", heading: "One clear trail from delivery to pickup." },
  { id: "features", heading: "Shop staging control without a full warehouse system." },
  { id: "who-its-for", heading: "Built for trade contractors." },
  { id: "scale", heading: "Start with one shop. Expand to every branch." },
  { id: "demo", heading: "Give operations a clear material trail" },
];

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

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

async function checkViewport(browser, { name, width, height }) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  try {
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      fail(`[${name}] Page failed to load (${response?.status()})`);
      return;
    }
    pass(`[${name}] Page loads`);

    const h1 = page.locator("h1");
    const h1Text = (await h1.textContent())?.trim();
    if (h1Text === HEADLINE) pass(`[${name}] H1 headline exact`);
    else fail(`[${name}] H1 mismatch: "${h1Text}"`);

    const body = await page.locator("body").innerText();
    if (body.includes(DESCRIPTION)) pass(`[${name}] Approved description present`);
    else fail(`[${name}] Approved description missing`);

    const h1Count = await page.locator("h1").count();
    if (h1Count === 1) pass(`[${name}] Single H1`);
    else fail(`[${name}] Expected 1 H1, found ${h1Count}`);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth <= clientWidth + 1) pass(`[${name}] No horizontal scroll`);
    else fail(`[${name}] Horizontal scroll (${scrollWidth}px > ${clientWidth}px)`);

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

    const logo = page.locator('header img[alt="StageVerify"]');
    if ((await logo.count()) > 0) {
      const logoOk = await logo.first().evaluate((el) => {
        const img = el;
        return img.complete && img.naturalWidth > 0;
      });
      if (logoOk && (await logo.first().isVisible())) pass(`[${name}] Header logo visible`);
      else fail(`[${name}] Header logo broken or hidden`);
    } else {
      fail(`[${name}] Header logo missing`);
    }

    const mockup = page.getByText(/Dispatcher view|Ready for Pickup|Job readiness/);
    await mockup.first().scrollIntoViewIfNeeded();
    if (await mockup.first().isVisible()) pass(`[${name}] Hero mockup visible`);
    else fail(`[${name}] Hero mockup not visible`);

    const hasFeatureDetail = await page
      .locator("#features")
      .getByText(/Know which vendor dropped off|Each role sees only what they need/)
      .count();
    const hasHowItWorksDetail = await page
      .locator("#how-it-works")
      .getByText(/Dispatch assigns it|StageVerify checks readiness/)
      .count();
    const hasFeatureTitleOnly = await page
      .locator("#features")
      .getByText("Vendor delivery tracking")
      .count();
    if (hasFeatureDetail > 0) pass(`[${name}] Feature descriptions present`);
    else if (hasFeatureTitleOnly > 0) pass(`[${name}] Feature list present (titles only)`);
    else fail(`[${name}] Features section content missing`);

    if (hasHowItWorksDetail > 0) pass(`[${name}] How It Works steps present`);
    else fail(`[${name}] How It Works content missing`);

    if (name === "desktop") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.locator('header a[href="#demo"]').first().click();
      await page.waitForFunction(
        () => {
          const el = document.getElementById("demo");
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight * 0.85 && rect.bottom > 80;
        },
        { timeout: 3000 },
      );
      pass(`[${name}] Request Demo scrolls to #demo`);
    }
  } finally {
    await context.close();
  }
}

async function main() {
  console.log(`\nStageVerify UI verification → ${baseUrl}\n`);

  let browser;
  try {
    browser = await chromium.launch();
  } catch {
    console.error("Playwright browsers missing. Run: npx playwright install chromium");
    process.exit(2);
  }

  for (const vp of viewports) {
    console.log(`${vp.name} (${vp.width}×${vp.height})`);
    await checkViewport(browser, vp);
    console.log("");
  }

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
