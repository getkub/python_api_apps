import pandas as pd
import folium
import random

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
    """Load Australian postcodes and their coordinates into a cache."""
    aus_postcodes_df = pd.read_csv(filepath)
    return dict(zip(aus_postcodes_df['postcode'].astype(str), 
                    zip(aus_postcodes_df['lat'], aus_postcodes_df['long'], aus_postcodes_df['locality'])))

def get_coords_with_jitter(postcode, cache, index=0):
    """Get coordinates for a postcode with a small jitter to avoid overlap."""
    base_coords = cache.get(str(postcode))
    if base_coords:
        # Add small offsets to latitude and longitude to avoid overlap
        jitter = 0.005  # Adjust this value as needed for spacing
        lat_offset = jitter * (index % 5 - 2)  # Create an offset pattern (-2 to 2)
        long_offset = jitter * (index // 5 - 2)
        return base_coords[0] + lat_offset, base_coords[1] + long_offset
    return None

def get_color(rank, total_ranks):
    """Determine the color for a school based on its rank."""
    gradient_index = min(int((rank / total_ranks) * (len(COLOR_GRADIENT) - 1)), len(COLOR_GRADIENT) - 1)
    return COLOR_GRADIENT[gradient_index]

def map_schools(df, postcode_cache):
    """Map schools to a folium map and save it."""
    # Create a map centered on Melbourne
    melbourne_coords = (-37.8136, 144.9631)
    school_map = folium.Map(location=melbourne_coords, zoom_start=11)

    # Initialize variables
    schools_mapped = 0
    total_schools = len(df)
    postcode_counters = {}
    unmapped_schools = []

    # Iterate over the DataFrame and map each school
    for idx, row in df.iterrows():
        postcode = row['Postcode']
        suburb = row['Suburb']
        
        # Ensure postcode is valid, otherwise log the school
        if not postcode:
            print(f"Warning: Skipping school {row['School']} due to missing postcode.")
            unmapped_schools.append(row['School'])
            continue

        # Keep track of how many schools share the same postcode
        if postcode not in postcode_counters:
            postcode_counters[postcode] = 0
        else:
            postcode_counters[postcode] += 1

        # Get coordinates with jitter, ignoring suburb for mapping
        coords = get_coords_with_jitter(postcode, postcode_cache, postcode_counters[postcode])
        
        if coords:
            color = get_color(row['Order'], total_schools)
            popup_content = f"""
            <b>Rank {row['Order']}: {row['School']}</b><br>
            Score: {row['Overall Score']}%<br>
            Sector: {row['Sector']}<br>
            SES: {row['SES']}
            """
            folium.CircleMarker(
                location=coords,
                radius=8,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.7,
                popup=popup_content,
                tooltip=f"Rank {row['Order']}: {row['School']}"
            ).add_to(school_map)
            schools_mapped += 1
        else:
            print(f"Warning: School {row['School']} with postcode {postcode} could not be mapped.")
            unmapped_schools.append(row['School'])

    # Save map and log results
    school_map.save(MAP_OUTPUT_PATH)
    print(f"Mapped {schools_mapped} out of {total_schools} schools.")
    if unmapped_schools:
        print(f"The following schools could not be mapped: {', '.join(unmapped_schools)}")
    print(f"Map has been saved to {MAP_OUTPUT_PATH}")

# Main execution
if __name__ == "__main__":
    # Load postcode cache
    print("Loading postcode data...")
    postcode_cache = load_postcode_cache(POSTCODE_DATA_PATH)

    # Load school data
    print("Loading school data...")
    df = pd.read_csv(CSV_OUTPUT_PATH)

    # Map schools
    map_schools(df, postcode_cache)