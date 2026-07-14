/* Keep older registration drafts compatible with the simplified flow. */
(function(){
  'use strict';
  function normalizeDraft(){
    const d=state.regDraft;if(!d)return;
    if(!d.tool){
      d.tool=d.type==='prompt'?'prompt':d.type==='auto'?'automation':d.type==='space'?'webapp':'gemini';
    }
    if(!d.pf){
      d.pf=d.tool==='copilot'?'COPILOT':/^claude|artifact|webapp|automation$/.test(d.tool)?'CLAUDE':'GEMINI';
    }
    if(!d.baseModel){
      d.baseModel=d.pf==='COPILOT'?'GPT-4o (Copilot)':d.pf==='CLAUDE'?'Claude 3.5 Sonnet':'Gemini 2.5 Pro';
    }
    d.toolFields=d.toolFields||{};
  }
  const baseRenderRegisterV11=renderRegister;
  renderRegister=function(){
    normalizeDraft();
    baseRenderRegisterV11();
    const pill=document.querySelector('#screen-register .reg-head-v11 .pill');
    if(pill)pill.textContent='3단계 등록';
  };
  if(state.screen==='register')renderRegister();
})();
