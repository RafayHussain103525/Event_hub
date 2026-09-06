from services.organizer_services import get_organizer_by_email
from services.user_service import get_user_by_email
from core.security import verify_password, get_password_hash
from execution import InvalidCredentialsException
from db.model import Organizer, User

dummy_hash = "$argon2id$v=19$m=65536,t=3,p=4$somefakesalt$somefakehash"
async def authenticate_organizer(db, email: str, password: str)-> Organizer | None:
    organizer = await get_organizer_by_email(db, email)
    if not organizer:
        await verify_password(password, dummy_hash)
        return None
    if not await verify_password(password, organizer.hashed_password):
        return None
    return organizer

async def authenticate_user(db, email: str, password: str)-> User | None:
    user = await get_user_by_email(db, email)
    if not user:
        await verify_password(password, dummy_hash)
        return None
    if not await verify_password(password, user.hashed_password):
        return None
    return user