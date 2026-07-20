from fastapi import APIRouter

from services.mock_data import build_dashboard_payload


router = APIRouter(prefix="/scan", tags=["scan"])


@router.get("/processes")
def get_processes():
    return {"processes": build_dashboard_payload()["processes"]}


@router.get("/processes/{pid}")
def get_process(pid: int):
    processes = build_dashboard_payload()["processes"]
    process = next((item for item in processes if item["pid"] == pid), None)
    if process is None:
        return {"message": "Process not found"}
    return process
