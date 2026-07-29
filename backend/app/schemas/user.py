from pydantic import BaseModel, Field, EmailStr, ConfigDict

class UserIn(BaseModel):
    username: str = Field(..., max_length=50) 
    email: EmailStr = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=20)
    #password: str = Field(..., min_length=8, max_length=100)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    phone_number: str | None

