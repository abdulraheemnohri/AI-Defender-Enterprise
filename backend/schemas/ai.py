from pydantic import BaseModel


class ExplainThreatRequest(BaseModel):
    query: str


class ChatRequest(BaseModel):
    messages: list[dict]


class AiResponse(BaseModel):
    summary: str
    actions: list[str]
    confidence: str
