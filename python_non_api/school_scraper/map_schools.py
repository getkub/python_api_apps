import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import folium
import pickle
import time

# Define output paths
csv_output_path = "/tmp/filtered_top_secondary_schools.csv"
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
        return geocode_cache[address]
    else:
        try:
            location = geocode(address)
            if location:
                coords = (location.latitude, location.longitude)
                geocode_cache[address] = coords
                return coords
            else:
                return None
        except Exception as e:
            print(f"Error geocoding {address}: {e}")
            return None

# Create a list of addresses
df['Address'] = df['School'] + ',' + df['Postcode'].astype(str)

# Get coordinates for each address
start_time = time.time()
df['Coordinates'] = df['Address'].apply(get_coordinates)
print(f"Geocoding completed in {time.time() - start_time:.2f} seconds")

# Save the cache
with open(cache_output_path, 'wb') as f:
    pickle.dump(geocode_cache, f)

# Drop rows where coordinates are None
df = df.dropna(subset=['Coordinates'])

# Create a map
map_center = df['Coordinates'].iloc[0]  # Center map around the first school
school_map = folium.Map(location=map_center, zoom_start=10)

# Add points to the map
for idx, row in df.iterrows():
    folium.Marker(location=row['Coordinates'], 
                  popup=f"{row['School']}\n{row['Postcode']}",
                  tooltip=row['School']).add_to(school_map)

# Save the map to an HTML file
school_map.save(map_output_path)

print(f"Map has been saved to {map_output_path}")
