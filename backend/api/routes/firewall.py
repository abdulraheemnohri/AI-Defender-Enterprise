from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

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


@router.delete("/rules/{rule_id}")
def delete_firewall_rule(rule_id: int, db: Session = Depends(get_db)):
    rule = db.query(FirewallRule).filter(FirewallRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Firewall rule {rule_id} not found."
        )
    db.delete(rule)
    db.commit()
    return {"message": f"Successfully deleted firewall rule {rule_id}", "id": rule_id}


@router.post("/rules/{rule_id}/toggle")
def toggle_firewall_rule(rule_id: int, db: Session = Depends(get_db)):
    rule = db.query(FirewallRule).filter(FirewallRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Firewall rule {rule_id} not found."
        )
    rule.enabled = not rule.enabled
    db.commit()
    db.refresh(rule)
    return {"message": f"Successfully toggled firewall rule {rule_id} state", "enabled": rule.enabled}


@router.post("/rules/import", response_model=List[FirewallRuleRead])
def import_firewall_rules(payload: List[FirewallRuleCreate], db: Session = Depends(get_db)):
    imported_rules = []
    for r in payload:
        rule = FirewallRule(**r.model_dump())
        db.add(rule)
        imported_rules.append(rule)
    db.commit()
    for rule in imported_rules:
        db.refresh(rule)
    return imported_rules


@router.post("/rules/promote", response_model=FirewallRuleRead)
def promote_suggested_rule(payload: FirewallRuleCreate, db: Session = Depends(get_db)):
    """
    Promote an AI-suggested rule or offline threat recommendation to an active system-enforced firewall rule.
    """
    # Enforce active promotion logic
    rule_data = payload.model_dump()
    # Ensure it's active immediately upon promotion
    rule_data["enabled"] = True
    new_rule = FirewallRule(**rule_data)
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return new_rule
