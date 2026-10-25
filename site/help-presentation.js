/* Local answer presentation only: no model, network, or HTML interpretation. */
(function(G){
'use strict';
const terms=['Website settings','Section settings','Background layers','Edit split','Add section','Add subsection','New portfolio','Export website','Open ZIP','Save draft','Use selected component','Helper link','Instance editor','View only','Browse mode','Edit mode','Full view','No fill','Fit content','border radius','aspect ratio','Ctrl+Shift+Z','Ctrl+Z','Ctrl+Y','Ctrl+D','Ctrl+1','Shift','Inspector','Workspace','Hierarchy','Components','Assets','Split','Fit','Flexible','Infinite','Projects','Publish','Unpublish','GitHub','YouTube','Sketchfab','Desktop','Tablet','Mobile','Browse','Isolate','padding','alignment','opacity','gradient','categories','list','lists'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![\\p{L}\\p{N}_])('+terms.sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\p{L}\\p{N}_])','giu');
function segments(text){const s=String(text),result=[];let from=0;for(const m of s.matchAll(pattern)){if(m.index>from)result.push({text:s.slice(from,m.index),important:false});result.push({text:m[0],important:true});from=m.index+m[0].length;}if(from<s.length)result.push({text:s.slice(from),important:false});return result;}
function progress(length,elapsed,cps=180,maxMs=6000){const rate=Math.max(30,Math.min(500,Number(cps)||180)),duration=Math.max(1,Math.min(maxMs,length/rate*1000));return Math.min(length,Math.floor(length*Math.max(0,elapsed)/duration));}
// Injectable timing makes completion/cancellation testable without a browser.
function type({length,render,done=()=>{},cps=180,reduced=false,request=cb=>requestAnimationFrame(cb),cancel=id=>cancelAnimationFrame(id)}){
 let id=null,start=null,ended=false;
 function finish(){if(ended)return;ended=true;if(id!==null)cancel(id);render(length);done();}
 function tick(time){if(ended)return;if(start===null)start=time;const n=progress(length,time-start,cps);render(n);if(n>=length){ended=true;done();}else id=request(tick);}
 if(reduced||!length)finish();else{render(0);id=request(tick);}
 return {finish,cancel(){if(ended)return;ended=true;if(id!==null)cancel(id);}};
}
const api={segments,progress,type};G.CraftHelpPresentation=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
