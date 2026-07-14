/* AX planning usage dashboard — aggregate comparison by tool and department */
(function(){
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    .ax-usage-v13{margin:18px 0 28px}
    .axu-head-v13{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:13px}
    .axu-head-v13 h3{font-size:1.18rem;margin:0;color:var(--ink)}
    .axu-head-v13 p{font-size:.78rem;color:var(--ink-soft);margin-top:4px;line-height:1.55}
    .axu-controls-v13{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
    .axu-period-v13{padding:7px 10px;border:1px solid var(--line);border-radius:5px;background:#fff;color:var(--ink-soft);font-size:.74rem;font-weight:750}
    .axu-toggle-v13{display:flex;border:1px solid var(--line);border-radius:5px;overflow:hidden;background:#fff}
    .axu-toggle-v13 button{border:0;border-right:1px solid var(--line);background:#fff;color:var(--ink-soft);padding:7px 11px;font-size:.74rem;font-weight:800}
    .axu-toggle-v13 button:last-child{border-right:0}.axu-toggle-v13 button.on{background:var(--gw-blue);color:#fff}
    .axu-summary-v13{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}
    .axu-stat-v13{padding:15px 16px}.axu-stat-v13 .label{font-size:.7rem;color:var(--ink-faint);font-weight:800}.axu-stat-v13 .value{font-size:1.42rem;font-weight:900;color:var(--ink);margin-top:5px;line-height:1.15}.axu-stat-v13 .delta{font-size:.72rem;font-weight:850;color:var(--gw-blue);margin-top:5px}.axu-stat-v13 .sub{font-size:.67rem;color:var(--ink-faint);margin-top:3px}
    .axu-grid-v13{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .axu-panel-v13{padding:17px 18px;min-width:0}.axu-panel-head-v13{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}.axu-panel-head-v13 b{font-size:.9rem}.axu-panel-head-v13 span{font-size:.67rem;color:var(--ink-faint)}
    .axu-tool-grid-v13{display:grid;grid-template-columns:1fr 1fr;gap:8px}.axu-tool-v13{padding:12px;border:1px solid var(--line);border-radius:5px;background:var(--paper)}.axu-tool-top-v13{display:flex;align-items:center;justify-content:space-between;gap:8px}.axu-tool-name-v13{font-size:.77rem;font-weight:850}.axu-source-v13{font-size:.61rem;color:var(--ink-faint)}.axu-tool-value-v13{display:flex;align-items:flex-end;gap:7px;margin-top:9px}.axu-tool-value-v13 strong{font-size:1.05rem}.axu-tool-value-v13 em{font-style:normal;font-size:.68rem;font-weight:850;color:var(--gw-blue);padding-bottom:2px}.axu-compare-v13{font-size:.64rem;color:var(--ink-faint);margin-top:2px}
    .axu-mini-v13{height:6px;background:#e5eaf0;border-radius:99px;margin-top:9px;overflow:hidden}.axu-mini-v13 span{display:block;height:100%;background:var(--gw-blue);border-radius:99px}
    .axu-dept-row-v13{display:grid;grid-template-columns:92px minmax(120px,1fr) 72px;gap:9px;align-items:center;margin:10px 0}.axu-dept-v13{font-size:.72rem;font-weight:800;white-space:nowrap}.axu-bars-v13{position:relative;height:12px}.axu-prev-v13,.axu-now-v13{position:absolute;left:0;border-radius:99px}.axu-prev-v13{top:1px;height:10px;background:#dce2e9}.axu-now-v13{top:3px;height:6px;background:var(--gw-blue)}.axu-dept-val-v13{text-align:right}.axu-dept-val-v13 b{display:block;font-size:.7rem}.axu-dept-val-v13 span{font-size:.62rem;color:var(--gw-blue);font-weight:850}
    .axu-legend-v13{display:flex;gap:13px;align-items:center;margin-top:13px;padding-top:10px;border-top:1px solid var(--line-soft);font-size:.64rem;color:var(--ink-faint)}.axu-legend-v13 i{display:inline-block;width:16px;height:6px;border-radius:99px;margin-right:4px;vertical-align:middle}.axu-legend-v13 .prev{background:#dce2e9}.axu-legend-v13 .now{background:var(--gw-blue)}
    .axu-foot-v13{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px;padding:10px 12px;background:var(--gw-blue-tint);border:1px solid #cfe1f7;border-radius:5px;font-size:.68rem;color:var(--ink-soft)}.axu-foot-v13 b{color:var(--gw-blue)}
    @media(max-width:1050px){.axu-summary-v13{grid-template-columns:repeat(2,1fr)}.axu-grid-v13{grid-template-columns:1fr}}
    @media(max-width:650px){.axu-summary-v13,.axu-tool-grid-v13{grid-template-columns:1fr}.axu-dept-row-v13{grid-template-columns:78px 1fr 65px}}
  `;
  document.head.appendChild(style);

  const usageDataV13={
    count:{
      label:'사용 횟수',unit:'회',current:12840,previous:8840,
      tools:[
        {name:'Gemini',source:'Google Admin',previous:6120,current:8450},
        {name:'Claude',source:'관리자 사용 로그',previous:1420,current:2160},
        {name:'Copilot',source:'조직 사용 리포트',previous:980,current:1240},
        {name:'Web App·MCP',source:'Playground 실행 로그',previous:320,current:990}
      ],
      departments:[
        {name:'비즈마케팅',previous:2100,current:3200},
        {name:'커머스',previous:2500,current:2780},
        {name:'AX기획',previous:1200,current:2050},
        {name:'AX개발',previous:980,current:1940},
        {name:'경영지원',previous:1050,current:1450},
        {name:'교육·기타',previous:1010,current:1420}
      ]
    },
    volume:{
      label:'사용량 지수',unit:'',current:149,previous:100,
      tools:[
        {name:'Gemini',source:'Google Admin',previous:100,current:143},
        {name:'Claude',source:'관리자 사용 로그',previous:100,current:161},
        {name:'Copilot',source:'조직 사용 리포트',previous:100,current:126},
        {name:'Web App·MCP',source:'Playground 실행 로그',previous:100,current:225}
      ],
      departments:[
        {name:'비즈마케팅',previous:100,current:152},
        {name:'커머스',previous:100,current:111},
        {name:'AX기획',previous:100,current:171},
        {name:'AX개발',previous:100,current:198},
        {name:'경영지원',previous:100,current:138},
        {name:'교육·기타',previous:100,current:141}
      ]
    }
  };

  state.axUsageMetricV13=state.axUsageMetricV13||'count';

  function fmtV13(n){return Number(n).toLocaleString('ko-KR');}
  function growthV13(now,prev){return prev?((now-prev)/prev*100):0;}
  function growthTextV13(now,prev){const g=growthV13(now,prev);return (g>=0?'+':'')+g.toFixed(1)+'%';}
  function metricValueV13(v,d){return fmtV13(v)+(d.unit||'');}

  function removeLegacyUsageV13(root){
    [...root.querySelectorAll('.section-title')].forEach(title=>{
      const text=(title.textContent||'').trim();
      if(text.includes('운영 대시보드')||text.includes('부서별 사용 상위')){
        const next=title.nextElementSibling;
        title.remove();
        if(next)next.remove();
      }
    });
  }

  function toolCardsV13(d){
    const max=Math.max(...d.tools.map(x=>x.current),1);
    return d.tools.map(x=>
      '<div class="axu-tool-v13">'+
        '<div class="axu-tool-top-v13"><span class="axu-tool-name-v13">'+x.name+'</span><span class="axu-source-v13">'+x.source+'</span></div>'+
        '<div class="axu-tool-value-v13"><strong>'+metricValueV13(x.current,d)+'</strong><em>'+growthTextV13(x.current,x.previous)+'</em></div>'+
        '<div class="axu-compare-v13">이전 '+metricValueV13(x.previous,d)+' → 최근 '+metricValueV13(x.current,d)+'</div>'+
        '<div class="axu-mini-v13"><span style="width:'+Math.max(8,Math.round(x.current/max*100))+'%"></span></div>'+
      '</div>'
    ).join('');
  }

  function deptRowsV13(d){
    const max=Math.max(...d.departments.map(x=>x.current),1);
    return d.departments.map(x=>
      '<div class="axu-dept-row-v13">'+
        '<div class="axu-dept-v13">'+x.name+'</div>'+
        '<div class="axu-bars-v13"><span class="axu-prev-v13" style="width:'+Math.max(4,Math.round(x.previous/max*100))+'%"></span><span class="axu-now-v13" style="width:'+Math.max(4,Math.round(x.current/max*100))+'%"></span></div>'+
        '<div class="axu-dept-val-v13"><b>'+metricValueV13(x.current,d)+'</b><span>'+growthTextV13(x.current,x.previous)+'</span></div>'+
      '</div>'
    ).join('');
  }

  function renderAxUsageDashboardV13(){
    const root=document.getElementById('screen-admin');
    if(!root)return;
    removeLegacyUsageV13(root);
    const old=root.querySelector('.ax-usage-v13');if(old)old.remove();
    const d=usageDataV13[state.axUsageMetricV13]||usageDataV13.count;
    const wrap=document.createElement('section');
    wrap.className='ax-usage-v13';
    wrap.innerHTML=
      '<div class="axu-head-v13"><div><h3>📊 AI 활용 변화 대시보드 <span class="pill" style="vertical-align:2px">목업 데이터</span></h3><p>이전 4주와 최근 4주의 집계값을 비교해 툴별·부서별 활용 증가를 확인합니다.</p></div>'+
      '<div class="axu-controls-v13"><span class="axu-period-v13">이전 4주 → 최근 4주</span><div class="axu-toggle-v13"><button class="'+(state.axUsageMetricV13==='count'?'on':'')+'" onclick="setAxUsageMetricV13(\'count\')">사용 횟수</button><button class="'+(state.axUsageMetricV13==='volume'?'on':'')+'" onclick="setAxUsageMetricV13(\'volume\')">사용량 지수</button></div></div></div>'+
      '<div class="axu-summary-v13">'+
        '<div class="card axu-stat-v13"><div class="label">최근 4주 '+d.label+'</div><div class="value">'+metricValueV13(d.current,d)+'</div><div class="delta">'+growthTextV13(d.current,d.previous)+' 증가</div><div class="sub">이전 '+metricValueV13(d.previous,d)+' 대비</div></div>'+
        '<div class="card axu-stat-v13"><div class="label">활성 사용자</div><div class="value">407명</div><div class="delta">전체 480명 중 84.8%</div><div class="sub">Google Admin 집계 기준</div></div>'+
        '<div class="card axu-stat-v13"><div class="label">활용 증가 부서</div><div class="value">6개</div><div class="delta">전체 표시 부서 증가</div><div class="sub">개인별 순위는 제공하지 않음</div></div>'+
        '<div class="card axu-stat-v13"><div class="label">가장 큰 증가</div><div class="value">Web App·MCP</div><div class="delta">'+growthTextV13(d.tools[3].current,d.tools[3].previous)+'</div><div class="sub">Playground 실행 로그 기준</div></div>'+
      '</div>'+
      '<div class="axu-grid-v13">'+
        '<div class="card axu-panel-v13"><div class="axu-panel-head-v13"><b>툴별 변화</b><span>제공 가능한 관리자·서비스 로그 집계</span></div><div class="axu-tool-grid-v13">'+toolCardsV13(d)+'</div></div>'+
        '<div class="card axu-panel-v13"><div class="axu-panel-head-v13"><b>부서별 변화</b><span>이전 기간 대비 최근 기간</span></div>'+deptRowsV13(d)+'<div class="axu-legend-v13"><span><i class="prev"></i>이전 4주</span><span><i class="now"></i>최근 4주</span></div></div>'+
      '</div>'+
      '<div class="axu-foot-v13"><span><b>집계 원칙</b> 개인 채팅 내용은 수집하지 않고, 툴·부서 단위 사용 횟수와 사용량만 확인</span><span><b>사용량 지수</b> 도구별 제공 단위가 달라 이전 4주=100으로 정규화</span></div>';
    const head=root.querySelector('.console-head');
    if(head)head.insertAdjacentElement('afterend',wrap);else root.prepend(wrap);
  }

  window.setAxUsageMetricV13=function(metric){
    state.axUsageMetricV13=metric==='volume'?'volume':'count';
    renderAxUsageDashboardV13();
    if(typeof savePersistentStateV7==='function')savePersistentStateV7(false);
  };

  const baseRenderAdminV13=window.renderAdmin;
  if(typeof baseRenderAdminV13==='function'){
    window.renderAdmin=renderAdmin=function(role){
      baseRenderAdminV13(role);
      if(role==='plan')renderAxUsageDashboardV13();
    };
  }

  if(state.screen==='admin'){
    const active=[...document.querySelectorAll('#screen-admin .role-toggle button')].find(b=>b.classList.contains('active'));
    if(active&&(active.textContent||'').includes('AX기획팀'))renderAxUsageDashboardV13();
  }
})();