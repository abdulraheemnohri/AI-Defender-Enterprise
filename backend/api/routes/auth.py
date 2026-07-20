from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from schemas.auth import LoginRequest, LoginResponse, Verify2FaRequest, AuditLogItem

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory audit log store to persist login attempts during the process
AUDIT_LOGS = [
    {
        "id": 1,
        "event": "Platform initialized in offline mode",
        "username": "SYSTEM",
        "role": "SYSTEM",
        "timestamp": datetime.utcnow().isoformat(),
    },
    {
        "id": 2,
        "event": "Database seeded with default policies",
        "username": "SYSTEM",
        "role": "SYSTEM",
        "timestamp": datetime.utcnow().isoformat(),
    }
]


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    # Check simple demo password/PIN (e.g. password "admin123" or PIN "1234")
    # To support fully functional offline-first mock, let's accept any non-empty password/PIN
    # but validate if it matches some standard credentials.
    username = payload.username or "administrator"
    role = payload.role or "Administrator"

    if payload.password and payload.password != "admin123" and payload.password != "password":
        # Log failure
        AUDIT_LOGS.append({
            "id": len(AUDIT_LOGS) + 1,
            "event": f"Failed login attempt for user '{username}' - Invalid Password",
            "username": username,
            "role": role,
            "timestamp": datetime.utcnow().isoformat(),
        })
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Hint: use 'admin123' or '1234'"
        )

    if payload.pin and payload.pin != "1234" and payload.pin != "1111":
        AUDIT_LOGS.append({
            "id": len(AUDIT_LOGS) + 1,
            "event": f"Failed PIN login attempt for user '{username}'",
            "username": username,
            "role": role,
            "timestamp": datetime.utcnow().isoformat(),
        })
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid PIN. Hint: use '1234'"
        )

    # Success
    # Standard role validation
    valid_roles = ["Administrator", "Security Analyst", "SOC Operator", "Auditor", "Read Only", "Guest"]
    if role not in valid_roles:
        role = "Guest"

    AUDIT_LOGS.append({
        "id": len(AUDIT_LOGS) + 1,
        "event": f"Successful login attempt for user '{username}' as {role}",
        "username": username,
        "role": role,
        "timestamp": datetime.utcnow().isoformat(),
    })

    # Simulating that Administrator and Security Analyst roles require a mock 2FA code (e.g. 123456)
    requires_2fa = role in ["Administrator", "Security Analyst", "SOC Operator"]

    return LoginResponse(
        success=True,
        token="demo-session-token-98765",
        role=role,
        username=username,
        message="Authentication successful",
        requires_2fa=requires_2fa,
    )


@router.post("/verify-2fa", response_model=LoginResponse)
def verify_2fa(payload: Verify2FaRequest):
    if payload.code != "123456":
        AUDIT_LOGS.append({
            "id": len(AUDIT_LOGS) + 1,
            "event": "MFA code verification failed",
            "username": "administrator",
            "role": "Administrator",
            "timestamp": datetime.utcnow().isoformat(),
        })
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid 2FA code. Hint: use '123456'"
        )

    AUDIT_LOGS.append({
        "id": len(AUDIT_LOGS) + 1,
        "event": "MFA verification successful. Session established.",
        "username": "administrator",
        "role": "Administrator",
        "timestamp": datetime.utcnow().isoformat(),
    })

    return LoginResponse(
        success=True,
        token="demo-session-token-98765-mfa",
        role="Administrator",
        username="administrator",
        message="MFA Verification Successful",
        requires_2fa=False,
    )


@router.get("/audit-logs", response_model=list[AuditLogItem])
def get_audit_logs():
    return AUDIT_LOGS
