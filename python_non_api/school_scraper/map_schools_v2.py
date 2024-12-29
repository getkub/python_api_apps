import pandas as pd
import folium

# Define input/output paths
CSV_OUTPUT_PATH = "/tmp/top_secondary_schools_clean.csv"
MAP_OUTPUT_PATH = "/tmp/top_secondary_schools_map.html"
POSTCODE_DATA_PATH = "/tmp/australian_postcodes.csv"

# Predefined color gradient from green to red
COLOR_GRADIENT = [
    "#00ff00", "#33ff00", "#66ff00", "#99ff00", "#ccff00", 
    "#ffff00", "#ffcc00", "#ff9900", "#ff6600", "#ff3300", 
    "#ff0000"
]

def load_postcode_cache(filepath):
    """Load Australian postcodes and their precise coordinates into a cache."""
    aus_postcodes_df = pd.read_csv(filepath)
    cache = {}
    for _, row in aus_postcodes_df.iterrows():
        postcode = str(row['postcode'])
        if postcode not in cache:
            cache[postcode] = []
        cache[postcode].append({
            'lat': row['Lat_precise'],
            'long': row['Long_precise'],
            'locality': row['locality']
        })
    return cache

def get_coords_with_jitter(postcode, suburb, cache, index=0):
    """Get precise coordinates for a postcode with a small jitter to avoid overlap."""
    coords_list = cache.get(str(postcode), [])
    if not coords_list:
        return None

    for entry in coords_list:
        locality = entry['locality']
        if suburb and isinstance(locality, str):
            if locality.strip().lower() == suburb.strip().lower():
                jitter = 0.005  # Reduced jitter for precise coordinates
                lat_offset = jitter * (index % 3 - 1)
                long_offset = jitter * (index // 3 - 1)
                return entry['lat'] + lat_offset, entry['long'] + long_offset
    
    # If no suburb match, use the first entry in the list for that postcode
    if coords_list:
        jitter = 0.00005  # Even smaller jitter for postcode only
        lat_offset = jitter * (index % 3 - 1)
        long_offset = jitter * (index // 3 - 1)
        return coords_list[0]['lat'] + lat_offset, coords_list[0]['long'] + long_offset

    return None

def get_color(rank, total_ranks):
    """Determine the color for a school based on its rank."""
    gradient_index = min(int((rank / total_ranks) * (len(COLOR_GRADIENT) - 1)), len(COLOR_GRADIENT) - 1)
    return COLOR_GRADIENT[gradient_index]

def map_schools(df, postcode_cache):
    """Map schools to a folium map and save it."""
    melbourne_coords = (-37.8136, 144.9631)
    school_map = folium.Map(location=melbourne_coords, zoom_start=14)  # Increased zoom for better detail

    schools_mapped = 0
    total_schools = len(df)
    postcode_suburb_counters = {}
    unmapped_schools = []

    # Sort DataFrame by 'Suburb' then 'Postcode' for consistent mapping order
    df_sorted = df.sort_values(['Suburb', 'Postcode'], na_position='last')

    for idx, row in df_sorted.iterrows():
        postcode = str(row['Postcode'])  # Ensure postcode is string for consistency
        suburb = row['Suburb'] if pd.notna(row['Suburb']) else None
        
        if not postcode:
            print(f"Warning: Skipping school {row['School']} due to missing postcode.")
            unmapped_schools.append(row['School'])
            continue

        # Track schools by postcode and suburb
        if postcode not in postcode_suburb_counters:
            postcode_suburb_counters[postcode] = {}
        if suburb not in postcode_suburb_counters[postcode]:
            postcode_suburb_counters[postcode][suburb] = 0
        postcode_suburb_counters[postcode][suburb] += 1

        # Get coordinates
        coords = get_coords_with_jitter(postcode, suburb, postcode_cache, postcode_suburb_counters[postcode][suburb])
        
        if coords:
            color = get_color(row['Order'], total_schools)
            popup_content = f"""
            <b>Rank {row['Order']}: {row['School']}</b><br>
            Score: {row['Overall Score']}%<br>
            Sector: {row['Sector']}<br>
            SES: {row['SES'] if pd.notna(row['SES']) else 'N/A'}
            """
            print(f"Matched {row['School']} at {coords} with suburb {suburb}")
            folium.CircleMarker(
                location=coords,
                radius=8,  # Increased for visibility
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=1.0,  # Full opacity
                popup=popup_content,
                tooltip=f"Rank {row['Order']}: {row['School']}"
            ).add_to(school_map)
            schools_mapped += 1
        else:
            print(f"Warning: School {row['School']} with postcode {postcode} and suburb {suburb} could not be mapped.")
            unmapped_schools.append(row['School'])

    # Save map and log results
    school_map.save(MAP_OUTPUT_PATH)
    print(f"Mapped {schools_mapped} out of {total_schools} schools.")
    if unmapped_schools:
        print(f"The following schools could not be mapped: {', '.join(unmapped_schools)}")
    print(f"Map has been saved to {MAP_OUTPUT_PATH}")

# Main execution
if __name__ == "__main__":
    print("Loading postcode data...")
    postcode_cache = load_postcode_cache(POSTCODE_DATA_PATH)

    print("Loading school data...")
    df = pd.read_csv(CSV_OUTPUT_PATH, keep_default_na=False, na_values=["_"])

    map_schools(df, postcode_cache)