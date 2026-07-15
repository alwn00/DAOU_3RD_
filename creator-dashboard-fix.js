/* Privacy-safe creator dashboard: platform-observable, aggregate signals only */
(function(){
  'use strict';
  if(window.__DAOU_CREATOR_DASHBOARD_FIX__)return;
  window.__DAOU_CREATOR_DASHBOARD_FIX__=true;

  const assetSignals=[
    {title:'채용공고 초안 작성기',version:'v1.3',adopts:31,reviews:8,improvements:3,updates:22},
    {title:'사내 규정 안내 도우미',version:'v2.0',adopts:24,reviews:6,improvements:4,updates:17},
    {title:'회의 후속조치 정리',version:'v1.1',adopts:18,reviews:3,improvements:1,updates:11}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .creator-impact-v14{margin:18px 0 26px}.creator-impact-head-v14{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:12px}.creator-impact-head-v14 h3{font-size:1.08rem}.creator-impact-head-v14 p{font-size:.76rem;color:var(--ink-soft);line-height:1.55;margin-top:3px}
    .impact-stats-v14{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.impact-stat-v14{padding:15px 16px}.impact-stat-v14 .k{font-size:.69rem;color:var(--ink-faint);font-weight:800}.impact-stat-v14 .v{font-size:1.35rem;font-weight:900;margin-top:4px;color:var(--ink)}.impact-stat-v14 .s{font-size:.66rem;color:var(--ink-soft);margin-top:3px}.impact-stat-v14 .up{color:var(--gw-blue);font-weight:850}
    .privacy-board-v24{margin-top:12px;padding:0;overflow:hidden}.privacy-board-head-v24{display:grid;grid-template-columns:minmax(230px,1fr) 80px 90px 90px 100px;padding:10px 14px;background:var(--paper-deep);font-size:.65rem;color:var(--ink-faint);font-weight:850}.privacy-board-row-v24{display:grid;grid-template-columns:minmax(230px,1fr) 80px 90px 90px 100px;align-items:center;padding:12px 14px;border-top:1px solid var(--line-soft);font-size:.72rem}.privacy-board-row-v24:first-of-type{border-top:0}.privacy-board-row-v24 b{font-size:.78rem}.privacy-board-row-v24 .sub{font-size:.63rem;color:var(--ink-faint);margin-top:2px}.privacy-board-row-v24 .num{text-align:right;font-weight:850}.privacy-note-v24{display:flex;gap:10px;align-items:flex-start;margin-top:10px;padding:11px 13px;background:var(--gw-blue-tint);border:1px solid #cfe1f7;border-radius:5px;font-size:.68rem;color:var(--ink-soft);line-height:1.5}.privacy-note-v24 b{color:var(--gw-blue)}
    @media(max-width:850px){.impact-stats-v14{grid-template-columns:repeat(2,1fr)}.privacy-board-head-v24{display:none}.privacy-board-row-v24{grid-template-columns:1fr 1fr;gap:5px 12px}.privacy-board-row-v24>div:first-child{grid-column:1/-1}.privacy-board-row-v24 .num{text-align:left}}
    @media(max-width:560px){.impact-stats-v14{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function impactHTML(){
    const totals=assetSignals.reduce((a,x)=>({adopts:a.adopts+x.adopts,reviews:a.reviews+x.reviews,improvements:a.improvements+x.improvements,updates:a.updates+x.updates}),{adopts:0,reviews:0,improvements:0,updates:0});
    return '<section class="creator-impact-v14" data-creator-dashboard-fixed="true">'
      +'<div class="creator-impact-head-v14"><div><h3>📊 내 AI 자산 반응</h3><p>플랫폼 안에서 확인 가능한 집계 신호만 제공합니다. 개인별 사용 여부와 복사 이후 활동은 추적하지 않습니다.</p></div><span class="pill">최근 30일 · 익명 집계</span></div>'
      +'<div class="impact-stats-v14">'
      +'<div class="card impact-stat-v14"><div class="k">가져가기·사본 생성</div><div class="v">'+totals.adopts+'회</div><div class="s">플랫폼에서 기록된 자산 가져가기</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">받은 후기</div><div class="v">'+totals.reviews+'건</div><div class="s">작성자가 직접 남긴 자산 후기</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">개선 제안</div><div class="v">'+totals.improvements+'건</div><div class="s">채택·검토 가능한 자산 단위 제안</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">새 버전 확인</div><div class="v">'+totals.updates+'회</div><div class="s">업데이트 알림에서 버전 상세 확인</div></div>'
      +'</div>'
      +'<div class="card privacy-board-v24"><div class="privacy-board-head-v24"><span>AI 자산</span><span style="text-align:right">현재 버전</span><span style="text-align:right">가져가기</span><span style="text-align:right">후기·제안</span><span style="text-align:right">버전 확인</span></div>'
      +assetSignals.map(x=>'<div class="privacy-board-row-v24"><div><b>'+x.title+'</b><div class="sub">개인·부서 정보 비공개</div></div><div class="num">'+x.version+'</div><div class="num">'+x.adopts+'회</div><div class="num">'+(x.reviews+x.improvements)+'건</div><div class="num">'+x.updates+'회</div></div>').join('')
      +'</div>'
      +'<div class="privacy-note-v24"><span>🔒</span><span><b>집계 원칙</b> 프롬프트를 복사한 뒤 외부 도구에서 사용한 횟수·소요시간·사용자는 알 수 없습니다. 이름, 부서, 개인별 실행 기록은 제작자에게 제공하지 않으며, 플랫폼에서 발생한 가져가기·후기·개선·버전 확인 이벤트만 자산 단위로 집계합니다.</span></div>'
      +'</section>';
  }

  function removeSection(root,pattern){
    const title=[...root.querySelectorAll('.section-title')].find(el=>pattern.test((el.textContent||'').trim()));
    if(!title)return;
    let node=title.nextElementSibling;
    while(node&&!node.classList.contains('section-title')){
      const next=node.nextElementSibling;node.remove();node=next;
    }
    title.remove();
  }

  function applyCreatorFix(mode){
    if(mode!=='creator')return;
    const root=document.getElementById('screen-my');if(!root)return;
    root.querySelectorAll('.creator-impact-v14,.contribution-summary,.usage-toggle-v14,.impact-grid-v14').forEach(el=>el.remove());
    removeSection(root,/활동 기록|GIT\s*CONTRIBUTION|최근 사용한 동료|자산별 실행 횟수/i);
    removeSection(root,/어느 부서에서 많이 활용하나|내 자산.*부서.*활용/i);
    const head=root.querySelector('.asset-vault-head');
    if(head)head.insertAdjacentHTML('afterend',impactHTML());else root.insertAdjacentHTML('afterbegin',impactHTML());
  }

  const baseRenderMy=window.renderMy;
  if(typeof baseRenderMy==='function')window.renderMy=function(mode){const result=baseRenderMy.apply(this,arguments);applyCreatorFix(mode||'reader');return result;};
  const baseRenderMyIn=window.renderMyIn;
  window.renderMyIn=function(mode){if(typeof window.renderMy==='function')return window.renderMy(mode);if(typeof baseRenderMyIn==='function')return baseRenderMyIn(mode);};
  if(window.state&&state.screen==='my'){
    const active=document.querySelector('.asset-vault-tabs button.active');
    if(active&&/내가 만든 자산/.test(active.textContent||''))applyCreatorFix('creator');
  }
})();
