/* Final collaboration management UI: one tab, classic vault list */
(function(){
  'use strict';
  if(window.__DAOU_COLLAB_FINAL__)return;
  window.__DAOU_COLLAB_FINAL__=true;

  const STORE='daou-v21';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const escText=v=>typeof esc==='function'?esc(String(v??'')):String(v??'');
  const me=()=>window.ME?.name||'박서연';
  let currentMode='reader';
  let scheduled=false;
  let repairing=false;

  const style=document.createElement('style');
  style.textContent=`
    .classic-collab-wrap{margin-top:14px}
    .classic-collab-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:18px 0 12px}
    .classic-collab-head h3{font-size:1rem;margin:0}.classic-collab-head p{margin-top:3px;font-size:.75rem;color:var(--ink-soft)}
    .classic-collab-list{overflow:hidden}.classic-collab-row{display:grid;grid-template-columns:44px minmax(260px,1fr) auto minmax(210px,auto);gap:12px;align-items:center;padding:13px 15px;border-bottom:1px solid var(--line-soft);min-height:88px}.classic-collab-row:last-child{border-bottom:0}
    .classic-collab-row .vr-icon{width:38px;height:38px;border-radius:6px;background:var(--gw-blue-tint);display:grid;place-items:center;font-size:1rem}
    .classic-collab-row .vr-title{font-size:.84rem;font-weight:900}.classic-collab-row .vr-meta{font-size:.67rem;color:var(--ink-faint);margin-top:3px}.classic-collab-row .model{font-size:.68rem;color:var(--ink-soft);margin-top:4px}
    .classic-collab-row .vr-actions{display:flex;justify-content:flex-end;gap:6px;flex-wrap:wrap}.classic-collab-row .btn{padding:7px 9px;font-size:.64rem;white-space:nowrap}
    .classic-collab-empty{padding:28px;text-align:center;color:var(--ink-faint);font-size:.76rem}
    .classic-improvement-row{display:grid;grid-template-columns:40px minmax(240px,1fr) auto;gap:12px;align-items:center;padding:12px 15px;border-bottom:1px solid var(--line-soft)}.classic-improvement-row:last-child{border-bottom:0}.classic-improvement-row .ic{width:34px;height:34px;border-radius:6px;background:var(--gold-tint);display:grid;place-items:center}.classic-improvement-row b{font-size:.8rem}.classic-improvement-row p{font-size:.69rem;color:var(--ink-soft);margin-top:3px}.classic-improvement-row .actions{display:flex;gap:6px;flex-wrap:wrap}.classic-improvement-row .btn{padding:7px 9px;font-size:.64rem}
    @media(max-width:850px){.classic-collab-row{grid-template-columns:40px 1fr}.classic-collab-row>.status-chip{grid-column:2}.classic-collab-row .vr-actions{grid-column:1/-1;justify-content:flex-start}.classic-improvement-row{grid-template-columns:36px 1fr}.classic-improvement-row .actions{grid-column:1/-1}.classic-collab-head{flex-direction:column}}
  `;
  document.head.appendChild(style);

  function read(){
    let d;
    try{d=JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){d=null;}
    d=d||{projects:[],imps:[],versions:{},notices:[],derived:[]};
    d.projects=d.projects||[];d.imps=d.imps||[];
    return d;
  }
  function asset(id){return typeof byId==='function'?byId(Number(id)):window.ASSETS?.find(a=>Number(a.id)===Number(id));}
  function mineAsset(id){const a=asset(id);return !!a&&(a.author===me()||(a.coOwners||[]).includes(me()));}

  function ensureSingleTab(mode=currentMode){
    const root=q('#screen-my');if(!root)return;
    const tabs=q('.asset-vault-tabs',root);if(!tabs)return;
    const collabs=qa('button',tabs).filter(b=>/공동\s*개발\s*관리/.test((b.textContent||'').trim()));
    collabs.forEach(b=>b.remove());
    const button=document.createElement('button');
    button.type='button';button.textContent='공동 개발 관리';button.dataset.collabFinal='1';
    button.onclick=()=>window.renderMyIn('collab');
    tabs.appendChild(button);
    qa('button',tabs).forEach(b=>{
      const text=(b.textContent||'').trim();
      if(/공동\s*개발\s*관리/.test(text))b.classList.toggle('active',mode==='collab');
      else if(mode==='collab')b.classList.remove('active');
    });
  }

  function status(p){
    if(p.status==='COMPLETED')return {label:'등록 완료',cls:'verified'};
    if((p.co||[]).length||p.status==='IN_PROGRESS')return {label:'공동 개발 중',cls:'poc'};
    return {label:'참여자 모집',cls:''};
  }
  function projectRow(p,role){
    const s=status(p),pending=(p.apps||[]).filter(a=>a.status==='APPLIED').length;
    const canRegister=role==='owner'||!!p.perm?.[me()]?.version;
    const model=p.modelCard?.baseModel||p.model||'모델 미정';
    const data=p.modelCard?.dataSource||'사용 데이터 미입력';
    let actions='';
    if(role==='owner')actions+='<button class="btn btn-primary" onclick="applicantsV22(\''+p.id+'\')">지원자 '+pending+'</button><button class="btn btn-ghost" onclick="permissionsV22(\''+p.id+'\')">권한 관리</button>';
    if(canRegister)actions+='<button class="btn btn-secondary" onclick="prepareProjectRegisterV22(\''+p.id+'\')">모델·자산 등록</button>';
    else actions+='<span class="pill">등록 권한 없음</span>';
    return '<div class="classic-collab-row"><div class="vr-icon">'+(role==='owner'?'🧩':'🤝')+'</div><div><div class="vr-title">'+escText(p.title)+'</div><div class="vr-meta">'+(role==='owner'?'주 소유':'공동 참여')+' · '+escText(p.type||'자산')+' · '+escText(p.tool||'도구 미정')+' · 주 소유자 '+escText(p.owner)+'</div><div class="model"><b>모델 카드</b> '+escText(model)+' · '+escText(data)+' · '+escText(p.modelCard?.license||'부서 한정')+'</div></div><span class="status-chip '+s.cls+'">'+s.label+'</span><div class="vr-actions">'+actions+'</div></div>';
  }
  function improvementRows(list){
    if(!list.length)return '<div class="classic-collab-empty">채택 후 등록을 기다리는 개선 제안이 없습니다.</div>';
    return list.map(i=>{const a=asset(i.assetId);return '<div class="classic-improvement-row"><div class="ic">✨</div><div><b>'+escText(a?.title||'AI 자산')+' · '+escText(i.title)+'</b><p>'+escText(i.body)+'</p></div><div class="actions"><button class="btn btn-primary" onclick="versionFormV21('+i.assetId+',\''+i.id+'\')">새 버전 등록</button><button class="btn btn-secondary" onclick="prepareImprovementRegisterV22(\''+i.id+'\')">모델·자산 등록</button></div></div>';}).join('');
  }

  function renderClassicManagement(){
    const root=q('#screen-my');if(!root)return;
    const d=read();
    const owned=d.projects.filter(p=>p.owner===me());
    const joined=d.projects.filter(p=>(p.co||[]).includes(me())||(p.apps||[]).some(a=>a.name===me()&&a.status==='ACCEPTED'));
    const improvements=d.imps.filter(i=>i.status==='ACCEPTED'&&mineAsset(i.assetId));
    const oldHead=q('.asset-vault-head',root);
    const head=oldHead?oldHead.outerHTML:'<div class="asset-vault-head"><div><h2>내 자산함</h2><p>내가 보유·제작·공동 개발한 AI 자산을 관리합니다.</p></div><div class="asset-vault-tabs"></div></div>';
    root.innerHTML=head+'<section class="classic-collab-wrap"><div class="classic-collab-head"><div><h3>공동 개발 관리</h3><p>내가 시작한 공동 개발과 참여 중인 자산을 확인합니다.</p></div><button class="btn btn-primary" onclick="nav(\'orchestra\')">공동 개발 둘러보기</button></div><div class="section-title">내가 주 소유자인 공동 개발 <small>'+owned.length+'건</small></div><div class="card classic-collab-list">'+(owned.length?owned.map(p=>projectRow(p,'owner')).join(''):'<div class="classic-collab-empty">주 소유자로 진행 중인 공동 개발이 없습니다.</div>')+'</div><div class="section-title">내가 공동 개발에 참여한 자산 <small>'+joined.length+'건</small></div><div class="card classic-collab-list">'+(joined.length?joined.map(p=>projectRow(p,'co')).join(''):'<div class="classic-collab-empty">공동 소유자로 참여한 자산이 없습니다.</div>')+'</div><div class="section-title">채택한 개선 제안 <small>'+improvements.length+'건</small></div><div class="card">'+improvementRows(improvements)+'</div></section>';
    ensureSingleTab('collab');
  }

  const baseRenderMy=window.renderMy;
  window.renderMy=function(mode){
    currentMode=mode||'reader';
    if(currentMode==='collab'){
      baseRenderMy.call(this,'creator');
      renderClassicManagement();
      setTimeout(()=>{renderClassicManagement();ensureSingleTab('collab');},40);
      return;
    }
    const result=baseRenderMy.apply(this,arguments);
    setTimeout(()=>ensureSingleTab(currentMode),0);
    setTimeout(()=>ensureSingleTab(currentMode),80);
    return result;
  };
  window.renderMyIn=function(mode){return window.renderMy(mode||'reader');};

  let observer;
  function scheduleRepair(){
    if(scheduled||repairing)return;
    scheduled=true;
    setTimeout(()=>{
      scheduled=false;
      if(window.state?.screen!=='my')return;
      const needsManagement=currentMode==='collab'&&!q('#screen-my .classic-collab-wrap');
      if(needsManagement){
        repairing=true;
        observer.disconnect();
        renderClassicManagement();
        observer.observe(document.body,{childList:true,subtree:true});
        repairing=false;
      }else{
        ensureSingleTab(currentMode);
      }
    },30);
  }
  observer=new MutationObserver(scheduleRepair);
  observer.observe(document.body,{childList:true,subtree:true});

  setTimeout(()=>{
    if(window.state?.screen==='my'){
      const active=qa('#screen-my .asset-vault-tabs button').find(b=>b.classList.contains('active'));
      currentMode=active&&/공동\s*개발\s*관리/.test(active.textContent||'')?'collab':active&&/내가\s*만든/.test(active.textContent||'')?'creator':'reader';
      if(currentMode==='collab')renderClassicManagement();else ensureSingleTab(currentMode);
    }
  },120);
})();
