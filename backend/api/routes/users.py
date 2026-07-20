from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from schemas.users import UserInfo, UserCreate, ActiveSession, AuditLogEntry

router = APIRouter(prefix="/users", tags=["users"])

# Initial mock user accounts
users_db = [
    UserInfo(
        username="administrator",
        role="Administrator",
        status="Active",
        email="admin@aidefender.local",
        department="Security Operations",
        registered_at="2024-01-10T08:00:00Z"
    ),
    UserInfo(
        username="analyst_jane",
        role="Security Analyst",
        status="Active",
        email="j.smith@aidefender.local",
        department="Threat Hunting",
        registered_at="2024-02-15T09:30:00Z"
    ),
    UserInfo(
        username="operator_bob",
        role="SOC Operator",
        status="Active",
        email="b.jones@aidefender.local",
        department="L1 Triage",
        registered_at="2024-03-01T11:45:00Z"
    ),
    UserInfo(
        username="auditor_compliance",
        role="Auditor",
        status="Active",
        email="audits@aidefender.local",
        department="Governance",
        registered_at="2024-03-10T14:20:00Z"
    ),
    UserInfo(
        username="guest_observer",
        role="Guest",
        status="Suspended",
        email="guest@aidefender.local",
        department="External Research",
        registered_at="2024-04-01T16:00:00Z"
    ),
]

# Active login sessions
sessions_db = [
    ActiveSession(
        session_id="sess-9812",
        username="administrator",
        role="Administrator",
        ip_address="127.0.0.1",
        device_info="Local workstation Console (Windows Hello)",
        login_time="2024-05-15T07:12:00Z"
    ),
    ActiveSession(
        session_id="sess-4211",
        username="analyst_jane",
        role="Security Analyst",
        ip_address="10.0.10.45",
        device_info="Secure SSL VPN client (Chromium/Windows 11)",
        login_time="2024-05-15T08:44:00Z"
    ),
    ActiveSession(
        session_id="sess-3342",
        username="operator_bob",
        role="SOC Operator",
        ip_address="10.0.10.112",
        device_info="HQ Security Desk Terminal (SecureBrowser)",
        login_time="2024-05-15T09:05:00Z"
    ),
]

# Comprehensive administrative audit log
audit_logs_db = [
    AuditLogEntry(
        id="aud-001",
        username="administrator",
        role="Administrator",
        action="MODIFY_FIREWALL",
        details="Added BLOCK rule for IP 185.220.101.7 (C2 Tor node)",
        timestamp="2024-05-15T08:15:22Z"
    ),
    AuditLogEntry(
        id="aud-002",
        username="analyst_jane",
        role="Security Analyst",
        action="TERM_PROCESS",
        details="Killed suspicious process powershell.exe (PID: 1884)",
        timestamp="2024-05-15T08:50:45Z"
    ),
    AuditLogEntry(
        id="aud-003",
        username="administrator",
        role="Administrator",
        action="TRUST_USB",
        details="Toggled device status to TRUSTED: Kingston DataTraveler 3.0",
        timestamp="2024-05-15T09:12:10Z"
    ),
]

@router.get("", response_model=List[UserInfo])
def get_all_users():
    return users_db

@router.post("", response_model=UserInfo)
def create_new_user(user: UserCreate):
    for u in users_db:
        if u.username == user.username:
            raise HTTPException(status_code=400, detail="Username already exists")

    new_user = UserInfo(
        username=user.username,
        role=user.role,
        status="Active",
        email=user.email,
        department=user.department,
        registered_at=datetime.utcnow().isoformat() + "Z"
    )
    users_db.append(new_user)
    return new_user

@router.delete("/{username}")
def delete_user(username: str):
    user_to_remove = None
    for u in users_db:
        if u.username == username:
            user_to_remove = u
            break

    if not user_to_remove:
        raise HTTPException(status_code=404, detail="User not found")

    if username == "administrator":
        raise HTTPException(status_code=400, detail="Cannot delete default admin workstation credential")

    users_db.remove(user_to_remove)
    return {"message": f"User {username} deleted successfully", "success": True}

@router.get("/sessions", response_model=List[ActiveSession])
def get_active_sessions():
    return sessions_db

@router.post("/sessions/{session_id}/revoke")
def revoke_session(session_id: str):
    sess_to_remove = None
    for s in sessions_db:
        if s.session_id == session_id:
            sess_to_remove = s
            break

    if not sess_to_remove:
        raise HTTPException(status_code=404, detail="Active session not found")

    sessions_db.remove(sess_to_remove)

    # Audit trail append
    new_audit = AuditLogEntry(
        id=f"aud-{int(datetime.utcnow().timestamp())}",
        username="administrator",
        role="Administrator",
        action="REVOKE_SESSION",
        details=f"Forcibly revoked session token {session_id} for user {sess_to_remove.username}",
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
    audit_logs_db.append(new_audit)

    return {"message": f"Session {session_id} revoked successfully", "success": True}

@router.get("/audit-logs", response_model=List[AuditLogEntry])
def get_audit_logs():
    return audit_logs_db

@router.post("/audit-logs", response_model=AuditLogEntry)
def add_audit_log_entry(entry: AuditLogEntry):
    audit_logs_db.append(entry)
    return entry
