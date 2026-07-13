"""DAOU AX 플레이그라운드 — PoC 백엔드 (FastAPI).

실행: uvicorn main:app --reload
목표: 자산의 상태 전이가 실제 DB(StatusHistory)에 기록되는 상태 머신을 시연.
인증·실제 빌드·실제 AI 호출·배포·파일 업로드는 만들지 않는다(시뮬레이션 대체).
"""
from contextlib import asynccontextmanager

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import services as S
from database import Base, engine, get_db
from models import Asset, AuditLog
from schemas import AssetCreate, ReportIn, ReviewIn, TakeIn
from seed_data import reset as reset_db
from seed_data import seed as seed_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # 첫 구동 시 테이블 생성
    yield


app = FastAPI(
    title="DAOU AX 플레이그라운드 PoC",
    description="AI 자산 등록→검증→심사→공개→사용 상태 머신 (기획 PoC)",
    version="1.0.0",
    lifespan=lifespan,
)

# 로컬 시연용 CORS 전체 허용.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_asset_or_404(db: Session, asset_id: int) -> Asset:
    asset = db.get(Asset, asset_id)
    if asset is None:
        raise HTTPException(status_code=404, detail="자산을 찾을 수 없습니다")
    return asset


@app.get("/")
def root():
    return {"service": "DAOU AX 플레이그라운드 PoC", "docs": "/docs"}


# ── 자산 등록 / 조회 ─────────────────────────────────────────────────
@app.post("/assets", status_code=201)
def create_asset(payload: AssetCreate, db: Session = Depends(get_db)):
    """등록 → 자동 검증 → 트랙 배정까지 자동 진행(LIGHT는 자동 공개)."""
    asset = S.register_asset(db, payload.model_dump())
    return S.serialize_asset(asset, with_history=True)


@app.get("/assets")
def list_assets(
    status: str | None = Query(None),
    type: str | None = Query(None),
    dept: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Asset)
    if status:
        q = q.filter(Asset.status == status)
    if type:
        q = q.filter(Asset.type == type)
    if dept:
        q = q.filter(Asset.dept == dept)
    q = q.order_by(Asset.id.desc())
    return [S.serialize_asset(a) for a in q.all()]


@app.get("/assets/{asset_id}")
def get_asset(asset_id: int, db: Session = Depends(get_db)):
    """상세 + 전체 상태 이력(StatusHistory)."""
    asset = _get_asset_or_404(db, asset_id)
    return S.serialize_asset(asset, with_history=True)


# ── 심사 / 가져가기 / 신고 ───────────────────────────────────────────
@app.post("/assets/{asset_id}/review")
def review(asset_id: int, payload: ReviewIn, background_tasks: BackgroundTasks,
           db: Session = Depends(get_db)):
    """HEAVY 심사. actor_role이 AX_PLAN이 아니면 403. 웹앱 승인 시 빌드 시뮬 시작."""
    asset = _get_asset_or_404(db, asset_id)
    try:
        asset = S.review_asset(db, asset, payload.actor_role,
                               payload.decision, payload.reason, background_tasks)
    except S.ForbiddenError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except S.ConflictError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except S.TransitionError as e:
        raise HTTPException(status_code=409, detail=str(e))
    return S.serialize_asset(asset, with_history=True)


@app.post("/assets/{asset_id}/take")
def take(asset_id: int, payload: TakeIn, db: Session = Depends(get_db)):
    """가져가기 → UsageLog + 공급 측 점수 반영."""
    asset = _get_asset_or_404(db, asset_id)
    try:
        return S.take_asset(db, asset, payload.user)
    except S.ConflictError as e:
        raise HTTPException(status_code=409, detail=str(e))


@app.post("/assets/{asset_id}/report")
def report(asset_id: int, payload: ReportIn, db: Session = Depends(get_db)):
    """신고 → 3회 누적 시 REVIEW_PENDING 재진입."""
    asset = _get_asset_or_404(db, asset_id)
    return S.report_asset(db, asset, payload.reporter, payload.reason)


# ── 운영 조회 ────────────────────────────────────────────────────────
@app.get("/audit")
def audit(db: Session = Depends(get_db)):
    rows = db.query(AuditLog).order_by(AuditLog.id.desc()).all()
    return [{
        "id": r.id,
        "asset_id": r.asset_id,
        "actor": r.actor,
        "action": r.action,
        "detail": r.detail,
        "timestamp": r.timestamp.isoformat(),
    } for r in rows]


@app.get("/scores")
def scores(db: Session = Depends(get_db)):
    return {"leaderboard": S.leaderboard(db)}


@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    return S.compute_stats(db)


# ── 시연 보조 ────────────────────────────────────────────────────────
@app.post("/demo/seed")
def demo_seed(db: Session = Depends(get_db)):
    result = seed_db(db)
    return {"seeded": True, **result}


@app.post("/demo/reset")
def demo_reset():
    return {"reset": True, **reset_db()}
