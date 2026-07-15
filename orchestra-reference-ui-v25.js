/* DAOU AX v25 — reference progress-card UI for AI collaboration tab only */
(function(){
'use strict';
if(window.__DAOU_ORCHESTRA_V25__)return;
window.__DAOU_ORCHESTRA_V25__=1;

const STORE='daou-v21';
const q=(s,r=document)=>r.querySelector(s);
const E=v=>typeof esc==='function'?esc(String(v??'')):String(v??'');
const me=()=>typeof ME!=='undefined'&&ME?.name?ME.name:(window.ME?.name||'박서연');

function read(){
  let d;
  try{d=JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){d=null;}
  d=d||{projects:[]};d.projects=d.projects||[];
  d.projects.forEach(p=>{p.co=p.co||[];p.apps=p.apps||[];p.roles=p.roles||[];});
  return d;
}

const style=document.createElement('style');
style.textContent=`
.v25-orch-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:18px;border-bottom:1px solid var(--line);margin-bottom:16px}.v25-orch-hero h2{font-size:1.5rem;margin:0}.v25-orch-hero p{font-size:.8rem;color:var(--ink-soft);margin-top:5px}.v25-orch-actions{display:flex;gap:7px;flex-wrap:wrap}
.v25-process{padding:15px 17px;margin-bottom:18px}.v25-process-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:11px}.v25-process-head b{font-size:.87rem}.v25-process-head span{font-size:.66rem;color:var(--ink-faint)}.v25-process-row{display:grid;grid-template-columns:repeat(5,minmax(110px,1fr));gap:7px}.v25-process-step{position:relative;padding:10px 9px;border:1px solid var(--line);border-radius:5px;background:#fff;text-align:center}.v25-process-step:not(:last-child):after{content:'→';position:absolute;right:-9px;top:50%;transform:translateY(-50%);color:var(--ink-faint);z-index:2}.v25-process-step b{display:block;font-size:.7rem}.v25-process-step span{display:block;font-size:.61rem;color:var(--ink-faint);margin-top:2px}
.v25-section-title{display:flex;align-items:center;gap:8px;margin:22px 0 11px;font-size:.98rem;font-weight:900}.v25-section-title small{font-size:.68rem;color:var(--ink-faint);font-weight:500}
.v25-card-list{display:flex;flex-direction:column;gap:15px}.v25-collab-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:19px 21px;box-shadow:var(--shadow)}.v25-card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.v25-title{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.v25-title h3{font-size:.96rem;margin:0}.v25-source{font-size:.63rem;padding:3px 7px;border-radius:4px;background:#f0f2f5;color:var(--ink-faint);font-weight:800}.v25-model{font-size:.62rem;padding:3px 7px;border-radius:4px;background:#eef3ff;color:#4d52a3;font-weight:800}.v25-percent{font-size:.94rem;font-weight:900;color:#5a36a5}
.v25-progress{height:14px;background:#eef0f4;border-radius:5px;overflow:hidden;margin:14px 0 12px}.v25-progress i{display:block;height:100%;background:#5a36a5;border-radius:5px}.v25-next{padding:10px 13px;border:1px solid #c8e2f4;background:#eaf6ff;border-radius:5px;font-size:.72rem;color:#4a6172}.v25-next b{color:#12679d;margin-right:5px}.v25-made{margin-top:12px;padding:13px 15px;border:1px solid #bed9e9;background:#e6f3fa;border-radius:6px}.v25-made b{display:block;font-size:.78rem;color:#11699d;margin-bottom:3px}.v25-made p{font-size:.73rem;color:#647584;line-height:1.55;margin:0}.v25-meta{font-size:.67rem;color:var(--ink-faint);margin-top:10px}.v25-model-card{font-size:.68rem;color:var(--ink-soft);margin-top:6px}.v25-role-title{font-size:.74rem;font-weight:900;margin-top:13px}.v25-roles{display:flex;gap:8px;flex-wrap:wrap;margin-top:7px}.v25-roles span{display:inline-flex;align-items:center;padding:6px 10px;border:1px solid #d9cafa;background:#f2ecff;color:#5c3c99;border-radius:5px;font-size:.67rem;font-weight:800}.v25-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:14px}.v25-status{font-size:.74rem;font-weight:900}.v25-status small{font-size:.65rem;color:var(--ink-faint);font-weight:500;margin-left:5px}.v25-card-actions{display:flex;gap:6px;flex-wrap:wrap}.v25-card-actions .btn{padding:7px 10px;font-size:.65rem}.v25-empty{padding:30px;text-align:center;color:var(--ink-faint);font-size:.76rem;background:#fff;border:1px solid var(--line);border-radius:6px}
@media(max-width:900px){.v25-orch-hero,.v25-card-bottom{align-items:flex-start;flex-direction:column}.v25-process-row{grid-template-columns:1fr}.v25-process-step:not(:last-child):after{content:'↓';right:auto;left:50%;top:auto;bottom:-13px;transform:translateX(-50%)}}
`;
document.head.appendChild(style);

function processHTML(){
  const steps=[['요청 등록','문제·현재 흐름'],['참여 신청','경험·기존 자산'],['개발자 선택','역할·공동 소유'],['공동 제작','AI 구성물 공유'],['모델·자산 등록','검증·버전 공개']];
  return '<div class="card v25-process"><div class="v25-process-head"><b>공동 개발이 이어지는 과정</b><span>모집부터 AI 자산 등록까지</span></div><div class="v25-process-row">'+steps.map(s=>'<div class="v25-process-step"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>').join('')+'</div></div>';
}
function progressFor(p,legacy){
  if(legacy)return Math.max(20,Math.min(100,Number(p.progress||60)));
  if(p.status==='COMPLETED')return 100;
  if((p.co||[]).length||p.status==='IN_PROGRESS')return 60;
  return 35;
}
function nextTask(item,legacy){
  const first=(item.roles||[])[0];
  if(first)return first;
  if(legacy)return '참여자와 역할을 합의합니다.';
  if((item.co||[]).length)return '공유된 AI 구성물을 검토합니다.';
  return '참여 신청을 검토하고 개발자를 선택합니다.';
}
function legacyAction(item){
  return '<button class="btn btn-primary" onclick="joinLegacyV22(\''+item.id+'\')">참여 의사 보내기</button>';
}
function projectAction(p){
  const user=me();
  const applied=(p.apps||[]).some(a=>a.name===user&&a.status==='APPLIED');
  if(p.owner===user)return '<button class="btn btn-secondary" onclick="nav(\'my\',\'collab\')">관리하기</button>';
  if((p.co||[]).includes(user))return '<button class="btn btn-primary" onclick="openWorkspaceV24(\''+p.id+'\')">공동 작업공간</button>';
  if(applied)return '<span class="pill">참여 신청 완료</span>';
  return '<button class="btn btn-primary" onclick="applyProjectV22(\''+p.id+'\')">참여 신청</button>';
}
function card(item,legacy){
  const pct=progressFor(item,legacy);
  const owner=legacy?(item.by||'원작자'):(item.owner||'원작자');
  const source=legacy?(item.from||'사내 공동 개발'):(item.type||'신규 공동 개발');
  const title=item.title||'공동 개발 프로젝트';
  const made=item.made||item.problem||'현재 결과물을 정리하고 있습니다.';
  const roles=(item.roles||[]).length?(item.roles||[]).map(r=>'<span>🙋 '+E(r)+'</span>').join(''):'<span>🙋 역할 협의 중</span>';
  const model=legacy?'모델 협의 중':(item.modelCard?.baseModel||item.model||'모델 미정');
  const data=legacy?'참여 후 모델 카드 확정':(item.modelCard?.dataSource||'사용 데이터 미입력');
  const scope=legacy?'공개 범위 협의':(item.modelCard?.license||'부서 한정');
  const co=legacy?'참여자 선정 전':((item.co||[]).length?item.co.join(', '):'참여자 선정 전');
  const state=legacy?'참여자 모집':pct===100?'등록 완료':pct>=60?'공동 개발 중':'참여자 모집';
  const statusHelp=legacy?'참여 신청 후 원작자가 개발자를 선택합니다.':pct>=60?'선택된 참여자와 AI 구성물을 공유합니다.':'지원자의 경험과 자산을 확인합니다.';
  return '<article class="v25-collab-card"><div class="v25-card-top"><div class="v25-title"><span>🤝</span><h3>'+E(title)+'</h3><span class="v25-source">'+E(source)+'</span><span class="v25-model">'+E(model)+'</span></div><strong class="v25-percent">'+pct+'%</strong></div><div class="v25-progress"><i style="width:'+pct+'%"></i></div><div class="v25-next"><b>다음 할 일 ·</b>'+E(nextTask(item,legacy))+' 완료 후 결과 범위와 모델 카드를 점검합니다.</div><div class="v25-made"><b>지금까지 만든 것</b><p>'+E(made)+'</p></div><div class="v25-meta">발제·제작: '+E(owner)+' · 공동 소유자 '+E(co)+'</div><div class="v25-model-card"><b>모델 카드</b> '+E(model)+' · '+E(data)+' · '+E(scope)+'</div><div class="v25-role-title">🔎 함께할 역할</div><div class="v25-roles">'+roles+'</div><div class="v25-card-bottom"><div class="v25-status">🤝 '+state+' <small>'+E(statusHelp)+'</small></div><div class="v25-card-actions">'+(legacy?legacyAction(item):projectAction(item))+'</div></div></article>';
}

window.renderOrchestra=function(){
  const root=q('#screen-orchestra');if(!root)return;
  const d=read();
  const legacy=typeof ENSEMBLES!=='undefined'?[...ENSEMBLES]:[];
  root.innerHTML='<div class="v25-orch-hero"><div><h2>AI 공동 개발</h2><p>진행 중인 아이디어를 확인하고, 내가 가진 경험과 AI 자산으로 참여합니다.</p></div><div class="v25-orch-actions"><button class="btn btn-secondary" onclick="nav(\'my\',\'collab\')">내 공동 개발 관리</button><button class="btn btn-primary" onclick="collabFormV22()">공동 개발 올리기</button></div></div>'+processHTML()+'<div class="v25-section-title">참여자를 찾는 공동 개발 <small>'+legacy.length+'건</small></div><div class="v25-card-list">'+(legacy.length?legacy.map(x=>card(x,true)).join(''):'<div class="v25-empty">현재 참여자를 모집하는 기존 공동 개발이 없습니다.</div>')+'</div><div class="v25-section-title">새로 등록된 공동 개발 <small>'+d.projects.length+'건</small></div><div class="v25-card-list">'+(d.projects.length?d.projects.map(x=>card(x,false)).join(''):'<div class="v25-empty">새로 등록된 공동 개발이 없습니다.</div>')+'</div>';
  if(typeof addBack==='function')addBack('orchestra');
};

const oldNav=window.nav;
window.nav=function(screen,param){
  const result=oldNav.apply(this,arguments);
  if(screen==='orchestra')setTimeout(()=>window.renderOrchestra(),0);
  return result;
};
setTimeout(()=>{if(window.state?.screen==='orchestra')window.renderOrchestra();},80);
})();
