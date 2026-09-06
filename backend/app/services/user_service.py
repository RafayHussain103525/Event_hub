from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from db.model import User
from schemas.user import UserIn
from execution import AlreadyExistsException
from core.security import get_password_hash


async def create_user(db: AsyncSession, user: UserIn) -> User:
    new_user = User(
        username=user.username.strip(),
        email=user.email.lower(),
        phone_number=user.phone_number,
        hashed_password=await get_password_hash(user.password)
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

async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(
                select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()
