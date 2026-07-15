/* Final my-assets layout: reader card/list switch, reader aquarium, creator score order */
(function(){
  'use strict';
  if(window.__DAOU_MY_ASSETS_LAYOUT_FIX__)return;
  window.__DAOU_MY_ASSETS_LAYOUT_FIX__=true;

  const style=document.createElement('style');
  style.textContent=`
    .reader-view-toolbar-v17{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:10px 12px;background:#fff;border:1px solid var(--line);border-radius:6px}
    .reader-view-toolbar-v17 .label{font-size:.76rem;color:var(--ink-soft);font-weight:750}
    .reader-view-switch-v17{display:flex;align-items:center;border:1px solid var(--line);border-radius:5px;overflow:hidden;background:#fff}
    .reader-view-switch-v17 button{border:0;border-right:1px solid var(--line);padding:7px 11px;background:#fff;color:var(--ink-soft);font-size:.72rem;font-weight:800}
    .reader-view-switch-v17 button:last-child{border-right:0}
    .reader-view-switch-v17 button.on{background:var(--gw-blue);color:#fff}
    .reader-hidden-v17{display:none!important}
    .reader-card-actions-v17{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:11px;padding-top:11px;border-top:1px solid var(--line-soft)}
    .reader-card-actions-v17 button{padding:8px 9px;font-size:.72rem;border-radius:4px}
    #ms-ring-host.creator-score-top-v17{margin-top:14px;margin-bottom:14px}
    @media(max-width:620px){.reader-view-toolbar-v17{align-items:flex-start;flex-direction:column}.reader-card-actions-v17{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function persistV17(){
    try{if(typeof savePersistentStateV7==='function')savePersistentStateV7(false);}catch(e){}
  }

  function removeSectionV17(root,pattern){
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

  function ensureReaderActivityV17(root){
    root.querySelectorAll('.grass-wrap').forEach(el=>el.remove());

    let details=root.querySelector('.reader-activity-toggle-v16,.reader-activity-toggle-v17');
    const title=[...root.querySelectorAll('.section-title')].find(el=>/활동 기록/.test((el.textContent||'').trim()));
    const log=root.querySelector('.commitlog');

    if(details){
      details.querySelectorAll('.grass-wrap').forEach(el=>el.remove());
      if(title)title.remove();
      return;
    }
    if(!log){
      if(title)title.remove();
      return;
    }

    details=document.createElement('details');
    details.className='reader-activity-toggle-v16 reader-activity-toggle-v17';
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

  function assetIdFromCardV17(card){
    const raw=card.getAttribute('onclick')||'';
    const match=raw.match(/nav\(['\"]detail['\"]\s*,\s*(\d+)/);
    return match?Number(match[1]):null;
  }

  function addReaderCardActionsV17(root){
    root.querySelectorAll('.vault-grid .vault-card').forEach(card=>{
      if(card.querySelector('.reader-card-actions-v17'))return;
      const id=assetIdFromCardV17(card);
      if(!id)return;
      const actions=document.createElement('div');
      actions.className='reader-card-actions-v17';
      actions.innerHTML='<button type="button" class="btn btn-secondary" onclick="openReaderAssetV17('+id+',event)">다시 열기</button>'
        +'<button type="button" class="btn btn-ghost" onclick="openReaderReviewV17('+id+',event)">후기 남기기</button>';
      card.appendChild(actions);
    });

    root.querySelectorAll('.vault-list .vault-row').forEach(row=>{
      const buttons=row.querySelectorAll('.vr-actions button');
      if(buttons[0])buttons[0].textContent='다시 열기';
      if(buttons[1])buttons[1].textContent='후기 남기기';
    });
  }

  function applyReaderViewV17(root){
    const view=state.readerAssetViewV17==='list'?'list':'card';
    const grid=root.querySelector('.vault-grid');
    const list=root.querySelector('.vault-list');
    if(grid)grid.classList.toggle('reader-hidden-v17',view!=='card');
    if(list)list.classList.toggle('reader-hidden-v17',view!=='list');
    root.querySelectorAll('.reader-view-switch-v17 button').forEach(btn=>btn.classList.toggle('on',btn.dataset.view===view));
  }

  function ensureReaderViewV17(root){
    const grid=root.querySelector('.vault-grid');
    const list=root.querySelector('.vault-list');
    if(!grid&&!list)return;

    let toolbar=root.querySelector('.reader-view-toolbar-v17');
    if(!toolbar){
      const title=[...root.querySelectorAll('.section-title')].find(el=>/가져온 AI 자산/.test((el.textContent||'').trim()));
      toolbar=document.createElement('div');
      toolbar.className='reader-view-toolbar-v17';
      toolbar.innerHTML='<span class="label">보기 방식</span><div class="reader-view-switch-v17">'
        +'<button type="button" data-view="card" onclick="setReaderAssetViewV17(\'card\')">▦ 카드 보기</button>'
        +'<button type="button" data-view="list" onclick="setReaderAssetViewV17(\'list\')">☷ 목록 보기</button></div>';
      if(title)title.insertAdjacentElement('afterend',toolbar);
      else (grid||list).parentNode.insertBefore(toolbar,grid||list);
    }
    addReaderCardActionsV17(root);
    applyReaderViewV17(root);
  }

  function applyReaderLayoutV17(root){
    const ring=root.querySelector('#ms-ring-host');
    if(ring)ring.remove();
    root.querySelectorAll('.grass-wrap').forEach(el=>el.remove());
    ensureReaderActivityV17(root);
    ensureReaderViewV17(root);
  }

  function applyCreatorLayoutV17(root){
    const head=root.querySelector('.asset-vault-head');
    const ring=root.querySelector('#ms-ring-host');
    if(head&&ring){
      ring.classList.add('creator-score-top-v17');
      head.insertAdjacentElement('afterend',ring);
    }
    removeSectionV17(root,/활동 어항/);
  }

  function applyMyAssetsLayoutV17(mode){
    const root=document.getElementById('screen-my');
    if(!root)return;
    if((mode||'reader')==='creator')applyCreatorLayoutV17(root);
    else applyReaderLayoutV17(root);
  }

  window.setReaderAssetViewV17=function(view){
    state.readerAssetViewV17=view==='list'?'list':'card';
    const root=document.getElementById('screen-my');
    if(root)applyReaderViewV17(root);
    persistV17();
  };

  window.openReaderAssetV17=function(id,event){
    if(event){event.preventDefault();event.stopPropagation();}
    if(typeof openBorrowed==='function')openBorrowed(id);
    else if(typeof nav==='function')nav('detail',id);
  };

  window.openReaderReviewV17=function(id,event){
    if(event){event.preventDefault();event.stopPropagation();}
    if(typeof nav!=='function')return;
    nav('detail',id);
    setTimeout(()=>{
      const root=document.getElementById('screen-detail');
      if(!root)return;
      const target=[...root.querySelectorAll('button,a')].find(el=>/후기|리뷰/.test((el.textContent||'').trim())&&/남기|작성|등록/.test((el.textContent||'').trim()));
      if(target)target.click();
      else if(typeof toast==='function')toast('자산 상세 화면에서 사용 후기를 남길 수 있습니다.');
    },80);
  };

  const baseRenderMy=window.renderMy;
  if(typeof baseRenderMy==='function'){
    window.renderMy=function(mode){
      const resolved=mode||'reader';
      const result=baseRenderMy.apply(this,arguments);
      applyMyAssetsLayoutV17(resolved);
      return result;
    };
  }

  window.renderMyIn=function(mode){
    return window.renderMy(mode||'reader');
  };

  if(window.state&&state.screen==='my'){
    const active=document.querySelector('.asset-vault-tabs button.active');
    applyMyAssetsLayoutV17(active&&/내가 만든 자산/.test(active.textContent||'')?'creator':'reader');
  }
})();