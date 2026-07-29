from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.events import EventIn, EventOut
from db.database import get_async_session
from schemas.events import EventIn, EventOut
from services.event_service import create_event, get_event_by_id, get_event_by_location

router = APIRouter()

@router.post("/", response_model=EventOut)
async def create_new_event(event: EventIn, db: AsyncSession = Depends(get_async_session)):
    try:
        new_event = await create_event(db, event)
        return new_event
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: AsyncSession = Depends(get_async_session)):
    event = await get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/location/{event_location}", response_model=list[EventOut])
async def get_events_by_location(event_location: str, limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)):
    try:
        events = await get_event_by_location(db, event_location, limit, offset)
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))