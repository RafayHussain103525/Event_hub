from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
import logging
from fastapi.responses import JSONResponse
from api.endpoints import events
from api.endpoints import auth
from db.database import init_db
from execution import DomainException
logger = logging.getLogger(__name__)



@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()  # ← Creates all tables on startup
    yield

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
