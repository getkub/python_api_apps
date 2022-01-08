# Code to distribute API requests to sub-modules
```
python3 -m venv py38
source py38/bin/activate
pip install -r requirements.txt
```

## Running the code
```
python server/program.py (runs the app that generates logs)
python server/server.py (runs the web server that sends SSE)
open client/client.html in a browser to view the events
```