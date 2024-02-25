from fastapi import APIRouter, Request, HTTPException
from api.data import get_data
import json

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

        return {"message": "Form submitted successfully", "data": form_data}
    except json.JSONDecodeError as e:
        # Handle JSONDecodeError (invalid JSON or empty body)
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
