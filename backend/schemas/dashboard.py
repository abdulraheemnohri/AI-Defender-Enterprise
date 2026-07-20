from pydantic import BaseModel


class MetricCard(BaseModel):
    label: str
    value: str
    delta: str
    status: str


class AlertItem(BaseModel):
    id: int
    title: str
    severity: str
    source: str
    status: str
    created_at: str


class ThreatPoint(BaseModel):
    time: str
    value: int


class ProcessItem(BaseModel):
    pid: int
    name: str
    cpu: float
    memory: float
    risk: str


class DashboardPayload(BaseModel):
    security_score: int
    threat_level: str
    metrics: list[MetricCard]
    alerts: list[AlertItem]
    timeline: list[ThreatPoint]
    processes: list[ProcessItem]
