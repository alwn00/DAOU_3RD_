/* DAOU 6-minute demo flow + creator analytics dashboard */
(function(){
  'use strict';

  const VERSION='v14';
  const DEMO_TITLE='출장 영수증 자동 분류 Web App';
  const DEMO_REQUEST_TITLE='출장 영수증 자동 분류 도구 제작 요청';

  const style=document.createElement('style');
  style.textContent=`
    .demo-launch-v14{border:1px solid #b9d6f5!important;background:#edf6ff!important;color:var(--gw-blue)!important;width:auto!important;padding:0 11px!important;gap:6px;font-size:.75rem!important;font-weight:850}
    .demo-coach-v14{position:sticky;top:66px;z-index:80;margin-bottom:14px;padding:13px 15px;border:1px solid #b9d6f5;background:#f5faff;border-radius:7px;box-shadow:0 5px 18px rgba(31,111,201,.09)}
    .demo-coach-top-v14{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.demo-coach-top-v14 b{font-size:.9rem}.demo-coach-step-v14{padding:3px 8px;border-radius:99px;background:var(--gw-blue);color:#fff;font-size:.68rem;font-weight:850}.demo-coach-v14 p{margin-top:4px;font-size:.75rem;color:var(--ink-soft)}
    .demo-coach-actions-v14{display:flex;gap:7px;margin-left:auto;flex-wrap:wrap}.demo-coach-actions-v14 button{padding:6px 10px;font-size:.7rem}
    .asset-filter-panel-v14{display:grid;grid-template-columns:minmax(220px,1.7fr) repeat(3,minmax(130px,.7fr)) auto;gap:8px;padding:12px;margin:10px 0 12px;background:#fff;border:1px solid var(--line);border-radius:6px}
    .asset-filter-panel-v14 input,.asset-filter-panel-v14 select{width:100%;padding:9px 10px;border:1px solid var(--line);border-radius:5px;background:#fff;color:var(--ink);font-size:.78rem}
    .asset-filter-caption-v14{grid-column:1/-1;display:flex;justify-content:space-between;gap:10px;font-size:.68rem;color:var(--ink-faint)}
    .demo-empty-v14{padding:26px;text-align:center;border:1px dashed #b9d6f5;background:#f8fbff;border-radius:7px;margin-top:12px}.demo-empty-v14 .big{font-size:2rem}.demo-empty-v14 h3{margin-top:6px}.demo-empty-v14 p{font-size:.78rem;color:var(--ink-soft);margin:5px auto 14px;max-width:560px}
    .demo-request-v14{margin:14px 0;padding:20px;border:2px solid #9fc8f1;background:#fbfdff}.demo-request-head-v14{display:flex;align-items:flex-start;gap:12px;justify-content:space-between;flex-wrap:wrap}.demo-request-head-v14 h3{font-size:1.1rem}.demo-request-head-v14 p{font-size:.76rem;color:var(--ink-soft);margin-top:3px}
    .demo-request-grid-v14{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:14px}.demo-field-v14{padding:12px;background:var(--paper);border-radius:5px}.demo-field-v14 b{display:block;font-size:.7rem;color:var(--ink-faint);margin-bottom:5px}.demo-field-v14 span{font-size:.8rem;line-height:1.6}.demo-request-actions-v14{display:flex;gap:8px;justify-content:flex-end;margin-top:13px;flex-wrap:wrap}
    .similar-v14{margin-top:11px;padding:11px 12px;border:1px solid var(--line);border-radius:5px;background:#fff;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.75rem}.similar-v14 .grow{flex:1}.similar-v14 b{display:block}.similar-v14 small{color:var(--ink-faint)}
    .workflow-v14{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.workflow-card-v14{padding:14px;border:1px solid var(--line);border-radius:6px;background:#fff}.workflow-card-v14 h4{font-size:.85rem;margin-bottom:10px}.workflow-step-v14{display:flex;align-items:center;gap:7px;padding:7px 0;font-size:.78rem}.workflow-step-v14 i{font-style:normal;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--gw-blue-tint);color:var(--gw-blue);font-size:.66rem;font-weight:900}.workflow-arrow-v14{text-align:center;color:var(--ink-faint);font-size:.7rem}
    .demo-reg-banner-v14{padding:14px 16px;margin-bottom:13px;border:1px solid #e2c27a;background:#fffaf0;border-radius:6px}.demo-reg-banner-v14 b{font-size:.85rem}.demo-reg-banner-v14 p{font-size:.74rem;color:var(--ink-soft);margin-top:3px}.demo-reg-chips-v14{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.demo-reg-chips-v14 span{font-size:.68rem;padding:4px 7px;border-radius:4px;background:#fff;border:1px solid #ecd79f}
    .demo-admin-v14{margin:0 0 18px;padding:18px;border:2px solid #9fc8f1;background:#fbfdff}.demo-admin-head-v14{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.demo-admin-head-v14 h3{font-size:1.05rem}.demo-admin-head-v14 p{font-size:.74rem;color:var(--ink-soft);margin-top:3px}.demo-check-grid-v14{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:13px}.demo-check-v14{display:flex;gap:8px;padding:10px;background:#fff;border:1px solid var(--line);border-radius:5px;font-size:.75rem}.demo-check-v14 .ok{color:#198754;font-weight:900}.demo-admin-actions-v14{display:flex;justify-content:flex-end;gap:8px;margin-top:12px;flex-wrap:wrap}
    .status-strip-v14{display:flex;align-items:center;gap:5px;overflow:auto;padding:10px 0 2px}.status-node-v14{white-space:nowrap;padding:5px 8px;border-radius:99px;background:#e7ebf0;color:var(--ink-faint);font-size:.64rem;font-weight:800}.status-node-v14.done{background:var(--gw-blue-tint);color:var(--gw-blue)}.status-node-v14.current{background:var(--gw-blue);color:#fff}.status-arr-v14{color:#a5afba;font-size:.7rem}
    .creator-impact-v14{margin-top:14px}.creator-impact-head-v14{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:10px}.creator-impact-head-v14 h3{font-size:1.05rem}.creator-impact-head-v14 p{font-size:.73rem;color:var(--ink-soft);margin-top:3px}
    .impact-stats-v14{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.impact-stat-v14{padding:15px}.impact-stat-v14 .k{font-size:.68rem;color:var(--ink-faint);font-weight:850}.impact-stat-v14 .v{font-size:1.42rem;font-weight:900;margin-top:4px}.impact-stat-v14 .s{font-size:.67rem;color:var(--ink-soft);margin-top:2px}.impact-stat-v14 .up{color:var(--gw-blue);font-weight:850}
    .impact-grid-v14{display:grid;grid-template-columns:1.15fr .85fr;gap:10px;margin-top:10px}.impact-panel-v14{padding:15px}.impact-panel-v14 h4{font-size:.85rem;margin-bottom:11px}.impact-user-v14{display:grid;grid-template-columns:1fr 1fr 70px 80px;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line-soft);font-size:.7rem}.impact-user-v14:last-child{border-bottom:0}.impact-user-v14 b{font-size:.73rem}.impact-user-v14 .saved{color:var(--gw-blue);font-weight:850;text-align:right}.impact-user-v14 .cnt{text-align:right}.impact-bar-row-v14{display:grid;grid-template-columns:90px 1fr 42px;gap:8px;align-items:center;margin:10px 0;font-size:.7rem}.impact-bar-v14{height:7px;background:#e7ebf0;border-radius:99px;overflow:hidden}.impact-bar-v14 span{display:block;height:100%;background:var(--gw-blue);border-radius:99px}
    .usage-toggle-v14{margin-top:12px;border:1px solid var(--line);border-radius:6px;background:#fff}.usage-toggle-v14 summary{cursor:pointer;padding:13px 15px;font-size:.82rem;font-weight:850;display:flex;align-items:center;gap:8px}.usage-toggle-v14 summary small{font-weight:500;color:var(--ink-faint)}.usage-toggle-v14 .inside{padding:0 15px 13px}.usage-log-v14{display:grid;grid-template-columns:105px 1fr 110px 80px;gap:8px;padding:8px 0;border-top:1px solid var(--line-soft);font-size:.69rem}.usage-log-v14 .save{color:var(--gw-blue);font-weight:850;text-align:right}.usage-log-v14 .when{color:var(--ink-faint)}
    .runtime-demo-v14{margin:14px 0;padding:16px;border:1px solid #b9d6f5;background:#f8fbff}.runtime-demo-v14 h3{font-size:.98rem}.runtime-demo-v14 p{font-size:.74rem;color:var(--ink-soft);margin:4px 0 10px}.runtime-demo-v14 .actions{display:flex;gap:8px;flex-wrap:wrap}
    .history-v14{margin-top:12px}.history-row-v14{display:grid;grid-template-columns:130px 145px 1fr;gap:10px;padding:10px 0;border-bottom:1px solid var(--line-soft);font-size:.72rem}.history-row-v14:last-child{border-bottom:0}.history-row-v14 b{color:var(--gw-blue)}.history-row-v14 .meta{color:var(--ink-faint)}
    @media(max-width:1000px){.asset-filter-panel-v14{grid-template-columns:1fr 1fr}.asset-filter-caption-v14{grid-column:1/-1}.impact-stats-v14{grid-template-columns:repeat(2,1fr)}.impact-grid-v14{grid-template-columns:1fr}}
    @media(max-width:680px){.demo-request-grid-v14,.workflow-v14,.demo-check-grid-v14,.impact-stats-v14{grid-template-columns:1fr}.asset-filter-panel-v14{grid-template-columns:1fr}.impact-user-v14,.usage-log-v14{grid-template-columns:1fr 1fr}.history-row-v14{grid-template-columns:1fr}.demo-coach-actions-v14{margin-left:0}}
  `;
  document.head.appendChild(style);

  const flow=state.demoReceiptFlowV14||(state.demoReceiptFlowV14={
    active:false,step:1,requestCreated:false,workflowAgreed:false,submitted:false,policyApproved:false,techValidated:false,published:false,used:false,improvement:false,wantCount:11,
    history:[{status:'REQUESTED',actor:'경영지원팀 · 요청자',reason:'출장 영수증 수기 분류 업무 개선 요청',at:'2026-07-15 09:10'}]
  });
  state.assetDeptV14=state.assetDeptV14||'all';
  state.assetTypeV14=state.assetTypeV14||'all';

  const statusOrder=['REQUESTED','IN_DEVELOPMENT','SUBMITTED','HEAVY_REVIEW','TECH_VALIDATED','PUBLISHED','IMPROVEMENT_REQUESTED'];
  const stepCopy={
    1:['탐색','출장·영수증·정산을 검색하고 부서·도구·유형 필터를 적용합니다.'],
    2:['제작 요청','업무 문제, 현재 흐름, 희망 결과, 사용 데이터만 작성합니다.'],
    3:['제작자 채택·흐름 합의','요청 흐름을 구현 가능한 AI 흐름으로 구체화하고 요청자가 확인합니다.'],
    4:['등록·Heavy Track 판정','Web App과 Git URL, 외부 API 연결을 등록하고 자동 점검합니다.'],
    5:['AX 검토·공개','AX기획 정책 검토와 AX개발 기술 검증을 순서대로 진행합니다.'],
    6:['활용·개선','공개 자산을 실행하고 개선 제안을 남깁니다.'],
    7:['StatusHistory','처리 주체, 시점, 사유가 남은 전체 상태 이력을 확인합니다.']
  };

  function escV14(v){return typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));}
  function persistV14(){try{if(typeof savePersistentStateV7==='function')savePersistentStateV7(false);}catch(e){}}
  function addHistoryV14(status,actor,reason){
    const last=flow.history[flow.history.length-1];
    if(last&&last.status===status&&last.reason===reason)return;
    flow.history.push({status,actor,reason,at:new Date().toLocaleString('ko-KR',{hour12:false})});
    persistV14();
  }
  function currentStatusV14(){return flow.history.length?flow.history[flow.history.length-1].status:'REQUESTED';}
  function statusStripV14(){
    const current=currentStatusV14(),ci=statusOrder.indexOf(current);
    return '<div class="status-strip-v14">'+statusOrder.map((s,i)=>'<span class="status-node-v14 '+(i<ci?'done':i===ci?'current':'')+'">'+s+'</span>'+(i<statusOrder.length-1?'<span class="status-arr-v14">→</span>':'')).join('')+'</div>';
  }

  function injectLaunchV14(){
    const right=document.querySelector('.gnb-right');if(!right||right.querySelector('.demo-launch-v14'))return;
    const b=document.createElement('button');b.className='gnb-ic demo-launch-v14';b.innerHTML='▶ 6분 시연';b.onclick=startReceiptDemoV14;
    right.insertBefore(b,right.firstChild);
  }
  function injectCoachV14(root){
    if(!flow.active||!root||root.querySelector('.demo-coach-v14'))return;
    const c=stepCopy[flow.step]||stepCopy[1];
    const bar=document.createElement('div');bar.className='demo-coach-v14';
    bar.innerHTML='<div class="demo-coach-top-v14"><span class="demo-coach-step-v14">'+flow.step+'/7</span><b>'+c[0]+'</b><div class="demo-coach-actions-v14"><button class="btn btn-ghost" onclick="openDemoRunbookV14()">대본 보기</button><button class="btn btn-secondary" onclick="showDemoHistoryV14()">StatusHistory</button><button class="btn btn-ghost" onclick="endReceiptDemoV14()">시연 종료</button></div></div><p>'+c[1]+'</p>'+statusStripV14();
    root.prepend(bar);
  }

  window.startReceiptDemoV14=function(){
    flow.active=true;flow.step=1;state.assetQuery='출장 영수증 정산';state.assetDeptV14='경영지원팀';state.assetTool='all';state.assetTypeV14='webapp';persistV14();
    if(typeof switchActor==='function')switchActor('user',true);
    nav('assets');setTimeout(()=>{renderAssetsV8();toast('▶ 6분 시연 모드가 시작되었습니다. 검색 결과가 없는 상태에서 제작 요청으로 이동하세요.');},50);
  };
  window.endReceiptDemoV14=function(){flow.active=false;persistV14();const coach=document.querySelector('.demo-coach-v14');if(coach)coach.remove();toast('시연 모드를 종료했습니다. 생성된 목업 상태는 유지됩니다.');};

  const baseCatalogV14=window.assetCatalogV8;
  if(typeof baseCatalogV14==='function'){
    window.assetCatalogV8=function(){
      let list=baseCatalogV14();
      const raw=(state.assetQuery||'').trim().toLowerCase();
      if(raw){
        const tokens=raw.split(/[\s,]+/).filter(Boolean);
        list=list.filter(a=>{const hay=[a.title,a.purpose,a.effect,a.author,a.dept,a.cat,(a.tags||[]).join(' ')].join(' ').toLowerCase();return tokens.every(t=>hay.includes(t));});
      }
      if(state.assetDeptV14&&state.assetDeptV14!=='all')list=list.filter(a=>a.dept===state.assetDeptV14);
      if(state.assetTypeV14&&state.assetTypeV14!=='all')list=list.filter(a=>assetTypeV14(a)===state.assetTypeV14);
      return list;
    };
  }
  function assetTypeV14(a){
    if(a.runtimeUrl||a.type==='space'||a.tool==='webapp'||a.tool==='artifact')return 'webapp';
    if(a.type==='auto'||a.tool==='automation'||(a.tags||[]).some(t=>/MCP|자동화|커넥터/.test(t)))return 'automation';
    if(a.type==='prompt'||a.tool==='prompt')return 'prompt';
    return 'agent';
  }
  window.setAssetDeptV14=function(v){state.assetDeptV14=v;renderAssetsV8();persistV14();};
  window.setAssetTypeV14=function(v){state.assetTypeV14=v;renderAssetsV8();persistV14();};
  window.applyReceiptSearchV14=function(){state.assetQuery='출장 영수증 정산';state.assetDeptV14='경영지원팀';state.assetTool='all';state.assetTypeV14='webapp';renderAssetsV8();};

  const baseRenderAssetsV14=window.renderAssetsV8;
  if(typeof baseRenderAssetsV14==='function'){
    window.renderAssetsV8=function(){
      baseRenderAssetsV14();
      const root=document.getElementById('screen-assets');if(!root)return;
      injectCoachV14(root);
      const search=root.querySelector('.asset-search');
      if(search&&!root.querySelector('.asset-filter-panel-v14')){
        const depts=['all'].concat([...new Set(ASSETS.map(a=>a.dept).filter(Boolean))]);
        const panel=document.createElement('div');panel.className='asset-filter-panel-v14';
        panel.innerHTML='<input value="'+escV14(state.assetQuery||'')+'" oninput="state.assetQuery=this.value;renderAssetsV8()" placeholder="통합 검색: 출장, 영수증, 정산">'
          +'<select onchange="setAssetDeptV14(this.value)">'+depts.map(d=>'<option value="'+escV14(d)+'" '+(state.assetDeptV14===d?'selected':'')+'>'+(d==='all'?'전체 부서':escV14(d))+'</option>').join('')+'</select>'
          +'<select onchange="setAssetToolV8(this.value)">'+[['all','전체 도구'],['GEMINI','Gemini'],['COPILOT','Copilot'],['CLAUDE','Claude'],['WEBAPP','웹앱·실행형']].map(x=>'<option value="'+x[0]+'" '+((state.assetTool||'all')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select>'
          +'<select onchange="setAssetTypeV14(this.value)">'+[['all','전체 유형'],['agent','설정형 에이전트'],['prompt','프롬프트'],['webapp','Web App'],['automation','자동화·MCP']].map(x=>'<option value="'+x[0]+'" '+((state.assetTypeV14||'all')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select>'
          +'<button class="btn btn-secondary" onclick="applyReceiptSearchV14()">시연 검색</button><div class="asset-filter-caption-v14"><span>검색어는 띄어쓰기 기준으로 모두 포함된 자산만 표시</span><span>부서 · 도구 · 유형 복합 필터</span></div>';
        search.replaceWith(panel);
      }
      const empty=root.querySelector('.asset-empty');
      if(empty&&flow.active){
        empty.className='demo-empty-v14';empty.innerHTML='<div class="big">📭</div><h3>적합한 자산이 없습니다</h3><p>경영지원팀에서 사용할 출장 영수증 자동 분류 Web App이 아직 공개되지 않았습니다. 현재 업무와 원하는 결과를 작성해 제작 요청으로 연결합니다.</p><button class="btn btn-primary" onclick="openDemoWishFormV14()">제작 요청 작성</button>';
      }
    };
  }

  window.openDemoWishFormV14=function(){
    flow.step=2;persistV14();
    openModal('<h3>💡 AI 제작 요청</h3><div class="desc">기술 구현 방식은 제작자가 구체화합니다. 요청자는 현재 업무와 원하는 결과를 설명합니다.</div>'
      +'<div class="formrow"><div class="lb">업무 문제</div><textarea id="demo-problem-v14" rows="2">영수증의 날짜·금액·항목을 수기로 분류</textarea></div>'
      +'<div class="formrow"><div class="lb">현재 흐름</div><input id="demo-current-v14" value="영수증 확인 → 항목 입력 → 증빙 확인 → 정산표 작성"></div>'
      +'<div class="formrow"><div class="lb">희망 결과</div><input id="demo-result-v14" value="이미지 업로드 후 정산 항목을 자동 분류"></div>'
      +'<div class="formrow"><div class="lb">사용 데이터</div><input id="demo-data-v14" value="영수증 이미지·출장 정보"></div>'
      +'<div class="similar-v14"><span>🔎</span><div class="grow"><b>유사 요청 추천</b><small>법인카드 증빙 자동 정리 · 요청 8명</small></div><button class="btn btn-ghost" onclick="wantDemoRequestV14(this)">저도 원해요</button></div>'
      +'<div class="modal-actions"><button class="btn btn-primary" onclick="submitDemoWishV14()">제작 요청 등록</button><button class="btn btn-ghost" onclick="closeModal()">취소</button></div>');
  };
  window.wantDemoRequestV14=function(btn){flow.wantCount++;if(btn){btn.textContent='✓ '+flow.wantCount+'명';btn.disabled=true;}persistV14();toast('수요에 반영했습니다. 유사 요청을 하나의 제작 과제로 묶을 수 있습니다.');};
  window.submitDemoWishV14=function(){
    flow.requestCreated=true;flow.step=3;addHistoryV14('REQUESTED','경영지원팀 · 요청자','업무 흐름·희망 결과·사용 데이터 등록');
    let w=WISHES.find(x=>x.demoV14);if(!w){w={id:114,q:'출장 영수증 이미지를 올리면 날짜·금액·항목을 자동 분류해 주세요',by:'경영지원팀',votes:flow.wantCount,status:'OPEN',needs:['경비 규정 지식','Web App 제작'],demoV14:true};WISHES.unshift(w);}else w.votes=flow.wantCount;
    closeModal();nav('wish');setTimeout(injectDemoWishV14,30);toast('제작 요청이 등록되었습니다. 유사 요청과 수요가 함께 표시됩니다.');
  };
  function injectDemoWishV14(){
    const root=document.getElementById('screen-wish');if(!root||root.querySelector('.demo-request-v14'))return;
    injectCoachV14(root);
    const card=document.createElement('div');card.className='card demo-request-v14';
    card.innerHTML='<div class="demo-request-head-v14"><div><h3>🧾 '+DEMO_REQUEST_TITLE+'</h3><p>경영지원팀 · 요청 '+flow.wantCount+'명 · '+(flow.workflowAgreed?'공동제작 진행':'제작자 모집')+'</p></div><span class="pill">'+(flow.workflowAgreed?'IN_DEVELOPMENT':'REQUESTED')+'</span></div>'
      +'<div class="demo-request-grid-v14"><div class="demo-field-v14"><b>업무 문제</b><span>영수증의 날짜·금액·항목을 수기로 분류</span></div><div class="demo-field-v14"><b>현재 흐름</b><span>영수증 확인 → 항목 입력 → 증빙 확인 → 정산표 작성</span></div><div class="demo-field-v14"><b>희망 결과</b><span>이미지 업로드 후 정산 항목 자동 분류</span></div><div class="demo-field-v14"><b>사용 데이터</b><span>영수증 이미지 · 출장 정보</span></div></div>'
      +'<div class="similar-v14"><span>🔎</span><div class="grow"><b>유사 요청: 법인카드 증빙 자동 정리</b><small>중복 요청을 수요로 합산해 제작 우선순위에 반영</small></div><button class="btn btn-ghost" onclick="wantDemoRequestV14(this)">저도 원해요 · '+flow.wantCount+'</button></div>'
      +'<div class="demo-request-actions-v14">'+(flow.workflowAgreed?'<button class="btn btn-primary" onclick="prepareDemoRegistrationV14()">완성된 Web App 등록</button>':'<button class="btn btn-primary" onclick="openWorkflowAgreementV14()">제작자로 전환 · 채택</button>')+'</div>';
    root.prepend(card);
  }

  window.openWorkflowAgreementV14=function(){
    flow.step=3;persistV14();
    if(typeof switchActor==='function')switchActor('user',true);
    openModal('<h3>🤝 제작자 채택·워크플로우 합의</h3><div class="desc">요청자의 업무 흐름을 구현 가능한 AI 흐름으로 구체화합니다.</div><div class="workflow-v14">'
      +'<div class="workflow-card-v14"><h4>요청자가 작성한 업무 흐름</h4>'+flowStepsV14(['영수증 확인','항목 입력','정산표 작성'])+'</div>'
      +'<div class="workflow-card-v14"><h4>제작자가 제안한 AI 흐름</h4>'+flowStepsV14(['이미지 업로드','OCR·항목 분류','사용자 확인','정산표 저장'])+'</div></div>'
      +'<div class="hint">요청자가 흐름을 확인하면 공동제작 상태가 시작되고, 역할·결정·변경 이력이 같은 요청에 연결됩니다.</div>'
      +'<div class="modal-actions"><button class="btn btn-primary" onclick="confirmDemoWorkflowV14()">요청자 확인 · 공동제작 시작</button><button class="btn btn-ghost" onclick="closeModal()">취소</button></div>');
  };
  function flowStepsV14(items){return items.map((x,i)=>'<div class="workflow-step-v14"><i>'+(i+1)+'</i><span>'+x+'</span></div>'+(i<items.length-1?'<div class="workflow-arrow-v14">↓</div>':'')).join('');}
  window.confirmDemoWorkflowV14=function(){flow.workflowAgreed=true;addHistoryV14('IN_DEVELOPMENT','제작자 · 요청자','AI 흐름 제안 및 요청자 확인 완료');closeModal();nav('wish');setTimeout(injectDemoWishV14,30);toast('공동제작이 시작되었습니다. 합의된 AI 흐름이 요청에 저장되었습니다.');};

  const basePlatformRuleV14=window.platformRule;
  if(typeof basePlatformRuleV14==='function'){
    window.platformRule=function(tool){
      if(tool==='webapp')return {pf:'CLAUDE',name:'바이브코딩 Web App',help:'Git 저장소, 배포 환경, 외부 API, Secret 관리 방식을 확인합니다.',fields:[['reg-webapp-git','Git URL','https://github.com/daou/receipt-classifier'],['reg-webapp-runtime','배포 환경','Cloud Run · 사내 접근'],['reg-webapp-api','외부 API 연결','OCR API · 경비 규정 API'],['reg-webapp-secret','Secret 관리','Secret Manager']]};
      return basePlatformRuleV14(tool);
    };
  }
  window.prepareDemoRegistrationV14=function(){
    flow.step=4;persistV14();
    state.regDraft={step:2,type:'space',tool:'webapp',pf:'CLAUDE',baseModel:'기타/사내 모델',title:DEMO_TITLE,purpose:'출장 영수증 이미지를 업로드해 날짜·금액·비용 항목을 자동 분류',effect:'건별 정산 작성 15분 → 3분',sIn:'영수증 이미지 + 출장자·출장일 정보',sOut:'날짜, 금액, 비용 항목, 증빙 상태가 입력된 정산표 초안',craft:'OCR 결과를 경비 규정 항목에 매핑하고 사용자 확인 후 저장',toolFields:{'reg-webapp-git':'https://github.com/daou/receipt-classifier','reg-webapp-runtime':'Cloud Run · 사내 접근','reg-webapp-api':'OCR API · 경비 규정 API','reg-webapp-secret':'Secret Manager'},dataSource:'영수증 이미지·출장 정보',sensitive:false,taskTags:['분류','추출'],license:'전사 공개',limitations:'사용자 확인 후 정산표 확정'};
    nav('register');setTimeout(()=>{renderRegister();injectDemoRegisterV14();},50);
  };
  function injectDemoRegisterV14(){
    const root=document.getElementById('screen-register');if(!root)return;injectCoachV14(root);
    if(root.querySelector('.demo-reg-banner-v14'))return;
    const wrap=root.querySelector('.reg-wrap-v11')||root;
    const b=document.createElement('div');b.className='demo-reg-banner-v14';b.innerHTML='<b>🧾 시연용 Web App 정보가 입력되었습니다</b><p>Git URL과 외부 API 연결이 자동 점검 대상에 포함됩니다.</p><div class="demo-reg-chips-v14"><span>Web App</span><span>Git URL 연결</span><span>외부 OCR API</span><span>Secret Manager</span><span>예상 판정: Heavy Track</span></div>';
    wrap.insertBefore(b,wrap.children[1]||wrap.firstChild);
  }
  const baseRenderRegisterV14=window.renderRegister;
  if(typeof baseRenderRegisterV14==='function')window.renderRegister=function(){baseRenderRegisterV14();setTimeout(injectDemoRegisterV14,0);};

  const baseSubmitRegV14=window.submitReg;
  if(typeof baseSubmitRegV14==='function'){
    window.submitReg=function(){
      const isDemo=state.regDraft&&state.regDraft.title===DEMO_TITLE;
      if(isDemo){flow.submitted=true;addHistoryV14('SUBMITTED','제작자','Web App 등록 신청 · Git URL·외부 API 정보 제출');setTimeout(()=>addHistoryV14('HEAVY_REVIEW','시스템','코드 실행·외부 API 연결 감지로 Heavy Track 자동 분류'),2400);}
      baseSubmitRegV14();
      if(isDemo)setTimeout(()=>{flow.step=5;persistV14();const a=document.getElementById('reg-done-actions');if(a)a.innerHTML='<div style="font-weight:800;margin-bottom:10px">Heavy Track 자동 분류 완료</div><button class="btn btn-primary" onclick="openDemoPolicyReviewV14()">AX기획 정책 검토로 이동</button>';},3600);
    };
  }

  window.openDemoPolicyReviewV14=function(){flow.step=5;persistV14();if(typeof switchActor==='function')switchActor('plan');else nav('admin');setTimeout(injectDemoAdminV14,50);};
  function injectDemoAdminV14(){
    const root=document.getElementById('screen-admin');if(!root||root.querySelector('.demo-admin-v14'))return;injectCoachV14(root);
    const role=state.actor==='dev'?'dev':'plan';
    const card=document.createElement('div');card.className='card demo-admin-v14';
    if(role==='plan')card.innerHTML='<div class="demo-admin-head-v14"><div><h3>🛡 '+DEMO_TITLE+'</h3><p>AX기획팀 정책 검토 · Heavy Track</p></div><span class="pill">HEAVY_REVIEW</span></div>'+statusStripV14()+'<div class="demo-check-grid-v14">'+checkV14('요청 목적','출장 정산 수기 입력 자동화')+checkV14('공개 범위','전사 공개 · 사내 계정')+checkV14('데이터 수준','영수증 이미지·출장 정보')+checkV14('운영 필요성','월 반복 업무 · 경영지원 소유')+'</div><div class="demo-admin-actions-v14"><button class="btn btn-primary" onclick="approveDemoPolicyV14()">정책 승인 · AX개발 이관</button></div>';
    else card.innerHTML='<div class="demo-admin-head-v14"><div><h3>🧑‍💻 '+DEMO_TITLE+'</h3><p>AX개발팀 기술 검증 · 배포 조건 확인</p></div><span class="pill">TECH REVIEW</span></div>'+statusStripV14()+'<div class="demo-check-grid-v14">'+checkV14('외부 API','OCR API allowlist 확인')+checkV14('Secret','Secret Manager 저장')+checkV14('배포 환경','Cloud Run · 사내 접근')+checkV14('테스트 결과','대표 영수증 20건 통과')+'</div><div class="demo-admin-actions-v14">'+(flow.techValidated?'<button class="btn btn-primary" onclick="publishDemoAssetV14()">공개 완료</button>':'<button class="btn btn-primary" onclick="validateDemoTechV14()">기술 승인</button>')+'</div>';
    const head=root.querySelector('.console-head');if(head)head.insertAdjacentElement('afterend',card);else root.prepend(card);
  }
  function checkV14(k,v){return '<div class="demo-check-v14"><span class="ok">✓</span><div><b>'+k+'</b><br><span>'+v+'</span></div></div>';}
  const baseRenderAdminV14=window.renderAdmin;
  if(typeof baseRenderAdminV14==='function')window.renderAdmin=function(role){baseRenderAdminV14(role);setTimeout(injectDemoAdminV14,0);};
  window.approveDemoPolicyV14=function(){flow.policyApproved=true;addHistoryV14('HEAVY_REVIEW','AX기획팀','업무 목적·공개 범위·데이터 수준·운영 필요성 정책 승인');if(typeof switchActor==='function')switchActor('dev');else renderAdmin('dev');setTimeout(injectDemoAdminV14,50);toast('정책 승인이 완료되어 AX개발 기술 검증으로 이관되었습니다.');};
  window.validateDemoTechV14=function(){flow.techValidated=true;addHistoryV14('TECH_VALIDATED','AX개발팀','외부 API·Secret·배포 환경·테스트 결과 기술 승인');renderAdmin('dev');toast('기술 검증이 완료되었습니다. 공개할 수 있습니다.');};
  window.publishDemoAssetV14=function(){
    flow.published=true;flow.step=6;addHistoryV14('PUBLISHED','AX개발팀','기술 검증 통과 · 사내 실행 URL 공개');
    let a=ASSETS.find(x=>x.demoReceiptV14||x.title===DEMO_TITLE);
    if(!a){a={id:Math.max.apply(null,ASSETS.map(x=>x.id))+1,icon:'🧾',title:DEMO_TITLE,author:ME.name,dept:'경영지원팀',pf:'CLAUDE',cat:'자동화',adopts:14,tries:31,recipes:2,daysAgo:0,type:'space',tool:'webapp',runtimeUrl:'https://apps.daou.local/receipt-classifier',deployedAt:'오늘',verified:true,demoReceiptV14:true,purpose:'출장 영수증 이미지를 올려 날짜·금액·비용 항목을 자동 분류할 때',effect:'건별 정산 작성 15분 → 3분',review1:'정산표 초안이 바로 만들어져 확인만 하면 됩니다',reviews:[{t:'법인카드 영수증도 비용 항목이 구분되면 좋겠어요',w:'영업팀',h:1}],sampleIn:'영수증 이미지 + 출장 정보',sampleOut:'날짜 · 금액 · 비용 항목 · 증빙 상태',craft:'OCR → 규정 항목 매핑 → 사용자 확인 → 정산표 저장',tools:['Web App','OCR API'],tags:['출장','영수증','정산','웹앱'],baseModel:'기타/사내 모델',dataSource:'영수증 이미지·출장 정보',license:'전사 공개',limitations:'사용자 확인 후 확정'};ASSETS.unshift(a);}
    if(typeof switchActor==='function')switchActor('user',true);nav('detail',a.id);toast('공개가 완료되었습니다. 이제 사용자 화면에서 실행할 수 있습니다.');
  };

  const baseRenderDetailV14=window.renderDetail;
  if(typeof baseRenderDetailV14==='function'){
    window.renderDetail=function(id){baseRenderDetailV14(id);const a=byId(id);if(!a||!(a.demoReceiptV14||a.title===DEMO_TITLE))return;const root=document.getElementById('screen-detail');injectCoachV14(root);if(root.querySelector('.runtime-demo-v14'))return;const box=document.createElement('div');box.className='card runtime-demo-v14';box.innerHTML='<h3>🧾 출장 영수증 자동 분류 실행</h3><p>이미지 업로드 → OCR·항목 분류 → 사용자 확인 → 정산표 저장</p><div class="actions"><button class="btn btn-primary" onclick="runDemoAssetV14('+a.id+')">앱 실행</button><button class="btn btn-secondary" onclick="openDemoImprovementV14('+a.id+')">개선 제안</button><button class="btn btn-ghost" onclick="showDemoHistoryV14()">StatusHistory</button></div>';
      const head=root.querySelector('.detail-head');if(head)head.insertAdjacentElement('afterend',box);else root.prepend(box);
    };
  }
  window.runDemoAssetV14=function(id){flow.used=true;const a=byId(id);if(a){a.tries=(a.tries||0)+1;}persistV14();openModal('<h3>🧾 실행 결과</h3><div class="desc">영수증 이미지가 분류되었습니다.</div><div class="demo-request-grid-v14"><div class="demo-field-v14"><b>날짜</b><span>2026-07-14</span></div><div class="demo-field-v14"><b>금액</b><span>48,000원</span></div><div class="demo-field-v14"><b>비용 항목</b><span>출장 교통비</span></div><div class="demo-field-v14"><b>증빙 상태</b><span>확인 완료</span></div></div><div class="modal-actions"><button class="btn btn-primary" onclick="closeModal();openDemoImprovementV14('+id+')">개선 제안 남기기</button><button class="btn btn-ghost" onclick="closeModal()">닫기</button></div>');};
  window.openDemoImprovementV14=function(id){openModal('<h3>📝 개선 제안</h3><div class="desc">실제 사용 중 필요한 개선 사항을 제작자에게 전달합니다.</div><div class="formrow"><div class="lb">개선 내용</div><textarea id="demo-improve-v14" rows="3">법인카드 영수증의 비용 항목을 자동 구분해 주세요.</textarea></div><div class="modal-actions"><button class="btn btn-primary" onclick="submitDemoImprovementV14('+id+')">제안 등록</button><button class="btn btn-ghost" onclick="closeModal()">취소</button></div>');};
  window.submitDemoImprovementV14=function(id){flow.improvement=true;flow.step=7;addHistoryV14('IMPROVEMENT_REQUESTED','경영지원팀 · 사용자','법인카드 영수증 비용 항목 자동 구분 요청');closeModal();toast('개선 제안이 제작자의 다음 버전 작업으로 연결되었습니다.');showDemoHistoryV14();};

  window.showDemoHistoryV14=function(){
    const rows=flow.history.map(h=>'<div class="history-row-v14"><b>'+h.status+'</b><span class="meta">'+escV14(h.actor)+'<br>'+escV14(h.at)+'</span><span>'+escV14(h.reason)+'</span></div>').join('');
    openModal('<h3>🧭 StatusHistory</h3><div class="desc">요청, 등록, 검토, 공개, 개선 상태가 바뀔 때마다 처리 주체·시점·사유가 서버 이력으로 남습니다.</div>'+statusStripV14()+'<div class="history-v14">'+rows+'</div><div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">닫기</button></div>');
  };
  window.openDemoRunbookV14=function(){
    const times=['탐색 40초','제작 요청 50초','제작·흐름 합의 50초','등록·자동 판정 1분','정책·기술 검증 1분','활용·개선 1분','StatusHistory 40초'];
    openModal('<h3>🎬 6분 시연 순서</h3><div class="desc">현재 단계: '+flow.step+'/7 · '+stepCopy[flow.step][0]+'</div><div class="card" style="padding:12px;margin-top:12px">'+times.map((x,i)=>'<div class="svc-row"><b>'+(i+1)+'. '+stepCopy[i+1][0]+'</b><span>'+x.split(' ').slice(1).join(' ')+'</span></div>').join('')+'</div><div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">닫기</button></div>');
  };

  const creatorUsersV14=[
    {name:'이서연',dept:'경영지원팀',asset:'채용공고 초안 작성기',uses:12,saved:'4.8시간',when:'오늘 09:24'},
    {name:'김도현',dept:'개발1팀',asset:'사내 규정 안내 도우미',uses:8,saved:'3.2시간',when:'어제 16:11'},
    {name:'박하늘',dept:'총무팀',asset:'사내 규정 안내 도우미',uses:7,saved:'2.1시간',when:'7/13 14:08'},
    {name:'정유진',dept:'영업2팀',asset:'채용공고 초안 작성기',uses:5,saved:'1.7시간',when:'7/12 11:32'},
    {name:'최민수',dept:'커머스팀',asset:'채용공고 초안 작성기',uses:4,saved:'1.3시간',when:'7/11 15:40'}
  ];
  function creatorImpactHtmlV14(){
    const bars=[['채용공고 초안 작성기',64],['사내 규정 안내 도우미',41],['회의 후속조치 정리',23]];
    return '<section class="creator-impact-v14"><div class="creator-impact-head-v14"><div><h3>📊 내가 만든 AI 자산 성과</h3><p>공개 자산의 실행·활용효과·사용자를 제작자 기준으로 집계한 목업 데이터</p></div><span class="pill">최근 30일</span></div>'
      +'<div class="impact-stats-v14"><div class="card impact-stat-v14"><div class="k">내 자산을 사용한 동료</div><div class="v">38명</div><div class="s"><span class="up">+9명</span> · 7개 부서</div></div><div class="card impact-stat-v14"><div class="k">동료가 절감한 시간</div><div class="v">126시간</div><div class="s">사용 후 입력한 예상 절감시간 합계</div></div><div class="card impact-stat-v14"><div class="k">내 자산 실행</div><div class="v">128회</div><div class="s"><span class="up">+31%</span> · 전월 대비</div></div><div class="card impact-stat-v14"><div class="k">내가 사용한 AI 자산</div><div class="v">47회</div><div class="s">가져온 자산 4개 · 직접 만든 자산 9회</div></div></div>'
      +'<div class="impact-grid-v14"><div class="card impact-panel-v14"><h4>최근 사용한 동료</h4>'+creatorUsersV14.map(u=>'<div class="impact-user-v14"><div><b>'+u.name+'</b><br><span style="color:var(--ink-faint)">'+u.dept+'</span></div><span>'+u.asset+'</span><span class="cnt">'+u.uses+'회</span><span class="saved">'+u.saved+' 절감</span></div>').join('')+'</div><div class="card impact-panel-v14"><h4>자산별 실행 횟수</h4>'+bars.map(x=>'<div class="impact-bar-row-v14"><span>'+x[0]+'</span><div class="impact-bar-v14"><span style="width:'+Math.round(x[1]/64*100)+'%"></span></div><b>'+x[1]+'</b></div>').join('')+'<div class="note" style="margin-top:12px">절감시간은 사용자가 실행 후 선택한 기존 소요시간과 실제 소요시간의 차이로 계산</div></div></div>'
      +'<details class="usage-toggle-v14"><summary>▸ 사용 기록 <small>기본 접힘 · 최근 실행 5건</small></summary><div class="inside">'+creatorUsersV14.map(u=>'<div class="usage-log-v14"><span class="when">'+u.when+'</span><span>'+u.name+' · '+u.dept+'<br>'+u.asset+'</span><span>'+u.uses+'회 실행</span><span class="save">'+u.saved+'</span></div>').join('')+'</div></details></section>';
  }
  const baseRenderMyV14=window.renderMy;
  if(typeof baseRenderMyV14==='function'){
    window.renderMy=function(mode){
      baseRenderMyV14(mode);
      const root=document.getElementById('screen-my');if(!root)return;injectCoachV14(root);
      [...root.querySelectorAll('.section-title')].forEach(title=>{
        const txt=(title.textContent||'').trim();
        if(txt.includes('나의 활용 꾸준함')){let n=title.nextElementSibling;title.remove();for(let i=0;i<2&&n;i++){const next=n.nextElementSibling;n.remove();n=next;}}
        if(txt.includes('내 자산, 어느 부서가 많이 활용하나')){const n=title.nextElementSibling;title.remove();if(n)n.remove();}
      });
      if(mode==='creator'&&!root.querySelector('.creator-impact-v14')){
        const head=root.querySelector('.myshelf-head');if(head)head.insertAdjacentHTML('afterend',creatorImpactHtmlV14());else root.insertAdjacentHTML('afterbegin',creatorImpactHtmlV14());
      }
    };
  }

  const baseNavV14=window.nav;
  if(typeof baseNavV14==='function'){
    window.nav=function(screen,param){baseNavV14(screen,param);setTimeout(()=>{const root=document.getElementById('screen-'+screen);injectCoachV14(root);if(screen==='wish')injectDemoWishV14();if(screen==='register')injectDemoRegisterV14();if(screen==='admin')injectDemoAdminV14();},0);};
  }

  injectLaunchV14();
  if(state.screen==='my')renderMy();
  if(state.screen==='assets')renderAssetsV8();
})();
