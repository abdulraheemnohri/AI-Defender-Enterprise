from fastapi import APIRouter

from schemas.system import SystemInfo
from services.mock_data import build_system_payload


router = APIRouter(prefix="/system", tags=["system"])


@router.get("/info", response_model=SystemInfo)
def get_system_info():
    return build_system_payload()
