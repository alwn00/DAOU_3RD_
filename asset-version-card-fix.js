(function(){
'use strict';
if(window.__DAOU_CARD_VERSION_FIX__)return;window.__DAOU_CARD_VERSION_FIX__=1;
function db(){try{return JSON.parse(localStorage.getItem('daou-v21')||'{}')}catch(_){return {}}}
function version(id){const d=db(),list=(d.versions||{})[id];if(list&&list.length)return list[list.length-1].name;const a=typeof byId==='function'?byId(Number(id)):null;return a&&a.ver?a.ver:'v1.0'}
function assetId(el){const raw=(el.getAttribute('onclick')||'')+[...el.querySelectorAll('[onclick]')].map(x=>x.getAttribute('onclick')||'').join(' '),m=raw.match(/nav\(['"]detail['"]\s*,\s*(\d+)/);return m?Number(m[1]):null}
function apply(root=document){root.querySelectorAll('.asset-card,.vault-card,.vault-row,.edu-card,.compact-asset-row').forEach(card=>{const id=assetId(card);if(!id)return;const title=card.querySelector('h3,.vr-title,.vc-title,.nm,.ttl');if(title&&!title.querySelector('.v21-badge'))title.insertAdjacentHTML('beforeend','<span class="v21-badge">'+version(id)+'</span>')})}
const home=window.renderHome;if(typeof home==='function')window.renderHome=function(){const r=home.apply(this,arguments);apply(document.getElementById('screen-home'));return r};
const my=window.renderMy;if(typeof my==='function')window.renderMy=function(){const r=my.apply(this,arguments);apply(document.getElementById('screen-my'));return r};
const assets=window.renderAssetsV8;if(typeof assets==='function')window.renderAssetsV8=function(){const r=assets.apply(this,arguments);apply(document.getElementById('screen-assets'));return r};
const navBase=window.nav;if(typeof navBase==='function')window.nav=function(){const r=navBase.apply(this,arguments);setTimeout(()=>apply(document),0);return r};
apply(document);
})();