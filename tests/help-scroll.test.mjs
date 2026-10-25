import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const P=createRequire(import.meta.url)('../site/help-presentation.js');
function setup(reduced=false){
 let next=0,time=0;const frames=new Map(),el={scrollTop:0,scrollHeight:1400,clientHeight:400};
 const follow=P.followScroll(el,{reduced:()=>reduced,request:cb=>{frames.set(++next,cb);return next;},cancel:id=>frames.delete(id)});
 return {el,follow,frames,tick(delta=16){time+=delta;const pending=[...frames.values()];frames.clear();pending.forEach(cb=>cb(time));},settle(){for(let i=0;i<200&&frames.size;i++)this.tick();assert.equal(frames.size,0);}};
}
test('Submitting from history scrolls smoothly before the arrival promise resolves',async()=>{const h=setup();let ready=false;h.follow.resume().then(()=>ready=true);h.tick();h.tick(100);assert.ok(h.el.scrollTop>0&&h.el.scrollTop<1000);await Promise.resolve();assert.equal(ready,false);h.settle();await Promise.resolve();assert.equal(ready,true);assert.equal(h.el.scrollTop,1000);});
test('Typing growth follows smoothly and settles at the new bottom',()=>{const h=setup();h.follow.resume();h.settle();h.el.scrollHeight+=600;h.follow.update();h.tick();assert.ok(h.el.scrollTop>1000&&h.el.scrollTop<1600);h.settle();assert.equal(h.el.scrollTop,1600);});
test('Manual wheel/touch intent cancels animation immediately',()=>{const h=setup();h.follow.resume();h.tick();h.tick(90);h.follow.pause();const top=h.el.scrollTop;h.el.scrollHeight+=500;h.follow.update();h.tick();assert.equal(h.el.scrollTop,top);assert.equal(h.follow.following,false);assert.equal(h.frames.size,0);});
test('Programmatic scroll notifications do not cancel following',()=>{const h=setup();h.follow.resume();h.tick();h.tick(100);h.follow.scrolled();assert.equal(h.follow.following,true);h.settle();});
test('Native scrollbar movement takes control away from following',()=>{const h=setup();h.follow.resume();h.settle();h.el.scrollTop=123;h.follow.scrolled();h.el.scrollHeight+=300;h.follow.update();h.tick();assert.equal(h.el.scrollTop,123);assert.equal(h.follow.following,false);});
test('A new question or Read more resumes after user interruption',()=>{const h=setup();h.follow.resume();h.settle();h.follow.pause();h.el.scrollTop=50;h.follow.resume();h.settle();assert.equal(h.el.scrollTop,1000);assert.equal(h.follow.following,true);});
test('Interrupting arrival resolves the gate so the answer is not stuck',async()=>{const h=setup();const ready=h.follow.resume();h.follow.pause();await ready;assert.equal(h.frames.size,0);});
test('Replacing a pending scroll resolves the previous gate and keeps one animation',async()=>{const h=setup();const old=h.follow.resume(),current=h.follow.resume();await old;assert.equal(h.frames.size,1);h.settle();await current;assert.equal(h.el.scrollTop,1000);});
test('Reduced motion skips animation and still follows new content',async()=>{const h=setup(true);await h.follow.resume();assert.equal(h.el.scrollTop,1000);assert.equal(h.frames.size,0);h.el.scrollHeight+=100;h.follow.update();h.tick();assert.equal(h.el.scrollTop,1100);assert.equal(h.frames.size,0);});
test('No overflow stays at zero and does not keep scheduling frames',()=>{const h=setup();h.el.scrollHeight=200;h.follow.resume();h.settle();assert.equal(h.el.scrollTop,0);});
test('Content shrinking and browser scroll clamping do not look like user scrolling',()=>{const h=setup();h.follow.resume();h.settle();h.el.scrollHeight=900;h.el.scrollTop=500;h.follow.scrolled();assert.equal(h.follow.following,true);h.follow.update();h.settle();assert.equal(h.el.scrollTop,500);});
test('Continuous typing eventually reveals the full answer including footer',()=>{const h=setup();h.follow.resume();h.settle();for(let i=0;i<300;i++){h.el.scrollHeight+=3;h.follow.update();h.tick();h.follow.scrolled();}h.el.scrollHeight+=150;h.follow.update();h.settle();assert.equal(h.el.scrollTop,h.el.scrollHeight-h.el.clientHeight);assert.equal(h.follow.following,true);});
