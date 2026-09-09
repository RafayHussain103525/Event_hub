from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from jwt.exceptions import InvalidTokenError

from db.database import get_async_session
from core.security import SECRET_KEY, ALGORITHM
from services.user_service import get_user_by_id
from services.organizer_services import get_organizer_by_id
from execution import InvalidCredentialsException
from db.model import User, Organizer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login/user")

# Dependency to get the current authenticated user
async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_async_session)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        role: str = payload.get("role")
        type: str = payload.get("type")

        if user_id_str is None or role != "user" or type != "access":
            raise InvalidCredentialsException(detail="Could not validate credentials")

    except jwt.InvalidTokenError:
        raise InvalidCredentialsException(detail="Invalid or expired token")
    user_id = int(user_id_str)
    user = await get_user_by_id(db, user_id)
    if not user:
        raise InvalidCredentialsException(detail="User not found")

    return user


async def get_current_organizer(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_async_session)
) -> Organizer:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        organizer_id_str: str = payload.get("sub")
        role: str = payload.get("role")
        type: str = payload.get("type")

        if organizer_id_str is None or role != "organizer" or type != "access":
            raise InvalidCredentialsException(detail="Could not validate credentials")

    except jwt.InvalidTokenError:
        raise InvalidCredentialsException(detail="Invalid or expired token")

    organizer_id = int(organizer_id_str)
    organizer = await get_organizer_by_id(db, organizer_id)
    if not organizer:
        raise InvalidCredentialsException(detail="Organizer not found")

    return organizer
