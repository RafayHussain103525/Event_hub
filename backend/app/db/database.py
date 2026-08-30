from db.model import Base
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

DATABASE_URL = (f"postgresql+asyncpg://"
                f"{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@db:5432/{os.getenv('POSTGRES_DB')}" 
            )
 
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def init_db():
    "init the database"
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all, checkfirst=True)

async def get_async_session():
    "get the database session"
    async with async_session() as session:
        yield session