from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, func
from .db import engine 
import asyncio
from sqlalchemy import insert
from backend.models import URL

# BASE that all models inherit from
Base = declarative_base()

class URL(Base):
    # standard setup for URL model
    __tablename__ = 'urls'
    
    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, nullable=False)       # stores the original URL
    short_code = Column(String, unique=True, index=True, nullable=False)        # stores the shortened url(must be unique)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# function to initialize the database (create tables)
async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
# run the init_models function to create tables when this file is executed directly
if __name__ == "__main__":
    asyncio.run(init_models())
