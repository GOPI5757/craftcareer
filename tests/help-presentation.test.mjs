import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),P=require('../site/help-presentation.js');
test('Highlights complete control names and keyboard shortcuts',()=>{
 const s=P.segments('Choose Website settings, then Inspector. Press Ctrl+Z.');
 assert.deepEqual(s.filter(x=>x.important).map(x=>x.text),['Website settings','Inspector','Ctrl+Z']);
});
test('Preserves the exact original answer including Unicode and markup-like text',()=>{
 for(const text of ['<img src=x onerror=alert(1)> → Inspector','Fit a 🧩 component.','padding\n\nSplit',''])assert.equal(P.segments(text).map(x=>x.text).join(''),text);
});
test('Does not highlight partial words',()=>assert.equal(P.segments('outfit listless splitter unpublished').some(x=>x.important),false));
test('Matching is case-insensitive and repeatable',()=>{for(let n=0;n<3;n++)assert.equal(P.segments('inspector INSPECTOR').filter(x=>x.important).length,2);});
test('Typing progresses monotonically and finishes within six seconds',()=>{
 for(const length of [1,180,1000,100000]){let prev=0;for(let time=0;time<=6000;time+=20){const v=P.progress(length,time);assert.ok(v>=prev&&v<=length);prev=v;}assert.equal(prev,length);}
});
function harness(extra={}){let next=0,calls=0;const frames=new Map(),values=[];const control=P.type({length:360,render:n=>values.push(n),done:()=>calls++,request:cb=>{frames.set(++next,cb);return next;},cancel:id=>frames.delete(id),...extra});return {control,values,frames,get calls(){return calls;},tick(t){const item=frames.entries().next().value;assert.ok(item);frames.delete(item[0]);item[1](t);}};}
test('Animation reveals partial text before completing once',()=>{const h=harness();h.tick(0);h.tick(500);assert.equal(h.values.at(-1),90);h.tick(2000);assert.equal(h.values.at(-1),360);assert.equal(h.calls,1);assert.equal(h.frames.size,0);});
test('Reduced motion immediately reveals the full answer without scheduling',()=>{const h=harness({reduced:true});assert.deepEqual(h.values,[360]);assert.equal(h.calls,1);assert.equal(h.frames.size,0);});
test('Clear cancels outstanding typing without reviving the old conversation',()=>{const h=harness();h.tick(0);h.control.cancel();h.control.finish();assert.equal(h.calls,0);assert.equal(h.frames.size,0);assert.equal(h.values.at(-1),0);});
test('A follow-up can finish the previous reply without truncation or double completion',()=>{const h=harness();h.tick(0);h.control.finish();h.control.finish();assert.equal(h.values.at(-1),360);assert.equal(h.calls,1);assert.equal(h.frames.size,0);});
test('Empty text completes without scheduling',()=>{const h=harness({length:0});assert.deepEqual(h.values,[0]);assert.equal(h.calls,1);});
test('Speed limits keep input safe and still complete',()=>{for(const speed of [0,-1,Infinity,NaN,30,500])assert.equal(P.progress(1000,6000,speed),1000);});
test('Presentation loaded before chat with safe text nodes and lifecycle cleanup',()=>{
 const html=readFileSync(new URL('../site/index.html',import.meta.url),'utf8'),ui=readFileSync(new URL('../site/help-chat.js',import.meta.url),'utf8');
 assert.ok(html.indexOf('help-presentation.js')<html.indexOf('help-chat.js'));
 assert.ok(ui.includes('document.createTextNode'));
 assert.ok(!ui.includes('innerHTML'));
 assert.ok(ui.includes('stopTyping(false)'));
 assert.ok(ui.includes("messages.setAttribute('aria-busy','true')"));
 assert.ok(ui.includes("window.matchMedia('(prefers-reduced-motion: reduce)')"));
});

test('AI emphasis becomes safe highlighted text without executing HTML',()=>{const result=P.segments('Choose **Split** and **<img src=x>**.');assert.equal(result.map(x=>x.text).join(''),'Choose Split and <img src=x>.');assert.ok(result.find(x=>x.text==='<img src=x>'&&x.important));});
test('Keyword styling uses colored heavier text without an underline',()=>{const css=readFileSync(new URL('../site/help-chat.css',import.meta.url),'utf8');assert.match(css,/help-keyword\{font-weight:800;color:var\(--accent\);text-decoration:none/);});
