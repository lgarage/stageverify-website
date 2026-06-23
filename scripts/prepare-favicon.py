"""Generate favicon-specific SV marks with optional vertical stretch and preview ladders."""

from __future__ import annotations

import base64
import io
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logos" / "sv-mark.png"
PUBLIC = ROOT / "public"
PREVIEW_DIR = PUBLIC / "favicon-preview"
LOGOS = ROOT / "logos"

PREVIEW_SIZES = [16, 24, 32, 48]
NAVY = (11, 31, 58)
MIN_EDGE_PX = 1
MAX_STRETCH_RATIO = 1.58  # reject variants that look over-stretched


@dataclass(frozen=True)
class FaviconVariant:
    id: str
    label: str
    width_percent: float
    vertical_stretch: float = 100.0


STRETCH_VARIANTS = [
    FaviconVariant("baseline", "Baseline (current 88×112)", 88, 112),
    FaviconVariant("86v118", "86% width × 118% height", 86, 118),
    FaviconVariant("86v122", "86% width × 122% height", 86, 122),
    FaviconVariant("86v120", "86% width × 120% height", 86, 120),
    FaviconVariant("84v126", "84% width × 126% height", 84, 126),
    FaviconVariant("84v128", "84% width × 128% height", 84, 128),
    FaviconVariant("84v130", "84% width × 130% height", 84, 130),
    FaviconVariant("82v132", "82% width × 132% height", 82, 132),
]

CHOSEN_VARIANT = FaviconVariant("84v126", "84% width × 126% height", 84, 126)


def trim_transparent_and_white(im: Image.Image, threshold: int = 250) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    min_x, min_y = w, h
    max_x, max_y = 0, 0

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                continue
            if r >= threshold and g >= threshold and b >= threshold:
                continue
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

    if max_x <= min_x or max_y <= min_y:
        return im

    return im.crop((min_x, min_y, max_x + 1, max_y + 1))


def favicon_icon(
    size: int,
    width_percent: float,
    vertical_stretch: float = 100.0,
    background: tuple[int, int, int] | None = None,
    src: Image.Image | None = None,
) -> Image.Image:
    """Render a favicon-only SV mark with optional vertical stretch."""
    mark_src = trim_transparent_and_white(src or Image.open(SRC))
    supersample = 4 if size <= 32 else 2
    work_size = size * supersample
    margin = max(MIN_EDGE_PX, 2) * supersample if size <= 32 else MIN_EDGE_PX * supersample

    for shrink in (1.0, 0.96, 0.92, 0.88):
        max_w = work_size - 2 * margin
        max_h = work_size - 2 * margin
        target_w = max(1, min(max_w, round(work_size * width_percent / 100 * shrink)))
        scale = target_w / mark_src.width
        mark_h = max(1, int(mark_src.height * scale))
        mark = mark_src.resize((target_w, mark_h), Image.Resampling.LANCZOS)

        if vertical_stretch != 100.0:
            mark_h = max(1, int(mark_h * vertical_stretch / 100.0))
            mark = mark.resize((target_w, mark_h), Image.Resampling.LANCZOS)

        if mark.width > max_w or mark.height > max_h:
            fit = min(max_w / mark.width, max_h / mark.height)
            mark = mark.resize(
                (max(1, int(mark.width * fit)), max(1, int(mark.height * fit))),
                Image.Resampling.LANCZOS,
            )

        if background is None:
            canvas = Image.new("RGBA", (work_size, work_size), (0, 0, 0, 0))
        else:
            canvas = Image.new("RGBA", (work_size, work_size), background + (255,))

        canvas.paste(
            mark,
            ((work_size - mark.width) // 2, (work_size - mark.height) // 2),
            mark,
        )

        final = (
            canvas.resize((size, size), Image.Resampling.LANCZOS)
            if supersample > 1
            else canvas
        )
        if size > 32 or measure_fill(final)["edgeClearance"] >= MIN_EDGE_PX:
            return final

    return final


def variant_icon(size: int, variant: FaviconVariant, background=None) -> Image.Image:
    return favicon_icon(
        size,
        variant.width_percent,
        variant.vertical_stretch,
        background=background,
    )


def png_to_data_uri(im: Image.Image) -> str:
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def write_svg(path: Path, background: str | None, png_uri: str, size: int = 512) -> None:
    if background:
        bg = f'  <rect width="{size}" height="{size}" fill="{background}"/>\n'
    else:
        bg = ""
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="StageVerify">
{bg}  <image href="{png_uri}" width="{size}" height="{size}" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def measure_fill(im: Image.Image) -> dict[str, float | int]:
    px = im.convert("RGBA").load()
    w, h = im.size
    min_x, min_y = w, h
    max_x, max_y = 0, 0

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                continue
            if r >= 248 and g >= 248 and b >= 248:
                continue
            if r <= 20 and g <= 45 and b <= 65:
                continue
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

    if max_x < min_x:
        return {
            "widthFill": 0.0,
            "heightFill": 0.0,
            "maxFill": 0.0,
            "edgeClearance": 0,
        }

    width_fill = (max_x - min_x + 1) / w
    height_fill = (max_y - min_y + 1) / h
    edge_clearance = min(min_x, min_y, w - 1 - max_x, h - 1 - max_y)

    return {
        "widthFill": width_fill,
        "heightFill": height_fill,
        "maxFill": max(width_fill, height_fill),
        "edgeClearance": edge_clearance,
    }


def checker_cell(size: int) -> Image.Image:
    preview = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    checker = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cpx = checker.load()
    for yy in range(size):
        for xx in range(size):
            if (xx // 8 + yy // 8) % 2:
                cpx[xx, yy] = (226, 232, 240, 255)
    return Image.alpha_composite(preview, checker)


def build_stretch_sheet() -> Image.Image:
    cell = 88
    label_w = 230
    header_h = 34
    sheet_w = label_w + cell * len(PREVIEW_SIZES)
    sheet_h = header_h + cell * len(STRETCH_VARIANTS)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (245, 246, 248))
    draw = ImageDraw.Draw(sheet)

    for col, size in enumerate(PREVIEW_SIZES):
        x = label_w + col * cell
        draw.text((x + 24, 10), f"{size}px", fill=(11, 31, 58))

    for row, variant in enumerate(STRETCH_VARIANTS):
        y0 = header_h + row * cell
        draw.text((8, y0 + 34), variant.label, fill=(11, 31, 58))
        for col, size in enumerate(PREVIEW_SIZES):
            icon = variant_icon(size, variant)
            tile = checker_cell(cell)
            offset = ((cell - size) // 2, (cell - size) // 2)
            tile.paste(icon, offset, icon)
            sheet.paste(tile.convert("RGB"), (label_w + col * cell, y0))

    return sheet


def reference_tab_icons() -> dict[str, str]:
    return {
        "gmail": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23c5221f' d='M1 3.5v9h14v-9H1zm12.8 1.1L8 8.9 2.2 4.6h11.6z'/%3E%3C/svg%3E",
        "gemini": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%234285f4' d='M8 1l1.8 5.5L15 8l-5.2 1.5L8 15l-1.8-5.5L1 8l5.2-1.5z'/%3E%3C/svg%3E",
        "chatgpt": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7' fill='%2310a37f'/%3E%3C/svg%3E",
    }


def write_preview_html() -> None:
    refs = reference_tab_icons()
    ref_tabs = "".join(
        f"""        <div class="tab ref"><img src="{href}" width="16" height="16" alt="" />{name.title()}</div>"""
        for name, href in refs.items()
    )

    rows = []
    for variant in STRETCH_VARIANTS:
        cells = []
        for size in PREVIEW_SIZES:
            src = f"./{variant.id}-{size}.png"
            cells.append(
                f"""      <div class="cell">
        <h3>{size}×{size}</h3>
        <div class="icon-wrap"><img src="{src}" width="{size}" height="{size}" alt="" /></div>
      </div>"""
            )
        chosen = ' class="row chosen"' if variant.id == CHOSEN_VARIANT.id else ""
        rows.append(
            f"""    <section{chosen}>
      <h2>{variant.label}</h2>
      <div class="grid">{''.join(cells)}
      </div>
      <div class="tab-row">
        <div class="tab"><img src="./{variant.id}-16.png" width="16" height="16" alt="" />StageVerify</div>
{ref_tabs}
      </div>
    </section>"""
        )

    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>StageVerify transparent favicon ladder</title>
    <style>
      body {{ font-family: system-ui, sans-serif; margin: 2rem; color: #0b1f3a; background: #f4f6f8; }}
      h1 {{ font-size: 1.35rem; margin-bottom: 0.25rem; }}
      p {{ color: #5a6578; max-width: 52rem; }}
      section {{ background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem 1.25rem; margin-top: 1rem; }}
      section.chosen {{ border-color: #2563eb; box-shadow: 0 0 0 1px #2563eb; }}
      section h2 {{ font-size: 1rem; margin: 0 0 0.75rem; }}
      .grid {{ display: flex; flex-wrap: wrap; gap: 1rem; }}
      .cell {{ min-width: 96px; }}
      .cell h3 {{ font-size: 0.8125rem; color: #5a6578; margin: 0 0 0.5rem; font-weight: 600; }}
      .icon-wrap {{
        display: flex; align-items: center; justify-content: center; min-height: 64px;
        background:
          linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
          linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
          linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
        background-size: 16px 16px;
        background-position: 0 0, 0 8px, 8px -8px, -8px 0;
        border-radius: 8px;
      }}
      .tab-row {{ display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.9rem; }}
      .tab {{
        display: inline-flex; align-items: center; gap: 0.45rem;
        padding: 0.4rem 0.85rem; border-radius: 8px 8px 0 0;
        background: #fff; border: 1px solid #d7dee8; border-bottom: none; font-size: 0.8125rem;
      }}
      .tab img {{ width: 16px; height: 16px; image-rendering: pixelated; }}
      .tab.ref {{ opacity: 0.9; }}
      .sheet {{ margin-top: 1.5rem; max-width: 100%; }}
      .sheet img {{ max-width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }}
    </style>
  </head>
  <body>
    <h1>StageVerify transparent favicon ladder</h1>
    <p>
      Transparent SV letters only — no background shape. Compare stretch variants at real tab sizes.
      Selected production variant: <strong>{CHOSEN_VARIANT.label}</strong>.
    </p>
    <div class="sheet">
      <p><strong>Contact sheet</strong></p>
      <img src="./favicon-stretch-ladder.png" alt="Favicon stretch ladder" />
    </div>
{''.join(rows)}
  </body>
</html>
"""
    (PREVIEW_DIR / "index.html").write_text(html, encoding="utf-8")


def cleanup_old_preview_assets() -> None:
    keep_ids = {variant.id for variant in STRETCH_VARIANTS}
    for path in PREVIEW_DIR.glob("*-*.png"):
        variant_id = path.name.rsplit("-", 1)[0]
        if variant_id not in keep_ids and path.name not in {
            "favicon-stretch-ladder.png",
            "stretch-screenshot.png",
        }:
            path.unlink(missing_ok=True)
    for name in ("favicon-sizing-ladder.png", "ladder-screenshot.png"):
        path = PREVIEW_DIR / name
        if path.exists():
            path.unlink()


def pick_best_variant() -> FaviconVariant:
    """Largest transparent SV with safe edges and acceptable stretch."""
    passing: list[tuple[float, FaviconVariant]] = []

    for variant in STRETCH_VARIANTS:
        ratio = variant.vertical_stretch / variant.width_percent
        if ratio > MAX_STRETCH_RATIO:
            continue

        m16 = measure_fill(variant_icon(16, variant))
        m32 = measure_fill(variant_icon(32, variant))
        if m16["edgeClearance"] < MIN_EDGE_PX or m32["edgeClearance"] < MIN_EDGE_PX:
            continue
        if float(m16["heightFill"]) > 0.72 or float(m32["heightFill"]) > 0.78:
            continue

        score = float(m16["heightFill"]) * 0.65 + float(m32["heightFill"]) * 0.35
        passing.append((score, variant))

    if not passing:
        return CHOSEN_VARIANT

    passing.sort(key=lambda item: item[0], reverse=True)
    return passing[0][1]


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source logo: {SRC}")

    global CHOSEN_VARIANT
    CHOSEN_VARIANT = pick_best_variant()

    LOGOS.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    cleanup_old_preview_assets()

    for variant in STRETCH_VARIANTS:
        for size in PREVIEW_SIZES:
            variant_icon(size, variant).save(
                PREVIEW_DIR / f"{variant.id}-{size}.png",
                optimize=True,
            )

    stretch_sheet = build_stretch_sheet()
    stretch_sheet.save(PREVIEW_DIR / "favicon-stretch-ladder.png", optimize=True)

    master = variant_icon(512, CHOSEN_VARIANT, None)
    transparent_uri = png_to_data_uri(master)
    write_svg(PUBLIC / "favicon.svg", None, transparent_uri)
    write_svg(LOGOS / "favicon-transparent.svg", None, transparent_uri)

    icons = {
        16: variant_icon(16, CHOSEN_VARIANT, None),
        32: variant_icon(32, CHOSEN_VARIANT, None),
        48: variant_icon(48, CHOSEN_VARIANT, None),
        180: variant_icon(180, CHOSEN_VARIANT, None),
    }

    icons[16].save(PUBLIC / "favicon-16x16.png", optimize=True)
    icons[32].save(PUBLIC / "favicon-32x32.png", optimize=True)
    icons[180].save(PUBLIC / "apple-touch-icon.png", optimize=True)

    ico_images = [icons[16], icons[32], icons[48]]
    ico_images[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(img.width, img.height) for img in ico_images],
        append_images=ico_images[1:],
    )

    write_preview_html()

    print(f"Source: {SRC} (favicon-only transforms; header logo unchanged)")
    print(
        f"Chosen variant: {CHOSEN_VARIANT.label} "
        f"(width {CHOSEN_VARIANT.width_percent:.0f}%, stretch {CHOSEN_VARIANT.vertical_stretch:.0f}%)"
    )
    print("\nTransparent ladder metrics:")
    for variant in STRETCH_VARIANTS:
        m16 = measure_fill(variant_icon(16, variant))
        m32 = measure_fill(variant_icon(32, variant))
        marker = " <-- chosen" if variant.id == CHOSEN_VARIANT.id else ""
        print(
            f"  {variant.label} — "
            f"16px h={m16['heightFill']:.0%} w={m16['widthFill']:.0%} edge={m16['edgeClearance']}px | "
            f"32px h={m32['heightFill']:.0%} w={m32['widthFill']:.0%}{marker}"
        )

    m16 = measure_fill(icons[16])
    m32 = measure_fill(icons[32])
    print(
        f"\nProduction 16x16 — width {m16['widthFill']:.0%}, height {m16['heightFill']:.0%}, "
        f"edge {m16['edgeClearance']}px"
    )
    print(
        f"Production 32x32 — width {m32['widthFill']:.0%}, height {m32['heightFill']:.0%}, "
        f"edge {m32['edgeClearance']}px"
    )


if __name__ == "__main__":
    main()
