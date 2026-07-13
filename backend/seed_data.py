"""시연용 초기 데이터. register_asset()를 그대로 태워 상태 이력까지 실제로 남긴다."""
import constants as C
from database import SessionLocal
from models import Asset, AuditLog, Score, StatusHistory, UsageLog
from services import register_asset, take_asset

# 4유형 · 4플랫폼 · 3등급을 고루 덮는 10건.
# LIGHT(PROMPT/AGENT + L1|L2) 6건은 등록 즉시 PUBLISHED,
# HEAVY(AUTOMATION·WEBAPP 또는 L3) 4건은 REVIEW_PENDING으로 남는다.
SEED_ASSETS = [
    dict(title="주간 업무보고 초안 생성 프롬프트", type="PROMPT", platform="GEMINI",
         data_level="L2", author="김민준", dept="경영지원본부",
         purpose="한 주간 진행 업무를 항목별로 정리해 보고서 초안을 만드는 프롬프트입니다."),
    dict(title="회의록 3줄 요약 프롬프트", type="PROMPT", platform="CLAUDE",
         data_level="L1", author="이서연", dept="마케팅팀",
         purpose="긴 회의록을 핵심 결정·액션아이템·다음 일정 3줄로 요약합니다."),
    dict(title="인사 규정 안내 Gem", type="AGENT", platform="GEMINI",
         data_level="L2", author="박도윤", dept="경영지원본부",
         purpose="사내 인사 규정에 대한 질문에 규정 문서 기반으로 답하는 설정형 에이전트입니다."),
    dict(title="제안서 검토 Claude Project", type="AGENT", platform="CLAUDE",
         data_level="L2", author="최지우", dept="영업팀",
         purpose="제안서 초안을 구조·논리·오탈자 관점에서 검토해 개선점을 제시합니다."),
    dict(title="코드 리뷰 코멘트 도우미", type="AGENT", platform="COPILOT",
         data_level="L1", author="정하준", dept="개발본부",
         purpose="변경된 코드에 대해 리뷰 코멘트 초안을 생성하는 설정형 에이전트입니다."),
    dict(title="신입 온보딩 FAQ Gem", type="AGENT", platform="GEMINI",
         data_level="L2", author="김민준", dept="경영지원본부",
         purpose="신규 입사자가 자주 묻는 질문에 온보딩 문서 기반으로 답합니다."),
    dict(title="매출 리포트 자동 집계 커넥터", type="AUTOMATION", platform="ETC",
         data_level="L2", author="한소율", dept="영업팀",
         purpose="매출 원장을 주기적으로 집계해 리포트 시트로 만드는 MCP 커넥터입니다."),
    dict(title="메일 분류·라벨링 자동화", type="AUTOMATION", platform="GEMINI",
         data_level="L2", author="오시윤", dept="마케팅팀",
         purpose="수신 메일을 규칙에 따라 분류하고 라벨을 자동 부여하는 자동화입니다."),
    dict(title="사내 연차 계산 웹앱", type="WEBAPP", platform="ETC",
         data_level="L2", author="정하준", dept="개발본부",
         purpose="입사일과 사용 연차를 입력하면 잔여 연차를 계산해 보여주는 웹앱입니다."),
    dict(title="고객 계약 조항 요약 프롬프트", type="PROMPT", platform="CLAUDE",
         data_level="L3", author="최지우", dept="영업팀",
         purpose="고객 계약서의 핵심 조항과 리스크를 요약합니다. 기밀 등급으로 중 트랙 대상입니다."),
]

# 공개된 자산에 대한 가져가기(다독왕·기여 점수 근거). (자산 인덱스, 사용자)
SEED_TAKES = [
    (0, "이서연"), (0, "박도윤"), (1, "김민준"), (2, "최지우"),
    (2, "정하준"), (3, "한소율"), (5, "오시윤"), (5, "이서연"),
]


def clear_all(db):
    """전체 초기화."""
    for model in (Score, UsageLog, AuditLog, StatusHistory, Asset):
        db.query(model).delete()
    db.commit()


def seed(db) -> dict:
    clear_all(db)
    created = [register_asset(db, dict(a)) for a in SEED_ASSETS]

    takes = 0
    for idx, user in SEED_TAKES:
        asset = created[idx]
        db.refresh(asset)
        if asset.status == C.PUBLISHED:
            take_asset(db, asset, user)
            takes += 1

    return {"assets": len(created), "takes": takes}


def reset() -> dict:
    db = SessionLocal()
    try:
        clear_all(db)
        return {"cleared": True}
    finally:
        db.close()
