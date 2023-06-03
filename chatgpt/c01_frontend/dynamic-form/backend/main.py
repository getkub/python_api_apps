from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Add the URL of your React application
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define your routes
@app.get("/api/form")
async def get_form():
    return {"message": "Get form data"}

@app.post("/api/submit-form")
async def submit_form(request: Request):
    form_data = await request.json()
    try:
        # Handle form submission logic here
        # Process the form data and perform any necessary actions
        # ...
        return {"message": "Form submitted successfully", "data": form_data}
    except Exception as e:
        return {"message": "Internal Server Error", "error": str(e)}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
