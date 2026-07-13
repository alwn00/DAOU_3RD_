"""비즈니스 로직: 자동 검증 · 상태 머신 · 트랙 배정 · 심사 · 가져가기 · 신고 · 점수.

이 모듈의 존재 이유는 '버튼 결과'가 아니라 상태 전이가 실제로 DB(StatusHistory)에
남는 것을 증명하는 것이다. 모든 상태 변경은 record_transition()을 거친다.
"""
import asyncio
import os
import re

from sqlalchemy import func

import constants as C
from database import SessionLocal, utcnow
from models import Asset, AuditLog, Score, StatusHistory, UsageLog


# ── 예외 ─────────────────────────────────────────────────────────────
class TransitionError(Exception):
    """허용되지 않은 상태 전이."""


class ConflictError(Exception):
    """현재 상태에서 수행할 수 없는 요청(409)."""


class ForbiddenError(Exception):
    """권한 없는 액터(403)."""


# ── 자동 검증 룰 ─────────────────────────────────────────────────────
# 실제 정규식으로 검사한다(시연에서 '진짜 거른다'를 보이기 위함).
RE_RRN = re.compile(r"\b\d{6}[-\s]?\d{7}\b")                       # 주민등록번호
RE_PHONE = re.compile(r"\b01[016789][-\s]?\d{3,4}[-\s]?\d{4}\b")   # 휴대전화
RE_EMAIL = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
RE_SECRET = re.compile(r"(password|api[_\-]?key|secret)", re.IGNORECASE)

PURPOSE_MIN_LEN = 10


def validate_asset(asset: Asset) -> list[str]:
    """통과하면 빈 리스트, 위반 시 사유 리스트."""
    issues: list[str] = []

    required = ("title", "type", "platform", "data_level", "author", "dept", "purpose")
    for field in required:
        if not getattr(asset, field):
            issues.append(f"필수 항목 누락: {field}")

    if asset.purpose and len(asset.purpose.strip()) < PURPOSE_MIN_LEN:
        issues.append(f"용도(purpose) 설명이 너무 짧습니다(최소 {PURPOSE_MIN_LEN}자)")

    text = f"{asset.title or ''} {asset.purpose or ''}"
    if RE_RRN.search(text):
        issues.append("주민등록번호 형식이 감지되었습니다")
    if RE_PHONE.search(text):
        issues.append("전화번호 형식이 감지되었습니다")
    if RE_EMAIL.search(text):
        issues.append("이메일 주소가 감지되었습니다")
    if RE_SECRET.search(text):
        issues.append("민감 키워드(password/api_key/secret)가 감지되었습니다")

    return issues


def assign_track(asset: Asset) -> str:
    """트랙 배정 룰.

    PROMPT·AGENT + (L1|L2) → LIGHT.
    AUTOMATION·WEBAPP 이거나 L3 → HEAVY(L3는 트랙 강제).
    """
    if asset.type in ("AUTOMATION", "WEBAPP") or asset.data_level == "L3":
        return C.HEAVY
    return C.LIGHT


# ── 상태 머신 ────────────────────────────────────────────────────────
def record_transition(db, asset: Asset, to_status: str, actor_role: str, reason=None):
    """상태를 바꾸고 StatusHistory에 한 줄 남긴다. 불법 전이는 거부."""
    from_status = asset.status
    if to_status not in C.ALLOWED_TRANSITIONS.get(from_status, set()):
        raise TransitionError(f"허용되지 않은 전이: {from_status} -> {to_status}")
    now = utcnow()
    asset.status = to_status
    asset.updated_at = now
    db.add(StatusHistory(
        asset_id=asset.id,
        from_status=from_status,
        to_status=to_status,
        actor_role=actor_role,
        reason=reason,
        timestamp=now,
    ))


def _audit(db, action: str, actor: str, detail: str, asset_id=None):
    db.add(AuditLog(asset_id=asset_id, actor=actor, action=action,
                    detail=detail, timestamp=utcnow()))


def _award(db, user: str, points: int, reason: str, asset_id=None):
    db.add(Score(user=user, points=points, reason=reason,
                 asset_id=asset_id, timestamp=utcnow()))


# ── 등록 플로우: 등록 → 자동검증 → 트랙배정 → (LIGHT면 자동공개) ──────
def register_asset(db, data: dict) -> Asset:
    now = utcnow()
    asset = Asset(status=C.DRAFT, track=None, report_count=0,
                  created_at=now, updated_at=now, **data)
    db.add(asset)
    db.flush()  # id 확보

    # 최초 기록(from_status=None)은 상태 머신 표를 타지 않고 직접 남긴다.
    db.add(StatusHistory(asset_id=asset.id, from_status=None, to_status=C.DRAFT,
                         actor_role=C.EMPLOYEE, reason="자산 등록", timestamp=now))

    record_transition(db, asset, C.AUTO_VALIDATING, C.SYSTEM, "자동 검증 시작")

    issues = validate_asset(asset)
    if issues:
        reason = "; ".join(issues)
        record_transition(db, asset, C.REJECTED, C.SYSTEM, reason)
        _audit(db, "AUTO_REJECT", C.SYSTEM, reason, asset.id)
        db.commit()
        db.refresh(asset)
        return asset

    track = assign_track(asset)
    asset.track = track
    record_transition(db, asset, C.TRACK_ASSIGNED, C.SYSTEM, f"트랙 배정: {track}")
    _audit(db, "AUTO_VALIDATE_PASS", C.SYSTEM, f"track={track}", asset.id)

    # 검증을 통과한 유효 등록에만 기여 점수 +3.
    _award(db, asset.author, C.REGISTER_POINTS, C.REASON_REGISTER, asset.id)

    if track == C.LIGHT:
        record_transition(db, asset, C.AUTO_APPROVED, C.SYSTEM, "룰 기반 자동 승인")
        _audit(db, "AUTO_APPROVE", C.SYSTEM, "Light 트랙 자동 승인", asset.id)
        record_transition(db, asset, C.PUBLISHED, C.SYSTEM, "공개")
    else:
        record_transition(db, asset, C.REVIEW_PENDING, C.SYSTEM, "중(Heavy) 트랙 수동 심사 대기")

    db.commit()
    db.refresh(asset)
    return asset


# ── 심사 플로우(HEAVY) ───────────────────────────────────────────────
def review_asset(db, asset: Asset, actor_role: str, decision: str, reason, background_tasks):
    if actor_role != C.AX_PLAN:
        raise ForbiddenError("심사 권한은 AX기획팀(AX_PLAN)에만 있습니다")
    if asset.status != C.REVIEW_PENDING:
        raise ConflictError(f"심사 대기 상태가 아닙니다(현재: {asset.status})")

    if decision == "REJECT":
        if not reason or not reason.strip():
            raise ConflictError("반려 사유는 필수입니다")
        record_transition(db, asset, C.REJECTED, C.AX_PLAN, reason)
        _audit(db, "REVIEW_REJECT", C.AX_PLAN, reason, asset.id)
        db.commit()
        db.refresh(asset)
        return asset

    # APPROVE
    _audit(db, "REVIEW_APPROVE", C.AX_PLAN, reason or "승인", asset.id)

    if asset.type == "WEBAPP":
        # 웹앱: 기술검증 → 빌드 → 배포 시뮬레이션을 백그라운드로 순차 점등.
        db.commit()
        if background_tasks is not None:
            background_tasks.add_task(run_webapp_pipeline, asset.id)
        db.refresh(asset)
        return asset

    # 웹앱이 아닌 HEAVY: 승인 즉시 공개.
    record_transition(db, asset, C.PUBLISHED, C.AX_PLAN, "심사 승인 후 공개")
    db.commit()
    db.refresh(asset)
    return asset


# 웹앱 파이프라인 각 단계. asyncio.sleep으로 '순서대로 점등'을 연출한다.
WEBAPP_STEPS = [
    (C.TECH_REVIEW, C.AX_DEV, "기술 검증"),
    (C.BUILD_SIM, C.AX_DEV, "컨테이너 빌드 시뮬레이션"),
    (C.DEPLOY_SIM, C.AX_DEV, "배포 시뮬레이션"),
    (C.PUBLISHED, C.AX_DEV, "배포 완료·공개"),
]


async def run_webapp_pipeline(asset_id: int):
    """REVIEW_PENDING → TECH_REVIEW → BUILD_SIM → DEPLOY_SIM → PUBLISHED.

    각 단계 사이 AX_SIM_DELAY초 대기(기본 1.2초, 테스트는 0). 단계마다
    자체 세션으로 커밋하므로 진행 중 GET /assets/{id} 폴링이 순차 점등을 본다.
    """
    delay = float(os.getenv("AX_SIM_DELAY", "1.2"))
    for to_status, actor, reason in WEBAPP_STEPS:
        if delay:
            await asyncio.sleep(delay)
        db = SessionLocal()
        try:
            asset = db.get(Asset, asset_id)
            if asset is None:
                return
            record_transition(db, asset, to_status, actor, reason)
            _audit(db, f"PIPELINE_{to_status}", actor, reason, asset_id)
            db.commit()
        finally:
            db.close()


# ── 가져가기 플로우 ──────────────────────────────────────────────────
def take_asset(db, asset: Asset, user: str) -> dict:
    if asset.status != C.PUBLISHED:
        raise ConflictError("공개(PUBLISHED)된 자산만 가져갈 수 있습니다")

    # 새 로그 추가 전에 '이 사용자가 이 자산을 이전에 가져간 적 있는지' 판단.
    prior = (db.query(UsageLog)
             .filter_by(asset_id=asset.id, user=user, action="TAKE").count())
    db.add(UsageLog(asset_id=asset.id, user=user, action="TAKE",
                    timestamp=utcnow()))

    awarded = False
    if user != asset.author and prior == 0:
        bonus_given = (db.query(Score)
                       .filter_by(asset_id=asset.id, reason=C.REASON_TAKE).count())
        if bonus_given < C.TAKE_BONUS_CAP:
            _award(db, asset.author, C.TAKE_POINTS, C.REASON_TAKE, asset.id)
            awarded = True

    db.commit()
    return {"asset_id": asset.id, "user": user, "score_awarded_to_author": awarded}


# ── 신고 플로우 ──────────────────────────────────────────────────────
def report_asset(db, asset: Asset, reporter, reason) -> dict:
    asset.report_count = (asset.report_count or 0) + 1
    _audit(db, "REPORT", reporter or "ANONYMOUS", reason or "", asset.id)

    reentered = False
    if asset.report_count >= C.REPORT_THRESHOLD and asset.status == C.PUBLISHED:
        record_transition(db, asset, C.REVIEW_PENDING, C.SYSTEM,
                          f"신고 {asset.report_count}회 누적으로 재심사 진입")
        _audit(db, "AUTO_REREVIEW", C.SYSTEM, "신고 누적 재심사 진입", asset.id)
        asset.report_count = 0
        reentered = True

    db.commit()
    db.refresh(asset)
    return {"asset_id": asset.id, "report_count": asset.report_count,
            "status": asset.status, "reentered_review": reentered}


# ── 직렬화 ───────────────────────────────────────────────────────────
def serialize_history(h: StatusHistory) -> dict:
    return {
        "from_status": h.from_status,
        "to_status": h.to_status,
        "actor_role": h.actor_role,
        "reason": h.reason,
        "timestamp": h.timestamp.isoformat(),
    }


def serialize_asset(asset: Asset, with_history: bool = False) -> dict:
    data = {
        "id": asset.id,
        "title": asset.title,
        "type": asset.type,
        "platform": asset.platform,
        "data_level": asset.data_level,
        "status": asset.status,
        "track": asset.track,
        "author": asset.author,
        "dept": asset.dept,
        "purpose": asset.purpose,
        "report_count": asset.report_count,
        "created_at": asset.created_at.isoformat(),
        "updated_at": asset.updated_at.isoformat(),
    }
    if with_history:
        data["status_history"] = [serialize_history(h) for h in asset.history]
    return data


def compute_stats(db) -> dict:
    total = db.query(func.count(Asset.id)).scalar() or 0

    def count_status(s):
        return db.query(func.count(Asset.id)).filter(Asset.status == s).scalar() or 0

    by_track = {C.LIGHT: 0, C.HEAVY: 0, "UNASSIGNED": 0}
    for track, cnt in db.query(Asset.track, func.count(Asset.id)).group_by(Asset.track):
        by_track[track or "UNASSIGNED"] = cnt

    by_type = {t: 0 for t in C.TYPES}
    for t, cnt in db.query(Asset.type, func.count(Asset.id)).group_by(Asset.type):
        by_type[t] = cnt

    takes = (db.query(func.count(UsageLog.id))
             .filter(UsageLog.action == "TAKE").scalar() or 0)

    return {
        "total_registered": total,
        "published": count_status(C.PUBLISHED),
        "review_pending": count_status(C.REVIEW_PENDING),
        "rejected": count_status(C.REJECTED),
        "in_progress": total - count_status(C.PUBLISHED) - count_status(C.REJECTED),
        "takes": takes,
        "by_track": by_track,
        "by_type": by_type,
    }


def leaderboard(db) -> list[dict]:
    rows = (db.query(Score.user, func.sum(Score.points).label("points"))
            .group_by(Score.user)
            .order_by(func.sum(Score.points).desc())
            .all())
    return [{"user": user, "points": int(points)} for user, points in rows]
