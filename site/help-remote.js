/* Cloudflare is called only by our same-origin backend; no provider keys in the browser. */
(function(G){
'use strict';
function create({apiBase='/api/help',fetchImpl=(...args)=>fetch(...args)}={}){
 // Disallow configuring an external destination for visitors' questions.
 if(!/^\/api\/[a-z0-9/-]+$/i.test(apiBase)||apiBase.includes('//'))throw Error('Help API must be a local API path.');
 let state=null;
 async function request(path,options={}){let r;try{r=await fetchImpl(apiBase+path,{credentials:'same-origin',cache:'no-store',...options});}catch(e){if(e.name==='AbortError')throw e;throw Object.assign(Error('unavailable'),{code:'unavailable'});}let data;try{data=await r.json();}catch{throw Object.assign(Error('unavailable'),{code:'unavailable'});}if(!r.ok)throw Object.assign(Error(data.code||'unavailable'),{code:data.code||'unavailable',retryAt:data.retryAt});return data;}
 async function status(signal){state=await request('/status',{signal});return state;}
 async function ask(payload,signal){if(!state?.csrf)await status(signal);if(!state?.configured)throw Object.assign(Error('not_configured'),{code:'not_configured'});const send=()=>request('/chat',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify(payload),signal});try{return await send();}catch(e){if(e.code!=='session_expired')throw e;await status(signal);return send();}}
 return {status,ask,reset(){state=null;}};
}
function availabilityMessage(error,locale,zone,now=Date.now()){
 if(error.code==='temporarily_unavailable'&&error.retryAt){const d=new Date(error.retryAt);if(Number.isFinite(d.getTime())&&d.getTime()>now){const when=new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short',...(zone?{timeZone:zone}:{})}).format(d);return `Chat is temporarily unavailable. Please try again on ${when}${zone?' ('+zone+')':' (your local time)'}. You can still use the built-in guides.`;}}
 if(error.code==='not_configured')return 'AI chat is not connected yet. You can still use the built-in guides.';
 if(error.code==='busy')return 'Chat is temporarily busy. Please try again shortly, or use the built-in guides.';
 return 'Chat is temporarily unavailable. Please try again shortly. You can still use the built-in guides.';
}
const api={create,availabilityMessage};G.CraftHelpRemote=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
