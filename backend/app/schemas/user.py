from datetime import datetime

from pydantic import BaseModel, Field, EmailStr, ConfigDict

class UserIn(BaseModel):
    username: str = Field(..., max_length=50) 
    email: EmailStr = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=20)
    password: str = Field(..., min_length=8, max_length=110)

class UserUpdate(BaseModel):
    username: str | None = Field(None, max_length=50)
    email: EmailStr | None = Field(None, max_length=100)
    phone_number: str | None = Field(None, max_length=20)
    password: str | None = Field(None, min_length=8, max_length=110)

class UserLogin(BaseModel):
    email: EmailStr = Field(..., max_length=100)
    password: str = Field(..., min_length=1, max_length=110)

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: EmailStr
    phone_number: str | None

class TokenResponseUser(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    expires_in: int
    account: UserOut  