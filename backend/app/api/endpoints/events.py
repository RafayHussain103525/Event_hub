from datetime import date
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.events import EventIn, EventOut
from db.database import get_async_session
from schemas.events import EventIn, EventOut
from execution import AlreadyExistsException, BadRequestException, NotFoundException
from services.organizer_services import (
    get_organizer_by_id,
    get_organizer_by_name,
)
from services.event_service import (create_event, get_event_by_id, get_event_by_location, get_events_by_organizer_id, get_all_events, get_events_by_organizer_name, 
                                    get_event_by_name, get_all_events, get_events_by_date_range)

router = APIRouter()

# creating a new event
@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_new_event(event: EventIn, db: AsyncSession = Depends(get_async_session)):
    new_event = await create_event(db, event)
    return new_event
    
# getting all events   
@router.get("/all_events", response_model=list[EventOut])
async def get_all_events_endpoint(limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)):

    events = await get_all_events(db, limit, offset)
    return events

# getting events by organizer id
@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: AsyncSession = Depends(get_async_session)):
    event = await get_event_by_id(db, event_id)
    if not event:
        raise NotFoundException(f"Event with id {event_id} not found")
    return event

# getting events by location
@router.get("/location/{event_location}", response_model=list[EventOut])
async def get_events_by_location(event_location: str, limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)):
    events = await get_event_by_location(db, event_location, limit, offset)
    return events

# getting events by organizer id
@router.get("/event_organizer/{organizer_id}", response_model=list[EventOut])
async def get_events_by_organizer(organizer_id: int, limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)):
    organizer = await get_organizer_by_id(db, organizer_id)
    if not organizer:
        raise NotFoundException(f"Organizer with id {organizer_id} not found")
    
    events = await get_events_by_organizer_id(db, organizer_id, limit, offset)
    return events

# getting events by organizer name
@router.get("/event_organizer_name/{organizer_name}", response_model=list[EventOut])
async def get_events_by_organizer_name_endpoint(organizer_name: str, limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)):
    organizer = await get_organizer_by_name(db, organizer_name)
    if not organizer:
        raise NotFoundException(f"Organizer with name {organizer_name} not found")
    
    events = await get_events_by_organizer_name(db, organizer_name, limit, offset)
    return events

# getting events by date range
@router.get("/date_range/{start_date}/{end_date}", response_model=list[EventOut])
async def get_events_by_date_range_endpoint(start_date: date, end_date: date, limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)):
    if start_date <= end_date:
        events = await get_events_by_date_range(db, start_date, end_date, limit, offset)
        return events
    else:
        raise BadRequestException("Start date must be less than or equal to end date")

# getting events by name
@router.get("/name/{event_name}", response_model=EventOut)
async def get_events_by_name(event_name: str,db: AsyncSession = Depends(get_async_session)):
    events = await get_event_by_name(db, event_name)
    if not events:
        raise NotFoundException(f"Event with name {event_name} not found")
    return events