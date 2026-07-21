from fastapi import APIRouter

from schemas.system import SystemInfo
from services.mock_data import build_system_payload


router = APIRouter(prefix="/system", tags=["system"])

# Stateful host containment isolation setting
host_isolated = False

@router.get("/info", response_model=SystemInfo)
def get_system_info():
    payload = build_system_payload()
    if host_isolated:
        payload["firewall_status"] = "STRICT_ISOLATION_ACTIVE"
        payload["ai_status"] = "CONTAINMENT_PROTOCOLS_ENGAGED"
    return payload

@router.get("/isolation")
def get_isolation_status():
    return {"isolated": host_isolated}

@router.post("/isolation/toggle")
def toggle_isolation_status():
    global host_isolated
    host_isolated = not host_isolated
    return {"isolated": host_isolated, "message": "Workstation emergency network isolation status changed successfully."}
