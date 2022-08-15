from typing import Optional
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
import sys
sys.path.insert(0,'../..')
from importlib import import_module
import csv
from flask import make_response
import io
from fastapi.templating import Jinja2Templates

from python_apps.p09_csv_gui import main

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


# NOT WORKING


# uvicorn 09_csv_gui:app --reload