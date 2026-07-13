"""테스트 픽스처.

앱 import 전에 환경변수를 설정한다:
  - AX_DATABASE_URL: 임시 파일 SQLite (실 DB와 분리)
  - AX_SIM_DELAY=0: 웹앱 빌드 시뮬 대기 제거 → TestClient가 백그라운드 태스크를
    동기적으로 완료시키므로, 심사 승인 직후 PUBLISHED까지 검증 가능.
"""
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

_DB_FD, _DB_PATH = tempfile.mkstemp(suffix=".db")
os.close(_DB_FD)
os.environ["AX_DATABASE_URL"] = f"sqlite:///{_DB_PATH}"
os.environ["AX_SIM_DELAY"] = "0"

import pytest
from fastapi.testclient import TestClient

from database import Base, engine
from main import app


@pytest.fixture()
def client():
    Base.metadata.create_all(bind=engine)
    c = TestClient(app)
    c.post("/demo/reset")  # 각 테스트를 깨끗한 상태에서 시작
    yield c


def register(client, **overrides):
    body = dict(
        title="테스트 자산",
        type="PROMPT",
        platform="GEMINI",
        data_level="L2",
        author="테스터",
        dept="AX기획팀",
        purpose="이 자산은 자동 검증을 통과하기 위한 충분한 길이의 용도 설명입니다.",
    )
    body.update(overrides)
    return client.post("/assets", json=body)
