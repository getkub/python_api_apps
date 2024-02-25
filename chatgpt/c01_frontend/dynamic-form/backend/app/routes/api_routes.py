# backend/app/routes/api_routes.py
from fastapi import APIRouter
from fastapi import HTTPException, Request
from app.data.data_manager import get_data, save_data
import json

router = APIRouter()

@router.post("/api/submit-form")
async def submit_form(request: Request):
    try:
        # Your existing submit_form logic here
        print("Received JSON data:", await request.body())
        
        form_data = await request.json()
        existing_data = get_data()

        print("Existing Data:", existing_data)
        print("Form Data:", form_data)

        save_data(form_data)
        return {"message": "Form submitted successfully", "data": form_data}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/api/get-data")
async def get_data_route():
    data = get_data()
    return data
