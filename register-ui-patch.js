/* Registration flow simplification: choose the actual tool once, then enter details */
(function(){
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    .reg-wrap-v11{max-width:940px;margin:0 auto}
    .reg-head-v11{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:16px}
    .reg-head-v11 h2{font-size:1.5rem}.reg-head-v11 p{font-size:.84rem;color:var(--ink-soft);margin-top:4px}
    .reg-stepbar-v11{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 16px}
    .reg-step-v11{padding:10px 12px;border:1px solid var(--line);background:#fff;border-radius:5px;color:var(--ink-faint);font-size:.76rem;font-weight:800}
    .reg-step-v11.on{border-color:var(--gw-blue);background:var(--gw-blue-tint);color:var(--gw-blue)}
    .reg-step-v11.done{color:var(--ink-soft);background:var(--paper-deep)}
    .preset-grid-v11{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:13px}
    .preset-card-v11{position:relative;text-align:left;padding:16px 14px;border:1px solid var(--line);background:#fff;border-radius:6px;min-height:145px;cursor:pointer;transition:.15s}
    .preset-card-v11:hover{border-color:var(--gw-blue);box-shadow:var(--shadow-hover);transform:translateY(-1px)}
    .preset-card-v11 .ic{font-size:1.45rem}.preset-card-v11 .name{font-weight:900;margin-top:7px}.preset-card-v11 .desc{font-size:.74rem;color:var(--ink-soft);line-height:1.45;margin-top:5px}.preset-card-v11 .track{display:inline-flex;margin-top:10px;padding:3px 7px;border-radius:4px;background:var(--gw-blue-tint);color:var(--gw-blue);font-size:.65rem;font-weight:850}.preset-card-v11 .track.heavy{background:var(--gold-tint);color:#946200}
    .advanced-types-v11{margin-top:14px;border-top:1px solid var(--line-soft);padding-top:12px}.advanced-types-v11 summary{cursor:pointer;color:var(--gw-blue);font-weight:850;font-size:.82rem}.advanced-types-v11[open] summary{margin-bottom:10px}
    .selected-preset-v11{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--gw-blue-tint);border:1px solid #cfe1f7;border-radius:6px;margin-bottom:14px}.selected-preset-v11 .ic{font-size:1.45rem}.selected-preset-v11 .body{flex:1}.selected-preset-v11 b{display:block}.selected-preset-v11 span{font-size:.74rem;color:var(--ink-soft)}
    .reg-section-v11{padding:18px 20px;margin-top:12px}.reg-section-v11 h3{font-size:1rem;margin-bottom:12px}.reg-section-v11 .section-desc{font-size:.75rem;color:var(--ink-faint);margin-top:-7px;margin-bottom:12px}
    .reg-grid-v11{display:grid;grid-template-columns:1fr 1fr;gap:12px}.reg-grid-v11 .wide{grid-column:1/-1}
    .tool-fields-v11{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tool-fields-v11 .formrow{margin-bottom:0}.tool-fields-v11 .wide{grid-column:1/-1}
    .reg-auto-v11{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 13px;background:var(--paper);border:1px solid var(--line);border-radius:5px;margin:12px 0}.reg-auto-v11 .txt{font-size:.75rem;color:var(--ink-soft)}
    .reg-details-v11{margin-top:12px;border:1px solid var(--line);border-radius:6px;background:#fff}.reg-details-v11 summary{cursor:pointer;padding:14px 16px;font-weight:850;font-size:.84rem}.reg-details-v11 .inside{padding:2px 18px 18px;border-top:1px solid var(--line-soft)}
    .reg-checks-v11{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.reg-checks-v11 label{display:flex;gap:7px;align-items:flex-start;padding:9px;background:var(--paper);border-radius:4px;font-size:.72rem;color:var(--ink-soft)}
    .review-box-v11{padding:20px}.review-row-v11{display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--line-soft);font-size:.82rem}.review-row-v11:last-child{border-bottom:0}.review-row-v11 b{min-width:125px;color:var(--ink-soft)}
    @media(max-width:900px){.preset-grid-v11{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:650px){.preset-grid-v11,.reg-grid-v11,.tool-fields-v11,.reg-checks-v11{grid-template-columns:1fr}.reg-grid-v11 .wide,.tool-fields-v11 .wide{grid-column:auto}}
  `;
  document.head.appendChild(style);

  const basePlatformRuleV11=platformRule;
  platformRule=function(tool){
    if(tool==='prompt')return {pf:'GEMINI',name:'프롬프트 템플릿',help:'프롬프트 원문과 사용 조건을 등록하면 복사해 재사용할 수 있습니다.',fields:[['reg-prompt-place','프롬프트 저장 위치','사내 문서 링크 또는 저장 경로']]};
    if(tool==='automation')return {pf:'CLAUDE',name:'자동화·MCP',help:'실행 코드, 연결 대상, 권한 범위를 확인한 뒤 기술 검증으로 이동합니다.',fields:[['reg-auto-repo','코드·설정 저장 위치','Git 저장소 또는 사내 저장 경로'],['reg-auto-connect','연결 대상','사내 API / MCP 서버 / 외부 API'],['reg-auto-owner','운영 담당자','부서·담당자 이름']]};
    return basePlatformRuleV11(tool);
  };

  const PRESETS_V11=[
    {k:'gemini',group:'quick',ic:'💎',name:'Gemini Gem',desc:'Gem 링크와 Knowledge 권한을 등록',type:'agent',tool:'gemini',pf:'GEMINI',model:'Gemini 2.5 Pro',track:'LIGHT'},
    {k:'copilot',group:'quick',ic:'🟣',name:'Copilot Agent',desc:'게시 URL과 Teams·M365 연결 정보 등록',type:'agent',tool:'copilot',pf:'COPILOT',model:'GPT-4o (Copilot)',track:'LIGHT'},
    {k:'claude-project',group:'quick',ic:'🟠',name:'Claude Project',desc:'지식 파일·지침·공유 범위를 등록',type:'agent',tool:'claude_project',pf:'CLAUDE',model:'Claude 3.5 Sonnet',track:'LIGHT'},
    {k:'prompt',group:'quick',ic:'📝',name:'프롬프트 템플릿',desc:'반복 업무에 쓰는 프롬프트와 예시를 등록',type:'prompt',tool:'prompt',pf:'GEMINI',model:'Gemini 2.5 Pro',track:'LIGHT'},
    {k:'claude-skill',group:'advanced',ic:'📦',name:'Claude Skill',desc:'skill.md와 resources ZIP 패키지 등록',type:'agent',tool:'claude_skill',pf:'CLAUDE',model:'Claude 3.5 Sonnet',track:'LIGHT'},
    {k:'artifact',group:'advanced',ic:'🧱',name:'Claude Artifact',desc:'실행·공유 URL과 입력 데이터 주의사항 등록',type:'space',tool:'artifact',pf:'CLAUDE',model:'Claude 3.5 Sonnet',track:'HEAVY'},
    {k:'automation',group:'advanced',ic:'⚙️',name:'자동화·MCP',desc:'스크립트·MCP·외부 연결 정보를 등록',type:'auto',tool:'automation',pf:'CLAUDE',model:'기타/사내 모델',track:'HEAVY'},
    {k:'webapp',group:'advanced',ic:'🖥️',name:'바이브코딩 웹앱',desc:'Git·런타임·외부 API와 배포 정보를 등록',type:'space',tool:'webapp',pf:'CLAUDE',model:'기타/사내 모델',track:'HEAVY'}
  ];

  function presetOfDraftV11(d){
    return PRESETS_V11.find(p=>p.tool===(d.tool||'gemini'))||PRESETS_V11[0];
  }
  function presetCardV11(p){
    return '<button type="button" class="preset-card-v11" onclick="selectRegistrationPresetV11(\''+p.k+'\')"><div class="ic">'+p.ic+'</div><div class="name">'+esc(p.name)+'</div><div class="desc">'+esc(p.desc)+'</div><span class="track '+(p.track==='HEAVY'?'heavy':'')+'">'+(p.track==='HEAVY'?'기술 검증 포함':'빠른 등록')+'</span></button>';
  }
  function simpleToolFieldsV11(rule,d){
    return '<div class="tool-fields-v11">'+rule.fields.map((f,i)=>'<div class="formrow '+(rule.fields.length===1?'wide':'')+'"><div class="lb">'+esc(f[1])+'</div><input type="text" id="'+f[0]+'" value="'+esc((d.toolFields||{})[f[0]]||'')+'" placeholder="'+esc(f[2])+'"></div>').join('')+'</div>';
  }
  function stepbarV11(step){
    return '<div class="reg-stepbar-v11">'+[['1','등록 방식'],['2','정보 입력'],['3','확인·신청']].map((x,i)=>'<div class="reg-step-v11 '+(step===i+1?'on':step>i+1?'done':'')+'">'+x[0]+'. '+x[1]+'</div>').join('')+'</div>';
  }

  window.selectRegistrationPresetV11=function(key){
    const p=PRESETS_V11.find(x=>x.k===key);if(!p)return;
    const old=state.regDraft||{};
    state.regDraft={
      step:2,type:p.type,tool:p.tool,pf:p.pf,baseModel:p.model,
      title:old.title||'',purpose:old.purpose||'',effect:old.effect||'',sIn:old.sIn||'',sOut:old.sOut||'',craft:old.craft||'',
      toolFields:{},dataSource:old.dataSource||'',sensitive:!!old.sensitive,taskTags:old.taskTags||[],license:old.license||'전사 공개',limitations:old.limitations||''
    };
    renderRegister();
  };

  renderRegister=function(){
    if(!state.regDraft||!state.regDraft.step)state.regDraft={step:1,type:null,tool:'gemini',pf:'GEMINI',baseModel:'Gemini 2.5 Pro',title:'',purpose:'',effect:'',sIn:'',sOut:'',craft:'',toolFields:{},dataSource:'',sensitive:false,taskTags:[],license:'전사 공개',limitations:''};
    const d=state.regDraft;
    let inner='';

    if(d.step===1){
      const quick=PRESETS_V11.filter(p=>p.group==='quick');
      const advanced=PRESETS_V11.filter(p=>p.group==='advanced');
      inner='<div class="card reg-section-v11"><h3>무엇을 만들었나요?</h3><p class="section-desc">실제 만든 툴이나 결과물 한 가지만 선택하면 바로 정보 입력으로 이동합니다.</p><div class="preset-grid-v11">'+quick.map(presetCardV11).join('')+'</div><details class="advanced-types-v11"><summary>자동화·웹앱 등 고급 등록 유형 보기</summary><div class="preset-grid-v11">'+advanced.map(presetCardV11).join('')+'</div></details></div>';
    }else if(d.step===2){
      const p=presetOfDraftV11(d),rule=platformRule(d.tool||'gemini');
      inner='<div class="selected-preset-v11"><div class="ic">'+p.ic+'</div><div class="body"><b>'+esc(p.name)+'</b><span>'+(p.track==='HEAVY'?'자동 검증 후 AX기획·기술 검증이 이어집니다.':'필수 항목 확인 후 Light Track 자동 검증으로 이어집니다.')+'</span></div><button class="btn btn-ghost" onclick="regGo(1)">등록 방식 변경</button></div>'+ 
        '<div class="card reg-section-v11"><h3>기본 정보</h3><div class="reg-grid-v11"><div class="formrow wide"><div class="lb">자산 이름 <span class="req-star">*</span></div><input type="text" id="reg-title" value="'+esc(d.title||'')+'" placeholder="예: 회의록 액션아이템 정리봇"></div><div class="formrow"><div class="lb">이럴 때 쓰세요 <span class="req-star">*</span></div><input type="text" id="reg-purpose" value="'+esc(d.purpose||'')+'" placeholder="어떤 업무에서 쓰는지 한 줄로"></div><div class="formrow"><div class="lb">활용 효과 <span class="req-star">*</span></div><input type="text" id="reg-effect" value="'+esc(d.effect||'')+'" placeholder="예: 정리 시간 40분 → 5분"></div></div><div class="reg-auto-v11"><div><b style="font-size:.82rem">설명이 막히나요?</b><div class="txt">용도를 적은 뒤 누르면 예시 입출력을 자동으로 채웁니다.</div></div><button type="button" class="btn btn-secondary" id="auto-btn" onclick="autoFillCard()">AI가 예시 작성</button></div><div id="auto-result" style="font-size:.76rem;color:var(--ink-soft)"></div></div>'+ 
        '<div class="card reg-section-v11"><h3>'+esc(rule.name)+' 공유·실행 정보</h3><p class="section-desc">'+esc(rule.help)+'</p>'+simpleToolFieldsV11(rule,d)+'</div>'+ 
        '<div class="card reg-section-v11"><h3>미리 체험 예시</h3><p class="section-desc">동료가 등록 전에 결과를 판단할 수 있는 대표 예시 한 건만 준비합니다.</p><div class="reg-grid-v11"><div class="formrow"><div class="lb">예시 입력 <span class="req-star">*</span></div><textarea id="reg-sin" rows="4" placeholder="실제 업무와 비슷한 샘플 입력">'+esc(d.sIn||'')+'</textarea></div><div class="formrow"><div class="lb">예시 출력</div><textarea id="reg-sout" rows="4" placeholder="샘플 입력에 대한 기대 결과">'+esc(d.sOut||'')+'</textarea></div></div></div>'+ 
        '<details class="reg-details-v11"><summary>상세 설정·보안 정보 <span style="font-weight:500;color:var(--ink-faint)">필요할 때만 펼치기</span></summary><div class="inside"><div class="formrow"><div class="lb">제작 노트</div><textarea id="reg-craft" rows="3" placeholder="핵심 설정, 만든 방법, 주의사항">'+esc(d.craft||'')+'</textarea></div><div class="reg-grid-v11"><div class="formrow"><div class="lb">기반 모델</div><select id="reg-base">'+['Gemini 2.5 Pro','Claude 3.5 Sonnet','GPT-4o','GPT-4o (Copilot)','기타/사내 모델'].map(m=>'<option'+(d.baseModel===m?' selected':'')+'>'+m+'</option>').join('')+'</select></div><div class="formrow"><div class="lb">사용 데이터·DB</div><input type="text" id="reg-data" value="'+esc(d.dataSource||'')+'" placeholder="예: 팀 보고 양식, 공개 문서"><label style="display:flex;gap:7px;align-items:center;margin-top:7px;font-size:.76rem;color:var(--ink-soft)"><input type="checkbox" id="reg-sensitive" '+(d.sensitive?'checked':'')+'> 개인정보·민감정보 포함</label></div></div><div class="formrow"><div class="lb">업무 태그</div><div class="radio-row" id="reg-tasks">'+['요약','분류','생성','번역','추출','평가'].map(t=>'<button type="button" class="radio-pill'+((d.taskTags||[]).includes(t)?' selected':'')+'" onclick="regToggleTask(this,\''+t+'\')">'+t+'</button>').join('')+'</div></div><div class="reg-grid-v11"><div class="formrow"><div class="lb">공개 범위</div><div class="radio-row" id="reg-lic"><button type="button" class="radio-pill'+(d.license!=='부서 한정'?' selected':'')+'" onclick="pickLic(this,\'전사 공개\')">전사 공개</button><button type="button" class="radio-pill'+(d.license==='부서 한정'?' selected':'')+'" onclick="pickLic(this,\'부서 한정\')">부서 한정</button></div></div><div class="formrow"><div class="lb">제한사항</div><input type="text" id="reg-limit" value="'+esc(d.limitations||'')+'" placeholder="예: 최종 검토는 담당자가 수행"></div></div><div style="font-weight:850;font-size:.8rem;margin-top:12px">등록 전 확인</div><div class="reg-checks-v11">'+['예시에 개인정보가 포함되지 않았는지 확인','링크와 지식 파일이 사내 권한으로 열리는지 확인','외부 API·커넥터와 운영 담당자 기재','예시 입출력이 실제 업무를 설명하는지 확인'].map((c,i)=>'<label><input type="checkbox" checked><span>'+c+'</span></label>').join('')+'</div></div></details>'+ 
        '<div class="reg-nav"><button class="btn btn-ghost" onclick="regGo(1)">← 이전</button><button class="btn btn-primary" onclick="regGo(3)">확인하기 →</button></div>';
    }else if(d.step===3){
      const p=presetOfDraftV11(d),rule=platformRule(d.tool||'gemini');
      inner='<div class="card review-box-v11"><h3 style="margin-bottom:12px">등록 내용을 확인해 주세요</h3><div class="review-row-v11"><b>등록 방식</b><span>'+p.ic+' '+esc(p.name)+' · '+(p.track==='HEAVY'?'기술 검증 포함':'빠른 등록')+'</span></div><div class="review-row-v11"><b>자산 이름</b><span>'+esc(d.title)+'</span></div><div class="review-row-v11"><b>사용 상황</b><span>'+esc(d.purpose)+'</span></div><div class="review-row-v11"><b>활용 효과</b><span>'+esc(d.effect)+'</span></div><div class="review-row-v11"><b>공유·실행 정보</b><span>'+((Object.values(d.toolFields||{}).filter(Boolean).map(esc).join(' · '))||'입력 정보 없음')+'</span></div><div class="review-row-v11"><b>검증 흐름</b><span>'+(p.track==='HEAVY'?'자동 점검 → AX기획 심사 → AX개발 기술 검증 → 공개':'자동 점검 → 필요 시 보완 → 공개')+'</span></div><div class="hint" style="margin-top:14px">등록 후에도 설명·예시 수정은 간편 반영되고, 데이터·권한·외부 연결 변경은 범위에 따라 다시 검증됩니다.</div><div class="reg-nav"><button class="btn btn-ghost" onclick="regGo(2)">← 수정하기</button><button class="btn btn-primary btn-big" onclick="submitReg()">등록 신청</button></div></div>';
    }else{
      inner='<div class="regcard card" style="text-align:center"><h3 style="text-align:center">심사가 진행됩니다</h3><div class="patent-steps"><div class="pstep" id="ps1"><div class="circ">📨</div><div class="nm">신청 처리 중</div></div><div class="pbar" id="pb1"></div><div class="pstep" id="ps2"><div class="circ">🔍</div><div class="nm">심사중</div></div><div class="pbar" id="pb2"></div><div class="pstep" id="ps3"><div class="circ">📗</div><div class="nm">등록됨</div></div></div><div class="verify-log" id="vlog"></div><div id="reg-done-actions" style="margin-top:20px"></div></div>';
    }

    document.getElementById('screen-register').innerHTML='<div class="reg-wrap-v11"><div class="reg-head-v11"><div><h2>AI 자산 등록</h2><p>만든 결과물을 한 번 선택하고, 필요한 정보만 입력합니다.</p></div><span class="pill">중복 선택 제거</span></div>'+stepbarV11(Math.min(d.step,3))+inner+'</div>';
  };

  if(state.screen==='register')renderRegister();
})();
