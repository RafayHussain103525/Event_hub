from datetime import datetime
from pydantic import BaseModel

class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str
