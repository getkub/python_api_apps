from fastapi import FastAPI, Request

app = FastAPI()

@app.get('/api/form')
async def get_form():
    return {'message': 'Get form data'}

@app.post('/api/submit-form')
async def submit_form(request: Request):
    form_data = await request.json()
    try:
        # Handle form submission logic here
        # Process the form data and perform any necessary actions
        # ...
        return {'message': 'Form submitted successfully', 'data': form_data}
    except Exception as e:
        return {'message': 'Internal Server Error', 'error': str(e)}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
