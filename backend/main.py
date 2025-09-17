import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from backend.db import get_db
from sqlalchemy import insert, select
from backend.models import URL

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# in memory database (does not run when app shuts down)
memory_db = {}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/shorten/")
async def shorten_url(original_url: str, db: AsyncSession = Depends(get_db)):
    new_url = insert(URL).values(original_url=original_url, short_code="kale123").returning(URL)
    result = await db.execute(new_url)      # inserts into URL table
    await db.commit()
    return result.scalar_one().short_code 