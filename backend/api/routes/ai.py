from fastapi import APIRouter

from schemas.ai import AiResponse, ChatRequest, ExplainThreatRequest
from services.mock_data import build_ai_response


router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/explain", response_model=AiResponse)
def explain_threat(payload: ExplainThreatRequest):
    return build_ai_response(payload.query)


@router.post("/chat", response_model=AiResponse)
def chat_with_ai(payload: ChatRequest):
    last_message = payload.messages[-1]["content"] if payload.messages else "status summary"
    return build_ai_response(last_message)
