from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import FirewallRule
from schemas.firewall import FirewallRuleCreate, FirewallRuleRead


router = APIRouter(prefix="/firewall", tags=["firewall"])


@router.get("/rules", response_model=list[FirewallRuleRead])
def get_firewall_rules(db: Session = Depends(get_db)):
    return db.query(FirewallRule).order_by(FirewallRule.id.asc()).all()


@router.post("/rules", response_model=FirewallRuleRead)
def create_firewall_rule(payload: FirewallRuleCreate, db: Session = Depends(get_db)):
    rule = FirewallRule(**payload.model_dump())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule
