/* My assets impact dashboard + collapsible usage logs */
(function(){
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    .my-impact-v15{margin:18px 0 24px}
    .miv15-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:12px}
    .miv15-head h3{font-size:1.08rem;margin:0;color:var(--ink)}
    .miv15-head p{margin:4px 0 0;font-size:.79rem;color:var(--ink-soft)}
    .miv15-badge{display:inline-flex;align-items:center;height:23px;padding:0 8px;border:1px solid var(--line);border-radius:4px;background:#fff;font-size:.68rem;font-weight:800;color:var(--ink-soft)}
    .miv15-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .miv15-kpi{padding:16px 17px;min-width:0}
    .miv15-kpi .lb{font-size:.71rem;color:var(--ink-faint);font-weight:800}
    .miv15-kpi .val{font-size:1.48rem;line-height:1.25;font-weight:900;color:var(--ink);margin-top:5px}
    .miv15-kpi .sub{font-size:.68rem;color:var(--ink-soft);margin-top:5px;line-height:1.45}
    .miv15-kpi .delta{color:var(--gw-blue);font-weight:850}
    .miv15-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:12px;margin-top:12px}
    .miv15-panel{padding:17px 18px;min-width:0}
    .miv15-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px}
    .miv15-panel-head b{font-size:.9rem}
    .miv15-panel-head span{font-size:.67rem;color:var(--ink-faint)}
    .miv15-bars{height:175px;display:flex;align-items:flex-end;gap:10px;padding:12px 5px 0;border-bottom:1px solid var(--line)}
    .miv15-bar-col{flex:1;min-width:0;text-align:center}
    .miv15-bar-value{font-size:.63rem;color:var(--ink-soft);margin-bottom:5px;font-weight:800}
    .miv15-bar-track{height:125px;display:flex;align-items:flex-end;justify-content:center}
    .miv15-bar{width:min(32px,75%);min-height:7px;background:var(--gw-blue);border-radius:4px 4px 0 0;transition:height .3s ease}
    .miv15-bar-label{font-size:.65rem;color:var(--ink-faint);margin-top:7px;white-space:nowrap}
    .miv15-metric-toggle{display:flex;border:1px solid var(--line);border-radius:4px;overflow:hidden;background:#fff}
    .miv15-metric-toggle button{border:0;border-right:1px solid var(--line);background:#fff;padding:5px 8px;font-size:.67rem;font-weight:800;color:var(--ink-soft)}
    .miv15-metric-toggle button:last-child{border-right:0}
    .miv15-metric-toggle button.on{background:var(--gw-blue);color:#fff}
    .miv15-self{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px}
    .miv15-self-card{padding:12px;border:1px solid var(--line);border-radius:5px;background:var(--paper)}
    .miv15-self-card span{display:block;font-size:.66rem;color:var(--ink-faint);font-weight:800}
    .miv15-self-card strong{display:block;font-size:1.08rem;margin-top:3px;color:var(--ink)}
    .miv15-impact-row{display:grid;grid-template-columns:minmax(105px,1fr) 64px 74px;gap:8px;align-items:center;padding:9px 0;border-top:1px solid var(--line-soft)}
    .miv15-impact-row:first-of-type{border-top:0}
    .miv15-impact-name{font-size:.75rem;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .miv15-impact-row span{font-size:.68rem;color:var(--ink-soft);text-align:right}
    .miv15-users{margin-top:12px;overflow:hidden}
    .miv15-user-head,.miv15-user-row{display:grid;grid-template-columns:minmax(120px,1.4fr) minmax(100px,1fr) 70px 86px 82px;gap:10px;align-items:center;padding:10px 14px}
    .miv15-user-head{background:var(--paper);font-size:.66rem;color:var(--ink-faint);font-weight:850;border-bottom:1px solid var(--line)}
    .miv15-user-row{font-size:.74rem;border-bottom:1px solid var(--line-soft)}
    .miv15-user-row:last-child{border-bottom:0}
    .miv15-user-name{font-weight:800;display:flex;align-items:center;gap:8px;min-width:0}
    .miv15-avatar{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:var(--gw-blue-tint);color:var(--gw-blue);font-size:.66rem;font-weight:900;flex:none}
    .miv15-num{text-align:right;font-variant-numeric:tabular-nums}
    details.my-usage-log-v15{margin-top:18px;border:1px solid var(--line);border-radius:6px;background:#fff;overflow:hidden}
    details.my-usage-log-v15>summary{list-style:none;cursor:pointer;padding:14px 17px;display:flex;align-items:center;gap:9px;font-size:.86rem;font-weight:850;color:var(--ink)}
    details.my-usage-log-v15>summary::-webkit-details-marker{display:none}
    details.my-usage-log-v15>summary::before{content:'›';font-size:1.15rem;color:var(--ink-faint);transition:transform .15s}
    details.my-usage-log-v15[open]>summary::before{transform:rotate(90deg)}
    .miv15-log-count{margin-left:auto;font-size:.67rem;font-weight:800;color:var(--ink-faint);background:var(--paper);border:1px solid var(--line);border-radius:99px;padding:2px 8px}
    .miv15-log-body{border-top:1px solid var(--line);padding:4px 0}
    .miv15-log-row{display:grid;grid-template-columns:32px minmax(0,1fr) 105px;gap:10px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line-soft)}
    .miv15-log-row:last-child{border-bottom:0}
    .miv15-log-icon{width:28px;height:28px;border-radius:5px;background:var(--paper);display:grid;place-items:center}
    .miv15-log-title{font-size:.75rem;font-weight:750;line-height:1.35}
    .miv15-log-meta{font-size:.65rem;color:var(--ink-faint);margin-top:2px}
    .miv15-log-date{text-align:right;font-size:.67rem;color:var(--ink-soft)}
    @media(max-width:950px){.miv15-kpis{grid-template-columns:repeat(2,1fr)}.miv15-grid{grid-template-columns:1fr}.miv15-user-head,.miv15-user-row{grid-template-columns:minmax(120px,1.5fr) 1fr 60px 78px}.miv15-user-head>*:last-child,.miv15-user-row>*:last-child{display:none}}
    @media(max-width:620px){.miv15-kpis{grid-template-columns:1fr}.miv15-user-head,.miv15-user-row{grid-template-columns:1fr 62px 78px}.miv15-user-head>*:nth-child(2),.miv15-user-row>*:nth-child(2){display:none}}
  `;
  document.head.appendChild(style);

  const impactData={
    executions:{label:'실행',unit:'회',weekly:[18,22,29,31,38,46]},
    saved:{label:'절감',unit:'시간',weekly:[3.1,3.8,5.2,6.4,7.8,10.2]}
  };
  const assets=[
    {name:'출장 영수증 자동 정산',runs:96,saved:'21.3시간'},
    {name:'회의록 핵심 요약 Gem',runs:58,saved:'10.8시간'},
    {name:'채용공고 초안 생성기',runs:30,saved:'4.4시간'}
  ];
  const users=[
    {name:'이수진',dept:'경영지원팀',runs:28,saved:'5시간 40분',last:'오늘 09:18'},
    {name:'박정우',dept:'영업지원팀',runs:19,saved:'4시간 10분',last:'어제 16:42'},
    {name:'최유진',dept:'재무팀',runs:16,saved:'3시간 20분',last:'7월 13일'},
    {name:'김태현',dept:'총무팀',runs:12,saved:'2시간 35분',last:'7월 12일'},
    {name:'김미주',dept:'AX기획팀 · 나',runs:27,saved:'5시간 25분',last:'오늘 08:55'}
  ];

  state.myImpactMetricV15=state.myImpactMetricV15||'executions';
  state.myAssetModeV15=state.myAssetModeV15||'reader';

  function escV15(v){return typeof esc==='function'?esc(String(v==null?'':v)):String(v==null?'':v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));}

  function removeLegacyContribution(root){
    [...root.querySelectorAll('.section-title')].forEach(title=>{
      const text=(title.textContent||'').trim();
      if(/GIT\s*CONTRIBUTION|활용 꾸준함|git 잔디/i.test(text)){
        const next=title.nextElementSibling;
        title.remove();
        if(next && (next.classList.contains('grass-wrap') || next.querySelector('.grass')))next.remove();
      }
    });
    root.querySelectorAll('.commitlog').forEach(el=>el.remove());
    root.querySelectorAll('details.my-usage-log-v15').forEach(el=>el.remove());
  }

  function chartHtml(){
    const d=impactData[state.myImpactMetricV15]||impactData.executions;
    const max=Math.max(...d.weekly,1);
    return '<div class="miv15-bars">'+d.weekly.map((v,i)=>
      '<div class="miv15-bar-col"><div class="miv15-bar-value">'+v+d.unit+'</div><div class="miv15-bar-track"><div class="miv15-bar" style="height:'+Math.max(8,Math.round(v/max*100))+'%"></div></div><div class="miv15-bar-label">'+(i+1)+'주차</div></div>'
    ).join('')+'</div>';
  }

  function dashboardHtml(){
    return '<section class="my-impact-v15" data-my-impact-v15>'+
      '<div class="miv15-head"><div><h3>내 AI 자산 성과</h3><p>내가 만든 자산의 실제 활용 사용자와 업무 절감 효과를 확인합니다.</p></div><span class="miv15-badge">시연용 집계 데이터</span></div>'+
      '<div class="miv15-kpis">'+
        '<div class="card miv15-kpi"><div class="lb">내 자산 누적 실행</div><div class="val">184회</div><div class="sub"><span class="delta">최근 4주 +31.4%</span> · 중복 실행 포함</div></div>'+
        '<div class="card miv15-kpi"><div class="lb">활용 사용자</div><div class="val">42명</div><div class="sub">8개 부서 · 권한 범위 내 사용자 기준</div></div>'+
        '<div class="card miv15-kpi"><div class="lb">추정 업무 절감</div><div class="val">36.5시간</div><div class="sub">실행 전 평균 처리시간과 완료 후 시간을 비교</div></div>'+
        '<div class="card miv15-kpi"><div class="lb">내가 직접 사용</div><div class="val">27회</div><div class="sub">내 업무 절감 <span class="delta">5시간 25분</span></div></div>'+
      '</div>'+
      '<div class="miv15-grid">'+
        '<div class="card miv15-panel"><div class="miv15-panel-head"><b>최근 6주 활용 추이</b><div class="miv15-metric-toggle"><button class="'+(state.myImpactMetricV15==='executions'?'on':'')+'" onclick="setMyImpactMetricV15(\'executions\')">실행 횟수</button><button class="'+(state.myImpactMetricV15==='saved'?'on':'')+'" onclick="setMyImpactMetricV15(\'saved\')">절감 시간</button></div></div>'+chartHtml()+'</div>'+
        '<div class="card miv15-panel"><div class="miv15-panel-head"><b>자산별 효과</b><span>최근 4주 기준</span></div><div class="miv15-self"><div class="miv15-self-card"><span>내 실행 비중</span><strong>14.7%</strong></div><div class="miv15-self-card"><span>동료 재사용률</span><strong>68.2%</strong></div></div>'+assets.map(a=>'<div class="miv15-impact-row"><div class="miv15-impact-name">'+escV15(a.name)+'</div><span>'+a.runs+'회</span><span>'+a.saved+'</span></div>').join('')+'</div>'+
      '</div>'+
      '<div class="card miv15-users"><div class="miv15-panel-head" style="padding:15px 16px 0"><b>누가 활용했나요?</b><span>내 자산 접근 권한 범위 내 사용자별 실행 집계</span></div>'+
        '<div class="miv15-user-head"><span>사용자</span><span>부서</span><span style="text-align:right">실행</span><span style="text-align:right">절감</span><span style="text-align:right">최근 사용</span></div>'+users.map(u=>'<div class="miv15-user-row"><div class="miv15-user-name"><span class="miv15-avatar">'+escV15(u.name.slice(0,1))+'</span><span>'+escV15(u.name)+'</span></div><span>'+escV15(u.dept)+'</span><span class="miv15-num">'+u.runs+'회</span><span class="miv15-num">'+escV15(u.saved)+'</span><span class="miv15-num">'+escV15(u.last)+'</span></div>').join('')+'</div>'+
    '</section>';
  }

  function usageLogHtml(){
    const entries=(state.ledger||[]).slice().reverse().slice(0,12);
    const rows=entries.length?entries.map(l=>'<div class="miv15-log-row"><div class="miv15-log-icon">'+escV15(l.ic||'•')+'</div><div><div class="miv15-log-title">'+escV15(l.msg||'AI 자산 활동')+'</div><div class="miv15-log-meta">'+escV15(l.ev||'USAGE_LOG')+'</div></div><div class="miv15-log-date">'+escV15(l.d||'오늘')+'</div></div>').join(''):'<div style="padding:20px;text-align:center;color:var(--ink-faint);font-size:.78rem">아직 기록된 사용 로그가 없습니다.</div>';
    return '<details class="my-usage-log-v15"><summary>사용 로그 <span style="font-size:.68rem;color:var(--ink-faint);font-weight:600">실행·가져오기·개선 활동 이력</span><span class="miv15-log-count">'+entries.length+'건</span></summary><div class="miv15-log-body">'+rows+'</div></details>';
  }

  function enhanceMyAssets(mode){
    const root=document.getElementById('screen-my');
    if(!root)return;
    removeLegacyContribution(root);
    if(mode==='creator'){
      const head=root.querySelector('.myshelf-head');
      if(head)head.insertAdjacentHTML('afterend',dashboardHtml());
    }
    root.insertAdjacentHTML('beforeend',usageLogHtml());
  }

  window.setMyImpactMetricV15=function(metric){
    state.myImpactMetricV15=metric;
    renderMy('creator');
  };

  const baseRenderMy=window.renderMy;
  window.renderMy=function(mode){
    state.myAssetModeV15=mode||'reader';
    baseRenderMy.call(this,state.myAssetModeV15);
    enhanceMyAssets(state.myAssetModeV15);
  };
  window.renderMyIn=function(mode){window.renderMy(mode);};

  if(state.screen==='my')window.renderMy(state.myAssetModeV15||'reader');
})();
