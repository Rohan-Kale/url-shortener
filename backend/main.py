import asyncio
import string
import random
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from redis.asyncio import Redis
from db import Base, engine, URL, AsyncSessionLocal
from pydantic import BaseModel
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

app = FastAPI()

class URLCreate(BaseModel):
    original_url: str

# Dependency
async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

# generate short codes
def generate_short_code(length=6):
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for _ in range(length))

# generate unique code
async def generate_unique_code(session: AsyncSession, length=6):
    while True:
        code = generate_short_code(length)
        result = await session.execute(select(URL).where(URL.short_code == code))
        if not result.scalars().first():
            return code

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Wait for Postgres
    while True:
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            print("Postgres ready, tables created")
            break
        except Exception:
            print("Waiting for Postgres...")
            await asyncio.sleep(1)

    # Wait for Redis
    redis = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    while True:
        try:
            await redis.set("ping", "pong")
            if await redis.get("ping") == "pong":
                print("Redis ready")
                break
        except Exception:
            print("Waiting for Redis...")
            await asyncio.sleep(1)
    await redis.close()

    yield

app = FastAPI(lifespan=lifespan)

# Routes
@app.post("/shorten")
async def shorten_url(url_create: URLCreate, session: AsyncSession = Depends(get_session)):
    original_url = url_create.original_url

    # Check if already exists
    result = await session.execute(select(URL).where(URL.original_url == original_url))
    existing = result.scalars().first()
    if existing:
        return {"original_url": existing.original_url, "short_code": existing.short_code}

    # Generate unique short code
    short_code = await generate_unique_code(session)

    new_url = URL(original_url=original_url, short_code=short_code)
    session.add(new_url)
    await session.commit()
    await session.refresh(new_url)
    return {"original_url": new_url.original_url, "short_code": new_url.short_code}

@app.get("/urls")
async def get_urls(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(URL))
    urls = result.scalars().all()
    return [{"original_url": u.original_url, "short_code": u.short_code} for u in urls]

# initialize redis for caching
redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

@app.get("/r/{short_code}")
async def redirect_url(short_code: str, session: AsyncSession = Depends(get_session)):
    # check redis cache first
    cached_url = await redis_client.get(f"url:{short_code}")
    if cached_url:
        return {"original_url": cached_url}
    # if not in cache, check database
    result = await session.execute(select(URL).where(URL.short_code == short_code))
    url_obj = result.scalars().first()
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short code not found")

    # cache the result in redis
    await redis_client.set(f"url:{short_code}", url_obj.original_url)
    
    return {"original_url": url_obj.original_url}
