from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(32), index=True)
    source: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(32), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class FirewallRule(Base):
    __tablename__ = "firewall_rules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    action: Mapped[str] = mapped_column(String(16))
    target: Mapped[str] = mapped_column(String(255))
    protocol: Mapped[str] = mapped_column(String(16), default="TCP")
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)


class QuarantineRecord(Base):
    __tablename__ = "quarantine_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_hash: Mapped[str] = mapped_column(String(128), index=True)
    risk_score: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(32), default="contained")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
