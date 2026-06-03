from fastapi import FastAPI,HTTPException,status,Depends
from pydantic import BaseModel
import hashlib
import secrets
import datetime
import os
from fastapi.middleware.cors import CORSMiddleware
import jwt
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm

from dotenv import load_dotenv
import mysql.connector
from jwtimp import create_access_token

app=FastAPI()
load_dotenv()
cors=os.getenv("CORS")
origins=[cors]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/login")

db_pass=os.getenv("db_pass")
SECRET_KEY=os.getenv("SECRET_KEY")
hostname=os.getenv("HOST")
db_name=os.getenv("DB_NAME")
userName=os.getenv("USER")
port_no=os.getenv("PORT")

def connect_db():
    return mysql.connector.connect(
        host=hostname,
        database=db_name,
        user=userName,
        passwd=db_pass,
        port=port_no
    )


def create_tables():

    conn=connect_db()
    cursor=conn.cursor()
    try:
        table1="""create table if not exists SYSTEM_USER(
userid int auto_increment primary key,
username varchar(45),
pass varchar(64),
log timestamp,
salt varchar(32)
);
"""
        table2="""create table if not exists todoList(
userid int,
task varchar(20)

);"""

        cursor.execute(table1)
        cursor.execute(table2)
        conn.commit()

    except mysql.connector.Error as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="INTERNAL SERVER ERROR"
        )
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

    

class LoginData(BaseModel):
    username:str
    password:str

@app.post("/register")
def register(payload:LoginData):
    conn=None
    cursor=None

    if payload.username=="":
        return {
            "success":False,
            "message":"username cannot be empty"
        }
    
    def hash_password(password):
        salt=secrets.token_bytes(16)
        
        hashed_password=hashlib.pbkdf2_hmac("sha256",password.encode(),salt,10000)

        return hashed_password.hex(),salt.hex()
    
    pass_hash,salt=hash_password(payload.password)


    try:
        conn=connect_db()
        
        cursor=conn.cursor()
        create_tables()

        
        

        query1="select username from SYSTEM_USER where username=%s"
        cursor.execute(query1,(payload.username,))

        user=cursor.fetchone()

        if not user:
            curr_time=datetime.datetime.now()
            query2="INSERT INTO SYSTEM_USER(username,pass,salt,log) VALUES(%s,%s,%s,%s);"
            cursor.execute(query2,(payload.username,pass_hash,salt,curr_time))
            conn.commit()
            return {
                "success":True,
                "message":"successfully Registered"
            }
        
        else:
            return {
                "success":False,
                "message":"username is taken"
            }
    except mysql.connector.Error as err:
        conn.rollback()
        print("from register ",err)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Database Error"
        )
    
    finally:

        if cursor: cursor.close()
        if conn: conn.close()


@app.post("/login")
def login(payload:OAuth2PasswordRequestForm=Depends()):
    

    conn=None
    cursor=None
    
    def hash_password(password,salt):
        hashed_password=hashlib.pbkdf2_hmac("sha256",password.encode(),bytes.fromhex(salt[0]),10000)

        return hashed_password

    try:
        conn=connect_db()
        cursor=conn.cursor()
        create_tables()

        query1="select salt from SYSTEM_USER where username=%s"
        
        cursor.execute(query1,(payload.username,))

        salt=cursor.fetchone()
        

        if salt:
            pass_hash=hash_password(payload.password,salt)
            
            query2="select * from SYSTEM_USER where username=%s and pass=%s"
            cursor.execute(query2,(payload.username,pass_hash.hex()))

            user=cursor.fetchone()
            

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password"
                )
            else:
                token=create_access_token({"user_id":user[0],"username":user[1]})
                return {
                    "success":True,
                    "username":user[1],
                    "message":"login successfull",
                    "access_token":token
                }
            
        else:
            raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password"
                )
        

    except mysql.connector.Error as err:
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="INTERNAL SERVER ERROR"
        )
    
    finally:
        
        if cursor: cursor.close()
        if conn: conn.close()

def get_current_user(token:str=Depends(oauth2_scheme)):

    if token=="undefined":
        return {"message":"invalid token or expired token"}
    
    try:
        decoded_payload=jwt.decode(token,SECRET_KEY,"HS256")
        
        return decoded_payload
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.."

        )
    except jwt.InvalidSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid token"
        )
    
class TodoCreate(BaseModel):
    data:str


@app.post("/create")
def create_todo(task:TodoCreate,usercrediential:dict=Depends(get_current_user)):
    
    conn=None
    cursor=None

    id=usercrediential["user_id"]
    
    try:
        conn=connect_db()
        cursor=conn.cursor()

        query1="INSERT INTO todoList values(%s,%s)"
        cursor.execute(query1,(id,task.data))

        conn.commit()
        return {"success":True,
                "message":"todo created"}

    except mysql.connector.Error as err:
        print("error from create :",err)
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="INTERNAL SERVER ERROR"

        )
    
    finally:
        if cursor: cursor.close()
        if conn: conn.close()



@app.get("/show")
def show(usercrediential:dict=Depends(get_current_user)):
    id=usercrediential["user_id"]

    conn=None
    cursor=None

    try:
        conn=connect_db()
        cursor=conn.cursor()

        query1="select task from todoList where userid=%s"
        cursor.execute(query1,(id,))

        todos=cursor.fetchall()

        all_task=[]
        for task in todos:
            all_task.append(task[0])

        return {"all_task":all_task}
            


    except mysql.connector.Error as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="INTERNAL SERVER ERROR"
        )
    
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.delete("/delete")
def delete_todo(task:TodoCreate,usercredential:dict=Depends(get_current_user)):
    conn=None
    cursor=None

    id=usercredential["user_id"]

    try:
        conn=connect_db()
        cursor=conn.cursor()


        query1="select task from todoList where userid=%s and task=%s"
        cursor.execute(query1,(id,task.data))
        user=cursor.fetchall()
        print(user)

        if user:
            query2="delete from todoList where userid=%s and task=%s"
            cursor.execute(query2,(id,task.data))
            conn.commit()
            return {
                "message":f"{task.data} deleted"
            }
        else:
            return {
                "message":"task is not present"
            }

    
    except mysql.connector.Error as err:
        print("from",err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="INTERNAL SERVER ERROR"
        )
    
    finally:
        if cursor: cursor.close()
        if conn: conn.close()



    
