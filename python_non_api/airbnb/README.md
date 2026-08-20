# Airbnb imagepuller

Downloads the photos from an Airbnb listing into a local folder.

## Requirements

- Python 3.11+
- Chromium browser (installed via Playwright)

## Setup (first time)

```bash
# From this directory
cd python_non_api/airbnb

# 1. Create and activate the virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 2. Install Python packages
pip install -r requirements.txt

# 3. Install the Chromium browser for Playwright
playwright install chromium
```

## Run

```bash
# Activate the venv each session (if not already active)
source .venv/bin/activate

# Basic usage -- downloads into ./airbnb_<listing_id>/
python imagepuller.py 1149110215582824847

# Or run without activating the venv
.venv/bin/python imagepuller.py 1149110215582824847
```

### Options

| Option | Description | Default |
|---|---|---|
| `listing_id` | Airbnb listing ID (required) | — |
| `-o, --output DIR` | Output directory | `./airbnb_<listing_id>/` |
| `--min-size KB` | Skip downloaded images smaller than this (KB) | `50` |

### Examples

```bash
# Output to a custom folder
python imagepuller.py 1149110215582824847 -o /tmp/airbnb/1149110215582824847

# Skip images under 100 KB instead of the 50 KB default
python imagepuller.py 1149110215582824847 --min-size 100
```

## Output

Photos are written to the output folder with sequential names:

```
001_Bungalow next to Country Park.jpg
002_photo.jpg
003_photo.jpg
...
photos.json   # URL + caption metadata for each kept photo
```

Images smaller than `--min-size` are deleted automatically and reported as
`SKIPPED` in the log.

## Notes

- Expect it to take ~1 minute per listing (page load + scroll + downloads).
- Some placeholder/avatar URLs may fail with HTTP 400 — that's expected and harmless.