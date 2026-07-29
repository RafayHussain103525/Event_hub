from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from db.model import Event
from schemas.events import EventIn
from typing import Sequence
async def create_event(db: AsyncSession, event: EventIn) -> Event:
    new_event = Event(
        name=event.name.lower().strip(),
        date=event.date,
        location=event.location.lower().strip(),
        description=event.description,
        poster_url=str(event.image_url) if event.image_url else None,
    )

    db.add(new_event)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise Exception("Event already exists")

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