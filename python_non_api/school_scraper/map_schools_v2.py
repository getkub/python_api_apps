import pandas as pd
import folium
import os
import requests
import re

# Define input/output paths
CSV_OUTPUT_PATH = "/tmp/top_secondary_schools_clean.csv"
MAP_OUTPUT_PATH = "/tmp/top_secondary_schools_map.html"
POSTCODE_DATA_PATH = "/tmp/australian_postcodes.csv"

# URL for Australian postcode data
POSTCODE_DATA_URL = "https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv"

# Predefined color gradient from green to red
COLOR_GRADIENT = [
    "#004d00", "#006600", "#007f00", "#009900", "#00b200", "#00cc00", "#00e500", "#00ff00", "#1aff00", "#33ff00",
    "#4dff00", "#66ff00", "#7fff00", "#99ff00", "#b2ff00", "#ccff00", "#e5ff00", "#ffff00", "#ffcc00", "#ffaa00",
    "#ff9900", "#ff8800", "#ff7700", "#ff6600", "#ff5500", "#ff4400", "#ff3300", "#ff2200", "#ff1100", "#ff0000"
]

def download_postcode_data(url, output_path):
    """Download the postcode data from the given URL and save it to output_path."""
    try:
        print(f"Downloading postcode data from {url}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f"Postcode data saved to {output_path}")
    except requests.RequestException as e:
        print(f"Error downloading postcode data: {e}")
        raise SystemExit(f"Failed to download postcode data. Please check your internet connection or download the file manually from {url}.")

def load_postcode_cache(filepath):
    """Load Australian postcodes and their precise coordinates into a cache."""
    if not os.path.exists(filepath):
        download_postcode_data(POSTCODE_DATA_URL, filepath)

    aus_postcodes_df = pd.read_csv(filepath)
    cache = {}
    for _, row in aus_postcodes_df.iterrows():
        postcode = str(row['postcode']).strip()
        if postcode and pd.notna(row['Lat_precise']) and pd.notna(row['Long_precise']):
            if postcode not in cache:
                cache[postcode] = []
            cache[postcode].append({
                'lat': row['Lat_precise'],
                'long': row['Long_precise'],
                'locality': str(row['locality']).strip().lower() if pd.notna(row['locality']) else ''
            })
    return cache

def clean_postcode(postcode):
    """Clean postcode by removing non-numeric values and ensuring it's a valid 4-digit string."""
    if pd.isna(postcode) or not postcode:
        return None
    cleaned = re.sub(r'[^0-9]', '', str(postcode))
    return cleaned if len(cleaned) == 4 else None

def get_coords_with_jitter(postcode, suburb, cache, index=0):
    """Get precise coordinates for a postcode with a small jitter to avoid overlap."""
    postcode = clean_postcode(postcode)
    if not postcode:
        return None

    coords_list = cache.get(postcode, [])
    if not coords_list:
        return None

    suburb = suburb.strip().lower() if isinstance(suburb, str) else ''

    for entry in coords_list:
        locality = entry['locality']
        if locality and (suburb == locality or suburb in locality or locality in suburb):
            jitter = 0.005
            lat_offset = jitter * (index % 3 - 1)
            long_offset = jitter * (index // 3 - 1)
            return entry['lat'] + lat_offset, entry['long'] + long_offset

    # Fallback: return first entry with small jitter
    jitter = 0.00005
    lat_offset = jitter * (index % 3 - 1)
    long_offset = jitter * (index // 3 - 1)
    return coords_list[0]['lat'] + lat_offset, coords_list[0]['long'] + long_offset

def get_color(rank, total_ranks):
    """Determine the color for a school based on its rank."""
    gradient_index = min(int((rank / total_ranks) * (len(COLOR_GRADIENT) - 1)), len(COLOR_GRADIENT) - 1)
    return COLOR_GRADIENT[gradient_index]

def map_schools(df, postcode_cache):
    """Map schools to a folium map and save it."""
    melbourne_coords = (-37.8136, 144.9631)
    school_map = folium.Map(location=melbourne_coords, zoom_start=12)

    schools_mapped = 0
    total_schools = len(df)
    postcode_suburb_counters = {}
    unmapped_schools = []

    df['Postcode'] = df['Postcode'].apply(clean_postcode)
    df_sorted = df.sort_values(['Suburb', 'Postcode'], na_position='last')

    for idx, row in df_sorted.iterrows():
        postcode = row['Postcode']
        suburb = row['Suburb'] if pd.notna(row['Suburb']) else None
        school_name = row['School']

        if not postcode:
            unmapped_schools.append(school_name)
            continue

        if postcode not in postcode_suburb_counters:
            postcode_suburb_counters[postcode] = {}
        if suburb not in postcode_suburb_counters[postcode]:
            postcode_suburb_counters[postcode][suburb] = 0
        postcode_suburb_counters[postcode][suburb] += 1

        coords = get_coords_with_jitter(postcode, suburb, postcode_cache, postcode_suburb_counters[postcode][suburb])

        if coords:
            color = get_color(row['Order'], total_schools)
            popup_content = f"""
            <b>Rank {row['Order']}: {school_name}</b><br>
            Score: {row['Overall Score']}%<br>
            Sector: {row['Sector']}<br>
            SES: {row['SES'] if pd.notna(row['SES']) else 'N/A'}
            """
            folium.CircleMarker(
                location=coords,
                radius=8,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=1.0,
                popup=popup_content,
                tooltip=f"Rank {row['Order']}: {school_name}"
            ).add_to(school_map)
            schools_mapped += 1
        else:
            unmapped_schools.append(school_name)

    school_map.save(MAP_OUTPUT_PATH)
    print(f"Mapped {schools_mapped} out of {total_schools} schools.")
    if unmapped_schools:
        print("Unmapped schools:")
        for s in unmapped_schools:
            print(f" - {s}")
    print(f"Map saved to {MAP_OUTPUT_PATH}")

# Main execution
if __name__ == "__main__":
    print("Loading postcode data...")
    postcode_cache = load_postcode_cache(POSTCODE_DATA_PATH)

    print("Loading school data...")
    df = pd.read_csv(CSV_OUTPUT_PATH, keep_default_na=False, na_values=["_"])

    map_schools(df, postcode_cache)
