from typing import Optional
from fastapi import FastAPI
import sys
sys.path.insert(0,'../..')
from importlib import import_module

from python_apps.p20_ml_prediction import main

app = FastAPI()

# Creates new instance.
my_instance = main.p20_ml()

# Defaults
ml_to_run="ml1"

@app.get("/")
def read_root():
    """
    Displays main page
    """
    return (my_instance.predict_nationality(ml_to_run))

@app.get("/{item_id}")
def read_item(item_id: str):
    """
    Displays apps page. Pass item_id
    """
    ml_to_run=item_id
    return (my_instance.predict_nationality(ml_to_run))

# uvicorn 20_ml1:app --reload


# http://127.0.0.1:8000/apps/app_00
# http://127.0.0.1:8000/apps/app_01
# http://127.0.0.1:8000/apps/app_02