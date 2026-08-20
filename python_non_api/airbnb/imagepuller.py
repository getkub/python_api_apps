#!/usr/bin/env python3

import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from playwright.sync_api import sync_playwright


# ------------------------------------------------------------
# Configuration
# ------------------------------------------------------------

AIRBNB_URL = "https://www.airbnb.co.uk/rooms/{listing_id}"

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/139.0.0.0 Safari/537.36"
)

# Ignore downloaded images smaller than this size (in KB).
# Filters out icons, avatars, thumbnails and placeholder assets.
DEFAULT_MIN_SIZE_KB = 20


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def clean_name(name: str) -> str:
    """Make a safe filename."""
    name = str(name or "").strip()

    # Remove things like "Photo 1", "Image 2", etc.
    name = re.sub(
        r"^(photo|image|picture|img)[\s_-]*\d*$",
        "",
        name,
        flags=re.I,
    ).strip()

    # Normalise whitespace
    name = re.sub(r"\s+", " ", name)

    # Filesystem-safe
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", name)

    # Keep filenames reasonably short
    name = name[:80].strip(" .-_")

    return name


def make_unique_filename(directory: Path, base_name: str, extension: str) -> Path:
    """Avoid overwriting files."""
    candidate = directory / f"{base_name}{extension}"

    if not candidate.exists():
        return candidate

    counter = 2
    while True:
        candidate = directory / f"{base_name}_{counter}{extension}"
        if not candidate.exists():
            return candidate
        counter += 1


def upgrade_image_url(url: str) -> str:
    """
    Try to get the original/large Airbnb image.

    Airbnb image URLs frequently contain resizing parameters.
    Removing query parameters generally gives the original CDN URL
    when the URL itself points at a muscache image.
    """

    if not url:
        return url

    # Remove query parameters such as ?im_w=720, ?im_q=high, etc.
    parsed = urlparse(url)

    if "muscache.com" in parsed.netloc:
        url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    # Some URLs contain explicit resize suffixes.
    url = re.sub(r"/im_w=\d+", "", url)
    url = re.sub(r"/im_q=[^/]+", "", url)
    url = re.sub(r"/im_k=[^/]+", "", url)

    return url


def extract_possible_caption(photo: dict) -> str:
    """
    Airbnb has changed its internal photo metadata structures over time,
    so try a number of possible caption / room-name fields.
    """

    possible_fields = [
        "caption",
        "title",
        "altText",
        "accessibilityLabel",
        "description",
        "roomName",
        "sectionName",
        "name",
    ]

    for field in possible_fields:
        value = photo.get(field)

        if isinstance(value, str) and value.strip():
            return value.strip()

        if isinstance(value, dict):
            for subfield in ("text", "name", "title", "value"):
                subvalue = value.get(subfield)
                if isinstance(subvalue, str) and subvalue.strip():
                    return subvalue.strip()

    return ""


# ------------------------------------------------------------
# Find photo objects recursively in Airbnb JSON
# ------------------------------------------------------------

def find_photo_objects(obj, found=None):
    """
    Recursively search Airbnb's embedded JSON for objects that look
    like photo records.
    """

    if found is None:
        found = []

    if isinstance(obj, dict):

        # A likely photo object normally has a URL-like field.
        url_fields = [
            "url",
            "imageUrl",
            "pictureUrl",
            "largePicture",
            "largeUrl",
            "originalUrl",
            "picture",
        ]

        has_image_url = any(
            isinstance(obj.get(field), str)
            and (
                "muscache.com" in obj.get(field, "")
                or "airbnb" in obj.get(field, "")
            )
            for field in url_fields
        )

        if has_image_url:
            found.append(obj)

        for value in obj.values():
            find_photo_objects(value, found)

    elif isinstance(obj, list):
        for value in obj:
            find_photo_objects(value, found)

    return found


def extract_url_from_photo(photo: dict):
    """
    Extract the best available URL from a photo object.
    Prefer original/large versions.
    """

    preferred_fields = [
        "originalUrl",
        "largePicture",
        "largeUrl",
        "imageUrl",
        "pictureUrl",
        "url",
        "picture",
    ]

    for field in preferred_fields:
        value = photo.get(field)

        if isinstance(value, str) and "http" in value:
            return value

        if isinstance(value, dict):
            for subfield in ("url", "uri", "src"):
                subvalue = value.get(subfield)
                if isinstance(subvalue, str) and "http" in subvalue:
                    return subvalue

    return None


# ------------------------------------------------------------
# Download
# ------------------------------------------------------------

def download_image(session, url, output_file):
    headers = {
        "User-Agent": USER_AGENT,
        "Referer": "https://www.airbnb.co.uk/",
    }

    response = session.get(
        url,
        headers=headers,
        timeout=60,
        stream=True,
    )

    response.raise_for_status()

    with open(output_file, "wb") as f:
        for chunk in response.iter_content(chunk_size=1024 * 128):
            if chunk:
                f.write(chunk)


# ------------------------------------------------------------
# Main scraper
# ------------------------------------------------------------

def scrape_listing(
    listing_id: str,
    output_dir: str,
    min_size_kb: float = DEFAULT_MIN_SIZE_KB,
):

    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)

    url = AIRBNB_URL.format(listing_id=listing_id)

    print(f"Opening:")
    print(f"  {url}")
    print()

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        context = browser.new_context(
            user_agent=USER_AGENT,
            viewport={
                "width": 1440,
                "height": 1000,
            },
            locale="en-GB",
        )

        page = context.new_page()

        print("Loading Airbnb listing...")

        page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=120_000,
        )

        # Give Airbnb's JS time to populate the page.
        time.sleep(5)

        # Scroll through the page so lazy-loaded data/images appear.
        print("Scrolling listing...")

        for _ in range(10):
            page.mouse.wheel(0, 2000)
            time.sleep(0.7)

        # --------------------------------------------------------
        # Extract JSON from script tags
        # --------------------------------------------------------

        print("Extracting embedded Airbnb data...")

        scripts = page.locator("script").all()

        photo_objects = []

        for script in scripts:
            try:
                text = script.text_content()

                if not text:
                    continue

                # We only care about scripts containing photo/CDN data.
                if "muscache.com" not in text:
                    continue

                # Try to parse as JSON directly.
                try:
                    data = json.loads(text)
                    photo_objects.extend(
                        find_photo_objects(data)
                    )
                    continue
                except Exception:
                    pass

                # Some script tags contain JSON embedded in JS.
                # Look for large JSON-ish sections.
                matches = re.findall(
                    r'\{.*?"muscache\.com".*?\}',
                    text,
                    flags=re.S,
                )

                for match in matches:
                    try:
                        data = json.loads(match)
                        photo_objects.extend(
                            find_photo_objects(data)
                        )
                    except Exception:
                        pass

            except Exception:
                continue

        # --------------------------------------------------------
        # Also collect image URLs directly from the DOM.
        # This is a useful fallback.
        # --------------------------------------------------------

        dom_urls = page.eval_on_selector_all(
            "img",
            """
            imgs => imgs
                .map(img => img.currentSrc || img.src)
                .filter(src =>
                    src &&
                    (
                        src.includes('muscache.com') ||
                        src.includes('airbnb')
                    )
                )
            """
        )

        browser.close()

    # ------------------------------------------------------------
    # Build photo list
    # ------------------------------------------------------------

    photos = []

    # First: structured photo objects
    for obj in photo_objects:

        photo_url = extract_url_from_photo(obj)

        if not photo_url:
            continue

        caption = extract_possible_caption(obj)

        photos.append({
            "url": upgrade_image_url(photo_url),
            "caption": caption,
        })

    # Second: DOM URLs as fallback
    for photo_url in dom_urls:

        if not photo_url:
            continue

        photos.append({
            "url": upgrade_image_url(photo_url),
            "caption": "",
        })

    # ------------------------------------------------------------
    # De-duplicate
    # ------------------------------------------------------------

    unique = []
    seen = set()

    for photo in photos:

        url = photo["url"]

        if url in seen:
            continue

        seen.add(url)
        unique.append(photo)

    photos = unique

    print(f"Found {len(photos)} unique photo URLs.")
    print()

    if not photos:
        print(
            "No photos found. Airbnb may have changed its page "
            "structure or blocked the automated request."
        )
        return

    # Save metadata too, which is useful for debugging.
    # ------------------------------------------------------------
    # Download
    # ------------------------------------------------------------

    session = requests.Session()

    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    })

    saved_index = 0
    saved_photos = []

    for index, photo in enumerate(photos, start=1):

        url = photo["url"]
        caption = clean_name(photo["caption"])

        # Use caption when available.
        # Otherwise use generic numbering.
        # Numbering is sequential over photos that are actually kept.
        if caption:
            base_name = f"{saved_index + 1:03d}_{caption}"
        else:
            base_name = f"{saved_index + 1:03d}_photo"

        # Most Airbnb listing images are JPEG/PNG/WebP.
        extension = ".jpg"

        path = make_unique_filename(
            output,
            base_name,
            extension,
        )

        print(
            f"[{index:03d}/{len(photos):03d}] "
            f"{path.name}"
        )

        try:
            download_image(
                session,
                url,
                path,
            )

        except Exception as e:

            print(
                f"    FAILED: {e}"
            )

            # Try the original URL if our upgrade altered it.
            try:

                original_url = photo["url"]

                download_image(
                    session,
                    original_url,
                    path,
                )

            except Exception:
                pass

        # Ignore tiny images (icons, avatars, thumbnails, placeholders).
        min_size = int(min_size_kb * 1024)

        if path.exists():
            size = path.stat().st_size

            if size < min_size:
                path.unlink()
                print(
                    f"    SKIPPED: {size/1024:.1f} KB "
                    f"(minimum {min_size_kb:g} KB)"
                )
            else:
                saved_index += 1
                saved_photos.append({
                    "url": photo["url"],
                    "caption": photo["caption"],
                })

        # Don't hammer Airbnb's CDN.
        time.sleep(0.3)

    # Save metadata for the photos that were actually kept.
    metadata_file = output / "photos.json"

    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(
            saved_photos,
            f,
            indent=2,
            ensure_ascii=False,
        )

    print()
    print(f"Downloaded {saved_index} photos.")
    print("Done.")
    print(f"Photos: {output.resolve()}")
    print(f"Metadata: {metadata_file.resolve()}")


# ------------------------------------------------------------
# CLI
# ------------------------------------------------------------

if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Download large photos from an Airbnb listing."
    )

    parser.add_argument(
        "listing_id",
        help="Airbnb listing ID",
    )

    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Output directory",
    )

    parser.add_argument(
        "--min-size",
        type=float,
        default=DEFAULT_MIN_SIZE_KB,
        metavar="KB",
        help=(
            "Skip images smaller than this size in KB "
            f"(default: {DEFAULT_MIN_SIZE_KB:g})"
        ),
    )

    args = parser.parse_args()

    output_dir = args.output

    if not output_dir:
        output_dir = f"airbnb_{args.listing_id}"

    scrape_listing(
        args.listing_id,
        output_dir,
        min_size_kb=args.min_size,
    )
