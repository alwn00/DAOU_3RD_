/* Keep demo-only panels out of normal navigation */
(function(){
  'use strict';
  function cleanupDemoPanelsV14(){
    const f=state.demoReceiptFlowV14||{};
    const requestVisible=!!(f.active||f.requestCreated);
    if(!requestVisible)document.querySelectorAll('.demo-request-v14').forEach(el=>el.remove());

    const isDemoRegistration=!!(state.regDraft&&state.regDraft.title==='출장 영수증 자동 분류 Web App');
    if(!isDemoRegistration)document.querySelectorAll('.demo-reg-banner-v14').forEach(el=>el.remove());

    const reviewVisible=!!((f.active&&f.step===5)||f.submitted||f.policyApproved||f.techValidated||f.published);
    if(!reviewVisible)document.querySelectorAll('.demo-admin-v14').forEach(el=>el.remove());
  }

  ['nav','renderRegister','renderAdmin','renderWish'].forEach(name=>{
    const base=window[name];
    if(typeof base!=='function')return;
    window[name]=function(){
      const result=base.apply(this,arguments);
      setTimeout(cleanupDemoPanelsV14,0);
      return result;
    };
  });

  cleanupDemoPanelsV14();
})();
