/* Creator-only guide. Messages stay in memory and never leave this page. */
(() => {
'use strict';
const config=window.CRAFTCAREER_CONFIG?.helpChat;
if(!config||config.enabled===false||!window.CraftHelp)return;
const H=window.CraftHelp,P=window.CraftHelpPresentation;
const node=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const button=(label,fn,cls='')=>{const b=node('button',cls,label);b.type='button';b.onclick=fn;return b;};
const trigger=button('? Help',()=>open(),'help-chat-launch');trigger.id='help-chat-launch';trigger.setAttribute('aria-controls','help-chat');trigger.setAttribute('aria-expanded','false');trigger.title='Ask the built-in CraftCareer guide';document.getElementById('website-settings').before(trigger);
const panel=node('section','');panel.id='help-chat';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','help-chat-title');
const header=node('header','help-chat-header'),titleWrap=node('div'),title=node('h2','',config.title||'CraftCareer Help');title.id='help-chat-title';titleWrap.append(node('span','help-chat-badge','BUILT-IN GUIDE'),title);const close=button('×',()=>hide());close.setAttribute('aria-label','Close help chat');header.append(titleWrap,close);
const intro=node('p','help-chat-note','Free guidance from reviewed CraftCareer instructions. This is not generative AI; it may ask you to choose a topic.');
const tools=node('div','help-chat-tools'),browse=button('Browse topics',()=>{directory.hidden=!directory.hidden;browse.setAttribute('aria-expanded',String(!directory.hidden));if(!directory.hidden)filter.focus();});browse.setAttribute('aria-expanded','false');browse.setAttribute('aria-controls','help-topic-directory');const clear=button('New chat',()=>{stopTyping(false);lastTopic='';messages.replaceChildren();welcome();input.value='';updateReadMore();input.focus();});tools.append(browse,clear);
const directory=node('div','help-topic-directory');directory.id='help-topic-directory';directory.hidden=true;const filter=node('input');filter.type='search';filter.placeholder='Find a topic…';filter.setAttribute('aria-label','Find a help topic');const topicList=node('div','help-topic-list');directory.append(filter,topicList);
const contextRow=node('div','help-chat-context'),contextLabel=node('label'),useContext=node('input');useContext.type='checkbox';useContext.checked=config.useSelection!==false;contextLabel.append(useContext,document.createTextNode('Use selected component'));const contextStatus=node('span','');contextRow.append(contextLabel,contextStatus);contextRow.title='Uses only component type, section type, device and editing mode. No files or text content are read.';
const messages=node('div','help-chat-messages');messages.id='help-chat-messages';messages.setAttribute('role','log');messages.setAttribute('aria-live','polite');messages.setAttribute('aria-relevant','additions');messages.setAttribute('aria-label','Help conversation');
const form=node('form','help-chat-form'),label=node('label','','Your question');label.htmlFor='help-chat-input';const input=node('textarea');input.id='help-chat-input';input.rows=2;input.maxLength=1200;input.placeholder='How do I put text beside an image?';const submit=node('button','primary','Send');submit.type='submit';const footer=node('div','help-chat-compose-footer');footer.append(node('small','','Enter to send · Shift+Enter for a new line'),submit);form.append(label,input,footer);const privacy=node('small','help-chat-privacy','No account or API key. Chat stays on this page and clears when it reloads.');
panel.append(header,intro,tools,directory,contextRow,messages,form,privacy);document.body.append(panel);
let lastTopic='',contextTimer=null,originalFocus=null,typing=null;
const readMore=button('↓ Read more',()=>{scrollLatest();updateReadMore();},'help-read-more');readMore.hidden=true;messages.after(readMore);
function updateReadMore(){readMore.hidden=messages.scrollHeight-messages.scrollTop-messages.clientHeight<36;}
messages.addEventListener('scroll',updateReadMore,{passive:true});
new ResizeObserver(updateReadMore).observe(messages);
function stopTyping(finish=true){if(typing){const previous=typing;typing=null;finish?previous.finish():previous.cancel();}messages.removeAttribute('aria-busy');}

const limit=Math.max(8,Math.min(60,Number(config.maxMessages)||24));
function context(){if(!useContext.checked)return {};const c=window.CraftCareer?.getHelpContext?.()||{};return c;}
function updateContext(){const c=context();contextStatus.textContent=useContext.checked?[c.component||c.section||'No selection',c.device||'',c.readOnly?'view only':''].filter(Boolean).join(' · '):'Selection off';}
useContext.onchange=updateContext;
function scrollLatest(){messages.scrollTop=messages.scrollHeight;}
function beginAnswer(){stopTyping();}
function present(box){
 const blocks=[...box.querySelectorAll('h3,p,li')],runs=[];let length=0;
 for(const block of blocks){const text=block.textContent;block.replaceChildren();block.hidden=true;const start=length;for(const part of P.segments(text)){const leaf=document.createTextNode('');if(part.important){const strong=node('strong','help-keyword');strong.append(leaf);block.append(strong);}else block.append(leaf);const chars=Array.from(part.text);runs.push({leaf,chars,start:length});length+=chars.length;}block.dataset.revealStart=start;}
 const tail=box.querySelector('.help-answer-footer');if(tail)tail.hidden=true;
 const indicator=node('span','help-typing','Typing…');indicator.setAttribute('aria-hidden','true');box.querySelector('.help-message-author').after(indicator);
 messages.setAttribute('aria-busy','true');
 // Position the start of the answer once. Growth never pulls readers to its end.
 scrollLatest();
 const done=()=>{indicator.remove();blocks.forEach(b=>b.classList.remove('help-typing-line'));if(tail)tail.hidden=false;messages.removeAttribute('aria-busy');typing=null;updateReadMore();};
 const controller=P.type({length,cps:config.typingSpeed,reduced:config.typingEffect===false||window.matchMedia('(prefers-reduced-motion: reduce)').matches,render:n=>{let active=null;for(const b of blocks){b.hidden=n<=+b.dataset.revealStart;b.classList.remove('help-typing-line');if(!b.hidden)active=b;}for(const r of runs)r.leaf.textContent=r.chars.slice(0,Math.max(0,n-r.start)).join('');if(active&&n<length)active.classList.add('help-typing-line');updateReadMore();},done});
 if(indicator.isConnected)typing=controller;
}
function showReply(text,ids=[]){beginAnswer();const box=message('guide',text),tail=node('div','help-answer-footer');choices(tail,ids);box.append(tail);present(box);}
function message(role,text){const box=node('article','help-message help-message-'+role);box.append(node('strong','help-message-author',role==='user'?'You':'CraftCareer guide'));if(text)box.append(node('p','',text));messages.append(box);while(messages.children.length>limit)messages.firstElementChild.remove();return box;}
function choices(box,ids){const group=node('div','help-chat-choices');for(const id of [...new Set(ids)]){const t=H.topic(id);if(!t)continue;group.append(button(t.title,()=>{beginAnswer();message('user',t.title);showTopic(t);},'help-topic-choice'));}if(group.children.length)box.append(group);}
function welcome(){const box=message('guide','What are you trying to build? Ask about a control, choose a topic, or select a component and ask “How do I edit this?”');choices(box,['start','hero-layout','split','lists','publish']);}
const actions={sections:['hierarchy-add','Add a section'], 'section-settings':['section-settings','Section settings'],components:['component-palette','Components'],assets:['open-assets','Assets'],device:['device','Device selector'],browse:['browse-mode','Browse mode'],'website-settings':['website-settings','Website settings'],publish:['github-publish','Publish'],workspace:['settings-menu','Workspace'],inspector:['inspector-content','Inspector']};
function showControl(key){const spec=actions[key];if(!spec)return;const target=document.getElementById(spec[0]);if(!target||target.disabled){showReply('Select the relevant section or component first, then try this shortcut again.');return;}
 hide(false);
 if(key==='workspace')target.open=true;
 else if(key==='inspector'){if(document.body.classList.contains('inspector-hidden'))document.getElementById('toggle-inspector').click();}
 else if(['sections','section-settings','assets','website-settings','publish','browse'].includes(key))target.click();
 target.classList.add('help-control-highlight');setTimeout(()=>target.classList.remove('help-control-highlight'),2000);
 if(['device','components','workspace'].includes(key)){(key==='workspace'?target.querySelector('summary'):target).focus({preventScroll:true});}
}
function showTopic(t){beginAnswer();lastTopic=t.id;const box=message('guide');box.append(node('h3','',t.title),node('p','',t.intro));if(context().readOnly)box.append(node('p','help-chat-caution','You are in a view-only session. Editing steps require your own editable copy or a valid Helper link.'));const steps=node('ol');for(const text of t.steps)steps.append(node('li','',text));const tail=node('div','help-answer-footer');tail.append(node('small','help-answer-source','Source: CraftCareer built-in guide · '+H.version));box.append(steps,tail);const action=actions[t.action];if(action)tail.append(button('Show '+action[1],()=>showControl(t.action),'help-show-control'));if(t.related.length){tail.append(node('small','help-related-label','Related guides'));choices(tail,t.related.slice(0,3));}present(box);}
function ask(){const q=input.value.trim();if(!q){input.focus();return;}beginAnswer();message('user',q);input.value='';const result=H.answer(q,context(),lastTopic);if(result.kind==='answer')showTopic(result.topic);else showReply(result.text,result.choices||[]);input.focus({preventScroll:true});}
form.onsubmit=e=>{e.preventDefault();ask();};input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();ask();}});
panel.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();hide();}});
function refreshTopics(){const q=filter.value.trim(),list=q?H.search(q).map(r=>r.topic):H.topics;topicList.replaceChildren();if(!list.length)topicList.append(node('p','','No matching topic. Try another word.'));for(const t of list)topicList.append(button(t.title,()=>{directory.hidden=true;browse.setAttribute('aria-expanded','false');beginAnswer();message('user',t.title);showTopic(t);}));}
filter.oninput=refreshTopics;
function open(){if(!panel.hidden){hide();return;}originalFocus=document.activeElement;panel.hidden=false;trigger.setAttribute('aria-expanded','true');updateContext();contextTimer=setInterval(updateContext,600);input.focus({preventScroll:true});updateReadMore();}
function hide(restore=true){stopTyping();panel.hidden=true;trigger.setAttribute('aria-expanded','false');clearInterval(contextTimer);contextTimer=null;if(restore)(originalFocus?.isConnected?originalFocus:trigger).focus({preventScroll:true});}
window.addEventListener('craftcareer-workspace-replaced',()=>{stopTyping(false);lastTopic='';messages.replaceChildren();welcome();updateContext();updateReadMore();});
refreshTopics();welcome();
})();
