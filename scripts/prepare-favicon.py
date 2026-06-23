"""Generate SV-mark favicons with configurable scale and a sizing ladder preview."""

from __future__ import annotations

import base64
import io
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logos" / "sv-mark.png"
PUBLIC = ROOT / "public"
PREVIEW_DIR = PUBLIC / "favicon-preview"
LOGOS = ROOT / "logos"

# Largest variant that stays centered with visible edge clearance at 16px.
CHOSEN_SCALE_PERCENT = 90

LADDER_PERCENTS = [70, 75, 80, 85, 90, 92, 94]
PREVIEW_SIZES = [16, 24, 32, 48]
NAVY = (11, 31, 58)


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


def contain_mark(max_w: int, max_h: int, src: Image.Image | None = None) -> Image.Image:
    """Scale the mark to fit inside max_w x max_h, centered, preserving aspect ratio."""
    mark_src = trim_transparent_and_white(src or Image.open(SRC))
    scale = min(max_w / mark_src.width, max_h / mark_src.height)
    mark_w = max(1, int(mark_src.width * scale))
    mark_h = max(1, int(mark_src.height * scale))
    mark = mark_src.resize((mark_w, mark_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (max_w, max_h), (0, 0, 0, 0))
    canvas.paste(
        mark,
        ((max_w - mark_w) // 2, (max_h - mark_h) // 2),
        mark,
    )
    return canvas


def square_icon(
    size: int,
    scale_percent: float,
    background: tuple[int, int, int] | None = None,
) -> Image.Image:
    """Place the SV mark inside a square canvas at the given scale percentage."""
    inner = max(1, round(size * scale_percent / 100))
    render_size = inner * 4 if size <= 32 else inner * 2
    mark = contain_mark(render_size, render_size)
    if render_size != inner:
        mark = mark.resize((inner, inner), Image.Resampling.LANCZOS)

    if background is None:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    else:
        canvas = Image.new("RGBA", (size, size), background + (255,))

    offset = ((size - inner) // 2, (size - inner) // 2)
    canvas.paste(mark, offset, mark)
    return canvas


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


def build_ladder_sheet() -> Image.Image:
    cell = 88
    label_w = 92
    header_h = 34
    sheet_w = label_w + cell * len(PREVIEW_SIZES)
    sheet_h = header_h + cell * len(LADDER_PERCENTS)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (245, 246, 248))
    draw = ImageDraw.Draw(sheet)

    for col, size in enumerate(PREVIEW_SIZES):
        x = label_w + col * cell
        draw.text((x + 24, 10), f"{size}px", fill=(11, 31, 58))

    for row, pct in enumerate(LADDER_PERCENTS):
        y0 = header_h + row * cell
        draw.text((8, y0 + 36), f"SV {pct}%", fill=(11, 31, 58))
        for col, size in enumerate(PREVIEW_SIZES):
            icon = square_icon(size, pct)
            tile = checker_cell(cell)
            offset = ((cell - size) // 2, (cell - size) // 2)
            tile.paste(icon, offset, icon)
            sheet.paste(tile.convert("RGB"), (label_w + col * cell, y0))

    return sheet


def write_preview_html() -> None:
    rows = []
    for pct in LADDER_PERCENTS:
        cells = []
        for size in PREVIEW_SIZES:
            src = f"./sv-{pct}-32.png"
            cells.append(
                f"""      <div class="cell">
        <h3>{size}×{size}</h3>
        <div class="icon-wrap"><img src="{src}" width="{size}" height="{size}" alt="" /></div>
      </div>"""
            )
        chosen = ' class="row chosen"' if pct == CHOSEN_SCALE_PERCENT else ""
        rows.append(
            f"""    <section{chosen}>
      <h2>SV {pct}%</h2>
      <div class="grid">{''.join(cells)}
      </div>
      <div class="tab-row">
        <div class="tab"><img src="./sv-{pct}-16.png" width="16" height="16" alt="" />StageVerify</div>
        <div class="tab ref"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7' fill='%234285f4'/%3E%3C/svg%3E" width="16" height="16" alt="" />Reference</div>
        <div class="tab ref"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='1' y='1' width='14' height='14' rx='2' fill='%2334a853'/%3E%3C/svg%3E" width="16" height="16" alt="" />Reference</div>
      </div>
    </section>"""
        )

    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>StageVerify favicon sizing ladder</title>
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
      .tab.ref {{ opacity: 0.85; }}
      .sheet {{ margin-top: 1.5rem; max-width: 100%; }}
      .sheet img {{ max-width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }}
    </style>
  </head>
  <body>
    <h1>StageVerify favicon sizing ladder</h1>
    <p>
      Compare SV mark scale variants at real favicon sizes. Selected production scale:
      <strong>SV {CHOSEN_SCALE_PERCENT}%</strong> (transparent canvas, centered, aspect preserved).
    </p>
    <div class="sheet">
      <p><strong>Contact sheet</strong></p>
      <img src="./favicon-sizing-ladder.png" alt="Favicon sizing ladder" />
    </div>
{''.join(rows)}
  </body>
</html>
"""
    (PREVIEW_DIR / "index.html").write_text(html, encoding="utf-8")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source logo: {SRC}")

    LOGOS.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

    for pct in LADDER_PERCENTS:
        icon32 = square_icon(32, pct)
        icon32.save(PREVIEW_DIR / f"sv-{pct}-32.png", optimize=True)
        square_icon(16, pct).save(PREVIEW_DIR / f"sv-{pct}-16.png", optimize=True)

    ladder = build_ladder_sheet()
    ladder.save(PREVIEW_DIR / "favicon-sizing-ladder.png", optimize=True)

    master = square_icon(512, CHOSEN_SCALE_PERCENT, None)
    transparent_uri = png_to_data_uri(master)
    write_svg(PUBLIC / "favicon.svg", None, transparent_uri)
    write_svg(LOGOS / "favicon-transparent.svg", None, transparent_uri)

    blue_master = square_icon(512, CHOSEN_SCALE_PERCENT, NAVY)
    write_svg(LOGOS / "favicon-bluebg.svg", "#0b1f3a", png_to_data_uri(blue_master))

    icons = {
        16: square_icon(16, CHOSEN_SCALE_PERCENT, None),
        32: square_icon(32, CHOSEN_SCALE_PERCENT, None),
        48: square_icon(48, CHOSEN_SCALE_PERCENT, None),
        180: square_icon(180, CHOSEN_SCALE_PERCENT, None),
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

    print(f"Source: {SRC}")
    print(f"Chosen scale: SV {CHOSEN_SCALE_PERCENT}%")
    print("\nLadder metrics at 32x32:")
    for pct in LADDER_PERCENTS:
        m = measure_fill(square_icon(32, pct))
        marker = " <-- chosen" if pct == CHOSEN_SCALE_PERCENT else ""
        print(
            f"  SV {pct:>2}% — width {m['widthFill']:.0%}, height {m['heightFill']:.0%}, "
            f"edge clearance {m['edgeClearance']}px{marker}"
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
    print(f"\nWrote {PUBLIC / 'favicon.svg'}")
    print(f"Wrote {PUBLIC / 'favicon-16x16.png'}")
    print(f"Wrote {PUBLIC / 'favicon-32x32.png'}")
    print(f"Wrote {PREVIEW_DIR / 'index.html'}")
    print(f"Wrote {PREVIEW_DIR / 'favicon-sizing-ladder.png'}")


if __name__ == "__main__":
    main()
