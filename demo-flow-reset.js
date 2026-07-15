/* Reset the 6-minute receipt demo before every run */
(function(){
  'use strict';

  const DEMO_TITLE='출장 영수증 자동 분류 Web App';
  const baseStart=window.startReceiptDemoV14;
  if(typeof baseStart!=='function')return;

  function removeWhere(list,predicate){
    if(!Array.isArray(list))return;
    for(let i=list.length-1;i>=0;i--){
      if(predicate(list[i]))list.splice(i,1);
    }
  }

  window.startReceiptDemoV14=function(){
    const flow=state.demoReceiptFlowV14||(state.demoReceiptFlowV14={});
    Object.assign(flow,{
      active:false,
      step:1,
      requestCreated:false,
      workflowAgreed:false,
      submitted:false,
      policyApproved:false,
      techValidated:false,
      published:false,
      used:false,
      improvement:false,
      wantCount:11,
      history:[]
    });

    state.assetQuery='';
    state.assetDeptV14='all';
    state.assetTypeV14='all';
    state.assetTool='all';
    if(state.regDraft&&state.regDraft.title===DEMO_TITLE)state.regDraft={};

    if(typeof ASSETS!=='undefined')removeWhere(ASSETS,a=>a&&(a.demoReceiptV14||a.title===DEMO_TITLE));
    if(typeof WISHES!=='undefined')removeWhere(WISHES,w=>w&&w.demoV14);
    if(typeof REVIEW_QUEUE!=='undefined')removeWhere(REVIEW_QUEUE,r=>r&&r.title===DEMO_TITLE);
    if(typeof TECH_QUEUE!=='undefined')removeWhere(TECH_QUEUE,t=>t&&t.title===DEMO_TITLE);

    document.querySelectorAll('.demo-request-v14,.demo-reg-banner-v14,.demo-admin-v14,.demo-coach-v14').forEach(el=>el.remove());
    try{if(typeof savePersistentStateV7==='function')savePersistentStateV7(false);}catch(e){}
    return baseStart.apply(this,arguments);
  };

  const launch=document.querySelector('.demo-launch-v14');
  if(launch)launch.onclick=window.startReceiptDemoV14;
})();