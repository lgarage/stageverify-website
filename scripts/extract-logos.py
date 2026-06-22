from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_IMAGES = ROOT / "public" / "images"
SHEET = Path(
    r"C:\Users\daday\.cursor\projects\c-Projects-stageverify-website\assets"
    r"\c__Users_daday_AppData_Roaming_Cursor_User_workspaceStorage_05144c5b3cabc94c7e6dac1971d6a7de_images_image-0e6488b8-0ece-4f49-b74a-4abe617584bf.png"
)

CROPS = {
    "icon": (760, 20, 990, 170),
    "logo_dark": (520, 340, 960, 520),
    "logo_light": (20, 340, 490, 560),
}


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5


def trim_to_content(image: Image.Image, pad: int = 6) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.split()[-1]
    bbox = alpha.getbbox()
    if bbox is None:
        bbox = rgba.getbbox()
    if bbox is None:
        return rgba

    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(rgba.width, bbox[2] + pad)
    bottom = min(rgba.height, bbox[3] + pad)
    return rgba.crop((left, top, right, bottom))


def remove_background(
    image: Image.Image,
    sample_points: list[tuple[int, int]],
    tolerance: float = 28.0,
) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    samples = [rgba.getpixel(point)[:3] for point in sample_points]
    bg = (
        sum(color[0] for color in samples) // len(samples),
        sum(color[1] for color in samples) // len(samples),
        sum(color[2] for color in samples) // len(samples),
    )

    for y in range(rgba.height):
        for x in range(rgba.width):
            rgb = rgba.getpixel((x, y))[:3]
            if color_distance(rgb, bg) <= tolerance:
                pixels[x, y] = (rgb[0], rgb[1], rgb[2], 0)

    return trim_to_content(rgba)


def png_to_data_uri(image: Image.Image) -> str:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def write_favicon_svg(icon: Image.Image) -> None:
    square = trim_to_content(icon.convert("RGBA"))
    width, height = square.size
    size = max(width, height)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - width) // 2, (size - height) // 2)
    canvas.paste(square, offset, square)
    data_uri = png_to_data_uri(canvas)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="StageVerify">
  <image href="{data_uri}" width="32" height="32" preserveAspectRatio="xMidYMid meet" />
</svg>
"""
    (ROOT / "public" / "favicon.svg").write_text(svg, encoding="utf-8")


def write_logo_dark_svg(logo: Image.Image) -> None:
    data_uri = png_to_data_uri(logo)
    width, height = logo.size
    view_width = 240
    view_height = round(height * (view_width / width))
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_width} {view_height}" role="img" aria-label="StageVerify">
  <image href="{data_uri}" width="{view_width}" height="{view_height}" preserveAspectRatio="xMidYMid meet" />
</svg>
"""
    (PUBLIC_IMAGES / "logo-dark.svg").write_text(svg, encoding="utf-8")


def main() -> None:
    PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)
    sheet = Image.open(SHEET)

    icon = trim_to_content(sheet.crop(CROPS["icon"]))
    icon.save(PUBLIC_IMAGES / "stageverify-icon.png", optimize=True)
    write_favicon_svg(icon)

    logo_dark = sheet.crop(CROPS["logo_dark"])
    logo_dark_transparent = remove_background(
        logo_dark,
        sample_points=[
            (8, 8),
            (logo_dark.width - 8, 8),
            (8, logo_dark.height - 8),
            (logo_dark.width - 8, logo_dark.height - 8),
        ],
    )
    logo_dark_transparent.save(PUBLIC_IMAGES / "logo-dark.png", optimize=True)
    write_logo_dark_svg(logo_dark_transparent)

    logo_light = sheet.crop(CROPS["logo_light"])
    logo_light_transparent = remove_background(
        logo_light,
        sample_points=[(8, 8), (logo_light.width - 8, 8), (8, logo_light.height - 8)],
        tolerance=22.0,
    )
    logo_light_transparent.save(PUBLIC_IMAGES / "logo-light.png", optimize=True)

    print("Wrote logo-dark.png, logo-dark.svg, logo-light.png, stageverify-icon.png, favicon.svg")


if __name__ == "__main__":
    main()
