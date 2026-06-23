"""Generate balanced square SV-mark favicons and a size preview sheet."""

from __future__ import annotations

import base64
import io
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logos" / "sv-mark.png"
PUBLIC = ROOT / "public"
LOGOS = ROOT / "logos"

# Chosen default: transparent canvas, mark contained with medium padding (~70% width on tab).
PADDING_RATIO = 0.12
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
    """Scale the mark to fit inside max_w x max_h, centered."""
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
    padding_ratio: float = PADDING_RATIO,
    background: tuple[int, int, int] | None = None,
) -> Image.Image:
    inner = max(1, int(size * (1 - padding_ratio * 2)))
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


def measure_fill(im: Image.Image) -> dict[str, float]:
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
        return {"widthFill": 0.0, "heightFill": 0.0}

    return {
        "widthFill": (max_x - min_x + 1) / w,
        "heightFill": (max_y - min_y + 1) / h,
    }


def build_preview_sheet() -> Image.Image:
    variants = [
        ("Chosen: transparent, medium padding", PADDING_RATIO, None),
        ("Alt: transparent, more padding", 0.16, None),
        ("Alt: navy background, medium padding", PADDING_RATIO, NAVY),
    ]
    sizes = [16, 24, 32, 48, 64]
    cell = 96
    label_h = 28
    header_h = 36
    sheet = Image.new("RGB", (cell * len(sizes), header_h + label_h + cell * len(variants)), (245, 246, 248))
    draw = ImageDraw.Draw(sheet)

    for col, size in enumerate(sizes):
        x = col * cell
        draw.text((x + 8, 8), f"{size}px", fill=(11, 31, 58))

    for row, (label, padding, bg) in enumerate(variants):
        y0 = header_h + label_h + row * cell
        draw.text((8, header_h + row * cell + 6), label, fill=(90, 101, 117))
        for col, size in enumerate(sizes):
            icon = square_icon(size, padding, bg)
            preview = Image.new("RGBA", (cell, cell), (255, 255, 255, 255))
            checker = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
            cpx = checker.load()
            for yy in range(cell):
                for xx in range(cell):
                    if (xx // 8 + yy // 8) % 2:
                        cpx[xx, yy] = (226, 232, 240, 255)
            preview = Image.alpha_composite(preview, checker)
            offset = ((cell - size) // 2, (cell - size) // 2)
            preview.paste(icon, offset, icon)
            sheet.paste(preview.convert("RGB"), (col * cell, y0))

    return sheet


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source logo: {SRC}")

    LOGOS.mkdir(parents=True, exist_ok=True)

    master = square_icon(512, PADDING_RATIO, None)
    transparent_uri = png_to_data_uri(master)

    write_svg(LOGOS / "favicon-transparent.svg", None, transparent_uri)
    write_svg(PUBLIC / "favicon.svg", None, transparent_uri)

    blue_master = square_icon(512, PADDING_RATIO, NAVY)
    write_svg(LOGOS / "favicon-bluebg.svg", "#0b1f3a", png_to_data_uri(blue_master))

    icons = {
        16: square_icon(16, PADDING_RATIO, None),
        32: square_icon(32, PADDING_RATIO, None),
        48: square_icon(48, PADDING_RATIO, None),
        180: square_icon(180, PADDING_RATIO, None),
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

    preview = build_preview_sheet()
    preview.save(PUBLIC / "favicon-preview.png", optimize=True)

    m32 = measure_fill(icons[32])
    print(f"Source: {SRC}")
    print(f"Padding ratio: {PADDING_RATIO} (transparent, contained mark)")
    print(
        "32x32 fill — "
        f"width {m32['widthFill']:.0%}, height {m32['heightFill']:.0%}"
    )
    print(f"Wrote {PUBLIC / 'favicon.svg'}")
    print(f"Wrote {PUBLIC / 'favicon-16x16.png'}")
    print(f"Wrote {PUBLIC / 'favicon-32x32.png'}")
    print(f"Wrote {PUBLIC / 'apple-touch-icon.png'}")
    print(f"Wrote {PUBLIC / 'favicon.ico'}")
    print(f"Wrote {PUBLIC / 'favicon-preview.png'}")


if __name__ == "__main__":
    main()
