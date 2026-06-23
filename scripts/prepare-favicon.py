"""Generate browser tab icons from logos/sv-mark.png."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logos" / "sv-mark.png"
PUBLIC = ROOT / "public"
ICON_SIZES = (16, 32, 48, 180)


def square_icon(size: int, padding_ratio: float = 0.12) -> Image.Image:
    src = Image.open(SRC).convert("RGBA")
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))

    inner = int(size * (1 - padding_ratio * 2))
    src.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    offset = ((size - src.width) // 2, (size - src.height) // 2)
    canvas.paste(src, offset, src)
    return canvas


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source logo: {SRC}")

    images_dir = PUBLIC / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    icons = {size: square_icon(size) for size in ICON_SIZES}

    icons[16].save(images_dir / "favicon-16x16.png", optimize=True)
    icons[32].save(images_dir / "favicon-32x32.png", optimize=True)
    icons[180].save(images_dir / "apple-touch-icon.png", optimize=True)

    ico_images = [icons[16], icons[32], icons[48]]
    ico_images[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(img.width, img.height) for img in ico_images],
        append_images=ico_images[1:],
    )

    print(f"Source: {SRC}")
    print(f"Wrote {PUBLIC / 'favicon.ico'}")
    print(f"Wrote {images_dir / 'favicon-16x16.png'}")
    print(f"Wrote {images_dir / 'favicon-32x32.png'}")
    print(f"Wrote {images_dir / 'apple-touch-icon.png'}")


if __name__ == "__main__":
    main()
