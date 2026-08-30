from db.database import get_async_session
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.organizer import OrganizerIn, OrganizerOut, OrganizerLogin
from schemas.user import UserIn, UserOut, UserLogin
from services.organizer_services import create_organizer, get_organizer_by_email
from services.user_service import create_user, get_user_by_email
from execution import AlreadyExistsException, InvalidCredentialsException

router = APIRouter()

@router.post("/signup/organizer",response_model=OrganizerOut, status_code=status.HTTP_201_CREATED)
async def create_organizer_endpoint(organizer: OrganizerIn, db: AsyncSession = Depends(get_async_session)):
    new_organizer = await create_organizer(db, organizer)
    return new_organizer

@router.post("/signup/user", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(user: UserIn, db: AsyncSession = Depends(get_async_session)):
    new_user = await create_user(db, user)
    return new_user

@router.post("/login/organizer", response_model=OrganizerOut)
async def get_organizer(payload : OrganizerLogin, db: AsyncSession = Depends(get_async_session)):
    organizer = await get_organizer_by_email(db, payload.email)
    if not organizer:
        raise InvalidCredentialsException()
    return organizer

@router.post("/login/user", response_model=UserOut)
async def get_user(payload : UserLogin, db: AsyncSession = Depends(get_async_session)):
    user = await get_user_by_email(db, payload.email)
    if not user:
        raise InvalidCredentialsException()
    return user

