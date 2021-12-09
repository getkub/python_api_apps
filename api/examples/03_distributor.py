from typing import Optional
from fastapi import FastAPI
import sys
sys.path.insert(0,'../..')
from importlib import import_module

app = FastAPI()

# Defaults
app_to_run="app_01"
app_fn="app_01_fn"

@app.get("/")
def read_root():
    from python_apps.p03_distributor import caller
    # Creates new instance.
    p03_distributor_instance = caller.p03_distributor()
    return (p03_distributor_instance.run_distributor(app_to_run,app_fn))

@app.get("/apps/{item_id}")
def read_item(item_id: str):
    from python_apps.p03_distributor import caller
    app_to_run=item_id
    app_fn=item_id+"_fn"
    # Creates new instance.
    p03_distributor_instance = caller.p03_distributor()
    return (p03_distributor_instance.run_distributor(app_to_run,app_fn))

# uvicorn 03_distributor:app --reload