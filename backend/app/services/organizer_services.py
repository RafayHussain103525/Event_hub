from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.model import Organizer
from schemas.organizer import OrganizerIn
from execution import AlreadyExistsException
from core.security import get_password_hash

class OrganizerAlreadyExists(Exception):
    pass

async def create_organizer(db: AsyncSession, organizer: OrganizerIn) -> Organizer:
    new_organizer = Organizer(
        name=organizer.name.lower().strip(),
        email=organizer.email.lower(),
        phone_number=organizer.phone_number,
        hashed_password =await get_password_hash(organizer.password)
    )

    db.add(new_organizer)
    try:
            await db.commit()
    except IntegrityError:
        await db.rollback()
        raise AlreadyExistsException("Organizer with this email, name already exists")
    await db.refresh(new_organizer)
    return new_organizer


async def get_organizer_by_email(db: AsyncSession, email: str) -> Organizer | None:
    result = await db.execute(
        select(Organizer).where(Organizer.email == email.lower())
    )
    return result.scalar_one_or_none()

async def get_organizer_by_id(db: AsyncSession, organizer_id: int) -> Organizer | None:
    result = await db.execute(
        select(Organizer).where(Organizer.id == organizer_id)
    )
    return result.scalar_one_or_none()

async def get_organizer_by_name(db: AsyncSession, name: str) -> Organizer | None:
    result = await db.execute(
        select(Organizer).where(Organizer.name == name.lower().strip())
    )
    return result.scalar_one_or_none()

async def get_all_organizers(db: AsyncSession, limit: int = 10, offset: int = 0) -> list[Organizer]:
    result = await db.execute(
        select(Organizer).offset(offset).limit(limit)
    )
    return result.scalars().all()
