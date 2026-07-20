from fastapi import APIRouter

from schemas.network import ConnectionSummary
from services.mock_data import build_connections_payload


router = APIRouter(prefix="/network", tags=["network"])


@router.get("/connections", response_model=ConnectionSummary)
def get_connections():
    return build_connections_payload()
