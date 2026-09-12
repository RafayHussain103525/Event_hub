from core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    create_refresh_token,
    SECRET_KEY,
    ALGORITHM,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from schemas.jwt import RefreshTokenResponse, RefreshTokenRequest
from db.database import get_async_session
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.organizer import (
    OrganizerIn,
    OrganizerOut,
    OrganizerLogin,
    TokenResponseOrganizer,
)
from schemas.user import UserIn, UserOut, UserLogin, TokenResponseUser
from services.organizer_services import create_organizer
from services.user_service import create_user
from services.auth_services import authenticate_organizer, authenticate_user
from execution import InvalidCredentialsException, BadRequestException
from datetime import datetime, timedelta, timezone
import jwt

router = APIRouter()


@router.post(
    "/signup/organizer",
    response_model=OrganizerOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_organizer_endpoint(
    organizer: OrganizerIn, db: AsyncSession = Depends(get_async_session)
):
    new_organizer = await create_organizer(db, organizer)
    return new_organizer


@router.post(
    "/signup/user", response_model=UserOut, status_code=status.HTTP_201_CREATED
)
async def create_user_endpoint(
    user: UserIn, db: AsyncSession = Depends(get_async_session)
):
    new_user = await create_user(db, user)
    return new_user


@router.post("/login/organizer", response_model=TokenResponseOrganizer)
async def organizer_auth(
    payload: OrganizerLogin, db: AsyncSession = Depends(get_async_session)
):
    organizer = await authenticate_organizer(db, payload.email, payload.password)
    if not organizer:
        raise InvalidCredentialsException()
    access_token = create_access_token(
        data={"sub": str(organizer.id), "role": "organizer"}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(organizer.id), "role": "organizer"}
    )
    return TokenResponseOrganizer(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        account=organizer,
        refresh_token=refresh_token,
    )


@router.post("/login/user", response_model=TokenResponseUser)
async def user_auth(payload: UserLogin, db: AsyncSession = Depends(get_async_session)):
    user = await authenticate_user(db, payload.email, payload.password)
    if not user:
        raise InvalidCredentialsException()
    access_token = create_access_token(data={"sub": str(user.id), "role": "user"})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "role": "user"})
    return TokenResponseUser(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        account=user,
        refresh_token=refresh_token,
    )


@router.post("/refresh_token", response_model=RefreshTokenResponse)
async def refresh_access_token(payload: RefreshTokenRequest):
    try:
        token_data = jwt.decode(
            payload.refresh_token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        if token_data.get("type") != "refresh":
            raise BadRequestException(detail="Invalid token type")

        user_id = token_data.get("sub")
        role = token_data.get("role")

        if not user_id or not role:
            raise BadRequestException(detail="Invalid token payload")

        user_id = int(user_id)
        new_token_data = {"sub": str(user_id), "role": role}
        new_access_token = create_access_token(data=new_token_data)
        expires = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60

        return RefreshTokenResponse(
            access_token=new_access_token, token_type="bearer", expires_in=expires
        )

    except jwt.InvalidTokenError:
        raise InvalidCredentialsException(detail="Refresh token is invalid or expired")


