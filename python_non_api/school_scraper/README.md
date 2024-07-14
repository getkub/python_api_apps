
##  Install Dependencies

```
venv_dir="~/Documents/removeMe/python_venv"
python3 -m venv ${venv_dir}
source ${venv_dir}/bin/activate
python3 -m pip install requests beautifulsoup4 pandas selenium
```

## Run the script

- With pagination
```
URL="from_a_list"
python3 ${script_dir}/download_schools.py ${URL}
```

### Filters
- Filter out boys or girls school (example shows how to filter out girls schools)
- Filter IN only schools in Melbourne (postcodes 30* or 31*)

```
pip install geopy folium
python3 ${script_dir}/filter_schools.py
```

### GeoCode
```
pip install geopy folium
python ${script_dir}/map_schools.py

```

### Now map into Geo Locations

```
pip install geopy folium
python3 ${script_dir}/map_schools.py
```

