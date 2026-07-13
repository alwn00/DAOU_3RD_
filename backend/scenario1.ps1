# 시나리오 ①: Gem 등록 → 자동승인 → PUBLISHED → 가져가기  (Windows PowerShell)
$ErrorActionPreference = "Stop"
$BASE = if ($env:BASE) { $env:BASE } else { "http://127.0.0.1:8000" }

Write-Host "== reset =="
Invoke-RestMethod -Method Post "$BASE/demo/reset" | Out-Null

Write-Host "== 1) 설정형 에이전트(Gem) 등록 (LIGHT -> 즉시 PUBLISHED) =="
$body = @{
  title="인사 규정 안내 Gem"; type="AGENT"; platform="GEMINI"; data_level="L2"
  author="박도윤"; dept="경영지원본부"
  purpose="사내 인사 규정 질문에 규정 문서 기반으로 답하는 설정형 에이전트입니다."
} | ConvertTo-Json
$asset = Invoke-RestMethod -Method Post "$BASE/assets" -ContentType "application/json; charset=utf-8" -Body $body
$id = $asset.id
Write-Host "asset id = $id, status = $($asset.status), track = $($asset.track)"

Write-Host "== 2) 상태 이력 =="
(Invoke-RestMethod "$BASE/assets/$id").status_history | ForEach-Object { "  $($_.from_status) -> $($_.to_status) [$($_.actor_role)] $($_.reason)" }

Write-Host "== 3) 타인 가져가기 (공급자 +1) =="
Invoke-RestMethod -Method Post "$BASE/assets/$id/take" -ContentType "application/json; charset=utf-8" -Body (@{user="이서연"} | ConvertTo-Json)

Write-Host "== 4) 점수판 =="
(Invoke-RestMethod "$BASE/scores").leaderboard | Format-Table -AutoSize
