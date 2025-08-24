"""
FastAPI backend for image edit/generation (scaffold).
"""

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Image Gen API - scaffold"}
