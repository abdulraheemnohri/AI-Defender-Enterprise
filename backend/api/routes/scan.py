from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.mock_data import build_dashboard_payload

router = APIRouter(prefix="/scan", tags=["scan"])

# Simple in-memory process lists to make kill/suspend actions stateful
STATE_PROCESSES = None


def get_stateful_processes():
    global STATE_PROCESSES
    if STATE_PROCESSES is None:
        STATE_PROCESSES = build_dashboard_payload()["processes"]
    return STATE_PROCESSES


class StartScanRequest(BaseModel):
    scan_type: str = "Quick"


@router.get("/processes")
def get_processes():
    return {"processes": get_stateful_processes()}


@router.get("/processes/{pid}")
def get_process(pid: int):
    processes = get_stateful_processes()
    process = next((item for item in processes if item["pid"] == pid), None)
    if process is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Process {pid} not found"
        )
    return process


@router.post("/processes/{pid}/kill")
def kill_process(pid: int):
    processes = get_stateful_processes()
    process = next((item for item in processes if item["pid"] == pid), None)
    if process is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Process {pid} not found"
        )
    # Remove process from local state
    global STATE_PROCESSES
    STATE_PROCESSES = [p for p in processes if p["pid"] != pid]
    return {"message": f"Successfully terminated process {process['name']} (PID: {pid})", "pid": pid}


@router.post("/processes/{pid}/suspend")
def suspend_process(pid: int):
    processes = get_stateful_processes()
    process = next((item for item in processes if item["pid"] == pid), None)
    if process is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Process {pid} not found"
        )
    # Toggle or set suspended status in risk or risk indicator
    for p in processes:
        if p["pid"] == pid:
            p["risk"] = "suspended"
    return {"message": f"Successfully suspended process {process['name']} (PID: {pid})", "pid": pid}


@router.post("/start-scan")
def start_scan(payload: StartScanRequest):
    return {
        "status": "completed",
        "scan_type": payload.scan_type,
        "message": f"{payload.scan_type} scan finished. No active malware files found.",
        "scanned_items_count": 14205 if payload.scan_type == "Full" else 842,
        "threats_found": []
    }
