from pydantic import BaseModel


class ConnectionItem(BaseModel):
    protocol: str
    local_address: str
    remote_address: str
    state: str
    reputation: str


class ConnectionSummary(BaseModel):
    total_connections: int
    suspicious_connections: int
    inbound_bandwidth: str
    outbound_bandwidth: str
    connections: list[ConnectionItem]
