// Lightweight DOM/state simulation; this is not a browser or a visual-layout test.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=n=>readFileSync(new URL('../site/'+n,import.meta.url),'utf8');
class Element {
 constructor(tag,doc){this.tag=tag;this.doc=doc;this.children=[];this.parent=null;this.attrs={};this.listeners={};this.dataset={};this.className='';this.value='';this.hidden=false;this.disabled=false;this.scrollTop=0;this.clientHeight=250;this.clientWidth=400;this._text='';this.classList={add:(...s)=>{this.className=[...new Set([...this.className.split(' '),...s])].join(' ');},remove:s=>{this.className=this.className.split(' ').filter(x=>x!==s).join(' ');},contains:s=>this.className.split(' ').includes(s)};}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('');}set textContent(s){this._text=String(s);this.children.forEach(x=>x.parent=null);this.children=[];}
 get scrollHeight(){return Math.max(this.clientHeight, this.children.reduce((n,c)=>n+70+c.textContent.length/2,0));}
 get firstElementChild(){return this.children[0];}get lastElementChild(){return this.children.at(-1);}
 get isConnected(){return this===this.doc.body||!!this.parent?.isConnected;}
 append(...items){for(const x of items){x.remove();x.parent=this;this.children.push(x);}}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null;}
 after(x){x.remove();x.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this)+1,0,x);}
 before(x){x.remove();x.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this),0,x);}
 replaceChildren(...xs){this.children.forEach(x=>x.parent=null);this.children=[];this._text='';this.append(...xs);}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
 fire(k,e={}){e.preventDefault??=()=>{};e.stopPropagation??=()=>{};this['on'+k]?.(e);for(const fn of this.listeners[k]||[])fn(e);}
 focus(){this.doc.activeElement=this;}click(){if(!this.disabled)this.onclick?.();}
 matches(s){if(s.startsWith('.'))return this.classList.contains(s.slice(1));if(s.startsWith('#'))return this.id===s.slice(1);return this.tag===s;}
 querySelectorAll(s){const selectors=s.split(',').map(x=>x.trim().split(/\s+/));const result=[];const visit=n=>{for(const c of n.children){if(selectors.some(parts=>{if(!c.matches(parts.at(-1)))return false;if(parts.length===1)return true;let p=c.parent;while(p){if(p.matches(parts[0]))return true;p=p.parent;}return false;}))result.push(c);visit(c);}};visit(this);return result;}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 getBoundingClientRect(){return {left:0};}
}
function setup({remote=false,reduced=false}={}){
 const doc={createElement(tag){return new Element(tag,this);},createTextNode(s){const e=this.createElement('#text');e.textContent=s;return e;},getElementById(id){return this.body.querySelector('#'+id);}};doc.body=doc.createElement('body');const anchor=doc.createElement('button');anchor.id='website-settings';doc.body.append(anchor);
 let id=0,time=0,networkCalls=0,resolveRemote,rejectRemote;const frames=new Map();
 const topic={id:'split',title:'Split',intro:'Choose Split. '.repeat(25),steps:['Use Inspector. '.repeat(25)],related:[]};
 const world={document:doc,CRAFTCAREER_CONFIG:{helpChat:{cloudflare:remote,typingSpeed:180}},CraftHelp:{topic:()=>topic,topics:[topic],answer:()=>({kind:'answer',topic}),search:()=>[{topic}],version:'test'},matchMedia:()=>({matches:reduced}),requestAnimationFrame:cb=>{frames.set(++id,cb);return id;},cancelAnimationFrame:id=>frames.delete(id),ResizeObserver:class{observe(){}},setInterval:()=>1,clearInterval(){},setTimeout,AbortController,AbortSignal,console,addEventListener(){}};
 if(remote)world.CraftHelpRemote={create:()=>({ask:()=>{networkCalls++;return new Promise((r,j)=>{resolveRemote=r;rejectRemote=j;});}}),availabilityMessage:()=> 'Temporarily unavailable.'};
 world.window=world;vm.createContext(world);vm.runInContext(script('help-presentation.js'),world);vm.runInContext(script('help-chat.js'),world);
 const q=s=>doc.body.querySelector(s),log=q('#help-chat-messages'),form=q('.help-chat-form'),input=q('#help-chat-input'),send=form.querySelector('button');
 return {q,log,input,send,frames,get calls(){return networkCalls;},get users(){return log.querySelectorAll('.help-message-user').length;},ask(text='How do I split?'){input.value=text;form.fire('submit');},enter(){input.fire('keydown',{key:'Enter'});},click(text){const b=doc.body.querySelectorAll('button').find(x=>x.textContent===text);assert.ok(b,text);b.click();},resolve(text='Use Split. '.repeat(70)){resolveRemote({answer:text,topics:['split']});},reject(){rejectRemote(Error('network'));},async tick(ms=16){time+=ms;const pending=[...frames.values()];frames.clear();pending.forEach(cb=>cb(time));await Promise.resolve();await Promise.resolve();},async settle(){for(let i=0;i<500&&frames.size;i++)await this.tick();assert.equal(frames.size,0);}};
}
test('Local reply locks Send, Enter and guide shortcuts during arrival and typing',async()=>{const h=setup();h.ask();assert.equal(h.send.disabled,true);assert.equal(h.users,1);h.input.value='next draft';h.enter();h.click('Split');assert.equal(h.users,1);assert.equal(h.input.value,'next draft');await h.tick();await h.tick(320);assert.equal(h.send.disabled,true);await h.settle();assert.equal(h.send.disabled,false);assert.equal(h.input.value,'next draft');h.enter();assert.equal(h.users,2);await h.settle();});
test('Remote reply stays locked from request through the final typed character',async()=>{const h=setup({remote:true});h.ask();h.ask('second');assert.equal(h.calls,1);assert.equal(h.users,1);await h.settle();assert.equal(h.send.disabled,true);h.resolve();await h.tick();assert.equal(h.send.disabled,true);h.enter();assert.equal(h.calls,1);await h.settle();assert.equal(h.send.disabled,false);});
test('New chat cancels queued typing and unlocks without reviving old messages',async()=>{const h=setup();h.ask();h.click('New chat');await h.settle();assert.equal(h.users,0);assert.equal(h.send.disabled,false);assert.equal(h.log.children.length,1);});
test('New chat ignores late network replies',async()=>{const h=setup({remote:true});h.ask();h.click('New chat');h.resolve();await h.tick();assert.equal(h.log.children.length,1);assert.equal(h.send.disabled,false);});
test('Failure message finishes typing and unlocks Send',async()=>{const h=setup({remote:true});h.ask();h.reject();await h.tick();await h.settle();assert.equal(h.send.disabled,false);assert.match(h.log.textContent,/Temporarily unavailable/);});
test('Reduced motion completes local answers without lingering locks',async()=>{const h=setup({reduced:true});h.ask();await h.tick();assert.equal(h.send.disabled,false);await h.settle();assert.equal(h.frames.size,0);assert.match(h.log.textContent,/Use Inspector/);});
test('Manual scroll interrupts auto-follow but not the answer or sending lock',async()=>{const h=setup();h.ask();await h.tick();await h.tick(350);h.log.fire('wheel');h.log.scrollTop=0;assert.equal(h.send.disabled,true);await h.settle();assert.equal(h.log.scrollTop,0);assert.equal(h.send.disabled,false);h.ask();await h.settle();assert.ok(h.log.scrollTop>0);});
test('Closing while arrival is pending reveals the answer without scrolling',async()=>{const h=setup();h.ask();h.click('×');const top=h.log.scrollTop;await h.settle();assert.equal(h.send.disabled,false);assert.equal(h.log.scrollTop,top);assert.match(h.log.textContent,/Use Inspector/);});
