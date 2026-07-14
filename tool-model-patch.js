/* Tool/model metadata refinement — record the actual creation environment without subscription-plan policy */
(function(){
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    .tool-model-card-v12{padding:17px 20px;margin-top:12px;border-left:3px solid var(--gw-blue)}
    .tool-model-card-v12 h3{font-size:1rem;margin-bottom:4px}
    .tool-model-card-v12 .tm-desc{font-size:.75rem;color:var(--ink-faint);margin-bottom:12px}
    .tool-model-grid-v12{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .tool-model-item-v12{padding:12px 13px;background:var(--paper);border:1px solid var(--line);border-radius:5px}
    .tool-model-item-v12 .label{font-size:.7rem;color:var(--ink-faint);font-weight:800;margin-bottom:5px}
    .tool-model-item-v12 .value{font-size:.88rem;font-weight:850;color:var(--ink)}
    .tool-model-item-v12 input{width:100%;border:1px solid var(--line);border-radius:4px;background:#fff;padding:8px 10px;color:var(--ink);font-size:.84rem}
    .tool-model-item-v12 input:focus{outline:none;border-color:var(--gw-blue);box-shadow:0 0 0 3px var(--gw-blue-tint)}
    .asset-env-v12{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:11px 14px;margin:10px 0 12px;background:var(--paper);border:1px solid var(--line);border-radius:5px;font-size:.77rem;color:var(--ink-soft)}
    .asset-env-v12 b{color:var(--ink)}
    .asset-env-v12 .sep{width:1px;height:16px;background:var(--line)}
    .model-note-v12{font-size:.7rem;color:var(--ink-faint);margin-left:auto}
    @media(max-width:650px){.tool-model-grid-v12{grid-template-columns:1fr}.model-note-v12{width:100%;margin-left:0}}
  `;
  document.head.appendChild(style);

  function toolNameV12(d){
    const map={
      gemini:'Gemini Gem',
      copilot:'Copilot Agent',
      claude_project:'Claude Project',
      claude_skill:'Claude Skill',
      artifact:'Claude Artifact',
      prompt:'프롬프트 템플릿',
      automation:'자동화·MCP',
      webapp:'Web App'
    };
    if(d&&map[d.tool])return map[d.tool];
    if(d&&d.pf==='GEMINI')return 'Gemini';
    if(d&&d.pf==='CLAUDE')return 'Claude';
    if(d&&d.pf==='COPILOT')return 'Copilot';
    return 'AI 도구';
  }

  function modelValueV12(d){
    return (d&&(d.baseModel||d.model||d.toolModel))||'';
  }

  function enhanceRegisterV12(){
    const root=document.getElementById('screen-register');
    const d=state.regDraft||{};
    if(!root||d.step!==2||root.querySelector('.tool-model-card-v12'))return;

    const selected=root.querySelector('.selected-preset-v11');
    if(!selected)return;

    const existing=document.getElementById('reg-base');
    let current=modelValueV12(d);
    if(existing&&existing.value)current=existing.value;

    const card=document.createElement('div');
    card.className='card tool-model-card-v12';
    card.innerHTML=
      '<h3>사용한 AI 도구·모델</h3>'+ 
      '<div class="tm-desc">구독 플랜이 아니라 실제 제작에 사용한 도구와 모델만 기록합니다. 사용자는 자산을 선택할 때 이 정보를 참고할 수 있습니다.</div>'+ 
      '<div class="tool-model-grid-v12">'+
        '<div class="tool-model-item-v12"><div class="label">사용 도구</div><div class="value">'+esc(toolNameV12(d))+'</div></div>'+ 
        '<div class="tool-model-item-v12"><div class="label">사용 모델</div><input id="reg-base-v12" list="model-options-v12" value="'+esc(current)+'" placeholder="예: Gemini 2.5 Pro, Claude Sonnet"><datalist id="model-options-v12"><option value="Gemini 2.5 Pro"><option value="Gemini 2.5 Flash"><option value="Claude Sonnet"><option value="Claude Opus"><option value="GPT-4o (Copilot)"><option value="기타/사내 모델"></datalist></div>'+ 
      '</div>';
    selected.insertAdjacentElement('afterend',card);

    if(existing){
      const oldRow=existing.closest('.formrow');
      if(oldRow)oldRow.style.display='none';
      existing.value=current;
    }

    const visible=document.getElementById('reg-base-v12');
    if(visible){
      visible.addEventListener('input',function(){
        d.baseModel=this.value;
        const hidden=document.getElementById('reg-base');
        if(hidden)hidden.value=this.value;
      });
    }
  }

  function enhanceReviewV12(){
    const root=document.getElementById('screen-register');
    const d=state.regDraft||{};
    if(!root||d.step!==3||root.querySelector('[data-tool-model-review-v12]'))return;
    const rows=[...root.querySelectorAll('.review-row-v11')];
    const before=rows.find(r=>(r.querySelector('b')?.textContent||'').includes('공유·실행'))||rows[rows.length-1];
    if(!before)return;
    const row=document.createElement('div');
    row.className='review-row-v11';
    row.dataset.toolModelReviewV12='true';
    row.innerHTML='<b>사용 도구·모델</b><span>'+esc(toolNameV12(d))+' · '+esc(modelValueV12(d)||'모델 미기재')+'</span>';
    before.insertAdjacentElement('beforebegin',row);
  }

  function injectAssetEnvironmentV12(id){
    const root=document.getElementById('screen-detail');
    if(!root||root.querySelector('.asset-env-v12'))return;
    const a=typeof byId==='function'?byId(Number(id)):null;
    if(!a)return;
    const head=root.querySelector('.detail-head');
    if(!head)return;
    const env=document.createElement('div');
    env.className='asset-env-v12';
    env.innerHTML='<span><b>사용 도구</b> '+esc(toolNameV12(a))+'</span><span class="sep"></span><span><b>사용 모델</b> '+esc(modelValueV12(a)||'등록 정보 없음')+'</span><span class="model-note-v12">실제 제작 환경 참고 정보</span>';
    head.insertAdjacentElement('afterend',env);
  }

  function updateGuideCopyV12(){
    const root=document.getElementById('screen-vision');
    if(!root)return;
    root.querySelectorAll('*').forEach(el=>{
      if(el.children.length)return;
      if((el.textContent||'').includes('툴별 공유 정보와 활용 예시')){
        el.textContent=el.textContent.replace('툴별 공유 정보와 활용 예시','사용한 AI 도구·모델과 활용 예시');
      }
    });
  }

  const baseRenderRegister=window.renderRegister;
  if(typeof baseRenderRegister==='function'){
    window.renderRegister=function(){
      baseRenderRegister();
      enhanceRegisterV12();
      enhanceReviewV12();
    };
  }

  const baseRenderDetail=window.renderDetail;
  if(typeof baseRenderDetail==='function'){
    window.renderDetail=function(id){
      baseRenderDetail(id);
      injectAssetEnvironmentV12(id);
    };
  }

  const baseRenderVision=window.renderVision;
  if(typeof baseRenderVision==='function'){
    window.renderVision=function(){
      baseRenderVision();
      updateGuideCopyV12();
    };
  }

  if(state.screen==='register'&&typeof renderRegister==='function')renderRegister();
  else if(state.screen==='detail'&&state.detailId&&typeof renderDetail==='function')renderDetail(state.detailId);
  else if(state.screen==='vision'&&typeof renderVision==='function')renderVision();
})();