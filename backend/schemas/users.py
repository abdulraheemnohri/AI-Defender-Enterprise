from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserInfo(BaseModel):
    username: str
    role: str
    status: str  # "Active", "Suspended", "Locked"
    email: str
    department: str
    registered_at: str

class UserCreate(BaseModel):
    username: str
    password: str
    role: str
    email: str
    department: str

class ActiveSession(BaseModel):
    session_id: str
    username: str
    role: str
    ip_address: str
    device_info: str
    login_time: str

class AuditLogEntry(BaseModel):
    id: str
    username: str
    role: str
    action: str  # "TERM_PROCESS", "MODIFY_FIREWALL", "TRUST_USB", "REVOKE_SESSION", "TOGGLE_MODEL"
    details: str
    timestamp: str
