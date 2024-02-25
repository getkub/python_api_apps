# backend/app/data/data_manager.py

import json

DATA_FILE_PATH = "/tmp/fulldata.yaml"

def get_data():
    try:
        with open(DATA_FILE_PATH, "r") as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []
    return data

def save_data(new_data):
    existing_data = get_data()
    existing_data.append(new_data)
    with open(DATA_FILE_PATH, "w") as file:
        json.dump(existing_data, file)
