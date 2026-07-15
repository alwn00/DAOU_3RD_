/* DAOU AX v22: history, visible model cards, my collaboration management */
(function(){
'use strict';
if(window.__DAOU_V22__)return;
window.__DAOU_V22__=1;

const STORE='daou-v21';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const E=v=>typeof esc==='function'?esc(String(v??'')):String(v??'');
const stamp=()=>new Date().toLocaleString('ko-KR',{hour12:false});
const currentUser=()=>window.ME?.name||'박서연';
const currentDept=()=>window.ME?.dept||'인사팀';

function data(){
  let d;
  try{d=JSON.parse(localStorage.getItem(STORE)||'null');}catch(_){d=null;}
  d=d||{seq:50,versions:{},imps:[],projects:[],notices:[],derived:[]};
  d.projects=d.projects||[];d.imps=d.imps||[];d.notices=d.notices||[];d.versions=d.versions||{};d.derived=d.derived||[];d.seq=d.seq||50;
  d.projects.forEach(p=>{
    p.co=p.co||[];p.apps=p.apps||[];p.perm=p.perm||{};
    p.modelCard=p.modelCard||{
      baseModel:p.model||'기타/사내 모델',
      dataSource:'업무 예시·공개 문서',
      license:'부서 한정',
      limitations:'최종 결과는 담당자가 검토'
    };
  });
  return d;
}
function save(d){localStorage.setItem(STORE,JSON.stringify(d));try{savePersistentStateV7(false);}catch(_){}}
function nextId(d,prefix){d.seq=(d.seq||50)+1;return prefix+d.seq;}
function asset(id){return typeof byId==='function'?byId(Number(id)):ASSETS.find(a=>Number(a.id)===Number(id));}
function isMineAsset(id){const a=asset(id);return !!a&&(a.author===currentUser()||(a.coOwners||[]).includes(currentUser()));}
function projectStatus(p){if(p.status==='COMPLETED')return '등록 완료';if(p.co?.length)return '공동 개발 중';return '참여자 모집';}

const style=document.createElement('style');
style.textContent=`
.v22-back{display:inline-flex;align-items:center;gap:5px;margin:0 0 13px;padding:6px 10px;border:1px solid var(--line);border-radius:4px;background:#fff;color:var(--ink-soft);font-size:.72rem;font-weight:800}.v22-back:hover{background:var(--paper-deep);color:var(--ink)}
.v22-model-card{margin-top:12px;padding:18px 20px}.v22-model-card h3{font-size:1rem;margin-bottom:4px}.v22-model-card .v22-model-desc{font-size:.75rem;color:var(--ink-faint);margin-bottom:12px}.v22-model-card .inside{padding:0!important;border:0!important}.v22-model-card .req-star{margin-left:3px}
.v22-my-tabs{display:flex;gap:5px;flex-wrap:wrap}.v22-my-tabs button{border:1px solid var(--line);background:#fff;color:var(--ink-soft);padding:7px 11px;border-radius:4px;font-size:.72rem;font-weight:800}.v22-my-tabs button.active{background:var(--gw-blue);border-color:var(--gw-blue);color:#fff}
.v22-collab-manage{margin-top:15px}.v22-manage-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:17px 18px;margin-bottom:12px}.v22-manage-head h3{font-size:1rem}.v22-manage-head p{font-size:.75rem;color:var(--ink-soft);margin-top:3px}.v22-project-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.v22-project{padding:15px}.v22-project h4{font-size:.9rem}.v22-tags,.v22-actions,.v22-roles{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v22-project .desc{font-size:.72rem;color:var(--ink-soft);line-height:1.58;margin-top:8px}.v22-project .ownerline{font-size:.67rem;color:var(--ink-faint);margin-top:7px}.v22-actions .btn{padding:6px 8px;font-size:.65rem}.v22-roles span{font-size:.62rem;border:1px solid var(--line);padding:3px 6px;border-radius:3px;background:var(--paper)}
.v22-empty{padding:28px;text-align:center;color:var(--ink-faint);font-size:.78rem}.v22-section-title{display:flex;align-items:center;gap:7px;margin:22px 0 10px;font-size:.96rem;font-weight:850}.v22-section-title small{font-size:.7rem;color:var(--ink-faint);font-weight:500}
.v22-orch-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding-bottom:18px;border-bottom:1px solid var(--line);margin-bottom:14px}.v22-orch-hero h2{font-size:1.5rem}.v22-orch-hero p{font-size:.8rem;color:var(--ink-soft);margin-top:5px}.v22-orch-actions{display:flex;gap:7px;flex-wrap:wrap}.v22-flow{padding:16px;overflow-x:auto}.v22-flow-row{display:flex;align-items:center;gap:7px;min-width:760px}.v22-flow-step{min-width:125px;padding:10px;border:1px solid var(--line);border-radius:5px;background:#fff;text-align:center}.v22-flow-step b{display:block;font-size:.72rem}.v22-flow-step span{font-size:.63rem;color:var(--ink-faint)}.v22-flow-arrow{color:var(--ink-faint)}
.v22-wip-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.v22-wip{padding:15px}.v22-progress{height:6px;background:var(--paper-deep);border-radius:5px;overflow:hidden;margin:9px 0}.v22-progress i{display:block;height:100%;background:var(--gw-blue)}
.v22-app-row{padding:11px 0;border-bottom:1px solid var(--line-soft)}.v22-app-row:last-child{border:0}.v22-app-row p{font-size:.73rem;color:var(--ink-soft);margin-top:4px}.v22-perm-row{display:grid;grid-template-columns:140px 1fr;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line-soft);font-size:.75rem}
@media(max-width:900px){.v22-project-list,.v22-wip-grid{grid-template-columns:1fr}.v22-orch-hero,.v22-manage-head{flex-direction:column}.v22-perm-row{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const originalNav=window.nav;
const navStack=[];
let navParam=null;
let navigatingBack=false;
function rememberCurrent(nextScreen,nextParam){
  const current=window.state?.screen;
  if(!current||current===nextScreen&&String(navParam??'')===String(nextParam??''))return;
  navStack.push({screen:current,param:navParam});
  if(navStack.length>30)navStack.shift();
}
window.nav=function(screen,param){
  if(!navigatingBack)rememberCurrent(screen,param);
  navParam=param;
  const result=originalNav.apply(this,arguments);
  setTimeout(()=>afterRenderV22(screen,param),0);
  return result;
};
window.goBackV22=function(){
  const target=navStack.pop()||{screen:'home',param:null};
  navigatingBack=true;
  window.nav(target.screen,target.param);
  navigatingBack=false;
};
function addBack(screen){
  const root=q('#screen-'+screen);
  if(!root)return;
  q('.v22-back',root)?.remove();
  if(screen==='home')return;
  const b=document.createElement('button');
  b.className='v22-back';b.type='button';b.innerHTML='← 뒤로';b.onclick=window.goBackV22;
  root.insertBefore(b,root.firstChild);
}

function cleanHomeTrend(){
  const root=q('#screen-home');if(!root)return;
  qa('.home-radar-grid .status-chip,.home-radar-grid .pill,.home-radar-card .badge,.home-radar-card [class*="poc"],.recent-trend [class*="poc"]',root).forEach(el=>{
    if(/poc\s*후보/i.test((el.textContent||'').trim())||/poc/i.test(el.className||''))el.remove();
  });
  qa('.home-radar-grid span,.home-radar-grid button',root).forEach(el=>{
    if(/^\s*(🧪\s*)?PoC\s*후보\s*$/i.test(el.textContent||''))el.remove();
  });
}
const originalHome=window.renderHome;
if(typeof originalHome==='function')window.renderHome=function(){const r=originalHome.apply(this,arguments);cleanHomeTrend();return r;};

function requiredLabel(root,label){
  const el=qa('.lb',root).find(x=>(x.textContent||'').trim().startsWith(label));
  if(el&&!q('.req-star',el))el.insertAdjacentHTML('beforeend',' <span class="req-star">*</span>');
}
function enhanceRegister(){
  const root=q('#screen-register');if(!root)return;
  const details=q('details.reg-details-v11',root);
  if(details){
    const inside=q('.inside',details);
    const card=document.createElement('section');
    card.className='card reg-section-v11 v22-model-card';
    card.innerHTML='<h3>모델 카드 <span class="req-star">*</span></h3><p class="v22-model-desc">기반 모델, 사용 데이터, 공개 범위, 제한사항을 함께 등록합니다.</p>';
    if(inside){while(inside.firstChild)card.appendChild(inside.firstChild);}
    details.replaceWith(card);
    requiredLabel(card,'기반 모델');requiredLabel(card,'사용 데이터·DB');requiredLabel(card,'공개 범위');requiredLabel(card,'제한사항');
    const dataInput=q('#reg-data',card);if(dataInput)dataInput.placeholder="없으면 '사용 데이터 없음' 입력";
    const limitInput=q('#reg-limit',card);if(limitInput)limitInput.placeholder="없으면 '별도 제한사항 없음' 입력";
  }
  const review=q('.review-box-v11',root);
  if(review&&!q('.v22-review-model',review)&&window.state?.regDraft?.step===3){
    const d=state.regDraft||{};
    const row='<div class="review-row-v11 v22-review-model"><b>모델 카드</b><span>기반 모델 <b>'+E(d.baseModel||'미입력')+'</b> · 데이터 '+E(d.dataSource||'미입력')+' · '+E(d.license||'미입력')+' · 제한 '+E(d.limitations||'미입력')+'</span></div>';
    const validation=qa('.review-row-v11',review).find(x=>/검증 흐름/.test(x.textContent||''));
    validation?validation.insertAdjacentHTML('beforebegin',row):review.insertAdjacentHTML('beforeend',row);
  }
  addBack('register');
}
const originalRegister=window.renderRegister;
if(typeof originalRegister==='function')window.renderRegister=function(){const r=originalRegister.apply(this,arguments);enhanceRegister();return r;};
const originalRegGo=window.regGo;
if(typeof originalRegGo==='function')window.regGo=function(n){
  if(Number(n)===3&&window.state?.regDraft?.step===2){
    const model=q('#reg-base')?.value.trim();
    const dataValue=q('#reg-data')?.value.trim();
    const limits=q('#reg-limit')?.value.trim();
    if(!model||!dataValue||!limits){toast('모델 카드의 기반 모델·사용 데이터·제한사항을 입력해 주세요. 없으면 없음으로 적어 주세요.');return;}
  }
  const r=originalRegGo.apply(this,arguments);setTimeout(enhanceRegister,0);return r;
};

function projectCard(p){
  const me=currentUser();
  const applied=(p.apps||[]).some(a=>a.name===me&&a.status==='APPLIED');
  return '<article class="card v22-project"><div style="display:flex;justify-content:space-between;gap:8px"><h4>'+E(p.title)+'</h4><span class="pill">'+projectStatus(p)+'</span></div>'+
    '<div class="v22-tags"><span class="pill">'+E(p.type)+'</span><span class="pill">'+E(p.model)+'</span><span class="pill">'+E(p.tool)+'</span></div>'+
    '<div class="desc"><b>해결 문제</b> '+E(p.problem)+'<br><b>현재까지 만든 것</b> '+E(p.made)+'</div>'+
    '<div class="v22-roles">'+(p.roles||[]).map(r=>'<span>'+E(r)+'</span>').join('')+'</div>'+
    '<div class="ownerline">주 소유자 '+E(p.owner)+' · 공동 소유자 '+((p.co||[]).length?E(p.co.join(', ')):'없음')+'</div>'+
    '<div class="v22-actions">'+(p.owner===me?'<button class="btn btn-secondary" onclick="nav(\'my\',\'collab\')">관리하기</button>':(p.co||[]).includes(me)?'<span class="pill">공동 소유자로 참여 중</span>':applied?'<span class="pill">참여 신청 완료</span>':'<button class="btn btn-primary" onclick="applyProjectV22(\''+p.id+'\')">참여 신청</button>')+'</div></article>';
}
function legacyWipCard(item){
  const progress=Number(item.progress||0);
  return '<article class="card v22-wip"><h4>'+E(item.title)+'</h4><div class="v22-meta" style="font-size:.66rem;color:var(--ink-faint);margin-top:3px">'+E(item.from||'사내 공동 개발')+' · '+E(item.by||'원작자')+'</div><div class="v22-progress"><i style="width:'+progress+'%"></i></div><div class="desc" style="font-size:.73rem;color:var(--ink-soft);line-height:1.58">'+E(item.made||'')+'</div><div class="v22-roles">'+(item.roles||[]).map(r=>'<span>'+E(r)+'</span>').join('')+'</div><div class="v22-actions"><button class="btn btn-primary" onclick="joinLegacyV22(\''+item.id+'\')">참여 의사 보내기</button></div></article>';
}
function flowHTML(){
  const cases=typeof ORCH_CASES!=='undefined'?ORCH_CASES:[];
  if(!cases.length)return '';
  return cases.map(c=>'<div class="card v22-flow" style="margin-bottom:9px"><b>'+E(c.title)+'</b><div class="v22-flow-row" style="margin-top:9px">'+(c.nodes||[]).map((n,i)=>(i?'<span class="v22-flow-arrow">→</span>':'')+'<div class="v22-flow-step"><b>'+E(n.ic)+' '+E(n.nt)+'</b><span>'+E(n.nd)+'</span></div>').join('')+'</div></div>').join('');
}
window.renderOrchestra=function(){
  const root=q('#screen-orchestra');if(!root)return;
  const d=data();
  const legacy=typeof ENSEMBLES!=='undefined'?ENSEMBLES:[];
  root.innerHTML='<div class="v22-orch-hero"><div><h2>AI 공동 개발</h2><p>진행 중인 아이디어를 발견하고, 내가 가진 경험과 자산으로 참여합니다.</p></div><div class="v22-orch-actions"><button class="btn btn-secondary" onclick="nav(\'my\',\'collab\')">내 공동 개발 관리</button><button class="btn btn-primary" onclick="collabFormV22()">공동 개발 올리기</button></div></div>'+
    '<div class="v22-section-title">공동 개발이 이어지는 과정 <small>요청·참여·공동 소유·등록</small></div>'+flowHTML()+
    '<div class="v22-section-title">참여자를 찾는 기존 공동 개발 <small>기존 화면의 모집 자산 유지</small></div><div class="v22-wip-grid">'+legacy.map(legacyWipCard).join('')+'</div>'+
    '<div class="v22-section-title">새로 등록된 공동 개발 <small>모델 카드 포함</small></div><div class="v22-project-list">'+(d.projects.length?d.projects.map(projectCard).join(''):'<div class="card v22-empty">등록된 공동 개발이 없습니다.</div>')+'</div>';
  addBack('orchestra');
};

window.collabFormV22=function(){
  openModal('<h3>공동 개발 올리기</h3><div class="desc">제작 정보와 모델 카드를 함께 등록합니다.</div>'+
    '<div class="formrow"><div class="lb">제목 *</div><input id="v22ct" placeholder="예: 출장 영수증 OCR 정산 Web App"></div>'+
    '<div class="formrow"><div class="lb">자산 유형 *</div><select id="v22type"><option>Gem</option><option>Web App</option><option>Copilot Agent</option><option>Claude Project</option><option>프롬프트</option><option>자동화·MCP</option></select></div>'+
    '<div class="formrow"><div class="lb">제작 도구 *</div><input id="v22tool" placeholder="예: Claude Code · OCR API"></div>'+
    '<div class="formrow"><div class="lb">해결 문제 *</div><textarea id="v22problem" rows="3"></textarea></div>'+
    '<div class="formrow"><div class="lb">현재까지 만든 것 *</div><textarea id="v22made" rows="3"></textarea></div>'+
    '<div class="formrow"><div class="lb">필요한 역할 *</div><input id="v22roles" placeholder="OCR 연결, 테스트 데이터 정리"></div>'+
    '<div class="card" style="padding:14px;margin-top:12px"><b>모델 카드</b>'+
      '<div class="formrow"><div class="lb">기반 모델 *</div><input id="v22model" placeholder="예: Claude 3.5 Sonnet"></div>'+
      '<div class="formrow"><div class="lb">사용 데이터·DB *</div><input id="v22data" placeholder="없으면 사용 데이터 없음"></div>'+
      '<div class="formrow"><div class="lb">공개 범위 *</div><select id="v22license"><option>부서 한정</option><option>전사 공개</option></select></div>'+
      '<div class="formrow"><div class="lb">제한사항 *</div><input id="v22limit" placeholder="없으면 별도 제한사항 없음"></div></div>'+
    '<div class="modal-actions"><button class="btn btn-primary" onclick="createCollabV22()">등록</button><button class="btn btn-ghost" onclick="closeModal()">취소</button></div>');
};
window.createCollabV22=function(){
  const ids=['v22ct','v22tool','v22problem','v22made','v22roles','v22model','v22data','v22limit'];
  if(ids.some(id=>!q('#'+id)?.value.trim())){toast('공동 개발 정보와 모델 카드를 모두 입력해 주세요.');return;}
  const d=data();
  d.projects.unshift({id:nextId(d,'c'),title:q('#v22ct').value.trim(),type:q('#v22type').value,model:q('#v22model').value.trim(),tool:q('#v22tool').value.trim(),problem:q('#v22problem').value.trim(),made:q('#v22made').value.trim(),roles:q('#v22roles').value.split(',').map(x=>x.trim()).filter(Boolean),owner:currentUser(),co:[],apps:[],perm:{},status:'RECRUITING',modelCard:{baseModel:q('#v22model').value.trim(),dataSource:q('#v22data').value.trim(),license:q('#v22license').value,limitations:q('#v22limit').value.trim()}});
  save(d);closeModal();renderOrchestra();toast('공동 개발 모집과 모델 카드를 등록했습니다.');
};
window.joinLegacyV22=function(id){
  const item=(typeof ENSEMBLES!=='undefined'?ENSEMBLES:[]).find(x=>String(x.id)===String(id));if(!item)return;
  const d=data();let p=d.projects.find(x=>x.legacyId===id);
  if(!p){p={id:nextId(d,'c'),legacyId:id,title:item.title,type:'공동 개발 자산',model:'모델 미정',tool:'도구 협의 중',problem:item.from||'현업 요청 해결',made:item.made||'',roles:item.roles||[],owner:(item.by||'원작자').replace(/.*\(([^·)]+).*/,'$1'),co:[],apps:[],perm:{},modelCard:{baseModel:'모델 미정',dataSource:'협업 중 확정',license:'부서 한정',limitations:'등록 전 모델 카드 확정 필요'}};d.projects.push(p);save(d);}
  applyProjectV22(p.id);
};
window.applyProjectV22=function(id){
  const d=data(),p=d.projects.find(x=>x.id===id);if(!p)return;
  const mine=ASSETS.filter(a=>a.author===currentUser()).slice(0,8);
  openModal('<h3>공동 개발 참여 신청</h3><div class="desc">내가 기여할 내용과 기존 제작 자산을 원작자에게 보여줍니다.</div><div class="formrow"><div class="lb">도울 수 있는 역할 *</div><input id="v22role" value="'+E((p.roles||[])[0]||'업무 검수')+'"></div><div class="formrow"><div class="lb">메시지·개발 경험 *</div><textarea id="v22msg" rows="4"></textarea></div><div class="formrow"><div class="lb">보여줄 내 자산</div><select id="v22portfolio"><option value="">선택 안 함</option>'+mine.map(a=>'<option>'+E(a.title)+'</option>').join('')+'</select></div><div class="modal-actions"><button class="btn btn-primary" onclick="submitProjectApplyV22(\''+id+'\')">신청</button><button class="btn btn-ghost" onclick="closeModal()">취소</button></div>');
};
window.submitProjectApplyV22=function(id){
  const role=q('#v22role').value.trim(),msg=q('#v22msg').value.trim();if(!role||!msg){toast('역할과 메시지를 입력해 주세요.');return;}
  const d=data(),p=d.projects.find(x=>x.id===id);if(!p)return;
  p.apps=p.apps||[];p.apps.push({id:nextId(d,'a'),name:currentUser(),dept:currentDept(),role,msg,portfolio:q('#v22portfolio').value,status:'APPLIED'});
  d.notices.unshift({title:'공동 개발 참여 신청',body:currentUser()+'님이 '+p.title+' 참여를 신청했습니다.',at:stamp(),read:false});save(d);closeModal();renderOrchestra();toast('원작자에게 참여 신청을 보냈습니다.');
};

function ensureMyTabs(mode){
  const root=q('#screen-my');if(!root)return;
  let tabs=q('.asset-vault-tabs',root);
  if(!tabs){tabs=document.createElement('div');tabs.className='asset-vault-tabs v22-my-tabs';const head=q('.asset-vault-head',root);head?head.appendChild(tabs):root.insertBefore(tabs,root.firstChild);}
  tabs.classList.add('v22-my-tabs');
  if(!q('[data-v22="collab"]',tabs))tabs.insertAdjacentHTML('beforeend','<button type="button" data-v22="collab" onclick="renderMyIn(\'collab\')">공동 개발 관리</button>');
  qa('button',tabs).forEach(b=>b.classList.toggle('active',mode==='collab'?b.dataset.v22==='collab':b.dataset.v22!=='collab'&&b.classList.contains('active')));
  if(mode==='collab'){qa('button',tabs).forEach(b=>b.classList.toggle('active',b.dataset.v22==='collab'));}
}
function manageProjectCard(p,role){
  const me=currentUser();
  const canRegister=role==='owner'||!!p.perm?.[me]?.version;
  return '<article class="card v22-project"><div style="display:flex;justify-content:space-between;gap:8px"><h4>'+E(p.title)+'</h4><span class="pill">'+(role==='owner'?'주 소유':'공동 참여')+'</span></div><div class="v22-tags"><span class="pill">'+E(p.type)+'</span><span class="pill">'+E(p.model)+'</span><span class="pill">'+E(p.tool)+'</span></div><div class="desc">'+E(p.problem)+'<br><b>모델 카드</b> '+E(p.modelCard?.dataSource||'미입력')+' · '+E(p.modelCard?.license||'미입력')+'</div><div class="ownerline">주 소유자 '+E(p.owner)+' · 공동 소유자 '+((p.co||[]).length?E(p.co.join(', ')):'없음')+'</div><div class="v22-actions">'+(role==='owner'?'<button class="btn btn-primary" onclick="applicantsV22(\''+p.id+'\')">지원자 '+(p.apps||[]).filter(a=>a.status==='APPLIED').length+'명</button><button class="btn btn-ghost" onclick="permissionsV22(\''+p.id+'\')">권한 관리</button>':'')+(canRegister?'<button class="btn btn-secondary" onclick="prepareProjectRegisterV22(\''+p.id+'\')">모델·자산 등록</button>':'<span class="pill">버전 등록 권한 없음</span>')+'</div></article>';
}
function acceptedImprovementHTML(d){
  const list=d.imps.filter(i=>i.status==='ACCEPTED'&&isMineAsset(i.assetId));
  return '<div class="v22-section-title">채택한 개선 제안 <small>새 버전 또는 별도 모델·자산 등록</small></div><div class="card">'+(list.length?list.map(i=>{const a=asset(i.assetId);return '<div class="v22-app-row"><b>'+E(a?.title||'자산')+' · '+E(i.title)+'</b><p>'+E(i.body)+'</p><div class="v22-actions"><button class="btn btn-primary" onclick="versionFormV21('+i.assetId+',\''+i.id+'\')">새 버전 등록</button><button class="btn btn-secondary" onclick="prepareImprovementRegisterV22(\''+i.id+'\')">모델·자산 등록</button></div></div>';}).join(''):'<div class="v22-empty">채택 후 등록을 기다리는 개선 제안이 없습니다.</div>')+'</div>';
}
function renderMyCollab(){
  const root=q('#screen-my');if(!root)return;
  const d=data();
  const oldHead=q('.asset-vault-head',root);
  const headHTML=oldHead?oldHead.outerHTML:'<div class="asset-vault-head"><div><h2>내 자산함</h2><p>내가 보유·제작·공동 개발한 AI 자산을 관리합니다.</p></div><div class="asset-vault-tabs"></div></div>';
  const owned=d.projects.filter(p=>p.owner===currentUser());
  const joined=d.projects.filter(p=>(p.co||[]).includes(currentUser())||(p.apps||[]).some(a=>a.name===currentUser()&&a.status==='ACCEPTED'));
  root.innerHTML=headHTML+'<section class="v22-collab-manage"><div class="card v22-manage-head"><div><h3>공동 개발 관리</h3><p>주소유 자산과 공동 참여 자산을 구분해 확인하고, 결과를 모델·AI 자산 등록으로 연결합니다.</p></div><button class="btn btn-primary" onclick="nav(\'orchestra\')">공동 개발 둘러보기</button></div><div class="v22-section-title">내가 주 소유자인 공동 개발 <small>'+owned.length+'건</small></div><div class="v22-project-list">'+(owned.length?owned.map(p=>manageProjectCard(p,'owner')).join(''):'<div class="card v22-empty">주 소유자로 진행 중인 공동 개발이 없습니다.</div>')+'</div><div class="v22-section-title">내가 공동 개발에 참여한 자산 <small>'+joined.length+'건</small></div><div class="v22-project-list">'+(joined.length?joined.map(p=>manageProjectCard(p,'co')).join(''):'<div class="card v22-empty">공동 소유자로 참여한 자산이 없습니다.</div>')+'</div>'+acceptedImprovementHTML(d)+'</section>';
  ensureMyTabs('collab');addBack('my');
}
const previousRenderMy=window.renderMy;
window.renderMy=function(mode){
  if(mode==='collab'){
    previousRenderMy.call(this,'creator');
    renderMyCollab();
    return;
  }
  const r=previousRenderMy.apply(this,arguments);ensureMyTabs(mode||'reader');addBack('my');return r;
};
window.renderMyIn=function(mode){return window.renderMy(mode||'reader');};

window.applicantsV22=function(id){
  const d=data(),p=d.projects.find(x=>x.id===id);if(!p)return;
  openModal('<h3>지원자 확인</h3><div class="desc">메시지와 기존 제작 자산을 보고 채택하거나 거절합니다.</div><div class="card" style="padding:4px 14px">'+((p.apps||[]).length?(p.apps||[]).map(a=>'<div class="v22-app-row"><b>'+E(a.name)+' · '+E(a.dept)+'</b><span class="pill" style="margin-left:7px">'+E(a.status)+'</span><p><b>'+E(a.role||'기여 역할')+'</b> · '+E(a.msg||'')+'</p>'+(a.portfolio?'<p>보여줄 자산: '+E(a.portfolio)+'</p>':'')+(a.status==='APPLIED'?'<div class="v22-actions"><button class="btn btn-primary" onclick="decideApplicantV22(\''+id+'\',\''+a.id+'\',true)">채택</button><button class="btn btn-ghost" onclick="decideApplicantV22(\''+id+'\',\''+a.id+'\',false)">거절</button></div>':'')+'</div>').join(''):'<div class="v22-empty">지원자가 없습니다.</div>')+'</div><div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal();renderMyIn(\'collab\')">닫기</button></div>');
};
window.decideApplicantV22=function(pid,appid,ok){
  const d=data(),p=d.projects.find(x=>x.id===pid),a=p?.apps?.find(x=>x.id===appid);if(!p||!a)return;
  a.status=ok?'ACCEPTED':'REJECTED';
  if(ok&&!p.co.includes(a.name)){p.co.push(a.name);p.perm[a.name]={improvement:false,version:false};p.status='IN_PROGRESS';}
  d.notices.unshift({title:ok?'공동 개발 참여 채택':'공동 개발 참여 거절',body:p.title+' 신청 결과가 등록되었습니다.',at:stamp(),read:false});save(d);applicantsV22(pid);
};
window.permissionsV22=function(id){
  const d=data(),p=d.projects.find(x=>x.id===id);if(!p)return;
  openModal('<h3>공동 소유권·권한</h3><div class="desc">후기와 개선 알림은 공동 소유자 모두가 받고, 개선 채택과 새 버전 공개 권한은 따로 부여합니다.</div><div class="card" style="padding:4px 14px"><div class="v22-perm-row"><b>'+E(p.owner)+'</b><span>주 소유자 · 전체 권한</span></div>'+(p.co||[]).map(n=>'<div class="v22-perm-row"><b>'+E(n)+'</b><span><label><input type="checkbox" '+(p.perm?.[n]?.improvement?'checked':'')+' onchange="setPermissionV22(\''+id+'\',\''+n+'\',\'improvement\',this.checked)"> 개선 채택</label> &nbsp; <label><input type="checkbox" '+(p.perm?.[n]?.version?'checked':'')+' onchange="setPermissionV22(\''+id+'\',\''+n+'\',\'version\',this.checked)"> 새 버전·모델 등록</label></span></div>').join('')+'</div><div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">닫기</button></div>');
};
window.setPermissionV22=function(id,name,key,value){const d=data(),p=d.projects.find(x=>x.id===id);if(!p)return;p.perm[name]=p.perm[name]||{};p.perm[name][key]=value;save(d);};

function typePreset(type,model){
  if(/web/i.test(type))return {type:'space',tool:'webapp',pf:'CLAUDE'};
  if(/copilot/i.test(type))return {type:'agent',tool:'copilot',pf:'COPILOT'};
  if(/claude/i.test(type)||/claude/i.test(model))return {type:'agent',tool:'claude_project',pf:'CLAUDE'};
  if(/프롬프트|prompt/i.test(type))return {type:'prompt',tool:'prompt',pf:'GEMINI'};
  if(/자동화|mcp/i.test(type))return {type:'auto',tool:'automation',pf:'CLAUDE'};
  return {type:'agent',tool:'gemini',pf:'GEMINI'};
}
window.prepareProjectRegisterV22=function(id){
  const d=data(),p=d.projects.find(x=>x.id===id);if(!p)return;
  const t=typePreset(p.type,p.model),m=p.modelCard||{};
  state.regDraft={step:2,type:t.type,tool:t.tool,pf:t.pf,baseModel:m.baseModel||p.model||'기타/사내 모델',title:p.title,purpose:p.problem,effect:'공동 개발 결과를 재사용 가능한 AI 자산으로 등록',sIn:'대표 업무 입력 예시',sOut:'공동 개발 결과 예시',craft:'주 소유자 '+p.owner+' · 공동 소유자 '+((p.co||[]).join(', ')||'없음')+' · 현재까지 만든 것: '+p.made,toolFields:{},dataSource:m.dataSource||'사용 데이터 없음',sensitive:false,taskTags:['생성'],license:m.license||'부서 한정',limitations:m.limitations||'별도 제한사항 없음',collabProjectId:p.id};
  try{savePersistentStateV7(false);}catch(_){}nav('register');toast('공동 개발 결과와 모델 카드를 등록 초안으로 불러왔습니다.');
};
window.prepareImprovementRegisterV22=function(iid){
  const d=data(),i=d.imps.find(x=>x.id===iid);if(!i)return;const a=asset(i.assetId);if(!a)return;
  const t=typePreset(a.type||'',a.baseModel||a.pf||'');
  state.regDraft={step:2,type:t.type,tool:t.tool,pf:a.pf||t.pf,baseModel:a.baseModel||({GEMINI:'Gemini 2.5 Pro',CLAUDE:'Claude 3.5 Sonnet',COPILOT:'GPT-4o (Copilot)'}[a.pf]||'기타/사내 모델'),title:a.title+' — '+i.title,purpose:a.purpose||i.title,effect:i.body,sIn:a.sampleIn||'대표 입력 예시',sOut:a.sampleOut||'개선 반영 결과 예시',craft:'기존 자산 '+a.title+'의 채택된 개선 제안 「'+i.title+'」을 별도 모델·AI 자산으로 등록',toolFields:{},dataSource:a.dataSource||'기존 자산의 사용 데이터와 동일',sensitive:false,taskTags:(a.tags||[]).filter(t=>['요약','분류','생성','번역','추출','평가'].includes(t)).slice(0,3),license:a.license||'부서 한정',limitations:a.limitations||'기존 자산의 사용 조건을 확인 후 적용',sourceImprovementId:i.id};
  try{savePersistentStateV7(false);}catch(_){}nav('register');toast('채택한 개선 제안과 모델 카드를 등록 초안으로 불러왔습니다.');
};

function afterRenderV22(screen,param){
  if(screen==='home')cleanHomeTrend();
  if(screen==='register')enhanceRegister();
  if(screen==='orchestra')renderOrchestra();
  if(screen==='my'&&param==='collab')renderMyCollab();
  addBack(screen);
}

const oldSwitchActor=window.switchActor;
if(typeof oldSwitchActor==='function')window.switchActor=function(){const r=oldSwitchActor.apply(this,arguments);setTimeout(()=>{if(state.screen==='home')cleanHomeTrend();if(state.screen==='my')ensureMyTabs('reader');addBack(state.screen);},0);return r;};

setTimeout(()=>{
  if(state.screen==='home')cleanHomeTrend();
  if(state.screen==='register')enhanceRegister();
  if(state.screen==='orchestra')renderOrchestra();
  if(state.screen==='my')ensureMyTabs('reader');
  addBack(state.screen||'home');
},0);
})();
