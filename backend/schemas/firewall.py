from pydantic import BaseModel


class FirewallRuleBase(BaseModel):
    name: str
    action: str
    target: str
    protocol: str = "TCP"
    enabled: bool = True


class FirewallRuleCreate(FirewallRuleBase):
    pass


class FirewallRuleRead(FirewallRuleBase):
    id: int

    class Config:
        from_attributes = True
