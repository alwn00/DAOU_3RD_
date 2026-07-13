/* Service guide and improvement/collaboration lifecycle */
(function(){
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
  .guide-grid-v10{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.guide-card-v10{padding:17px;text-align:left;background:#fff;border:1px solid var(--line);border-radius:6px;cursor:pointer}.guide-card-v10:hover{border-color:var(--gw-blue);box-shadow:var(--shadow-hover)}.guide-card-v10 b{display:block;margin:6px 0 4px}.guide-card-v10 span{font-size:.77rem;color:var(--ink-soft);line-height:1.5}.guide-card-v10 em{display:block;margin-top:9px;font-style:normal;font-size:.7rem;color:var(--gw-blue);font-weight:800}
  .life-v10{display:grid;grid-template-columns:repeat(8,minmax(105px,1fr));gap:8px;overflow-x:auto}.life-step-v10{min-width:105px;padding:13px 9px;text-align:center;background:#fff;border:1px solid var(--line);border-radius:5px}.life-step-v10 small{color:var(--gw-blue);font-weight:900}.life-step-v10 b{display:block;font-size:.84rem;margin:4px 0}.life-step-v10 span{display:block;font-size:.68rem;color:var(--ink-faint);line-height:1.4}
  .stage-v10{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.stage-v10 div{padding:11px 8px;text-align:center;background:var(--paper);border:1px solid var(--line);border-radius:5px}.stage-v10 b{display:block;font-size:.77rem}.stage-v10 span{font-size:.68rem;color:var(--ink-faint)}
  .principles-v10{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.principle-v10{padding:16px}.principle-v10 b{display:block;color:var(--gw-blue);margin:5px 0}.principle-v10 p{font-size:.78rem;color:var(--ink-soft);line-height:1.55}
  .improve-box-v10{padding:18px 20px;margin-top:16px}.improve-head-v10{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}.improve-actions-v10{display:flex;gap:7px;flex-wrap:wrap}.proposal-v10{padding:10px 12px;margin-top:8px;background:var(--paper);border:1px solid var(--line);border-radius:5px}.proposal-v10 .top{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.proposal-v10 .status{font-size:.68rem;font-weight:850;color:var(--gw-blue);background:var(--gw-blue-tint);padding:3px 7px;border-radius:4px}.proposal-v10 .body{font-size:.76rem;color:var(--ink-soft);margin-top:5px;line-height:1.45}.version-v10{margin-top:13px;padding-top:12px;border-top:1px solid var(--line-soft);font-size:.76rem;color:var(--ink-soft)}
  .collab-guide-v10{padding:17px 18px;margin:14px 0}.next-v10{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:9px 11px;margin:9px 0;background:var(--gw-blue-tint);border:1px solid #cfe1f7;border-radius:5px;font-size:.76rem}.next-v10 b{color:var(--gw-blue)}
  #improve-role-wrap-v10{display:none}#improve-role-wrap-v10.on{display:block}
  @media(max-width:1000px){.guide-grid-v10{grid-template-columns:repeat(2,1fr)}.life-v10{grid-template-columns:repeat(4,1fr)}.stage-v10{grid-template-columns:repeat(3,1fr)}}@media(max-width:650px){.guide-grid-v10,.principles-v10,.life-v10,.stage-v10{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function renameVision(){
    const el=document.getElementById('side-vision');
    if(el)el.innerHTML='<span class="si-ic">🧭</span> 서비스 이용 가이드';
  }
  renameVision();

  const intents=[
    ['🔎','업무에 쓸 AI가 필요해요','업무·부서·툴로 찾고 예시를 확인한 뒤 내 자산함으로 가져옵니다.','검색 → 미리 체험 → 가져오기','assets'],
    ['✍','직접 만든 AI가 있어요','툴별 공유 정보와 활용 예시를 입력하면 검증·심사로 연결됩니다.','정보 입력 → 검증 → 심사 → 공개','register'],
    ['💡','필요한 AI가 아직 없어요','업무 불편을 요청으로 남기고 공감과 제작자 채택을 기다립니다.','요청 → 공감 → 채택 → 제작','wish'],
    ['🤝','기존 AI를 더 좋게 만들고 싶어요','개선 내용을 제안하고 참여 역할을 남겨 공동 개발로 연결합니다.','개선 제안 → 협업 → 새 버전','orchestra']
  ];
  const life=[['01','발견','업무·부서·툴 검색'],['02','미리 체험','예시 입력·출력 확인'],['03','가져오기','내 환경에 맞게 사용'],['04','활용 기록','후기·불편 축적'],['05','개선 제안','바꿀 내용 등록'],['06','공동 개발','역할 배정·작업'],['07','검증·심사','변경 위험 확인'],['08','새 버전 공개','알림·부서 확산']];
  const stages=[['1. 제안 접수','바꿀 내용 등록'],['2. 검토 중','원작자 확인'],['3. 참여자 모집','필요 역할 공개'],['4. 공동 개발 중','작업·테스트'],['5. 검증·심사 중','변경 범위 확인'],['6. 공개 완료','새 버전 배포']];

  renderVision=function(){
    renameVision();
    document.getElementById('screen-vision').innerHTML=
      '<div class="myshelf-head"><div><h2>🧭 서비스 소개·이용 가이드</h2><p style="margin-top:4px;color:var(--ink-soft);font-size:.86rem">처음 방문한 직원도 목적에 맞는 메뉴와 다음 단계를 바로 찾을 수 있습니다.</p></div><span class="pill">발견부터 지속 개선까지</span></div>'+ 
      '<div class="card" style="padding:22px 24px;margin-top:14px"><div style="font-size:1.06rem;font-weight:900;color:var(--gw-blue)">개인의 AI 활용 경험을 안전하게 공유하고, 사용하며 함께 개선하는 사내 AI 자산 플랫폼</div><p style="margin-top:8px;color:var(--ink-soft);font-size:.88rem;line-height:1.7">검증된 자산을 쉽게 발견해 활용하고, 제작 경험은 등록과 심사를 거쳐 조직 자산으로 남깁니다. 실제 사용 중 나온 의견은 개선 제안과 공동 개발을 거쳐 새 버전으로 이어집니다.</p></div>'+ 
      '<div class="section-title">무엇을 하러 오셨나요? <small>카드를 누르면 해당 메뉴로 이동합니다</small></div><div class="guide-grid-v10">'+intents.map(x=>'<button class="guide-card-v10" onclick="nav(\''+x[4]+'\')"><div style="font-size:1.4rem">'+x[0]+'</div><b>'+esc(x[1])+'</b><span>'+esc(x[2])+'</span><em>'+esc(x[3])+' →</em></button>').join('')+'</div>'+ 
      '<div class="section-title">AI 자산이 성장하는 과정 <small>사용 후 개선까지 하나의 흐름</small></div><div class="life-v10">'+life.map(x=>'<div class="life-step-v10"><small>STEP '+x[0]+'</small><b>'+esc(x[1])+'</b><span>'+esc(x[2])+'</span></div>').join('')+'</div>'+ 
      '<div class="section-title">개선과 공동 개발의 진행 단계</div><div class="card" style="padding:18px"><p style="font-size:.82rem;color:var(--ink-soft);line-height:1.6;margin-bottom:12px"><b style="color:var(--ink)">개선 제안</b>은 무엇을 바꿀지 정하는 단계이며, <b style="color:var(--ink)">공동 개발</b>은 채택된 개선을 누가 어떤 역할로 실행할지 정하는 단계입니다. 문구·태그 수정은 간편 반영하고, 프롬프트·지식·외부 연결 변경은 범위에 맞춰 다시 검증합니다.</p><div class="stage-v10">'+stages.map(x=>'<div><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>').join('')+'</div></div>'+ 
      '<div class="section-title">운영 원칙</div><div class="principles-v10">'+[['🔎','쉽게 발견하고 재사용','검색·툴별 필터·미리 체험으로 첫 사용 부담을 줄입니다.'],['🛡','안전하게 검증하고 공유','데이터·권한·외부 연결 변화에 따라 Light·Heavy 검토를 적용합니다.'],['🔁','사용하며 함께 개선','후기와 제안을 새 버전으로 연결하고 소유권·인수인계 기록을 남깁니다.']].map(x=>'<div class="card principle-v10"><div style="font-size:1.4rem">'+x[0]+'</div><b>'+x[1]+'</b><p>'+x[2]+'</p></div>').join('')+'</div>'+ 
      '<div class="card" style="padding:22px;margin-top:18px;text-align:center;background:var(--gw-blue-tint);border-color:#cfe1f7"><b>검색부터 가져오기까지 이용 흐름을 직접 확인해 보세요</b><div style="font-size:.8rem;color:var(--ink-soft);margin-top:4px">검색 → 발견 → 미리 체험 → 가져오기 → 내 자산함</div><button class="btn btn-primary" style="margin-top:12px" onclick="startSim()">▶ 이용 흐름 시뮬레이션</button></div>';
  };

  function stageName(s){
    return ({OPEN:'제안 접수','검토중':'검토 중','모집중':'참여자 모집','채택':'공동 개발 전환',IN_PROGRESS:'공동 개발 중',REVIEW:'검증·심사 중',PUBLISHED:'공개 완료','반영 완료':'공개 완료'})[s]||s||'제안 접수';
  }

  window.toggleImproveRoleV10=function(on){
    const el=document.getElementById('improve-role-wrap-v10');
    if(el)el.classList.toggle('on',!!on);
  };

  window.proposeImprove=function(targetId,join){
    const target=targetId?byId(Number(targetId)):null;
    const opts=ASSETS.filter(a=>a.assetKind!=='EDUCATION').slice(0,20).map(a=>'<option value="'+a.id+'" '+(target&&a.id===target.id?'selected':'')+'>'+esc(a.title)+'</option>').join('');
    openModal('<h3>💡 개선 제안하기</h3><div class="desc">바꿀 내용을 먼저 제안하고, 직접 참여할 수 있다면 역할을 함께 남깁니다. 채택된 제안만 공동 개발로 이동합니다.</div>'+ 
      '<div class="formrow"><div class="lb">대상 자산</div><select id="improve-target-v10">'+opts+'</select></div>'+ 
      '<div class="formrow"><div class="lb">개선 유형</div><select id="improve-kind-v10"><option>오류·정보 수정</option><option selected>기능 개선</option><option>다른 업무로 확장</option><option>데이터·권한·보안 보완</option></select></div>'+ 
      '<div class="formrow"><div class="lb">개선 내용</div><textarea id="improve-text-v10" rows="4" placeholder="현재 불편한 점, 바꿀 결과, 확인 기준을 적어 주세요"></textarea></div>'+ 
      '<label style="display:flex;gap:8px;align-items:center;font-size:.85rem;color:var(--ink-soft)"><input id="improve-join-v10" type="checkbox" '+(join?'checked':'')+' onchange="toggleImproveRoleV10(this.checked)"> 이 개선 작업에 직접 참여할 수 있어요</label>'+ 
      '<div id="improve-role-wrap-v10" class="'+(join?'on':'')+'"><div class="formrow"><div class="lb">참여 가능한 역할</div><select id="improve-role-v10"><option>업무 지식 제공</option><option>기획·요구사항 정리</option><option>프롬프트·지침 개선</option><option>개발·자동화</option><option>테스트·검증</option></select></div></div>'+ 
      '<div class="hint">제안 접수 → 검토 중 → 참여자 모집 → 공동 개발 → 검증·심사 → 공개 완료 순서로 진행됩니다.</div>'+ 
      '<div class="modal-actions"><button class="btn btn-primary" onclick="submitImproveProposalV10()">제안 등록</button><button class="btn btn-ghost" onclick="closeModal()">취소</button></div>');
  };

  window.submitImproveProposalV10=function(){
    const id=Number(document.getElementById('improve-target-v10').value),a=byId(id);
    const text=document.getElementById('improve-text-v10').value.trim();
    const join=document.getElementById('improve-join-v10').checked;
    if(!a||!text){toast('대상 자산과 개선 내용을 입력해 주세요');return;}
    PROPOSALS.unshift({id:'pr-'+Date.now(),kind:'개선',category:document.getElementById('improve-kind-v10').value,target:a.id,title:a.title,by:nickFull(ME.name,ME.dept),text,votes:1,mine:true,status:'제안 접수',participate:join,role:join?document.getElementById('improve-role-v10').value:''});
    savePersistentStateV7(false);closeModal();
    if(state.screen==='detail')renderDetail(a.id);else renderOrchestra();
    toast(join?'개선 제안과 참여 역할을 등록했습니다':'개선 제안을 등록했습니다');
  };

  function proposalHTML(p){
    return '<div class="proposal-v10"><div class="top"><span class="status">'+esc(stageName(p.status))+'</span><b style="font-size:.8rem">'+esc(p.category||p.kind||'개선')+'</b><span style="margin-left:auto;font-size:.68rem;color:var(--ink-faint)">공감 '+(p.votes||0)+'</span></div><div class="body">'+esc(p.text)+'</div>'+(p.participate?'<div style="font-size:.68rem;color:var(--gw-blue);font-weight:800;margin-top:5px">참여 가능 · '+esc(p.role||'역할 협의')+'</div>':'')+'</div>';
  }

  const baseDetail=renderDetail;
  renderDetail=function(id){
    baseDetail(id);
    const root=document.getElementById('screen-detail'),a=byId(Number(id));
    if(!root||!a||root.querySelector('.improve-box-v10'))return;
    const ps=PROPOSALS.filter(p=>Number(p.target)===a.id),ver=a.ver||((a.adopts||0)>150?'1.3':(a.daysAgo||99)<7?'1.0':'1.1');
    const box=document.createElement('div');box.className='card improve-box-v10';
    box.innerHTML='<div class="improve-head-v10"><div><h3>이 자산을 더 좋게 만들 아이디어가 있나요?</h3><p style="font-size:.77rem;color:var(--ink-soft);margin-top:4px">개선할 내용을 제안하고 참여 가능한 역할이 있으면 공동 개발로 연결합니다.</p></div><div class="improve-actions-v10"><button class="btn btn-secondary" onclick="proposeImprove('+a.id+',false)">개선 제안하기</button><button class="btn btn-primary" onclick="proposeImprove('+a.id+',true)">함께 개선하기</button></div></div>'+ 
      (ps.length?ps.slice(0,3).map(proposalHTML).join(''):'<div class="proposal-v10"><div class="body">아직 개선 제안이 없습니다. 실제 사용 중 발견한 불편을 첫 제안으로 남겨 주세요.</div></div>')+ 
      '<div class="version-v10"><b style="color:var(--ink)">버전 기록 · 현재 v'+esc(ver)+'</b><div style="margin-top:7px">v'+esc(ver)+' · 현재 공개 버전, 활용 조건 점검</div>'+((a.adopts||0)>100?'<div style="margin-top:5px">v1.2 · 동료 후기 기반 출력 형식 개선</div>':'')+'<div style="margin-top:5px">v1.0 · 최초 등록·검증 후 공개</div></div>';
    root.appendChild(box);
  };

  function collabStage(e){
    if(e.projectStatus==='REVIEW')return '검증·심사 중';
    if(e.projectStatus==='PUBLISHED')return '공개 완료';
    if((e.progress||0)>=90)return '검증 준비';
    return e.joined?'공동 개발 중':'참여자 모집';
  }

  const baseOrchestra=renderOrchestra;
  renderOrchestra=function(){
    PROPOSALS.forEach(p=>p.status=stageName(p.status));
    baseOrchestra();
    const root=document.getElementById('screen-orchestra');if(!root)return;
    const hero=root.querySelector('.ax-hero,.ens-hero');
    const guide=document.createElement('div');guide.className='card collab-guide-v10';guide.innerHTML='<h3>개선·협업 진행 단계</h3><p style="font-size:.79rem;color:var(--ink-soft);margin:4px 0 11px">개선 제안은 바꿀 내용을 정하고, 공동 개발은 채택된 제안을 역할별 작업으로 실행합니다.</p><div class="stage-v10">'+stages.map(x=>'<div><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>').join('')+'</div>';
    if(hero)hero.insertAdjacentElement('afterend',guide);else root.prepend(guide);
    ENSEMBLES.forEach(e=>{
      const card=document.getElementById(e.id);if(!card)return;
      const info=document.createElement('div');info.className='next-v10';info.innerHTML='<span class="status">'+esc(collabStage(e))+'</span><span><b>다음 할 일</b> · '+esc((e.roles||[])[0]||'테스트와 결과 확인')+'</span><span style="color:var(--ink-faint)">완료 후 변경 범위에 맞춰 검증·심사</span>';
      const p=card.querySelector('.ens-prog');if(p)p.insertAdjacentElement('afterend',info);else card.prepend(info);
    });
  };

  window.submitCollabAssetV7=function(id){
    const e=ENSEMBLES.find(x=>x.id===id);if(!e)return;
    const risk=[e.title,e.made].concat(e.roles||[]).join(' '),heavy=/외부|API|OCR|스크립트|자동화|커넥터|웹앱|개인정보|권한|데이터 연결/.test(risk);
    e.projectStatus='REVIEW';
    if(!REVIEW_QUEUE.some(r=>r.collabId===id))REVIEW_QUEUE.push({id:'RC-C-'+Date.now(),collabId:id,title:e.title,author:e.owner+'(AI 공동 개발)',track:heavy?'HEAVY':'LIGHT',reason:heavy?'외부 연결·자동화 변경 포함':'설정·프롬프트 중심 변경',pre:{purpose:true,effect:true,sample:true},status:'OPEN',requiresTech:heavy});
    e.audit.unshift({at:'오늘',event:'최종 등록 신청 · '+(heavy?'Heavy':'Light')+' Track',by:ME.name});savePersistentStateV7(false);
    if(state.screen==='my'&&typeof renderMyV9==='function')renderMyV9();else renderOrchestra();
    toast('변경 범위에 따라 '+(heavy?'Heavy Track 기술 검증':'Light Track 검증')+'으로 이동했습니다');
  };

  if(state.screen==='vision')renderVision();
  if(state.screen==='orchestra')renderOrchestra();
})();
