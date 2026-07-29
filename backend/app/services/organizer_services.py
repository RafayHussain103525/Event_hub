from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.model import Organizer
from schemas.organizer import OrganizerIn

class OrganizerAlreadyExists(Exception):
    pass

async def create_organizer(db: AsyncSession, organizer: OrganizerIn) -> Organizer:
    new_organizer = Organizer(
        name=organizer.name.strip(),
        email=organizer.email.lower(),
        phone_number=organizer.phone_number,
    )

    db.add(new_organizer)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise OrganizerAlreadyExists()

    await db.refresh(new_organizer)
    return new_organizer


async def get_organizer_by_email(db: AsyncSession, email: str) -> Organizer | None:
    result = await db.execute(
        select(Organizer).where(Organizer.email == email.lower())
    )
    return result.scalar_one_or_none()
