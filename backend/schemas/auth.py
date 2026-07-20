from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    username: str = "administrator"
    password: Optional[str] = None
    pin: Optional[str] = None
    role: str = "Administrator"
    remember_me: bool = False


class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    role: str
    username: str
    message: str
    requires_2fa: bool


class Verify2FaRequest(BaseModel):
    token: str
    code: str


class AuditLogItem(BaseModel):
    id: int
    event: str
    username: str
    role: str
    timestamp: str
