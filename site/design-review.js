/* Conservative visual proposals. A proposal is never a classification until answered. */
(function(G){
'use strict';
const D=G.CraftDesign||(typeof require!=='undefined'?require('./design-engine.js'):null);
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
const union=rs=>{const x=Math.min(...rs.map(r=>r.x)),y=Math.min(...rs.map(r=>r.y));return {x,y,w:Math.max(...rs.map(r=>r.x+r.w))-x,h:Math.max(...rs.map(r=>r.y+r.h))-y};};
function parts(image,predicate,bridge=false){const {width:W,height:H,data}=image,mask=new Uint8Array(W*H),result=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)mask[y*W+x]=predicate(x,y,data,(y*W+x)*4)?1:0;
 if(bridge){const original=mask.slice();for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){const i=y*W+x;if(mask[i])continue;const horizontal=[1,2,3].some(d=>original[i-d])&&[1,2,3].some(d=>original[i+d]),vertical=[1,2,3].some(d=>original[i-W*d])&&[1,2,3].some(d=>original[i+W*d]);if(horizontal||vertical)mask[i]=1;}}
 for(let n=0;n<mask.length;n++){if(!mask[n])continue;mask[n]=0;const queue=[n];let x0=W,y0=H,x1=0,y1=0;for(let q=0;q<queue.length;q++){const i=queue[q],x=i%W,y=Math.floor(i/W);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,k=yy*W+xx;if(xx>=0&&xx<W&&yy>=0&&yy<H&&mask[k]){mask[k]=0;queue.push(k);}}}if(queue.length>=5)result.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,n:queue.length});}
 return result;
}
function outlines(image){
 const W=image.width,H=image.height,d=image.data,mask=new Uint8Array(W*H),runs=[];
 const lum=(x,y)=>{const i=(y*W+x)*4;return (d[i]+d[i+1]+d[i+2])/3;};
 for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=(y*W+x)*4,hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]),v=lum(x,y);if(hi-lo<38&&Math.max(v-Math.min(lum(x-2,y),lum(x+2,y)),Math.max(lum(x-2,y),lum(x+2,y))-v)>10)mask[y*W+x]=1;}
 // Straight parallel sides survive textured backgrounds that would join a whole contour.
 for(let x=2;x<W-2;x++){let start=-1,last=-1,count=0;const finish=()=>{const h=last-start+1;if(start>=0&&h>=W*.012&&h<=W*.09&&count/h>.7)runs.push({x,y:start,h});};for(let y=2;y<H;y++){if(mask[y*W+x]){if(start<0)start=y;last=y;count++;}else if(start>=0&&y-last>2){finish();start=-1;count=0;}}finish();}
 const found=[];
 for(let i=0;i<runs.length;i++){const a=runs[i];for(let j=i+1;j<runs.length;j++){const b=runs[j],width=b.x-a.x;if(width>W*.09)break;if(width<W*.016||Math.abs(a.y-b.y)>Math.max(4,a.h*.25)||Math.min(a.h,b.h)/Math.max(a.h,b.h)<.65||width/a.h<.65||width/a.h>2.1)continue;
   const mid=(a.y+a.h/2+b.y+b.h/2)/2,guessH=Math.max(width,(a.h+b.h)/2),x0=a.x,x1=b.x;let bestTop=null,bestBottom=null;
   const score=y=>{if(y<2||y>=H-2)return 0;let sum=0,total=0;for(let x=Math.ceil(x0+width*.2);x<x1-width*.2;x++){total++;const v=lum(x,y);if(Math.max(v-Math.min(lum(x,y-2),lum(x,y+2)),Math.max(lum(x,y-2),lum(x,y+2))-v)>8)sum++;}return sum/Math.max(1,total);};
   for(let y=Math.round(mid-guessH*.7);y<=mid-guessH*.25;y++){const value=score(y);if(!bestTop||value>bestTop.score)bestTop={y,score:value};}
   for(let y=Math.round(mid+guessH*.25);y<=mid+guessH*.7;y++){const value=score(y);if(!bestBottom||value>bestBottom.score)bestBottom={y,score:value};}
   if(bestTop?.score<.6||bestBottom?.score<.6)continue;const height=bestBottom.y-bestTop.y;if(width/height<.65||width/height>1.6)continue;
   const r={x:Math.max(0,x0-2)/W,y:Math.max(0,bestTop.y-2)/H,w:(width+4)/W,h:(height+4)/H,score:bestTop.score+bestBottom.score};found.push(r);
 }}
 const picked=[];for(const r of found.sort((a,b)=>b.score-a.score)){if(!picked.some(p=>overlap(p,r)>Math.min(p.w*p.h,r.w*r.h)*.4))picked.push(r);}return picked.slice(0,24).map(({score,...r})=>r);
}
function topBand(image){const W=image.width,H=image.height,p=D.pixels(image),bg=p.dominant(0,0,W,Math.max(2,H*.025));let bottom=0;
 for(let y=0;y<Math.min(H*.22,W*.2);y+=2){let same=0;for(let x=0;x<W;x+=8){const c=p.at(x,y);if(Math.hypot(...c.map((v,i)=>v-bg[i]))<38)same++;}if(same/Math.ceil(W/8)<.78){if(y>H*.025){bottom=y;break;}}}
 return bottom>H*.025?{x:0,y:0,w:1,h:bottom/H,color:'#'+bg.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')}:null;
}
function propose(raw,image){let plan=D.normalize(raw),questions=[];const band=topBand(image),W=image.width,H=image.height;
 const add=(kind,label,candidates,options)=>{if(!candidates.length||questions.length>=38)return;questions.push({id:'review-'+(questions.length+1),kind,label,box:union(candidates),candidates:structuredClone(candidates),options,answer:''});};
 const buttonOptions=[['buttons','Clickable buttons'],['images','Images / logos'],['background','Background decoration'],['omit','Leave out']];
 if(band){
  const top=plan.regions.filter(r=>['text','button'].includes(r.type)&&r.y+r.h/2<band.h),groups=[];
  for(const r of top.sort((a,b)=>a.x-b.x)){let group=groups.at(-1);if(group&&r.x-(group.at(-1).x+group.at(-1).w)<.13&&Math.abs(r.y-group[0].y)<.025)group.push(r);else groups.push([r]);}
  const nav=groups.filter(g=>g.length>=2).flat();if(nav.length){add('navigation','Are these links a navigation bar?',nav,[['navigation','Navigation bar'],['text','Ordinary text'],['background','Part of the background']]);questions.at(-1).band=band;}
  // Preserve a visual logo as an image instead of stretching a whole header screenshot.
  const bg=band.color.match(/\w\w/g).map(c=>parseInt(c,16));const fg=parts(image,(x,y,d,i)=>y/H<band.h&&Math.hypot(d[i]-bg[0],d[i+1]-bg[1],d[i+2]-bg[2])>48).filter(r=>r.h>=4&&r.w>=2&&r.w<W*.35);
  let clusters=[];for(const p of fg.sort((a,b)=>a.x-b.x)){const r={x:p.x/W,y:p.y/H,w:p.w/W,h:p.h/H},old=clusters.find(c=>r.x-c.x-c.w<.023&&r.x>=c.x&&Math.min(r.y+r.h,c.y+c.h)-Math.max(r.y,c.y)>-.005);if(old)Object.assign(old,union([old,r]));else clusters.push(r);}
  for(const r of clusters){if(r.w<.02||r.h<.008||nav.some(t=>overlap(t,r)>t.w*t.h*.3))continue;const rs=top.filter(t=>overlap(t,r)>t.w*t.h*.3);add('mark','How should this header mark behave?',[{...r,type:'image',text:rs.map(t=>t.text).join(' ')||'Header mark',visual:'crop'}],buttonOptions);}
 }
 const known=questions.flatMap(q=>q.candidates),icons=outlines(image).filter(r=>!known.some(k=>overlap(r,k)>r.w*r.h*.25)&&!plan.regions.some(t=>t.type==='text'&&t.text.length>3&&overlap(t,r)>r.w*r.h*.5));
 const clusters=[];for(const r of icons.sort((a,b)=>a.y-b.y||a.x-b.x)){const g=clusters.find(g=>g.some(k=>(Math.abs((k.y+k.h/2)-(r.y+r.h/2))<Math.max(k.h,r.h)*.55&&Math.abs(k.x-r.x)<Math.max(k.w,r.w)*4)||(Math.abs(k.x-r.x)<Math.max(k.w,r.w)*.55&&Math.abs(k.y-r.y)<Math.max(k.h,r.h)*4)));if(g)g.push(r);else clusters.push([r]);}
 // Details contained in a detected picture are reviewed together, not guessed as controls.
 const pictureGroups=[];for(const picture of plan.regions.filter(r=>r.type==='image')){const inside=clusters.filter(g=>g.every(r=>overlap(r,picture)>r.w*r.h*.9));if(inside.length>1){for(const g of inside)clusters.splice(clusters.indexOf(g),1);pictureGroups.push(inside.flat());}}clusters.push(...pictureGroups);
 for(const g of clusters){add('controls',g.length===1?'What is this small control?':'What are these small controls?',g.sort((a,b)=>a.y-b.y||a.x-b.x).map((r,i)=>({...r,type:'image',visual:'crop',text:'Control '+(i+1)})),buttonOptions);}
 const filled=plan.regions.filter(r=>r.type==='button'&&!known.some(k=>overlap(k,r)>r.w*r.h*.3));
 for(const r of D.groupRepeats(filled,W,H))add('button',r.members?'Are these repeated clickable buttons?':'Is this a clickable button?',r.members||[r],[['buttons',r.members?'Button list':'Clickable button'],['text','Ordinary text'],['background','Background decoration']]);
 const uncertain=plan.regions.filter(r=>r.type==='text'&&(r.confidence<70||r.w*W<r.h*H*.7)&&!questions.some(q=>q.candidates.some(c=>overlap(c,r)>r.w*r.h*.3)));
 for(const r of uncertain.slice(0,12))add('uncertain','The lettering is uncertain. How should it be kept?',[{...r,h:r.sourceBox?.h||r.h}],[['text','Editable text — review spelling'],['images','Keep its exact appearance as an image'],['background','Background decoration'],['omit','Leave out']]);
 if(plan.referenceLayout&&!plan.regions.some(r=>r.type==='background')&&plan.regions.some(r=>r.type==='image'))add('backdrop','Keep the decorative background from the reference?',[{type:'background',x:0,y:0,w:1,h:1,text:'Decorative background'}],[['artwork','Keep background artwork'],['background','Use a plain background color']]);
 // A final visual review catches controls that OCR cannot recognize at all.
 questions.push({id:'review-final',kind:'final',label:'Does the preview include every control you want to edit?',box:{x:0,y:0,w:1,h:1},candidates:[],options:[['ready','Yes, continue'],['mark','No, let me mark missing controls']],answer:''});
 plan.questions=questions;for(const q of questions)for(const r of plan.regions){if(r.type==='background'||q.kind==='backdrop')continue;if(q.candidates.some(c=>overlap(c,r)>r.w*r.h*.5)){r.enabled=false;r.reviewOwner=q.id;}}
 return plan;
}
function answer(raw,id,value){const plan=D.normalize(raw),q=plan.questions?.find(q=>q.id===id);if(!q||!q.options.some(o=>o[0]===value))throw Error('Choose one of the available answers.');q.answer=value;
 if(q.kind==='final')return plan;
 if(value==='artwork')for(const r of plan.regions)if(r.enabled&&r.type==='image'&&!r.sourceBox)r.sourceBox={x:r.x,y:r.y,w:r.w,h:r.h,color:r.color,mode:'area'};
 plan.regions=plan.regions.filter(r=>r.reviewCreated!==id);for(const r of plan.regions)if(r.reviewOwner===id)r.enabled=false;
 if(value==='background')return plan;
 for(const [i,c]of q.candidates.entries()){
  const r={...c,reviewCreated:id,enabled:value!=='omit',sourceBox:{x:c.x,y:c.y,w:c.w,h:c.h,color:c.color||'#eeeeee',mode:c.visual==='crop'?'area':'letters'}};
  if(value==='navigation'||value==='buttons'){r.type='button';r.label=c.text||'Button '+(i+1);if(c.visual==='crop'){r.text='';r.visual='crop';}}
  else if(value==='images'){r.type='image';r.visual='crop';r.sourceBox.mode='area';if(q.kind==='uncertain')r.text='Lettering from reference';}
  else if(value==='artwork'){r.type='background';delete r.sourceBox;}
  else if(value==='text'){r.type='text';delete r.visual;}
  if(value==='omit'){r.sourceBox.mode='area';r.erase=true;}plan.regions.push(r);
 }
 return D.normalize(plan);
}
const api={propose,answer,outlines,topBand,pending:p=>(p?.questions||[]).filter(q=>!q.answer||q.answer==='mark')};G.CraftDesignReview=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
