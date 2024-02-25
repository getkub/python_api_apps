from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
import uvicorn
from api.data import get_data
import os

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

# Include your API routes
app.include_router(api_router)

if __name__ == "__main__":
    try:
        # Print the current working directory
        print("Current working directory:", os.getcwd())

        # Print the absolute path to data.json
        print("Absolute path to data.json:", os.path.abspath("api/data.json"))

        uvicorn.run(app, host="localhost", port=8000)
    except Exception as e:
        print("Exception:", str(e))
