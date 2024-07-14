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
                return address, None
        except Exception as e:
            print(f"Error geocoding {address}: {e}")
            return address, None

# Create a list of addresses
df['Address'] = df['School'] + ',' + df['Postcode'].astype(str)

# Get coordinates for each address using concurrent requests
start_time = time.time()

# Using ThreadPoolExecutor to parallelize the geocoding requests
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(get_coordinates, address) for address in df['Address']]
    results = {}
    for future in as_completed(futures):
        address, coords = future.result()
        if coords:
            results[address] = coords

# Update DataFrame with results
df['Coordinates'] = df['Address'].map(results)
print(f"Geocoding completed in {time.time() - start_time:.2f} seconds")

# Save the cache
with open(cache_output_path, 'wb') as f:
    pickle.dump(geocode_cache, f)

# Drop rows where coordinates are None
df = df.dropna(subset=['Coordinates'])

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
map_center = df['Coordinates'].iloc[0]  # Center map around the first school
school_map = folium.Map(location=map_center, zoom_start=10)

# Add points to the map
total_ranks = len(df)
for idx, row in df.iterrows():
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
