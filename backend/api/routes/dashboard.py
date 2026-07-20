from fastapi import APIRouter

from schemas.dashboard import DashboardPayload
from services.mock_data import build_dashboard_payload


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardPayload)
def get_dashboard():
    return build_dashboard_payload()
