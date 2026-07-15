/* Creator dashboard DOM alignment fix */
(function(){
  'use strict';
  if(window.__DAOU_CREATOR_DASHBOARD_FIX__)return;
  window.__DAOU_CREATOR_DASHBOARD_FIX__=true;

  const people=[
    ['이서연','경영지원팀','채용공고 초안 작성기','12회','4.8시간','오늘 09:24'],
    ['김도현','개발1팀','사내 규정 안내 도우미','8회','3.2시간','어제 16:11'],
    ['박하늘','총무팀','사내 규정 안내 도우미','7회','2.1시간','7/13 14:08'],
    ['정유진','영업2팀','채용공고 초안 작성기','5회','1.7시간','7/12 11:32'],
    ['최민수','커머스팀','회의 후속조치 정리','4회','1.3시간','7/11 15:40']
  ];

  function impactHTML(){
    const bars=[['채용공고 초안 작성기',64],['사내 규정 안내 도우미',41],['회의 후속조치 정리',23]];
    return '<section class="creator-impact-v14" data-creator-dashboard-fixed="true">'
      +'<div class="creator-impact-head-v14"><div><h3>📊 내가 만든 AI 자산 성과</h3><p>최근 30일 동안 동료가 사용한 횟수와 절감 효과를 제작자 기준으로 확인합니다.</p></div><span class="pill">최근 30일</span></div>'
      +'<div class="impact-stats-v14">'
      +'<div class="card impact-stat-v14"><div class="k">내 자산을 사용한 동료</div><div class="v">38명</div><div class="s"><span class="up">+9명</span> · 7개 부서</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">동료가 절감한 시간</div><div class="v">126시간</div><div class="s">실행 후 입력한 예상 절감시간 합계</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">내 자산 실행</div><div class="v">128회</div><div class="s"><span class="up">+31%</span> · 전월 대비</div></div>'
      +'<div class="card impact-stat-v14"><div class="k">내가 사용한 AI 자산</div><div class="v">47회</div><div class="s">가져온 자산 4개 · 직접 만든 자산 9회</div></div>'
      +'</div>'
      +'<div class="impact-grid-v14"><div class="card impact-panel-v14"><h4>최근 사용한 동료</h4>'
      +people.map(p=>'<div class="impact-user-v14"><div><b>'+p[0]+'</b><br><span style="color:var(--ink-faint)">'+p[1]+'</span></div><span>'+p[2]+'</span><span class="cnt">'+p[3]+'</span><span class="saved">'+p[4]+' 절감</span></div>').join('')
      +'</div><div class="card impact-panel-v14"><h4>자산별 실행 횟수</h4>'
      +bars.map(x=>'<div class="impact-bar-row-v14"><span>'+x[0]+'</span><div class="impact-bar-v14"><span style="width:'+Math.round(x[1]/64*100)+'%"></span></div><b>'+x[1]+'</b></div>').join('')
      +'<div class="note" style="margin-top:12px">절감시간 = 기존 소요시간 − AI 자산 사용 후 실제 소요시간</div></div></div>'
      +'<details class="usage-toggle-v14"><summary>▸ 사용 기록 <small>기본 접힘 · 최근 실행 5건</small></summary><div class="inside">'
      +people.map(p=>'<div class="usage-log-v14"><span class="when">'+p[5]+'</span><span>'+p[0]+' · '+p[1]+'<br>'+p[2]+'</span><span>'+p[3]+' 실행</span><span class="save">'+p[4]+'</span></div>').join('')
      +'</div></details></section>';
  }

  function removeSection(root,pattern){
    const title=[...root.querySelectorAll('.section-title')].find(el=>pattern.test((el.textContent||'').trim()));
    if(!title)return;
    let node=title.nextElementSibling;
    while(node&&!node.classList.contains('section-title')){
      const next=node.nextElementSibling;
      node.remove();
      node=next;
    }
    title.remove();
  }

  function applyCreatorFix(mode){
    if(mode!=='creator')return;
    const root=document.getElementById('screen-my');
    if(!root)return;

    root.querySelectorAll('.creator-impact-v14').forEach(el=>el.remove());
    root.querySelectorAll('.contribution-summary').forEach(el=>el.remove());
    removeSection(root,/활동 기록|GIT\s*CONTRIBUTION/i);
    removeSection(root,/어느 부서에서 많이 활용하나|내 자산.*부서.*활용/i);

    const head=root.querySelector('.asset-vault-head');
    if(head)head.insertAdjacentHTML('afterend',impactHTML());
    else root.insertAdjacentHTML('afterbegin',impactHTML());
  }

  const baseRenderMy=window.renderMy;
  if(typeof baseRenderMy==='function'){
    window.renderMy=function(mode){
      const result=baseRenderMy.apply(this,arguments);
      applyCreatorFix(mode||'reader');
      return result;
    };
  }

  const baseRenderMyIn=window.renderMyIn;
  window.renderMyIn=function(mode){
    if(typeof window.renderMy==='function')return window.renderMy(mode);
    if(typeof baseRenderMyIn==='function')return baseRenderMyIn(mode);
  };

  if(window.state&&state.screen==='my'){
    const active=document.querySelector('.asset-vault-tabs button.active');
    if(active&&/내가 만든 자산/.test(active.textContent||''))applyCreatorFix('creator');
  }
})();