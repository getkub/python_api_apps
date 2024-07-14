
##  Install Dependencies

```
python3 -m venv  ~/Documents/removeMe/python_venv 
source ~/Documents/removeMe/python_venv/bin/activate
python3 -m pip install requests beautifulsoup4 pandas selenium
```

## Run the script

- With pagination
```
python3 ./scrape_schools.py
```

### Filters
- Filter out boys or girls school (example shows how to filter out girls schools)
- Filter IN only schools in Melbourne (postcodes 30* or 31*)

```
pip install geopy folium
python3 ./map_schools.py
```

### Now map into Geo Locations

```
pip install geopy folium
python3 ./map_schools.py
```

