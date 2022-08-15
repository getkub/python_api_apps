from typing import Optional
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
import sys
sys.path.insert(0,'../..')
from importlib import import_module
from fastapi.templating import Jinja2Templates

from python_apps.p06_gui import main

app = FastAPI()
templates_dir='templates'
static_dir='/static'
#print(static_dir)
app.mount(static_dir, StaticFiles(directory="static"), name="static")

# Creates new instance.
my_instance = main.p09_csv_gui()
templates = Jinja2Templates(directory=templates_dir)

# Defaults
app_to_run="app_00"
app_fn="app_00_fn"

@app.get("/")
def read_root(request: Request):
    """
    Displays main page
    """
    return templates.TemplateResponse("p09_main.html", {"request": request})


# uvicorn p09_csv_gui:app --reload