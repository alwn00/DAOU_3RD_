"""SQLAlchemy ORM 모델.

기획서 데이터 모델 1~5 그대로:
  Asset / StatusHistory / AuditLog / UsageLog / Score
포터빌리티를 위해 상태·트랙 등은 SQL ENUM 대신 문자열 컬럼으로 두고
값 검증은 애플리케이션(Pydantic·상수)에서 담당한다.
"""
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base, utcnow


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    type = Column(String(20), nullable=False)        # PROMPT | AGENT | AUTOMATION | WEBAPP
    platform = Column(String(20), nullable=False)    # GEMINI | CLAUDE | COPILOT | ETC
    data_level = Column(String(4), nullable=False)   # L1 | L2 | L3
    status = Column(String(20), nullable=False)
    track = Column(String(10), nullable=True)        # LIGHT | HEAVY | NULL
    author = Column(String(50), nullable=False)
    dept = Column(String(50), nullable=False)
    purpose = Column(Text, nullable=False)           # 용도
    report_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=utcnow)
    updated_at = Column(DateTime, nullable=False, default=utcnow)

    history = relationship(
        "StatusHistory",
        back_populates="asset",
        cascade="all, delete-orphan",
        order_by="StatusHistory.id",
    )


class StatusHistory(Base):
    """모든 상태 전이 기록 — 시연의 핵심 근거."""
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    from_status = Column(String(20), nullable=True)  # 최초 등록은 None
    to_status = Column(String(20), nullable=False)
    actor_role = Column(String(20), nullable=False)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=utcnow)

    asset = relationship("Asset", back_populates="history")


class AuditLog(Base):
    """심사 결정·등급 변경·반려 사유 등 감사 기록."""
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    actor = Column(String(50), nullable=False)
    action = Column(String(40), nullable=False)
    detail = Column(Text, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=utcnow)


class UsageLog(Base):
    """가져가기/실행/검토 집계용."""
    __tablename__ = "usage_log"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    user = Column(String(50), nullable=False)
    action = Column(String(10), nullable=False)      # TAKE | RUN | REVIEW
    timestamp = Column(DateTime, nullable=False, default=utcnow)


class Score(Base):
    """공급 측 기여 점수 원장."""
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True)
    user = Column(String(50), nullable=False)
    points = Column(Integer, nullable=False)
    reason = Column(String(50), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    timestamp = Column(DateTime, nullable=False, default=utcnow)
