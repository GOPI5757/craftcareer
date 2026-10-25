/* Local retrieval over reviewed instructions. No model, network, or canvas writes. */
(function(G){
'use strict';
const K=G.CraftHelpKnowledge||(typeof require!=='undefined'?require('./help-knowledge.js'):null);
const stop=new Set('a an the i me my we our you your it its this that these those is are was be been do does did can could would should will want need how what where why when which please tell show know about to of in on at and or for with as from have has not now just some thing things make using use help change set get also add adding create creating'.split(' '));
const aliases={colour:'color',colours:'color',colors:'color',centre:'center',photos:'image',photo:'image',picture:'image',pictures:'image',images:'image',pics:'image',pic:'image',sizing:'size',resizing:'resize',buttons:'button',btn:'button',btns:'button',cells:'cell',sections:'section',subsections:'subsection',projects:'project',cards:'card',items:'item',lists:'list',links:'link',fonts:'font',widths:'width',heights:'height',rounded:'radius',rounding:'radius',corners:'corner',gaps:'gap',spaces:'spacing',columns:'column',rows:'row',mobile:'mobile',phone:'mobile',categories:'category',filters:'filter',vertically:'vertical',horizontally:'horizontal',edges:'edge',backgound:'background',backround:'background',splitt:'split',reszie:'resize',smartphone:'mobile',categories:'category',filters:'filter',vertically:'vertical',horizontally:'horizontal',edges:'edge',backgound:'background',backround:'background',splitt:'split',reszie:'resize',tabs:'tab',copied:'copy',copying:'copy',duplicating:'duplicate',moving:'move',deleting:'remove',delete:'remove',removing:'remove',exporting:'export',saving:'save',publishing:'publish',published:'publish',uploading:'upload',uploads:'upload',drawing:'draw',nav:'navigation',navbar:'navigation'};
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}+#]+/gu,' ').trim();
const tokens=s=>[...new Set(normalize(s).split(/\s+/).map(t=>aliases[t]||t).filter(t=>t&&!stop.has(t)))];
const docs=K.topics.map(t=>({topic:t,title:new Set(tokens(t.title)),tags:new Set(tokens(t.tags)),body:new Set(tokens(t.intro+' '+t.steps.join(' ')))}));
const vocabulary=new Set(docs.flatMap(d=>[...d.title,...d.tags]));
const corrected=ts=>ts;
const contextTopic={text:'text',button:'buttons',image:'image',icon:'icons',list:'lists',code:'code',video:'video',gallery:'gallery',sketchfab:'models',dropdown:'dropdown',contact:'contact',appbar:'navigation',projects:'projects',popup:'popup',infinite:'subsections',page:'project-pages'};
function search(question,context={},previous=''){
 const q=String(question||'').slice(0,1200),ts=corrected(tokens(q)),explicit=ts.filter(t=>vocabulary.has(t));
 if(!explicit.length)return [];
 const generic=/\b(it|this|that|selected|same|its)\b/i.test(q),hint=contextTopic[context.component]||contextTopic[context.section]||(previous&&K.topics.some(t=>t.id===previous)?previous:'');
 let ranked=docs.map(d=>{let score=0,hits=0;for(const t of ts){const df=docs.filter(x=>x.title.has(t)||x.tags.has(t)).length,idf=Math.log(1+docs.length/(1+df));const weight=d.title.has(t)?3:d.tags.has(t)?2:d.body.has(t)?.25:0;if(weight>=2)hits++;score+=weight*idf;}if(generic&&d.topic.id===hint)score+=4;return {topic:d.topic,score,hits};}).filter(d=>d.hits>0);
 // Specific combinations take precedence over a general guide that mentions the same words.
 const has=(...words)=>words.every(w=>ts.includes(w));let exact='';
 if(has('button','hover')||has('button','pressed')||has('fill','transparent'))exact='button-states';
 else if(has('image','blend')||has('image','fade')||has('image','edge'))exact='image-blend';
 else if(has('image','border'))exact='image-border';
 else if(has('cell','blend')||has('seam'))exact='blend';
 else if(has('list','gap')||has('list','spacing')||has('item','gap'))exact='list-gap';
 else if(has('image','gallery')||has('gallery'))exact='gallery';
 else if(has('text','align')||has('text','alignment')||has('text','vertical'))exact='alignment';
 else if(has('background','color')||has('background','fill'))exact='background';
 else if(has('button','resize')||has('button','width')||has('button','height')||has('button','size')||has('button','icon'))exact='buttons';
 else if(has('project','category')||has('project','filter'))exact='categories';
 else if(has('project','page')||has('card','page'))exact='project-pages';
 else if(has('from','image')||/from image|image analysis|design assistant|image ai/i.test(q))exact='hidden-ai';
 else if(has('github','error')||has('github','expired')||has('custom','domain')||(has('update','live')||has('publish'))&&/not|old|fail|still/i.test(q))exact='publish-trouble';
 else if(has('open','github'))exact='github-open';
 else if(has('list','duplicate')||has('list','copy'))exact='lists';
 else if(has('mobile')||has('tablet')||has('responsive'))exact='responsive';
 else if(has('gradient')||has('overlay'))exact='background';
 else if(has('divider'))exact='divider';
 else if(has('spacer'))exact='spacer';
 else if(has('font')||has('typography'))exact='text';
 else if(has('underline')||has('bold')||has('italic'))exact='text';
 else if(has('split'))exact='split';
 else if(has('subsection','height'))exact='subsections';
 else if(has('corner')||has('radius'))exact='corners';
 else if(has('resize'))exact='resize';
 for(const r of ranked)if(r.topic.id===exact){r.score+=25;r.exact=true;}
 return ranked.sort((a,b)=>b.score-a.score||a.topic.id.localeCompare(b.topic.id)).slice(0,5);
}
function answer(question,context={},previous=''){
 const q=String(question||'').trim().slice(0,1200);
 if(!q)return {kind:'empty',text:'Ask a CraftCareer question or choose a topic.',choices:[]};
 if(/checkout|shopping cart|\bstripe\b|credit card|\bpayments?\b/i.test(q))return {kind:'unknown',text:'The reviewed CraftCareer features do not include a shopping cart or payment processor. A button can open an external link, but that does not add a payment system to your portfolio.',choices:['actions','buttons']};
 if(/^(hi|hello|hey|thanks|thank you)[!. ]*$/i.test(q))return {kind:'welcome',text:'I can help you find CraftCareer controls and follow its built-in workflows. What would you like to do?',choices:['start','split','projects','publish']};
 if(/^(what can you do|what are you|are you (an? )?ai)\??$/i.test(q))return {kind:'welcome',text:'I am a free built-in guide, not a generative AI model. I match questions to reviewed CraftCareer instructions. I cannot inspect your account, diagnose every bug, or change your canvas.',choices:['start','hero-layout','export']};
 if(/^(and )?(how|what) (about|on) (mobile|tablet|phone)\??$/i.test(q))return {kind:'answer',topic:K.topics.find(t=>t.id==='responsive'),alternatives:[]};
 if(/^(?:how (?:do|can) i )?(edit|explain|show|help)( (me|with))? (this|it|that|selected)( (component|element))?\??$/i.test(q)){
 const id=contextTopic[context.component]||contextTopic[context.section]||previous;
 if(id&&K.topics.some(t=>t.id===id))return {kind:'answer',topic:K.topics.find(t=>t.id===id),alternatives:[]};
 }
 const ranked=search(q,context,previous);
 if(!ranked.length||ranked[0].score<5)return {kind:'unknown',text:'I could not confidently match that to a reviewed CraftCareer guide. Try naming the control or choose a topic below. I can explain supported workflows, but cannot answer every question or inspect a live account.',choices:['start','split','projects','recovery']};
 const top=ranked[0],next=ranked[1],meaningful=tokens(q).length;
 if(!top.exact&&(top.hits<2&&meaningful>4||next&&top.score-next.score<2.5&&top.topic.id!==previous))return {kind:'clarify',text:'Which part would you like help with?',choices:ranked.slice(0,3).map(x=>x.topic.id)};
 return {kind:'answer',topic:top.topic,alternatives:ranked.slice(1,3).map(x=>x.topic.id)};
}
const api={search,answer,topic:id=>K.topics.find(t=>t.id===id),topics:K.topics,version:K.version};G.CraftHelp=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
