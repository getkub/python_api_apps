from typing import Optional, List
from fastapi import FastAPI, Request, Query
import sys
sys.path.insert(0,'../..')
from importlib import import_module

from python_apps.p20_ml_prediction import main

app = FastAPI()

# Creates new instance.
my_instance = main.p20_ml()

# Defaults
sample_data="Lee"

@app.get("/")
def read_root():
    """
    Displays main page
    """
    return (my_instance.predict_nationality(sample_data))

@app.get("/names/")
async def read_item(request: Request, name: str = Query(None, min_length=3, max_length=50)):
    if request.method == 'GET':
        namequery = request.query_params["name"]
        data = [namequery]
        result = my_instance.predict_nationality(data)
        return {"orig_name": data, "prediction": result}

# uvicorn 20_ml1:app --reload
# http://127.0.0.1:8000/names/?name=Lee
