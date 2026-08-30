import pytest
import pytest_asyncio
from unittest.mock import patch
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool
from db.database import get_async_session
from db.model import Base
from main import app

# We use a separate test database so we don't pollute your real data
TEST_DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/test_eventdb_hub"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False, poolclass=NullPool)
TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)


@pytest.fixture(autouse=True)
def mock_init_db():
    with patch("main.init_db"):
        yield

@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    """Creates tables before tests and drops them after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session():
    """Provides a clean database session for each test."""
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session):
    """Provides an async HTTP client with the test DB injected."""
    async def override_get_db():
        yield db_session

    # Override the real DB dependency with our test DB
    app.dependency_overrides[get_async_session] = override_get_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
        
    app.dependency_overrides.clear()