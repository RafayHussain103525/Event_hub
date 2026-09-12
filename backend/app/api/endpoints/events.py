from datetime import date
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.dependencies import get_current_organizer
from core.dependencies import get_current_user
from schemas.events import EventIn, EventOut, EventUpdate
from db.database import get_async_session
from schemas.events import EventIn, EventOut
from execution import AlreadyExistsException, BadRequestException, NotFoundException, ForbiddenException
from services.organizer_services import (
    get_organizer_by_id,
    get_organizer_by_name,
)
from services.event_service import (
    create_event,
    get_event_by_id,
    get_event_by_location,
    get_events_by_organizer_id,
    get_all_events,
    get_events_by_organizer_name,
    get_event_by_name,
    get_all_events,
    get_events_by_date_range,
    delete_event,
)

router = APIRouter()


# creating a new event
@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_new_event(
    event: EventIn,
    db: AsyncSession = Depends(get_async_session),
    current_organizer=Depends(get_current_organizer),
):
    event.organizer_id = current_organizer.id
    new_event = await create_event(db, event)
    return new_event


# getting all events
@router.get("/all_events", response_model=list[EventOut])
async def get_all_events_endpoint(
    limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_async_session)
):
    events = await get_all_events(db, limit, offset)
    return events


# getting events by organizer id
@router.get("/my_events", response_model=list[EventOut])
async def get_events_by_organizer(
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session),
    current_organizer=Depends(get_current_organizer),
):

    events = await get_events_by_organizer_id(db, current_organizer.id, limit, offset)
    return events


# getting events by id
@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: AsyncSession = Depends(get_async_session)):
    event = await get_event_by_id(db, event_id)
    if not event:
        raise NotFoundException(f"Event with id {event_id} not found")
    return event


# deleting an event by id
@router.delete("/delete/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event_endpoint(
    event_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_organizer=Depends(get_current_organizer),
):
    delete_event_result = await delete_event(
        db, event_id, current_organizer.id
    )
    if not delete_event_result:
        raise NotFoundException(
            f"Event with id {event_id} not found or you do not have permission to delete it"
        )


@router.patch("/update/{event_id}", response_model=EventOut)
async def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_organizer=Depends(get_current_organizer),
):
    updated_event = await update_event(db, event_id, current_organizer.id, event_update)
    if not updated_event:
        raise NotFoundException(
            f"Event with id {event_id} not found or you do not have permission to update it"
        )
    return updated_event

# getting events by location
@router.get("/location/{event_location}", response_model=list[EventOut])
async def get_events_by_location(
    event_location: str,
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session),
):
    events = await get_event_by_location(db, event_location, limit, offset)
    return events


# getting events by organizer name
@router.get("/event_organizer_name/{organizer_name}", response_model=list[EventOut])
async def get_events_by_organizer_name_endpoint(
    organizer_name: str,
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session),
):
    organizer = await get_organizer_by_name(db, organizer_name)
    if not organizer:
        raise NotFoundException(f"Organizer with name {organizer_name} not found")

    events = await get_events_by_organizer_name(db, organizer_name, limit, offset)
    return events


# getting events by date range
@router.get("/date_range/{start_date}/{end_date}", response_model=list[EventOut])
async def get_events_by_date_range_endpoint(
    start_date: date,
    end_date: date,
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session),
):
    if start_date <= end_date:
        events = await get_events_by_date_range(db, start_date, end_date, limit, offset)
        return events
    else:
        raise BadRequestException("Start date must be less than or equal to end date")


# getting events by name
@router.get("/name/{event_name}", response_model=list[EventOut])
async def get_events_by_name(
    event_name: str, db: AsyncSession = Depends(get_async_session)
):
    events = await get_event_by_name(db, event_name)
    if not events:
        raise NotFoundException(f"Event with name {event_name} not found")
    return events
