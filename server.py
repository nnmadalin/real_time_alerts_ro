from meteoalertapi import Meteoalert
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

app = FastAPI()

class RequestModel(BaseModel):
   api_token: str

@app.post("/api/{county}")
async def root(county: str, request_data: RequestModel):
   if(os.getenv("API_KEY") == request_data.api_token):
      meteo = Meteoalert('Romania', county)
      return meteo.get_alert()
   else:
      raise HTTPException(status_code=401, detail="Authentication failed")