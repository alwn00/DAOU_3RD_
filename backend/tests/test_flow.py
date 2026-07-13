"""상태 머신 엔드투엔드 테스트.

최소 요구: 4유형 각각 등록→PUBLISHED + 반려 1케이스 + 신고 재심사 1케이스.
"""
from conftest import register


def _statuses(client, asset_id):
    """상태 이력의 to_status 순서 리스트."""
    detail = client.get(f"/assets/{asset_id}").json()
    return [h["to_status"] for h in detail["status_history"]]


# ── 4유형 등록 → PUBLISHED ───────────────────────────────────────────
def test_prompt_light_auto_published(client):
    """PROMPT + L2 → LIGHT → 등록 즉시 PUBLISHED."""
    r = register(client, type="PROMPT", data_level="L2")
    assert r.status_code == 201
    body = r.json()
    assert body["track"] == "LIGHT"
    assert body["status"] == "PUBLISHED"
    assert _statuses(client, body["id"]) == [
        "DRAFT", "AUTO_VALIDATING", "TRACK_ASSIGNED", "AUTO_APPROVED", "PUBLISHED",
    ]


def test_agent_light_auto_published(client):
    """AGENT + L1 → LIGHT → PUBLISHED."""
    r = register(client, title="설정형 에이전트", type="AGENT",
                 platform="CLAUDE", data_level="L1")
    body = r.json()
    assert body["track"] == "LIGHT"
    assert body["status"] == "PUBLISHED"


def test_automation_heavy_review_to_published(client):
    """AUTOMATION → HEAVY → 심사 대기 → AX_PLAN 승인 → PUBLISHED."""
    r = register(client, title="자동화 커넥터", type="AUTOMATION", platform="ETC")
    body = r.json()
    assert body["track"] == "HEAVY"
    assert body["status"] == "REVIEW_PENDING"

    rev = client.post(f"/assets/{body['id']}/review",
                      json={"actor_role": "AX_PLAN", "decision": "APPROVE", "reason": "확인"})
    assert rev.status_code == 200
    assert rev.json()["status"] == "PUBLISHED"


def test_webapp_heavy_build_sim_to_published(client):
    """WEBAPP → HEAVY → 승인 → 기술검증·빌드·배포 시뮬 → PUBLISHED.

    AX_SIM_DELAY=0 이므로 TestClient가 백그라운드 파이프라인을 끝까지 완료시킨다.
    """
    r = register(client, title="사내 웹앱", type="WEBAPP", platform="ETC")
    body = r.json()
    assert body["track"] == "HEAVY"
    assert body["status"] == "REVIEW_PENDING"

    client.post(f"/assets/{body['id']}/review",
                json={"actor_role": "AX_PLAN", "decision": "APPROVE"})

    detail = client.get(f"/assets/{body['id']}").json()
    assert detail["status"] == "PUBLISHED"
    seq = [h["to_status"] for h in detail["status_history"]]
    for step in ("TECH_REVIEW", "BUILD_SIM", "DEPLOY_SIM", "PUBLISHED"):
        assert step in seq
    # 순서 보장
    assert seq.index("TECH_REVIEW") < seq.index("BUILD_SIM") < \
        seq.index("DEPLOY_SIM") < seq.index("PUBLISHED")


def test_l3_forces_heavy(client):
    """L3 기밀은 PROMPT여도 HEAVY 강제."""
    r = register(client, type="PROMPT", data_level="L3")
    assert r.json()["track"] == "HEAVY"


# ── 반려 ─────────────────────────────────────────────────────────────
def test_auto_reject_on_phone_number(client):
    """용도에 전화번호가 포함되면 자동 검증에서 REJECTED."""
    r = register(client, purpose="문의는 010-1234-5678 로 연락 주세요. 자동화 프롬프트입니다.")
    body = r.json()
    assert body["status"] == "REJECTED"
    assert "전화번호" in body["status_history"][-1]["reason"]


def test_review_forbidden_for_non_ax_plan(client):
    """AX_PLAN이 아닌 액터의 심사는 403."""
    r = register(client, type="AUTOMATION", platform="ETC")
    asset_id = r.json()["id"]
    rev = client.post(f"/assets/{asset_id}/review",
                      json={"actor_role": "EMPLOYEE", "decision": "APPROVE"})
    assert rev.status_code == 403


def test_review_reject_requires_reason(client):
    """반려 사유가 없으면 409."""
    r = register(client, type="AUTOMATION", platform="ETC")
    asset_id = r.json()["id"]
    rev = client.post(f"/assets/{asset_id}/review",
                      json={"actor_role": "AX_PLAN", "decision": "REJECT"})
    assert rev.status_code == 409


# ── 신고 재심사 ──────────────────────────────────────────────────────
def test_report_triggers_rereview(client):
    """공개 자산 신고 3회 누적 → REVIEW_PENDING 재진입."""
    r = register(client, type="PROMPT", data_level="L1")  # LIGHT → PUBLISHED
    asset_id = r.json()["id"]
    assert client.get(f"/assets/{asset_id}").json()["status"] == "PUBLISHED"

    for i in range(2):
        res = client.post(f"/assets/{asset_id}/report", json={"reporter": f"u{i}"})
        assert res.json()["reentered_review"] is False

    res = client.post(f"/assets/{asset_id}/report", json={"reporter": "u2"})
    assert res.json()["reentered_review"] is True
    assert client.get(f"/assets/{asset_id}").json()["status"] == "REVIEW_PENDING"


# ── 가져가기 / 점수 ──────────────────────────────────────────────────
def test_take_awards_supply_side_score(client):
    """등록 +3, 타인 가져가기 +1(본인 제외)."""
    r = register(client, author="공급자", type="PROMPT", data_level="L1")
    asset_id = r.json()["id"]

    # 본인 가져가기는 점수 없음
    self_take = client.post(f"/assets/{asset_id}/take", json={"user": "공급자"})
    assert self_take.json()["score_awarded_to_author"] is False

    # 타인 가져가기는 +1
    other = client.post(f"/assets/{asset_id}/take", json={"user": "소비자A"})
    assert other.json()["score_awarded_to_author"] is True

    # 동일인 재가져가기는 추가 점수 없음
    again = client.post(f"/assets/{asset_id}/take", json={"user": "소비자A"})
    assert again.json()["score_awarded_to_author"] is False

    board = {row["user"]: row["points"] for row in client.get("/scores").json()["leaderboard"]}
    assert board["공급자"] == 4  # 등록 3 + 피가져가기 1


def test_take_bonus_capped(client):
    """자산당 피가져가기 보너스 상한 +3."""
    r = register(client, author="공급자2", type="PROMPT", data_level="L1")
    asset_id = r.json()["id"]
    for u in ["a", "b", "c", "d", "e"]:  # 5명이 가져가도 보너스는 최대 3
        client.post(f"/assets/{asset_id}/take", json={"user": u})
    board = {row["user"]: row["points"] for row in client.get("/scores").json()["leaderboard"]}
    assert board["공급자2"] == 6  # 등록 3 + 보너스 상한 3


# ── 시연 데이터 ──────────────────────────────────────────────────────
def test_seed_and_stats(client):
    seeded = client.post("/demo/seed").json()
    assert seeded["assets"] == 10
    stats = client.get("/stats").json()
    assert stats["total_registered"] == 10
    assert stats["by_track"]["LIGHT"] == 6
    assert stats["by_track"]["HEAVY"] == 4
    assert stats["published"] == 6  # LIGHT 6건 자동 공개
