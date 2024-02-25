# api/routes.py
from fastapi import APIRouter, Request, HTTPException
from api.data import get_data, save_data
import json
import yaml

router = APIRouter()

@router.post("/api/submit-form")
async def submit_form(request: Request):
    try:
        # Print received request body for debugging
        print("Received JSON data:", await request.body())
        
        form_data = await request.json()
        existing_data = get_data()

        # Handle form submission logic here
        # For debugging, print the existing data and form data
        print("Existing Data:", existing_data)
        print("Form Data:", form_data)

        # Process the form data and perform any necessary actions
        # ...

        # Append form data to existing data
        existing_data.append(form_data)

        # Save the updated data to data.json
        save_data(existing_data)

        # Append form data to the YAML file at /tmp/fulldata.yaml
        yaml_file_path = '/tmp/fulldata.yaml'
        with open(yaml_file_path, 'a') as yaml_file:
            yaml.dump([form_data], yaml_file, default_flow_style=False)

        return {"message": "Form submitted successfully", "data": form_data}
    except json.JSONDecodeError as e:
        # Handle JSONDecodeError (invalid JSON or empty body)
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
    except Exception as e:
        # Handle other exceptions and print detailed error message
        print(f"Internal Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
