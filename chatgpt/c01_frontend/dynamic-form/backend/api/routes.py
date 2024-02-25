# api/routes.py
from fastapi import APIRouter, Request, HTTPException
from api.data import get_data
import json
import yaml
import os

router = APIRouter()

@router.post("/api/submit-form")
async def submit_form(request: Request):
    try:
        form_data = await request.json()

        existing_data = get_data()
        print("Existing Data:", existing_data)

        # Process the form data and perform any necessary actions
        # ...

        # Append the form data to the YAML file
        append_to_yaml(form_data)

        return {"message": "Form submitted successfully", "data": form_data}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/api/get-existing-data")
async def get_existing_data():
    try:
        existing_data = get_data()
        return existing_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

def append_to_yaml(data):
    yaml_path = '/tmp/fulldata.yaml'

    # Create the YAML file if it doesn't exist
    if not os.path.exists(yaml_path):
        with open(yaml_path, 'w') as yaml_file:
            yaml.dump([], yaml_file)

    # Load existing YAML data
    with open(yaml_path, 'r') as yaml_file:
        existing_yaml_data = yaml.safe_load(yaml_file)

    # Append the new data to the YAML file
    existing_yaml_data.append(data)
    with open(yaml_path, 'w') as yaml_file:
        yaml.dump(existing_yaml_data, yaml_file)
