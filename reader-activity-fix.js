/* Reader asset tab: hide score, remove grass, collapse activity logs */
(function(){
  'use strict';
  if(window.__DAOU_READER_ACTIVITY_FIX__)return;
  window.__DAOU_READER_ACTIVITY_FIX__=true;

  const style=document.createElement('style');
  style.textContent=`
    .reader-activity-toggle-v16{margin-top:28px;border:1px solid var(--line);border-radius:7px;background:#fff;box-shadow:var(--shadow);overflow:hidden}
    .reader-activity-toggle-v16>summary{list-style:none;cursor:pointer;padding:15px 17px;display:flex;align-items:center;gap:9px;font-size:.94rem;font-weight:850;color:var(--ink);user-select:none}
    .reader-activity-toggle-v16>summary::-webkit-details-marker{display:none}
    .reader-activity-toggle-v16>summary::before{content:'▸';color:var(--gw-blue);font-size:.9rem;transition:transform .15s ease}
    .reader-activity-toggle-v16[open]>summary::before{transform:rotate(90deg)}
    .reader-activity-toggle-v16>summary small{font-size:.72rem;font-weight:500;color:var(--ink-faint)}
    .reader-activity-toggle-v16[open]>summary{border-bottom:1px solid var(--line-soft);background:#fbfcfe}
    .reader-activity-body-v16{padding:14px 16px 16px}
    .reader-activity-body-v16>.commitlog{margin-top:0!important;border:0;box-shadow:none}
  `;
  document.head.appendChild(style);

  function removeReaderOnlyBlocksV16(root){
    const ring=root.querySelector('#ms-ring-host');
    if(ring)ring.remove();

    root.querySelectorAll('.grass-wrap').forEach(el=>el.remove());

    const exact=[...root.querySelectorAll('*')].filter(el=>{
      const own=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.nodeValue||'').join(' ');
      return /GIT\s*CONTRIBUTION/i.test(own);
    });
    exact.forEach(el=>{
      const target=el.closest('[data-git-contribution],.git-contribution,.contribution-ring,.card,.widget,section')||el;
      if(target!==root)target.remove();
    });
  }

  function collapseReaderLogsV16(root){
    if(root.querySelector('.reader-activity-toggle-v16'))return;

    const title=[...root.querySelectorAll('.section-title')].find(el=>/활동 기록/.test((el.textContent||'').trim()));
    const log=root.querySelector('.commitlog');

    if(!log){
      if(title)title.remove();
      return;
    }

    const details=document.createElement('details');
    details.className='reader-activity-toggle-v16';

    const summary=document.createElement('summary');
    summary.innerHTML='<span>🔥 활동 기록</span><small>기본 접힘 · 최근 활동 로그</small>';

    const body=document.createElement('div');
    body.className='reader-activity-body-v16';

    const anchor=title||log;
    anchor.parentNode.insertBefore(details,anchor);
    if(title)title.remove();
    body.appendChild(log);
    details.append(summary,body);
  }

  function applyReaderFixV16(mode){
    if((mode||'reader')!=='reader')return;
    const root=document.getElementById('screen-my');
    if(!root)return;
    removeReaderOnlyBlocksV16(root);
    collapseReaderLogsV16(root);
  }

  const baseRenderMy=window.renderMy;
  if(typeof baseRenderMy==='function'){
    window.renderMy=function(mode){
      const resolved=mode||'reader';
      const result=baseRenderMy.apply(this,arguments);
      applyReaderFixV16(resolved);
      return result;
    };
  }

  window.renderMyIn=function(mode){
    return window.renderMy(mode||'reader');
  };

  if(window.state&&state.screen==='my'){
    const active=document.querySelector('.asset-vault-tabs button.active');
    if(!active||/가져온 자산/.test(active.textContent||''))applyReaderFixV16('reader');
  }
})();