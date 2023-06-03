import json

def get_data():
    with open('data.json') as file:
        data = json.load(file)
    return data
