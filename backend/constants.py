"""상태 머신 / 트랙 / 액터 / 점수 규칙 상수.

'확정된 시스템 구조'를 그대로 코드화한 것. 임의 변경 금지 대상이다.
"""

# ── 자산 상태(status) ────────────────────────────────────────────────
DRAFT = "DRAFT"
AUTO_VALIDATING = "AUTO_VALIDATING"
TRACK_ASSIGNED = "TRACK_ASSIGNED"
AUTO_APPROVED = "AUTO_APPROVED"
REVIEW_PENDING = "REVIEW_PENDING"
TECH_REVIEW = "TECH_REVIEW"
BUILD_SIM = "BUILD_SIM"
DEPLOY_SIM = "DEPLOY_SIM"
PUBLISHED = "PUBLISHED"
REJECTED = "REJECTED"

# ── 심사 트랙(track) ─────────────────────────────────────────────────
LIGHT = "LIGHT"   # 경: 룰 기반 자동 심사
HEAVY = "HEAVY"   # 중: 자동 검증 + AX기획팀 수동 심사(웹앱은 AX개발팀 기술 검증)

# ── 액터 역할(actor_role) ────────────────────────────────────────────
EMPLOYEE = "EMPLOYEE"     # 직원: 탐색·등록·가져가기
AX_PLAN = "AX_PLAN"       # AX기획팀: 정책·심사·운영
AX_DEV = "AX_DEV"         # AX개발팀: 기술검증·빌드·배포·로그
SEC_LEGAL = "SEC_LEGAL"   # 보안·법무: 외부 연결·라이선스 검토
SYSTEM = "SYSTEM"         # 자동 룰 엔진

# ── 자산 분류값 ──────────────────────────────────────────────────────
TYPES = ("PROMPT", "AGENT", "AUTOMATION", "WEBAPP")
PLATFORMS = ("GEMINI", "CLAUDE", "COPILOT", "ETC")
DATA_LEVELS = ("L1", "L2", "L3")

# ── 허용 상태 전이 그래프 ────────────────────────────────────────────
# record_transition()이 이 표에 없는 전이를 거부한다.
ALLOWED_TRANSITIONS = {
    DRAFT: {AUTO_VALIDATING},
    AUTO_VALIDATING: {TRACK_ASSIGNED, REJECTED},
    TRACK_ASSIGNED: {AUTO_APPROVED, REVIEW_PENDING, REJECTED},
    AUTO_APPROVED: {PUBLISHED, REJECTED},
    REVIEW_PENDING: {TECH_REVIEW, PUBLISHED, REJECTED},
    TECH_REVIEW: {BUILD_SIM, REJECTED},
    BUILD_SIM: {DEPLOY_SIM, REJECTED},
    DEPLOY_SIM: {PUBLISHED, REJECTED},
    PUBLISHED: {REVIEW_PENDING},   # 신고 누적 시 재심사 재진입
    REJECTED: set(),               # 종착
}

# ── 점수 규칙(공급 측에만 부여) ──────────────────────────────────────
REGISTER_POINTS = 3     # 등록(자동 검증 통과) +3
TAKE_POINTS = 1         # 피가져가기 +1 / 동일인 1회
TAKE_BONUS_CAP = 3      # 자산당 피가져가기 보너스 상한 +3

REASON_REGISTER = "등록 +3"
REASON_TAKE = "피가져가기 +1"

# ── 신고 재심사 임계치 ───────────────────────────────────────────────
REPORT_THRESHOLD = 3
