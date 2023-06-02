from fastapi import FastAPI, Request

app = FastAPI()

@app.post('/api/submit-form')
async def submit_form(request: Request):
    try:
        # Handle form submission logic here
        return {'message': 'Form submitted successfully'}
    except Exception as e:
        return {'message': 'Internal Server Error', 'detail': str(e)}

@app.get('/api/submit-form')
async def get_form():
    try:
        # Handle GET request for form page display
        return {'message': 'Welcome to the form page'}
    except Exception as e:
        return {'message': 'Internal Server Error', 'detail': str(e)}

# Run the FastAPI server
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='localhost', port=8000)
