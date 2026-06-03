import jwt
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from datetime import datetime,timedelta,timezone
from fastapi import APIRouter,HTTPException,status,Depends
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials


app=FastAPI()
load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")

def create_access_token(data:dict,expires_delta:timedelta=timedelta(minutes=30)):
    to_encode=data.copy()
    expire=datetime.now(timezone.utc)+expires_delta
    to_encode.update({"exp":expire})

    encode_jwt=jwt.encode(to_encode,SECRET_KEY,"HS256")

    return encode_jwt




