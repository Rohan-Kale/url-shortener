from sqlalchemy import Column, Integer, String
from .db import Base
from sqlalchemy.ext.asyncio import AsyncSession
from .models import URL

class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, nullable=False)
    short_code = Column(String, unique=True, index=True)

# fetches a URL by its short code
async def get_url_by_code(session: AsyncSession, short_code: str):
    return await session.get(URL, {"short_code": short_code})

# creates a new URL entry
async def create_url(session: AsyncSession, original_url: str, short_code: str):
    url = URL(original_url=original_url, short_code=short_code)
    session.add(url)
    await session.commit()
    await session.refresh(url)
    return url