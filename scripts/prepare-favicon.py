"""Generate browser tab icons from logos/sv-mark.png."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logos" / "sv-mark.png"
PUBLIC = ROOT / "public"
ICON_SIZES = (16, 32, 48, 180)
# Fill the tab square; wide marks are center-cropped after scale-to-cover.
PADDING_RATIO = 0.0


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


def render_mark(inner: int) -> Image.Image:
    src = trim_transparent_and_white(Image.open(SRC))

    scale = max(inner / src.width, inner / src.height)
    mark_w = max(1, int(src.width * scale))
    mark_h = max(1, int(src.height * scale))
    mark = src.resize((mark_w, mark_h), Image.Resampling.LANCZOS)

    left = max(0, (mark_w - inner) // 2)
    top = max(0, (mark_h - inner) // 2)
    return mark.crop((left, top, left + inner, top + inner))


def square_icon(size: int) -> Image.Image:
    inner = size if PADDING_RATIO == 0 else max(1, int(size * (1 - PADDING_RATIO * 2)))
    render_size = inner * 4 if size <= 32 else inner * 2
    mark = render_mark(render_size)

    if render_size != inner:
        mark = mark.resize((inner, inner), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    offset = ((size - inner) // 2, (size - inner) // 2)
    canvas.paste(mark, offset, mark)
    return canvas.convert("RGB")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source logo: {SRC}")

    images_dir = PUBLIC / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    icons = {size: square_icon(size) for size in ICON_SIZES}

    icons[16].save(images_dir / "favicon-16x16.png", optimize=True)
    icons[32].save(images_dir / "favicon-32x32.png", optimize=True)
    icons[48].save(images_dir / "favicon-48x48.png", optimize=True)
    icons[180].save(images_dir / "apple-touch-icon.png", optimize=True)

    ico_images = [icons[16], icons[32], icons[48]]
    ico_images[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(img.width, img.height) for img in ico_images],
        append_images=ico_images[1:],
    )

    trimmed = trim_transparent_and_white(Image.open(SRC))
    print(f"Source: {SRC} ({Image.open(SRC).size[0]}x{Image.open(SRC).size[1]})")
    print(f"Trimmed bounds: {trimmed.size[0]}x{trimmed.size[1]}")
    print(f"Wrote {PUBLIC / 'favicon.ico'}")
    print(f"Wrote {images_dir / 'favicon-16x16.png'}")
    print(f"Wrote {images_dir / 'favicon-32x32.png'}")
    print(f"Wrote {images_dir / 'favicon-48x48.png'}")
    print(f"Wrote {images_dir / 'apple-touch-icon.png'}")


if __name__ == "__main__":
    main()
