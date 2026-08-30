import datetime

from pydantic import BaseModel, HttpUrl, Field, ConfigDict

class EventIn(BaseModel):
    name: str = Field(..., max_length=100)
    date: datetime.date 
    location: str = Field(..., max_length=200)
    description: str = Field(..., max_length=500)
    image_url: HttpUrl|None = Field(None, description="URL of the event image")
    organizer_id: int|None = Field(None, description="ID of the organizer for the event")
   
    

class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    date: datetime.date
    location: str
    description: str
    poster_url: HttpUrl|None
    organizer_id: int|None




