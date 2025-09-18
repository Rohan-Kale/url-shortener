from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
import redis.asyncio as redis
import os, string, random
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert

from .db import AsyncSessionLocal, engine, Base
from .models import URL, get_url_by_code, create_url


load_dotenv()  # Load environment variables from .env file

# REDIS CONFIG
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))

r = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), decode_responses=True)


origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000"
]

# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and connect Redis
    app.state.redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: close connections
    await app.state.redis.close()
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

# Dependency to get DB session
async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
        
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility function to generate a random short code
def generate_short_code(n=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

@app.post("/shorten/")
async def shorten_url(original_url: str, session: AsyncSession = Depends(get_session)):
    code = generate_short_code()
    # Save to DB
    url = await create_url(session, original_url, code)
    # Cache in Redis
    await app.state.redis.set(code, original_url)
    return {"short_code": code, "original_url": original_url}

@app.get("/{short_code}")
async def redirect_url(short_code: str, session: AsyncSession = Depends(get_session)):
    # Check Redis cache first
    cached_url = await app.state.redis.get(short_code)
    if cached_url:
        return {"original_url": cached_url}
    
    # If not in cache, check DB
    url_entry = await get_url_by_code(session, short_code)
    if url_entry:
        # Cache it for future requests
        await app.state.redis.set(short_code, url_entry.original_url)
        return {"original_url": url_entry.original_url}
    
    raise HTTPException(status_code=404, detail="URL not found")