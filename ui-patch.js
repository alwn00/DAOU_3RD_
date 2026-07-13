/* Home trend wording + asset tool filters */
(function(){
  'use strict';

  state.assetTool=state.assetTool||'all';

  const baseAssetCatalog=assetCatalogV8;
  assetCatalogV8=function(){
    let list=baseAssetCatalog();
    const tool=state.assetTool||'all';
    if(tool==='all')return list;
    return list.filter(a=>{
      if(tool==='WEBAPP'){
        return !!a.runtimeUrl || a.type==='space' || a.tool==='webapp' ||
          (a.tags||[]).some(t=>/웹앱|Artifact|MCP|자동화/.test(String(t)));
      }
      return a.pf===tool;
    });
  };

  window.setAssetToolV8=function(tool){
    state.assetTool=tool;
    renderAssetsV8();
    savePersistentStateV7(false);
  };

  function injectToolFilters(){
    const root=document.getElementById('screen-assets');
    if(!root || root.querySelector('.asset-tool-tabs'))return;
    const categoryTabs=root.querySelector('.discovery-tabs');
    if(!categoryTabs)return;

    const options=[
      ['all','전체 툴'],
      ['GEMINI','Gemini'],
      ['COPILOT','Copilot'],
      ['CLAUDE','Claude'],
      ['WEBAPP','웹앱·실행형']
    ];
    const bar=document.createElement('div');
    bar.className='discovery-tabs asset-tool-tabs';
    bar.style.marginTop='10px';
    bar.innerHTML='<span style="align-self:center;font-size:.82rem;font-weight:800;color:var(--ink-soft);margin-right:4px">툴별 보기</span>'+
      options.map(x=>'<button class="'+((state.assetTool||'all')===x[0]?'active':'')+'" onclick="setAssetToolV8(\''+x[0]+'\')">'+x[1]+'</button>').join('');
    categoryTabs.insertAdjacentElement('afterend',bar);
  }

  const baseRenderAssets=renderAssetsV8;
  renderAssetsV8=function(){
    baseRenderAssets();
    injectToolFilters();
  };

  function restoreRecentTrend(){
    const root=document.getElementById('screen-home');
    if(!root || root.querySelector('[data-home-recent-trend]'))return;

    const leader=[...root.querySelectorAll('section.home-section')]
      .find(section=>(section.querySelector('h3')?.textContent||'').includes('AI 활용 리더'));
    if(!leader)return;

    const radar=hot트렌드PostsV9();
    const section=document.createElement('section');
    section.className='home-section';
    section.dataset.homeRecentTrend='true';
    section.innerHTML='<div class="home-section-head"><h3>최근 AI 트렌드</h3><button onclick="nav(\'radar\')">전체 보기 →</button></div>'+
      '<div class="card home-panel">'+radar.map(p=>'<div class="hot-radar-row" onclick="nav(\'radar\')">'+
        '<div class="hr-top"><div class="hr-title">'+esc(p.title)+'</div>'+
        (p.verified?'<span class="status-chip verified">AX 검증</span>':'')+
        (p.poc?'<span class="status-chip poc">PoC 후보</span>':'')+
        '<span class="hr-score">HOT '+hot트렌드ScoreV9(p)+'</span></div>'+
        '<div class="hr-meta">'+esc(p.by)+' · 댓글 '+(p.commentList||[]).length+' · 수정 제안 '+(p.suggestions||[]).length+'</div>'+
        '<div class="hr-body">'+esc(p.body)+'</div></div>').join('')+'</div>';

    const row=document.createElement('div');
    row.className='home-two-col';
    leader.parentNode.insertBefore(row,leader);
    row.append(section,leader);
  }

  const baseRenderHome=renderHome;
  renderHome=function(){
    baseRenderHome();
    restoreRecentTrend();
  };

  if(state.screen==='assets')renderAssetsV8();
  else if(state.screen==='home')renderHome();
})();
