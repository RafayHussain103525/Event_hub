from pydantic import BaseModel, Field, EmailStr, ConfigDict

class OrganizerIn(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=20)
    #password: str = Field(..., min_length=8, max_length=100)


class OrganizerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    phone_number: str | None

