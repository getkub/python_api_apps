from typing import Optional
from fastapi import FastAPI
import sys
sys.path.insert(0,'../..')
from importlib import import_module

from python_apps.p03_distributor import caller

app = FastAPI()

# Creates new instance.
my_instance = caller.p03_distributor()

# Defaults
app_to_run="app_00"
app_fn="app_00_fn"

@app.get("/")
def read_root():
    """
    Displays main page
    """
    return (my_instance.run_distributor(app_to_run,app_fn))

@app.get("/apps/{item_id}")
def read_item(item_id: str):
    """
    Displays apps page. Pass item_id
    """
    app_to_run=item_id
    app_fn=item_id+"_fn"
    return (my_instance.run_distributor(app_to_run,app_fn))

# uvicorn 03_distributor:app --reload


# http://127.0.0.1:8000/apps/app_00
# http://127.0.0.1:8000/apps/app_01
# http://127.0.0.1:8000/apps/app_02