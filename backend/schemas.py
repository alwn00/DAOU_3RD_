"""요청 바디 스키마(Pydantic). 응답은 services의 serialize_* 로 dict 직렬화한다."""
from typing import Literal, Optional

from pydantic import BaseModel, Field


class AssetCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    type: Literal["PROMPT", "AGENT", "AUTOMATION", "WEBAPP"]
    platform: Literal["GEMINI", "CLAUDE", "COPILOT", "ETC"]
    data_level: Literal["L1", "L2", "L3"]
    author: str = Field(..., min_length=1, max_length=50)
    dept: str = Field(..., min_length=1, max_length=50)
    purpose: str = Field(..., min_length=1)


class ReviewIn(BaseModel):
    actor_role: str
    decision: Literal["APPROVE", "REJECT"]
    reason: Optional[str] = None


class TakeIn(BaseModel):
    user: str = Field(..., min_length=1, max_length=50)


class ReportIn(BaseModel):
    reporter: Optional[str] = None
    reason: Optional[str] = None
