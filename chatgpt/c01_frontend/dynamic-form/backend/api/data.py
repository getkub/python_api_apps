# api/data.py
import os
import json

def get_data():
    data_file_path = 'data.json'

    if not os.path.exists(data_file_path) or os.path.getsize(data_file_path) == 0:
        # If the file does not exist or is empty, return an empty list
        return []

    with open(data_file_path) as file:
        data = json.load(file)

    return data

def save_data(data):
    data_file_path = 'data.json'

    with open(data_file_path, 'w') as file:
        json.dump(data, file)
