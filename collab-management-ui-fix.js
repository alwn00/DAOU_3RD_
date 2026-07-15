/* DAOU AX: single collaboration tab + vault-style collaboration management */
(function(){
'use strict';
if(window.__DAOU_COLLAB_UI_FIX__)return;
window.__DAOU_COLLAB_UI_FIX__=1;

const STORE='daou-v21';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const E=v=>typeof esc==='function'?esc(String(v??'')):String(v??'');
const me=()=>window.ME?.name||'박서연';
let view='all';

function read(){
  let d;
  try{d=JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){d=null;}
  d=d||{projects:[],imps:[],versions:{},notices:[],derived:[]};
  d.projects=d.projects||[];d.imps=d.imps||[];
  return d;
}
function asset(id){return typeof byId==='function'?byId(Number(id)):window.ASSETS?.find(a=>Number(a.id)===Number(id));}
function isMineAsset(id){const a=asset(id);return !!a&&(a.author===me()||(a.coOwners||[]).includes(me()));}
function statusMeta(p){
  if(p.status==='COMPLETED')return {label:'등록 완료',pct:100,cls:'verified'};
  if((p.co||[]).length||p.status==='IN_PROGRESS')return {label:'공동 개발 중',pct:68,cls:'poc'};
  return {label:'참여자 모집',pct:35,cls:''};
}

const style=document.createElement('style');
style.textContent=`
.asset-vault-tabs .v23-collab-tab{white-space:nowrap}
.v23-collab-wrap{margin-top:14px}
.v23-collab-intro{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:18px 20px;margin-bottom:13px}
.v23-collab-intro h3{font-size:1.02rem;margin:0}.v23-collab-intro p{margin-top:4px;font-size:.76rem;color:var(--ink-soft)}
.v23-collab-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:13px}
.v23-collab-stat{padding:15px 17px}.v23-collab-stat .k{font-size:.69rem;color:var(--ink-faint);font-weight:800}.v23-collab-stat .v{font-size:1.35rem;font-weight:900;color:var(--gw-blue);margin-top:2px}.v23-collab-stat .d{font-size:.68rem;color:var(--ink-soft);margin-top:2px}
.v23-collab-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}
.v23-collab-filter{display:flex;align-items:center;border:1px solid var(--line);border-radius:5px;overflow:hidden;background:#fff}
.v23-collab-filter button{border:0;border-right:1px solid var(--line);background:#fff;color:var(--ink-soft);padding:8px 12px;font-size:.7rem;font-weight:800}.v23-collab-filter button:last-child{border-right:0}.v23-collab-filter button.on{background:var(--gw-blue);color:#fff}
.v23-collab-toolbar .hint{font-size:.68rem;color:var(--ink-faint)}
.v23-group-title{display:flex;align-items:center;gap:7px;margin:19px 0 9px;font-size:.91rem;font-weight:900}.v23-group-title small{font-size:.66rem;color:var(--ink-faint);font-weight:500}
.v23-list{overflow:hidden}.v23-collab-row{grid-template-columns:44px minmax(250px,1fr) auto minmax(225px,auto)!important;min-height:94px;padding:13px 15px!important;cursor:default!important}
.v23-collab-row .vr-icon{width:38px;height:38px;border-radius:6px;background:var(--gw-blue-tint);display:grid;place-items:center;font-size:1.05rem}
.v23-collab-row .vr-title{cursor:default!important;font-size:.84rem;font-weight:900}
.v23-collab-row .vr-meta{font-size:.67rem!important;color:var(--ink-faint);margin-top:3px}
.v23-model-line{font-size:.68rem;color:var(--ink-soft);margin-top:5px;line-height:1.45}
.v23-progress-line{display:flex;align-items:center;gap:8px;margin-top:7px}.v23-progress-track{height:5px;max-width:220px;flex:1;background:var(--paper-deep);border-radius:5px;overflow:hidden}.v23-progress-track i{display:block;height:100%;background:var(--gw-blue)}.v23-progress-line span{font-size:.61rem;color:var(--ink-faint)}
.v23-role-chip{display:inline-flex;align-items:center;padding:3px 7px;border-radius:3px;background:#e6f2fa;color:#005a9c;font-size:.61rem;font-weight:850;margin-left:5px}
.v23-collab-row .vr-actions{display:flex!important;justify-content:flex-end;align-items:center;gap:6px;flex-wrap:wrap}.v23-collab-row .vr-actions .btn{padding:7px 9px;font-size:.64rem;white-space:nowrap}
.v23-improvement-row{display:grid;grid-template-columns:42px minmax(240px,1fr) auto;gap:12px;align-items:center;padding:12px 15px;border-bottom:1px solid var(--line-soft)}.v23-improvement-row:last-child{border-bottom:0}.v23-improvement-row .ic{width:36px;height:36px;border-radius:6px;background:var(--gold-tint);display:grid;place-items:center}.v23-improvement-row b{font-size:.8rem}.v23-improvement-row p{font-size:.69rem;color:var(--ink-soft);margin-top:3px}.v23-improvement-row .actions{display:flex;gap:6px;flex-wrap:wrap}.v23-improvement-row .btn{padding:7px 9px;font-size:.64rem}
.v23-empty{padding:34px 20px;text-align:center;color:var(--ink-faint);font-size:.76rem}
@media(max-width:900px){.v23-collab-summary{grid-template-columns:1fr}.v23-collab-row{grid-template-columns:42px 1fr!important}.v23-collab-row>.status-chip,.v23-collab-row>.pill{grid-column:2}.v23-collab-row .vr-actions{grid-column:1/-1;justify-content:flex-start}.v23-collab-toolbar{align-items:flex-start;flex-direction:column}.v23-improvement-row{grid-template-columns:38px 1fr}.v23-improvement-row .actions{grid-column:1/-1}}
`;
document.head.appendChild(style);

function dedupeTabs(mode){
  const root=q('#screen-my');if(!root)return;
  let tabs=q('.asset-vault-tabs',root);
  if(!tabs)return;
  const collab=qa('button',tabs).filter(b=>/공동\s*개발\s*관리/.test((b.textContent||'').trim()));
  collab.forEach(b=>b.remove());
  const button=document.createElement('button');
  button.type='button';button.className='v23-collab-tab';button.textContent='공동 개발 관리';button.onclick=()=>window.renderMyIn('collab');
  tabs.appendChild(button);
  qa('button',tabs).forEach(b=>{
    const text=(b.textContent||'').trim();
    if(/공동\s*개발\s*관리/.test(text))b.classList.toggle('active',mode==='collab');
    else if(mode==='collab')b.classList.remove('active');
    else if(mode==='creator')b.classList.toggle('active',/내가\s*만든\s*자산/.test(text));
    else if(mode==='reader')b.classList.toggle('active',/가져온\s*자산/.test(text));
  });
}

function projectRow(p,role){
  const s=statusMeta(p),canRegister=role==='owner'||!!p.perm?.[me()]?.version;
  const pending=(p.apps||[]).filter(a=>a.status==='APPLIED').length;
  const model=p.modelCard?.baseModel||p.model||'모델 미정';
  const data=p.modelCard?.dataSource||'사용 데이터 미입력';
  const actions=(role==='owner'
    ?'<button class="btn btn-primary" onclick="applicantsV22(\''+p.id+'\')">지원자 '+pending+'</button><button class="btn btn-ghost" onclick="permissionsV22(\''+p.id+'\')">권한 관리</button>'
    :'')+(canRegister?'<button class="btn btn-secondary" onclick="prepareProjectRegisterV22(\''+p.id+'\')">모델·자산 등록</button>':'<span class="pill">등록 권한 없음</span>');
  return '<div class="vault-row v23-collab-row"><div class="vr-icon">'+(role==='owner'?'🧩':'🤝')+'</div><div class="vr-body"><div class="vr-title">'+E(p.title)+'<span class="v23-role-chip">'+(role==='owner'?'주 소유':'공동 참여')+'</span></div><div class="vr-meta">'+E(p.type)+' · '+E(p.tool)+' · 주 소유자 '+E(p.owner)+' · 공동 소유자 '+((p.co||[]).length?E(p.co.join(', ')):'없음')+'</div><div class="v23-model-line"><b>모델 카드</b> '+E(model)+' · '+E(data)+' · '+E(p.modelCard?.license||'부서 한정')+'</div><div class="v23-progress-line"><div class="v23-progress-track"><i style="width:'+s.pct+'%"></i></div><span>'+s.pct+'%</span></div></div><span class="status-chip '+s.cls+'">'+s.label+'</span><div class="vr-actions">'+actions+'</div></div>';
}

function improvementRows(d){
  const list=d.imps.filter(i=>i.status==='ACCEPTED'&&isMineAsset(i.assetId));
  if(!list.length)return '<div class="v23-empty">채택 후 등록을 기다리는 개선 제안이 없습니다.</div>';
  return list.map(i=>{const a=asset(i.assetId);return '<div class="v23-improvement-row"><div class="ic">✨</div><div><b>'+E(a?.title||'AI 자산')+' · '+E(i.title)+'</b><p>'+E(i.body)+'</p></div><div class="actions"><button class="btn btn-primary" onclick="versionFormV21('+i.assetId+',\''+i.id+'\')">새 버전 등록</button><button class="btn btn-secondary" onclick="prepareImprovementRegisterV22(\''+i.id+'\')">모델·자산 등록</button></div></div>';}).join('');
}

function renderManagement(){
  const root=q('#screen-my');if(!root)return;
  const d=read();
  const owned=d.projects.filter(p=>p.owner===me());
  const joined=d.projects.filter(p=>(p.co||[]).includes(me())||(p.apps||[]).some(a=>a.name===me()&&a.status==='ACCEPTED'));
  const improvements=d.imps.filter(i=>i.status==='ACCEPTED'&&isMineAsset(i.assetId));
  const host=q('.v22-collab-manage',root)||q('.v23-collab-wrap',root);
  if(!host)return;
  host.className='v23-collab-wrap';
  const showOwned=view==='all'||view==='owned';
  const showJoined=view==='all'||view==='joined';
  const showImps=view==='all'||view==='improvements';
  host.innerHTML='<div class="card v23-collab-intro"><div><h3>공동 개발 관리</h3><p>내가 시작한 작업과 참여 중인 작업을 내 자산함 목록 방식으로 관리합니다.</p></div><button class="btn btn-primary" onclick="nav(\'orchestra\')">공동 개발 둘러보기</button></div>'+
    '<div class="v23-collab-summary"><div class="card v23-collab-stat"><div class="k">내가 주 소유</div><div class="v">'+owned.length+'건</div><div class="d">지원자·권한·등록 관리</div></div><div class="card v23-collab-stat"><div class="k">공동 개발 참여</div><div class="v">'+joined.length+'건</div><div class="d">공동 소유·기여 중인 자산</div></div><div class="card v23-collab-stat"><div class="k">채택한 개선</div><div class="v">'+improvements.length+'건</div><div class="d">버전 또는 새 자산 등록 대기</div></div></div>'+
    '<div class="v23-collab-toolbar"><div class="v23-collab-filter">'+[['all','전체'],['owned','주 소유'],['joined','공동 참여'],['improvements','채택한 개선']].map(x=>'<button class="'+(view===x[0]?'on':'')+'" onclick="setCollabViewV23(\''+x[0]+'\')">'+x[1]+'</button>').join('')+'</div><span class="hint">상태와 모델 카드를 확인한 뒤 등록으로 연결</span></div>'+
    (showOwned?'<div class="v23-group-title">내가 주 소유자인 공동 개발 <small>'+owned.length+'건</small></div><div class="card v23-list">'+(owned.length?owned.map(p=>projectRow(p,'owner')).join(''):'<div class="v23-empty">주 소유자로 진행 중인 공동 개발이 없습니다.</div>')+'</div>':'')+
    (showJoined?'<div class="v23-group-title">내가 공동 개발에 참여한 자산 <small>'+joined.length+'건</small></div><div class="card v23-list">'+(joined.length?joined.map(p=>projectRow(p,'co')).join(''):'<div class="v23-empty">공동 소유자로 참여한 자산이 없습니다.</div>')+'</div>':'')+
    (showImps?'<div class="v23-group-title">채택한 개선 제안 <small>'+improvements.length+'건</small></div><div class="card">'+improvementRows(d)+'</div>':'');
  dedupeTabs('collab');
}

window.setCollabViewV23=function(next){view=next;renderManagement();};

const baseRenderMy=window.renderMy;
window.renderMy=function(mode){
  const resolved=mode||'reader';
  const result=baseRenderMy.apply(this,arguments);
  setTimeout(()=>{
    dedupeTabs(resolved);
    if(resolved==='collab')renderManagement();
  },0);
  return result;
};
window.renderMyIn=function(mode){return window.renderMy(mode||'reader');};

const baseNav=window.nav;
window.nav=function(screen,param){
  const result=baseNav.apply(this,arguments);
  if(screen==='my')setTimeout(()=>{dedupeTabs(param||'reader');if(param==='collab')renderManagement();},0);
  return result;
};

setTimeout(()=>{
  if(window.state?.screen==='my'){
    const collab=qa('.asset-vault-tabs button').some(b=>b.classList.contains('active')&&/공동\s*개발\s*관리/.test(b.textContent||''));
    dedupeTabs(collab?'collab':'reader');
    if(collab)renderManagement();
  }
},80);
})();
