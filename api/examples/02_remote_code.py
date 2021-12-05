from typing import Optional
from fastapi import FastAPI
import sys
sys.path.insert(0,'../..')
from importlib import import_module

app = FastAPI()

@app.get("/")
def read_root():
    from python_apps.p02_remote_code.src.app import run_me_1
    return (run_me_1("02_remote_code"))

@app.get("/items/{item_id}")
def read_item(item_id: int):
    from python_apps.p02_remote_code.src.app import run_me_1
    return (run_me_1(item_id))

# uvicorn 02_remote_code:app --reload