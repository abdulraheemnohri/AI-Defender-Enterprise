from sqlalchemy.orm import Session

from database.database import Base, engine
from database.models import Alert, FirewallRule, QuarantineRecord


def initialize_database():
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        _seed_alerts(session)
        _seed_firewall_rules(session)
        _seed_quarantine(session)
        session.commit()


def _seed_alerts(session: Session):
    if session.query(Alert).count() > 0:
        return

    session.add_all(
        [
            Alert(
                title="Suspicious PowerShell chain detected",
                description="Encoded command spawned from Office child process.",
                severity="high",
                source="Behavior Engine",
                status="investigating",
            ),
            Alert(
                title="Unsigned executable downloaded",
                description="Downloaded file failed signature verification.",
                severity="medium",
                source="File Defender",
                status="queued",
            ),
        ]
    )


def _seed_firewall_rules(session: Session):
    if session.query(FirewallRule).count() > 0:
        return

    session.add_all(
        [
            FirewallRule(
                name="Block TOR Exit Node",
                action="block",
                target="185.220.101.7",
                protocol="TCP",
                enabled=True,
            ),
            FirewallRule(
                name="Allow SOC Collector",
                action="allow",
                target="10.0.0.15:6514",
                protocol="TCP",
                enabled=True,
            ),
        ]
    )


def _seed_quarantine(session: Session):
    if session.query(QuarantineRecord).count() > 0:
        return

    session.add(
        QuarantineRecord(
            file_name="invoice_viewer.exe",
            file_hash="87c4b9b8f5f4c29f3a2e0a6b23c2f11c",
            risk_score=84.5,
            status="contained",
        )
    )
