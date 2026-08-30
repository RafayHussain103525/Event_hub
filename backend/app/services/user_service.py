from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from db.model import User
from schemas.user import UserIn
from execution import AlreadyExistsException


async def create_user(db: AsyncSession, user: UserIn) -> User:
    new_user = User(
        username=user.username.strip(),
        email=user.email.lower(),
        phone_number=user.phone_number,
        hashed_password="some thing here later"
    )

    db.add(new_user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise AlreadyExistsException("User with this email already exists")

    await db.refresh(new_user)
    return new_user

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(
                select(User).where(User.email == email.lower())
    )
    return result.scalar_one_or_none()
