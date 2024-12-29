
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

## Below example is to filter for Victoria - Melbourne ONLY
## Change parameters to do for other states
python3 ${script_dir}/filter_schools_vic.py
```

### GeoCode
```
pip install geopy folium
python3 ${script_dir}/map_schools.py

```

### Using the version2 script with local mapping

```
python3 ${script_dir}/cleanup_postcode.py
python3 ${script_dir}/map_schools_v2.py
```

