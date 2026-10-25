(function(G){
'use strict';
const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const keyed=a=>Array.isArray(a)&&a.every(v=>v&&typeof v==='object'&&typeof v.id==='string');
// ID-based patches preserve inherited desktop edits and independent device layouts.
function diff(base,next){
 if(equal(base,next))return undefined;
 if(keyed(base)&&keyed(next)){
  const old=new Map(base.map(x=>[x.id,x])),items={},added={};
  for(const value of next){if(old.has(value.id)){const d=diff(old.get(value.id),value);if(d!==undefined)items[value.id]=d;}else added[value.id]=clone(value);}
  const removed=base.filter(x=>!next.some(y=>y.id===x.id)).map(x=>x.id);
  const result={$array:true,items,added,removed};
  if(!equal(base.map(x=>x.id),next.map(x=>x.id)))result.order=next.map(x=>x.id);
  return result;
 }
 if(base&&next&&typeof base==='object'&&typeof next==='object'&&!Array.isArray(base)&&!Array.isArray(next)){
  const values={},removed=[];for(const key of Object.keys(base))if(!(key in next))removed.push(key);
  for(const key of Object.keys(next)){const d=diff(base[key],next[key]);if(d!==undefined)values[key]=d;}
  return {$object:true,values,removed};
 }
 return {$value:clone(next)};
}
function apply(base,patch){
 if(!patch)return clone(base);
 if('$value'in patch)return clone(patch.$value);
 if(patch.$array){const result=(Array.isArray(base)?base:[]).filter(x=>!patch.removed.includes(x.id)).map(x=>apply(x,patch.items[x.id]));for(const [id,value]of Object.entries(patch.added))if(!result.some(x=>x.id===id))result.push(clone(value));if(patch.order){const map=new Map(result.map(x=>[x.id,x]));return [...patch.order.map(id=>map.get(id)).filter(Boolean),...result.filter(x=>!patch.order.includes(x.id))];}return result;}
 const result=clone(base)||{};for(const key of patch.removed||[])delete result[key];for(const [key,value]of Object.entries(patch.values||{})){if(['__proto__','constructor','prototype'].includes(key))continue;result[key]=apply(result[key],value);}return result;
}
function resolve(data,device='desktop'){const base=clone(data);delete base.deviceOverrides;return device==='desktop'?base:apply(base,data.deviceOverrides?.[device]);}
function device(width){return width<=600?'mobile':width<=1024?'tablet':'desktop';}
function equalRatios(count){const n=Math.min(4,Math.max(2,Math.round(count)));return Array.from({length:n},(_,i)=>i===n-1?100-Math.round(100/n*1000)/1000*(n-1):Math.round(100/n*1000)/1000);}
function boundary(ratios,index,value,min=5){const out=ratios.slice(),before=out.slice(0,index).reduce((a,b)=>a+b,0),pair=out[index]+out[index+1],local=Math.min(pair-min,Math.max(min,value-before));out[index]=Math.round(local*1000)/1000;out[index+1]=Math.round((pair-out[index])*1000)/1000;return out;}
function replacePaths(value,from,to){if(!value||typeof value!=='object')return;for(const key of Object.keys(value)){if(typeof value[key]==='string'&&(value[key]===from||value[key]==='./'+from||value[key].startsWith(from+'?')||value[key].startsWith(from+'#')||value[key].startsWith('./'+from+'?')||value[key].startsWith('./'+from+'#'))){const prefix=value[key].startsWith('./')?'./':'';value[key]=prefix+to+value[key].slice(prefix.length+from.length);}else if(value[key]&&typeof value[key]==='object')replacePaths(value[key],from,to);}}
const api={clone,diff,apply,resolve,device,equalRatios,boundary,replacePaths};G.CraftLayout=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
