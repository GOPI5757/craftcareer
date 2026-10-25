/* Local answer presentation only: no model, network, or HTML interpretation. */
(function(G){
'use strict';
const terms=['Website settings','Section settings','Background layers','Edit split','Add section','Add subsection','New portfolio','Export website','Open ZIP','Save draft','Use selected component','Helper link','Instance editor','View only','Browse mode','Edit mode','Full view','No fill','Fit content','border radius','aspect ratio','Ctrl+Shift+Z','Ctrl+Z','Ctrl+Y','Ctrl+D','Ctrl+1','Shift','Inspector','Workspace','Hierarchy','Components','Assets','Split','Fit','Flexible','Infinite','Projects','Publish','Unpublish','GitHub','YouTube','Sketchfab','Desktop','Tablet','Mobile','Browse','Isolate','padding','alignment','opacity','gradient','categories','list','lists'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![\\p{L}\\p{N}_])('+terms.sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\p{L}\\p{N}_])','giu');
function keywords(text){const s=String(text),result=[];let from=0;for(const m of s.matchAll(pattern)){if(m.index>from)result.push({text:s.slice(from,m.index),important:false});result.push({text:m[0],important:true});from=m.index+m[0].length;}if(from<s.length)result.push({text:s.slice(from),important:false});return result;}
function segments(text){const s=String(text),parts=[];let end=0;for(const m of s.matchAll(/\*\*([^*\n]{1,100})\*\*/g)){parts.push(...keywords(s.slice(end,m.index)));parts.push({text:m[1],important:true});end=m.index+m[0].length;}parts.push(...keywords(s.slice(end)));return parts;}
function progress(length,elapsed,cps=180,maxMs=6000){const rate=Math.max(30,Math.min(500,Number(cps)||180)),duration=Math.max(1,Math.min(maxMs,length/rate*1000));return Math.min(length,Math.floor(length*Math.max(0,elapsed)/duration));}
// Injectable timing makes completion/cancellation testable without a browser.
function type({length,render,done=()=>{},cps=180,reduced=false,request=cb=>requestAnimationFrame(cb),cancel=id=>cancelAnimationFrame(id)}){
 let id=null,start=null,ended=false;
 function finish(){if(ended)return;ended=true;if(id!==null)cancel(id);render(length);done();}
 function tick(time){if(ended)return;if(start===null)start=time;const n=progress(length,time-start,cps);render(n);if(n>=length){ended=true;done();}else id=request(tick);}
 if(reduced||!length)finish();else{render(0);id=request(tick);}
 return {finish,cancel(){if(ended)return;ended=true;if(id!==null)cancel(id);}};
}
function followScroll(element,{request=cb=>requestAnimationFrame(cb),cancel=id=>cancelAnimationFrame(id),reduced=()=>false}={}){
 let following=false,frame=null,intro=null,lastTime=null,written=element.scrollTop,settle=null;
 const end=()=>Math.max(0,element.scrollHeight-element.clientHeight);
 const resolve=()=>{const done=settle;settle=null;done?.();};
 function pause(){following=false;if(frame!==null)cancel(frame);frame=null;intro=null;lastTime=null;resolve();}
 function write(value){element.scrollTop=value;written=element.scrollTop;}
 function tick(time){frame=null;if(!following)return;const target=end();
  if(reduced()){write(target);intro=null;resolve();return;}
  if(intro){if(intro.time===null)intro.time=time;const t=Math.min(1,(time-intro.time)/280);write(intro.from+(target-intro.from)*(1-Math.pow(1-t,3)));if(t===1){intro=null;resolve();}}
  else{const delta=Math.min(64,Math.max(1,lastTime===null?16:time-lastTime));const value=element.scrollTop+(target-element.scrollTop)*(1-Math.exp(-delta/55));write(Math.abs(target-value)<.75?target:value);}
  lastTime=time;if(intro||Math.abs(end()-element.scrollTop)>.75)update();
 }
 function update(){if(following&&frame===null)frame=request(tick);}
 function resume(){pause();following=true;written=element.scrollTop;intro={from:element.scrollTop,time:null};const ready=new Promise(r=>settle=r);if(reduced()){write(end());intro=null;resolve();}else update();return ready;}
 function scrolled(){if(following&&Math.abs(element.scrollTop-Math.min(written,end()))>2)pause();}
 return {resume,pause,update,scrolled,get following(){return following;}};
}
const api={segments,progress,type,followScroll};G.CraftHelpPresentation=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
