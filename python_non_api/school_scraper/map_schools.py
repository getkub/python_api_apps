import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
from concurrent.futures import ThreadPoolExecutor, as_completed
import folium
import pickle
import time

# Define output paths
csv_output_path = "/tmp/top_secondary_schools_full.csv"
map_output_path = "/tmp/top_secondary_schools_map.html"
cache_output_path = "/tmp/geocode_cache.pkl"

# Load the data
df = pd.read_csv(csv_output_path)

# Initialize geolocator
geolocator = Nominatim(user_agent="school_locator")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

# Load cached coordinates if available
try:
    with open(cache_output_path, 'rb') as f:
        geocode_cache = pickle.load(f)
except FileNotFoundError:
    geocode_cache = {}

# Function to get coordinates with caching
def get_coordinates(address):
    if address in geocode_cache:
        return address, geocode_cache[address]
    else:
        try:
            location = geocode(address)
            if location:
                coords = (location.latitude, location.longitude)
                geocode_cache[address] = coords
                return address, coords
            else:
                print(f"Address not found: {address}")
                return address, None
        except Exception as e:
            print(f"Error geocoding {address}: {e}")
            return address, None

# Function to retry geocoding with partial name
def retry_with_partial_name(school_name):
    # Use the portion of the school name after the first comma
    address = f"{school_name.split(',', 1)[-1].strip()}"
    print(f"Retrying with partial name: {address}")
    return get_coordinates(address)

# Initial geocoding
start_time = time.time()
df['Address'] = df['School']  # Initial attempt using just the school name

# Get coordinates for each address using concurrent requests
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(get_coordinates, address): address for address in df['Address']}
    results = {}
    failed_addresses = []  # List to track addresses that failed

    for future in as_completed(futures):
        address = futures[future]
        address, coords = future.result()
        if coords:
            results[address] = coords
        else:
            # Capture the full address that failed
            item = df[df['Address'] == address].iloc[0]
            failed_addresses.append(item)
            print(f"Failed to geocode address: {address}")

# Retry geocoding failed addresses using partial name
retry_start_time = time.time()
with ThreadPoolExecutor(max_workers=5) as executor:
    partial_retry_futures = {
        executor.submit(retry_with_partial_name, item['School']): item for item in failed_addresses
    }
    for future in as_completed(partial_retry_futures):
        item = partial_retry_futures[future]
        address, coords = future.result()
        if coords:
            # Update results with retry coordinates
            results[address] = coords
        else:
            print(f"Partial retry failed for address: {item['School'].split(',', 1)[-1].strip()}")

# Print results for debugging
# print("Results after retries:")
# for address, coords in results.items():
#     print(f"{address}: {coords}")

# Map retry results back to original DataFrame
# Ensure correct address formatting
df['Retry Address'] = df['School'].apply(lambda x: x.split(',', 1)[-1].strip())
df['Coordinates'] = df['Retry Address'].map(results)

# Add coordinates for original addresses that were not retried
# Ensure coordinates from initial geocoding are included
df.loc[df['Coordinates'].isna(), 'Coordinates'] = df['Address'].map(results)

# Drop rows where coordinates are None
df_with_coords = df.dropna(subset=['Coordinates'])

# Print information about missing data
missing_count = len(df) - len(df_with_coords)
if missing_count > 0:
    print(f"Number of addresses not geocoded: {missing_count}")

# Predefined color gradient from green to yellow to red
color_gradient = [
    "#00ff00", "#33ff00", "#66ff00", "#99ff00", "#ccff00", 
    "#ffff00", "#ffcc00", "#ff9900", "#ff6600", "#ff3300", 
    "#ff0000"
]

# Function to get color based on rank
def get_color(rank, total_ranks):
    gradient_index = min(int((rank / total_ranks) * (len(color_gradient) - 1)), len(color_gradient) - 1)
    return color_gradient[gradient_index]

# Create a map
if not df_with_coords.empty:
    map_center = df_with_coords['Coordinates'].iloc[0]  # Center map around the first school
    school_map = folium.Map(location=map_center, zoom_start=10)

    # Add points to the map
    total_ranks = len(df_with_coords)
    for idx, row in df_with_coords.iterrows():
        rank = int(row['Order'])
        color = get_color(rank, total_ranks)
        folium.CircleMarker(
            location=row['Coordinates'],
            radius=8,
            color=color,
            fill=True,
            fill_color=color,
            fill_opacity=0.7,
            popup=f"Rank {rank}: {row['School']}\n{row['Postcode']}",
            tooltip=f"Rank {rank}"
        ).add_to(school_map)

    # Save the map to an HTML file
    school_map.save(map_output_path)
    print(f"Map has been saved to {map_output_path}")
else:
    print("No valid coordinates to display on the map.")
