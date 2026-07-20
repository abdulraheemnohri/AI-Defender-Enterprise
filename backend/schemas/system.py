from pydantic import BaseModel


class ResourceUsage(BaseModel):
    cpu: float
    memory: float
    disk: float


class SystemInfo(BaseModel):
    hostname: str
    os: str
    uptime: str
    resources: ResourceUsage
    firewall_status: str
    antivirus_status: str
    ai_status: str
