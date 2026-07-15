/* Reader asset tab: hide Git contribution and collapse activity history */
(function(){
  'use strict';
  if(window.__DAOU_READER_ACTIVITY_FIX__)return;
  window.__DAOU_READER_ACTIVITY_FIX__=true;

  const style=document.createElement('style');
  style.textContent=`
    .reader-activity-toggle-v15{margin-top:28px;border:1px solid var(--line);border-radius:7px;background:#fff;box-shadow:var(--shadow);overflow:hidden}
    .reader-activity-toggle-v15>summary{list-style:none;cursor:pointer;padding:15px 17px;display:flex;align-items:center;gap:9px;font-size:.94rem;font-weight:850;color:var(--ink);user-select:none}
    .reader-activity-toggle-v15>summary::-webkit-details-marker{display:none}
    .reader-activity-toggle-v15>summary::before{content:'▸';color:var(--gw-blue);font-size:.9rem;transition:transform .15s ease}
    .reader-activity-toggle-v15[open]>summary::before{transform:rotate(90deg)}
    .reader-activity-toggle-v15>summary small{font-size:.72rem;font-weight:500;color:var(--ink-faint)}
    .reader-activity-toggle-v15[open]>summary{border-bottom:1px solid var(--line-soft);background:#fbfcfe}
    .reader-activity-body-v15{padding:0 16px 16px}
    .reader-activity-body-v15>.card:first-child{margin-top:14px}
  `;
  document.head.appendChild(style);

  function removeGitContributionV15(root){
    const ring=root.querySelector('#ms-ring-host');
    if(ring)ring.remove();

    const exact=[...root.querySelectorAll('*')].filter(el=>{
      const own=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.nodeValue||'').join(' ');
      return /GIT\s*CONTRIBUTION/i.test(own);
    });
    exact.forEach(el=>{
      const target=el.closest('[data-git-contribution],.git-contribution,.contribution-ring,.card,.widget,section')||el;
      if(target!==root)target.remove();
    });
  }

  function collapseReaderActivityV15(root){
    if(root.querySelector('.reader-activity-toggle-v15'))return;
    const title=[...root.querySelectorAll('.section-title')].find(el=>/활동 기록/.test((el.textContent||'').trim()));
    if(!title)return;

    const details=document.createElement('details');
    details.className='reader-activity-toggle-v15';
    const summary=document.createElement('summary');
    summary.innerHTML='<span>🔥 활동 기록</span><small>기본 접힘 · 최근 26주의 등록·활용·후기·AI 공동 개발 활동</small>';
    const body=document.createElement('div');
    body.className='reader-activity-body-v15';

    let node=title.nextElementSibling;
    while(node&&!node.classList.contains('section-title')){
      const next=node.nextElementSibling;
      body.appendChild(node);
      node=next;
    }

    title.parentNode.insertBefore(details,title);
    title.remove();
    details.append(summary,body);
  }

  function applyReaderFixV15(mode){
    if((mode||'reader')!=='reader')return;
    const root=document.getElementById('screen-my');
    if(!root)return;
    removeGitContributionV15(root);
    collapseReaderActivityV15(root);
  }

  const baseRenderMy=window.renderMy;
  if(typeof baseRenderMy==='function'){
    window.renderMy=function(mode){
      const resolved=mode||'reader';
      const result=baseRenderMy.apply(this,arguments);
      applyReaderFixV15(resolved);
      return result;
    };
  }

  window.renderMyIn=function(mode){
    return window.renderMy(mode||'reader');
  };

  if(window.state&&state.screen==='my'){
    const active=document.querySelector('.asset-vault-tabs button.active');
    if(!active||/가져온 자산/.test(active.textContent||''))applyReaderFixV15('reader');
  }
})();