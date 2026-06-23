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

/** Minimum fill ratios for favicon mark vs canvas (guards against tiny padded icons). */
const FAVICON_MIN_HEIGHT_FILL = 0.85;
const FAVICON_MIN_WIDTH_FILL = 0.85;
const FAVICON_MIN_INK_RATIO = 0.1;

async function analyzeIconPixels(page, url) {
  return page.evaluate(
    async ({ iconUrl, minHeightFill, minWidthFill, minInkRatio }) => {
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
          if (r >= 248 && g >= 248 && b >= 248) continue;

          ink++;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      if (ink === 0) {
        return { width, height, heightFill: 0, widthFill: 0, inkRatio: 0 };
      }

      const heightFill = (maxY - minY + 1) / height;
      const widthFill = (maxX - minX + 1) / width;
      const inkRatio = ink / (width * height);

      return {
        width,
        height,
        heightFill,
        widthFill,
        inkRatio,
        ok:
          heightFill >= minHeightFill &&
          widthFill >= minWidthFill &&
          inkRatio >= minInkRatio,
      };
    },
    {
      iconUrl: url,
      minHeightFill: FAVICON_MIN_HEIGHT_FILL,
      minWidthFill: FAVICON_MIN_WIDTH_FILL,
      minInkRatio: FAVICON_MIN_INK_RATIO,
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
  const png48 = links.find((l) => l.sizes === "48x48");
  const png16 = links.find((l) => l.sizes === "16x16");
  const shortcut = links.find((l) => l.rel === "shortcut icon");
  const apple = links.find((l) => l.rel === "apple-touch-icon");

  if (png48 && png32 && png16 && shortcut && apple) {
    pass("[favicon] Head links for 48/32/16, shortcut, and apple-touch");
  } else {
    fail("[favicon] Missing expected head icon links");
  }

  const assets = [
    { label: "favicon-48x48.png", url: png48?.href, expected: 48 },
    { label: "favicon-32x32.png", url: png32?.href, expected: 32 },
    { label: "favicon-16x16.png", url: png16?.href, expected: 16 },
    { label: "favicon.ico", url: shortcut?.href },
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

  for (const size of [32, 48]) {
    const link = size === 32 ? png32 : png48;
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
        `[favicon] ${size}x${size} mark fill height ${pct(metrics.heightFill)}, width ${pct(metrics.widthFill)}, ink ${pct(metrics.inkRatio)}`,
      );
    } else {
      fail(
        `[favicon] ${size}x${size} mark too small — height ${pct(metrics.heightFill)}, width ${pct(metrics.widthFill)}, ink ${pct(metrics.inkRatio)} (need ≥${pct(FAVICON_MIN_HEIGHT_FILL)} fill)`,
      );
    }
  }
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

  console.log("favicon");
  const favPage = await browser.newPage();
  try {
    const favResponse = await favPage.goto(baseUrl, { waitUntil: "networkidle" });
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
