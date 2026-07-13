#!/usr/bin/env bash
# 시나리오 ②: 웹앱 등록 → HEAVY → 심사 승인 → 빌드 시뮬 → PUBLISHED
set -e
BASE=${BASE:-http://127.0.0.1:8000}

echo "== 1) 웹앱 등록 (HEAVY → REVIEW_PENDING) =="
ID=$(curl -s -X POST $BASE/assets -H "Content-Type: application/json" -d '{
  "title":"사내 연차 계산 웹앱","type":"WEBAPP","platform":"ETC","data_level":"L2",
  "author":"정하준","dept":"개발본부",
  "purpose":"입사일과 사용 연차를 입력하면 잔여 연차를 계산해 보여주는 웹앱입니다."
}' | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
echo "asset id = $ID"

echo "== 2) AX기획팀 승인 → 빌드/배포 시뮬 시작 =="
curl -s -X POST $BASE/assets/$ID/review -H "Content-Type: application/json" \
  -d '{"actor_role":"AX_PLAN","decision":"APPROVE","reason":"기술 검증 진행"}'; echo

echo "== 3) 상태 순차 점등 폴링 =="
for i in 1 2 3 4 5; do
  sleep 1.3
  S=$(curl -s $BASE/assets/$ID | python -c "import sys,json;print(json.load(sys.stdin)['status'])")
  echo "  [$i] status = $S"
done

echo "== 4) 최종 상태 이력 =="
curl -s $BASE/assets/$ID | python -m json.tool

echo "== (참고) 권한 없는 심사는 403 =="
curl -s -o /dev/null -w "http_code=%{http_code}\n" -X POST $BASE/assets/$ID/review \
  -H "Content-Type: application/json" -d '{"actor_role":"EMPLOYEE","decision":"APPROVE"}'
