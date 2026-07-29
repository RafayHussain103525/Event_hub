from fastapi import FastAPI
from api.endpoints import events

app = FastAPI()
app.include_router(events.router, prefix="/events", tags=["events"])
