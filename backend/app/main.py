import asyncio
from contextlib import asynccontextmanager, suppress
from fastapi import FastAPI, Request
import logging
from fastapi.responses import JSONResponse
from api.endpoints import events
from api.endpoints import auth
from db.database import init_db, async_session
from services.event_service import delete_past_events
from execution import DomainException
logger = logging.getLogger(__name__)

CLEANUP_INTERVAL_SECONDS = 3600  

async def cleanup_past_events_task():
    """Background loop: deletes events whose date has passed."""
    while True:
        try:
            async with async_session() as session:
                deleted = await delete_past_events(session)
                if deleted:
                    logger.info(f"Auto-deleted {deleted} past event(s)")
        except Exception as e:
            logger.error(f"Past-event cleanup failed: {e}")
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()                                   
    cleanup_task = asyncio.create_task(cleanup_past_events_task())
    yield
    cleanup_task.cancel()                             
    with suppress(asyncio.CancelledError):
        await cleanup_task

app = FastAPI(lifespan=lifespan, title="EventHub API", version="1.0.0")

@app.exception_handler(DomainException)
async def domain_exception_handler(request : Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
