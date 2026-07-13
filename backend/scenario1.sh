#!/usr/bin/env bash
# 시나리오 ①: Gem 등록 → 자동승인 → PUBLISHED → 가져가기
set -e
BASE=${BASE:-http://127.0.0.1:8000}

echo "== reset =="
curl -s -X POST $BASE/demo/reset; echo

echo "== 1) 설정형 에이전트(Gem) 등록 (LIGHT → 즉시 PUBLISHED) =="
ID=$(curl -s -X POST $BASE/assets -H "Content-Type: application/json" -d '{
  "title":"인사 규정 안내 Gem","type":"AGENT","platform":"GEMINI","data_level":"L2",
  "author":"박도윤","dept":"경영지원본부",
  "purpose":"사내 인사 규정 질문에 규정 문서 기반으로 답하는 설정형 에이전트입니다."
}' | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
echo "asset id = $ID"

echo "== 2) 상태 이력 =="
curl -s $BASE/assets/$ID | python -m json.tool

echo "== 3) 타인 가져가기 (공급자 +1) =="
curl -s -X POST $BASE/assets/$ID/take -H "Content-Type: application/json" -d '{"user":"이서연"}'; echo

echo "== 4) 점수판 =="
curl -s $BASE/scores | python -m json.tool
