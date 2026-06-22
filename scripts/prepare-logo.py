"""Prepare svlogo_full.png for the dark header: white Stage, colored icon + Verify."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logos" / "svlogo_full.png"
OUT = ROOT / "public" / "images" / "svlogo_full.png"

ICON_END_RATIO = 0.34
VERIFY_START_RATIO = 0.68
MAX_WIDTH = 900


def is_background(r: int, g: int, b: int) -> bool:
    return r > 242 and g > 242 and b > 242


def is_verify_blue(r: int, g: int, b: int) -> bool:
    return b > 140 and g > 90 and b > r + 40


def prepare_logo() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    icon_end = int(w * ICON_END_RATIO)
    verify_start = int(w * VERIFY_START_RATIO)

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (255, 255, 255, 0)
                continue
            if x < icon_end or x >= verify_start:
                continue
            if is_verify_blue(r, g, b):
                continue
            px[x, y] = (255, 255, 255, 255)

    im.thumbnail((MAX_WIDTH, MAX_WIDTH // 4), Image.Resampling.LANCZOS)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, optimize=True)
    print(f"Wrote {OUT} ({im.size[0]}x{im.size[1]})")


if __name__ == "__main__":
    prepare_logo()
