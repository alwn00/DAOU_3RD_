/* Creator dashboard: privacy-safe organizational impact signals */
(function(){
  'use strict';
  if(window.__DAOU_CREATOR_DASHBOARD_FIX__)return;
  window.__DAOU_CREATOR_DASHBOARD_FIX__=true;

  const assetSignals=[
    {title:'채용공고 초안 작성기',version:'v1.3',adopts:31,reviews:8,improvements:3,updates:22,departments:6,engaged:19,origin:'교육에서 시작'},
    {title:'사내 규정 안내 도우미',version:'v2.0',adopts:24,reviews:6,improvements:4,updates:17,departments:5,engaged:14,origin:'제작 요청에서 시작'},
    {title:'회의 후속조치 정리',version:'v1.1',adopts:18,reviews:3,improvements:1,updates:11,departments:4,engaged:9,origin:'개인 제작에서 시작'}
  ];
  const deptSignals=[
    {name:'경영지원',count:22},{name:'AX',count:18},{name:'개발',count:14},{name:'마케팅',count:10},{name:'영업',count:6},{name:'기타 4개 부서',count:3}
  ];
  const lifecycle=[
    {label:'v1.0 공개',detail:'경영지원팀 최초 등록'},
    {label:'3개 부서 확산',detail:'가져가기 18회'},
    {label:'개선 제안 채택',detail:'담당자·기한 표 추가'},
    {label:'v1.3 공개',detail:'6개 부서로 확산'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .creator-impact-v14{margin:18px 0 26px}.creator-impact-head-v14{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:12px}.creator-impact-head-v14 h3{font-size:1.08rem}.creator-impact-head-v14 p{font-size:.76rem;color:var(--ink-soft);line-height:1.55;margin-top:3px}
    .impact-stats-v14{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.impact-stat-v14{padding:15px 16px}.impact-stat-v14 .k{font-size:.69rem;color:var(--ink-faint);font-weight:800}.impact-stat-v14 .v{font-size:1.35rem;font-weight:900;margin-top:4px;color:var(--ink)}.impact-stat-v14 .s{font-size:.66rem;color:var(--ink-soft);margin-top:3px}.impact-stat-v14 .up{color:var(--gw-blue);font-weight:850}
    .creator-impact-grid-v26{display:grid;grid-template-columns:1.15fr .85fr;gap:12px;margin-top:12px}.impact-panel-v26{padding:16px 18px}.impact-panel-v26 h4{font-size:.88rem;margin-bottom:3px}.impact-panel-v26 .desc{font-size:.66rem;color:var(--ink-faint);margin-bottom:12px}
    .dept-row-v26{display:grid;grid-template-columns:92px minmax(120px,1fr) 46px;gap:9px;align-items:center;margin:10px 0}.dept-row-v26 .name{font-size:.71rem;font-weight:800}.dept-bar-v26{height:8px;background:#e7ebf0;border-radius:99px;overflow:hidden}.dept-bar-v26 i{display:block;height:100%;background:var(--gw-blue);border-radius:99px}.dept-row-v26 b{text-align:right;font-size:.69rem}
    .timeline-v26{position:relative;padding-left:21px}.timeline-v26:before{content:'';position:absolute;left:6px;top:7px;bottom:7px;width:2px;background:#dce3ea}.timeline-item-v26{position:relative;padding:0 0 15px}.timeline-item-v26:last-child{padding-bottom:0}.timeline-item-v26:before{content:'';position:absolute;left:-19px;top:4px;width:9px;height:9px;border-radius:50%;background:var(--gw-blue);border:2px solid #fff;box-shadow:0 0 0 1px #b8d1e6}.timeline-item-v26 b{display:block;font-size:.74rem}.timeline-item-v26 span{font-size:.65rem;color:var(--ink-faint)}
    .privacy-board-v24{margin-top:12px;padding:0;overflow:hidden}.privacy-board-head-v24{display:grid;grid-template-columns:minmax(210px,1fr) 70px 82px 82px 82px 95px;padding:10px 14px;background:var(--paper-deep);font-size:.64rem;color:var(--ink-faint);font-weight:850}.privacy-board-row-v24{display:grid;grid-template-columns:minmax(210px,1fr) 70px 82px 82px 82px 95px;align-items:center;padding:12px 14px;border-top:1px solid var(--line-soft);font-size:.71rem}.privacy-board-row-v24:first-of-type{border-top:0}.privacy-board-row-v24 b{font-size:.78rem}.privacy-board-row-v24 .sub{font-size:.62rem;color:var(--ink-faint);margin-top:2px}.privacy-board-row-v24 .num{text-align:right;font-weight:850}.privacy-note-v24{display:flex;gap:10px;align-items:flex-start;margin-top:10px;padding:11px 13px;background:var(--gw-blue-tint);border:1px solid #cfe1f7;border-radius:5px;font-size:.68rem;color:var(--ink-soft);line-height:1.5}.privacy-note-v24 b{color:var(--gw-blue)}
    @media(max-width:980px){.creator-impact-grid-v26{grid-template-columns:1fr}.impact-stats-v14{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:850px){.privacy-board-head-v24{display:none}.privacy-board-row-v24{grid-template-columns:1fr 1fr;gap:5px 12px}.privacy-board-row-v24>div:first-child{grid-column:1/-1}.privacy-board-row-v24 .num{text-align:left}}
    @media(max-width:560px){.impact-stats-v14{grid-template-columns:1fr}.dept-row-v26{grid-template-columns:80px 1fr 40px}}
  `;
  document.head.appendChild(style);

  function impactHTML(){
    const totals=assetSignals.reduce((a,x)=>({adopts:a.adopts+x.adopts,reviews:a.reviews+x.reviews,improvements:a.improvements+x.improvements,updates:a.updates+x.updates,engaged:a.engaged+x.engaged}),{adopts:0,reviews:0,improvements:0,updates:0,engaged:0});
    const deptTotal=9;
    const engageRate=Math.round(totals.engaged/Math.max(1,totals.adopts)*100);
    const maxDept=Math.max(...deptSignals.map(x=>x.count),1);
    return '<section class="creator-impact-v14" data-creator-dashboard-fixed="true">'
      +'<div class="creator-impact-head-v14"><div><h3>📊 내가 만든 AI의 조직 영향력</h3><p>내 자산이 얼마나 넓게 확산되고, 어떤 반응을 만들었는지 자산·부서 단위 집계로 확인합니다.</p></div><span class="pill">최근 30일 · 익명 집계</span></div>'
      +'<div class="impact-stats-v14">'
      +'<div class="card impact-stat-v14"><div class="k">등록한 AI 자산</div><div class="v">'+assetSignals.length+'개</div><div class="s">현재 공개·운영 중인 자산</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">가져간 부서</div><div class="v">'+deptTotal+'개</div><div class="s">개인 이름 없이 부서 수만 집계</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">가져가기·사본 생성</div><div class="v">'+totals.adopts+'회</div><div class="s">플랫폼에서 기록된 가져가기</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">반응 발생률</div><div class="v">'+engageRate+'%</div><div class="s">후기·개선·버전 확인 중 1개 이상</div></div>'
      +'</div>'
      +'<div class="creator-impact-grid-v26">'
      +'<div class="card impact-panel-v26"><h4>부서 확산 현황</h4><div class="desc">3건 미만 부서는 ‘기타’로 묶어 개인 식별 가능성을 낮춥니다.</div>'
      +deptSignals.map(x=>'<div class="dept-row-v26"><span class="name">'+x.name+'</span><div class="dept-bar-v26"><i style="width:'+Math.max(7,Math.round(x.count/maxDept*100))+'%"></i></div><b>'+x.count+'회</b></div>').join('')
      +'</div>'
      +'<div class="card impact-panel-v26"><h4>조직 안에서 성장한 과정</h4><div class="desc">공개·확산·개선·버전 공개 이력</div><div class="timeline-v26">'
      +lifecycle.map(x=>'<div class="timeline-item-v26"><b>'+x.label+'</b><span>'+x.detail+'</span></div>').join('')
      +'</div></div></div>'
      +'<div class="card privacy-board-v24"><div class="privacy-board-head-v24"><span>AI 자산</span><span style="text-align:right">버전</span><span style="text-align:right">부서</span><span style="text-align:right">가져가기</span><span style="text-align:right">후기·제안</span><span style="text-align:right">버전 확인</span></div>'
      +assetSignals.map(x=>'<div class="privacy-board-row-v24"><div><b>'+x.title+'</b><div class="sub">'+x.origin+' · 개인 정보 비공개</div></div><div class="num">'+x.version+'</div><div class="num">'+x.departments+'개</div><div class="num">'+x.adopts+'회</div><div class="num">'+(x.reviews+x.improvements)+'건</div><div class="num">'+x.updates+'회</div></div>').join('')
      +'</div>'
      +'<div class="privacy-note-v24"><span>🔒</span><span><b>집계 원칙</b> 프롬프트 복사 이후의 실제 실행 횟수와 절감시간은 추적하지 않습니다. 제작자에게는 개인 이름·개인별 활동을 제공하지 않고, 가져간 부서 수와 플랫폼 안에서 발생한 가져가기·후기·개선·버전 확인만 집계합니다.</span></div>'
      +'</section>';
  }

  function removeSection(root,pattern){
    const title=[...root.querySelectorAll('.section-title')].find(el=>pattern.test((el.textContent||'').trim()));
    if(!title)return;
    let node=title.nextElementSibling;
    while(node&&!node.classList.contains('section-title')){const next=node.nextElementSibling;node.remove();node=next;}
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
