import datetime

from pydantic import BaseModel, Field, EmailStr, ConfigDict


class OrganizerIn(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=20)
    password: str = Field(..., min_length=8, max_length=110)


class OrganizerLogin(BaseModel):
    email: EmailStr = Field(..., max_length=100)
    password: str = Field(..., min_length=1, max_length=110)


class OrganizerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    phone_number: str | None

class OrganizerUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    email: EmailStr | None = Field(None, max_length=100)
    phone_number: str | None = Field(None, max_length=20)
    password: str | None = Field(None, min_length=8, max_length=110)


class TokenResponseOrganizer(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    expires_in: int
    account: OrganizerOut
