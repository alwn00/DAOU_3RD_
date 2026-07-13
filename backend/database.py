"""DB 엔진 / 세션 정의.

SQLite 기본. AX_DATABASE_URL 환경변수로 PostgreSQL 등으로 교체 가능하도록
연결 문자열만 바꾸면 되게 구성했다(모델은 표준 SQLAlchemy만 사용).
"""
import os
from datetime import datetime, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def utcnow() -> datetime:
    """naive UTC datetime. (datetime.utcnow() deprecation 회피 + isoformat 출력 안정화)"""
    return datetime.now(timezone.utc).replace(tzinfo=None)

DATABASE_URL = os.getenv("AX_DATABASE_URL", "sqlite:///./ax_playground.db")

# SQLite는 단일 파일 + 멀티스레드(백그라운드 태스크) 접근을 위해 옵션 필요.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


def get_db():
    """FastAPI 의존성용 세션 제너레이터."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
