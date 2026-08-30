from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from db.model import Event, Organizer
from schemas.events import EventIn
from typing import Sequence
from datetime import date
from execution import AlreadyExistsException, BadRequestException, DatabaseException

async def create_event(db: AsyncSession, event: EventIn) -> Event:
    new_event = Event(
        name=event.name.lower().strip(),
        date=event.date,
        location=event.location.lower().strip(),
        description=event.description,
        poster_url=str(event.image_url) if event.image_url else None,
        organizer_id=event.organizer_id
    )

    db.add(new_event)
    
    try:
        await db.commit()
        
    except IntegrityError as e:
        await db.rollback()
        sqlstate = getattr(e.orig, "sqlstate", None)

        if sqlstate == "23505":  # unique_violation
            raise AlreadyExistsException("Event with this name already exists") from e

        if sqlstate == "23503":  # foreign_key_violation
            raise BadRequestException("Invalid organizer_id: no such organizer exists") from e

        # Fallback for other IntegrityErrors
        raise DatabaseException(f"Database integrity error: {e.orig}") from e
        
    except SQLAlchemyError as e:
        await db.rollback()
        # Fallback for connection issues, timeouts, etc.
        raise DatabaseException(f"Could not create event: {e}") from e

    await db.refresh(new_event)
    return new_event

async def get_event_by_name(db: AsyncSession, name: str) -> Event | None:
    result = await db.execute(
        select(Event).where(Event.name == name.lower().strip())
    )
    return result.scalar_one_or_none()

async def get_event_by_location(db: AsyncSession, event_location: str, limit: int = 10, offset: int = 0) -> Sequence[Event]:
    result = await db.execute(
        select(Event).where(Event.location == event_location.lower().strip()).offset(offset).limit(limit)
    )
    return result.scalars().all()

async def get_event_by_id(db:AsyncSession, event_id: int)-> Event | None:
    result = await db.execute(
        select(Event).where(Event.id == event_id)
    )
    return result.scalar_one_or_none()

async def get_events_by_organizer_id(db: AsyncSession, organizer_id: int, limit: int = 10, offset: int = 0) -> Sequence[Event]:
    result = await db.execute(
        select(Event).where(Event.organizer_id == organizer_id).offset(offset).limit(limit)
    )
    return result.scalars().all()

async def get_all_events(db: AsyncSession, limit: int = 10, offset: int = 0) -> Sequence[Event]:
    result = await db.execute(
        select(Event).offset(offset).limit(limit)
    )
    return result.scalars().all()

async def get_events_by_date_range(db: AsyncSession, start_date: date, end_date: date, limit: int = 10, offset: int = 0) -> Sequence[Event]:
    result = await db.execute(
        select(Event).where(Event.date >= start_date, Event.date <= end_date).offset(offset).limit(limit)
    )
    return result.scalars().all()

async def get_events_by_organizer_name(db: AsyncSession, organizer_name: str, limit: int = 10, offset: int = 0) -> Sequence[Event]:
    result = await db.execute(
        select(Event).join(Organizer).where(Organizer.name == organizer_name.lower().strip()).offset(offset).limit(limit)
    )
    return result.scalars().all()