from pydantic import BaseModel
from typing import List, Optional

class SecurityRule(BaseModel):
    id: str
    name: str
    type: str  # "YARA", "Sigma", "Firewall", "Custom Heuristic"
    author: str
    content: str
    enabled: bool
    description: str
    created_at: str
    tags: List[str]

class RuleCreate(BaseModel):
    name: str
    type: str
    content: str
    description: str
    tags: List[str]

class RuleCompileResult(BaseModel):
    success: bool
    errors: Optional[str] = None
    warnings: Optional[str] = None
    affected_indicators: List[str]
    compilation_time_ms: float
