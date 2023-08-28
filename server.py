from meteoalertapi import Meteoalert
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

app = FastAPI()

origins = [
   "http://localhost.tiangolo.com",
   "https://localhost.tiangolo.com",
   "http://localhost",
   "http://localhost:8080",
   "http://localhost:3000",
   "http://127.0.0.1:3000",
]

app.add_middleware(
   CORSMiddleware,
   allow_origins=origins,
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)

class RequestModel(BaseModel):
   api_token: str

@app.post("/api/{county}")
async def root(county: str, request_data: RequestModel):
   if(os.getenv("REACT_APP_API_KEY") == request_data.api_token):
      meteo = Meteoalert('Romania', county)
      return meteo.get_alert()
   else:
      raise HTTPException(status_code=401, detail="Authentication failed")