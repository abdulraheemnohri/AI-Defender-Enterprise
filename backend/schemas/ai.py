from pydantic import BaseModel
from typing import Optional, List, Dict


class ExplainThreatRequest(BaseModel):
    query: str
    model: Optional[str] = "gemma"


class ChatRequest(BaseModel):
    messages: List[Dict]
    model: Optional[str] = "gemma"
    temperature: Optional[float] = 0.7


class AiResponse(BaseModel):
    summary: str
    actions: List[str]
    confidence: str
    suggested_rules: Optional[List[str]] = None
