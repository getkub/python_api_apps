import os
import json

def get_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_file_path = os.path.join(base_dir, 'data.json')

    if not os.path.exists(data_file_path):
        with open(data_file_path, 'w') as file:
            json.dump({}, file)

    with open(data_file_path) as file:
        data = json.load(file)

    return data
