# 시나리오 ②: 웹앱 등록 → HEAVY → 심사 승인 → 빌드 시뮬 → PUBLISHED  (Windows PowerShell)
$ErrorActionPreference = "Stop"
$BASE = if ($env:BASE) { $env:BASE } else { "http://127.0.0.1:8000" }

Write-Host "== 1) 웹앱 등록 (HEAVY -> REVIEW_PENDING) =="
$body = @{
  title="사내 연차 계산 웹앱"; type="WEBAPP"; platform="ETC"; data_level="L2"
  author="정하준"; dept="개발본부"
  purpose="입사일과 사용 연차를 입력하면 잔여 연차를 계산해 보여주는 웹앱입니다."
} | ConvertTo-Json
$asset = Invoke-RestMethod -Method Post "$BASE/assets" -ContentType "application/json; charset=utf-8" -Body $body
$id = $asset.id
Write-Host "asset id = $id, status = $($asset.status), track = $($asset.track)"

Write-Host "== 2) AX기획팀 승인 -> 빌드/배포 시뮬 시작 =="
$rev = @{ actor_role="AX_PLAN"; decision="APPROVE"; reason="기술 검증 진행" } | ConvertTo-Json
Invoke-RestMethod -Method Post "$BASE/assets/$id/review" -ContentType "application/json; charset=utf-8" -Body $rev | Out-Null

Write-Host "== 3) 상태 순차 점등 폴링 =="
for ($i=1; $i -le 5; $i++) {
  Start-Sleep -Milliseconds 1300
  $s = (Invoke-RestMethod "$BASE/assets/$id").status
  Write-Host "  [$i] status = $s"
}

Write-Host "== 4) 최종 상태 이력 =="
(Invoke-RestMethod "$BASE/assets/$id").status_history | ForEach-Object { "  $($_.from_status) -> $($_.to_status) [$($_.actor_role)] $($_.reason)" }

Write-Host "== (참고) 권한 없는 심사는 403 =="
try {
  Invoke-RestMethod -Method Post "$BASE/assets/$id/review" -ContentType "application/json; charset=utf-8" -Body (@{actor_role="EMPLOYEE"; decision="APPROVE"} | ConvertTo-Json) | Out-Null
  Write-Host "  (예상과 다름: 403이 나와야 함)"
} catch {
  Write-Host "  http_code = $($_.Exception.Response.StatusCode.value__)"
}
