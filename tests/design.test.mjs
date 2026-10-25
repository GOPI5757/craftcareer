import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),D=require('../site/design-engine.js'),M=require('../site/model.js'),L=require('../site/layout.js');
const hero=()=>({width:1280,height:800,background:'#101724',regions:[
 {type:'text',text:'ALEX MORGAN',x:.06,y:.06,w:.2,h:.04,fontSize:1.4},
 {type:'text',text:'Projects About Contact',x:.7,y:.06,w:.24,h:.04},
 {type:'text',text:'GAMEPLAY PROGRAMMER',x:.06,y:.29,w:.4,h:.04},
 {type:'text',text:'Worlds worth playing.',x:.06,y:.36,w:.44,h:.16,fontSize:3.8},
 {type:'text',text:'I build playful systems.',x:.06,y:.58,w:.42,h:.04},
 {type:'button',text:'Explore projects',x:.06,y:.65,w:.18,h:.07,background:'#b52647'},
 {type:'image',text:'Landscape',x:.59,y:.23,w:.35,h:.55},
 {type:'text',text:'Unity / Unreal / C++',x:.06,y:.91,w:.3,h:.03}
]});
function allElements(sections){const elements=[];for(const s of sections)M.visitCells(s.grid,c=>{if(c.element)elements.push(c.element);});return elements;}
test('Reject missing, malformed and excessive model output',()=>{for(const p of [null,{}, {regions:'bad'},{regions:Array(81).fill({})}])assert.throws(()=>D.normalize(p));});
test('Sanitize all geometry, colors and component types',()=>{const r=D.normalize({width:Infinity,background:'url(https://evil)',regions:[{type:'script',x:-5,y:6,w:Infinity,h:-1,color:'red;script',text:'<script>alert(1)</script>',fontSize:99}]}).regions[0];assert.equal(r.type,'text');assert.equal(r.x,0);assert.ok(r.y<1);assert.ok(r.fontSize<=16);assert.equal(r.color,'#eeeeee');assert.equal(r.text,'<script>alert(1)</script>');});
test('Compile real editable components into valid existing config schema',()=>{const out=D.compile(hero(),M),doc=M.fresh();doc.sections=out.sections;assert.deepEqual(M.validate(doc),[]);assert.ok(out.sections.length>=2);assert.equal(allElements(out.sections).length,8);assert.ok(allElements(out.sections).some(e=>e.type==='button'));assert.ok(allElements(out.sections).some(e=>e.type==='image'));});
test('Generate independent mobile and tablet configuration patches',()=>{const out=D.compile(hero(),M),doc=M.fresh();doc.sections=out.sections;for(const device of ['mobile','tablet']){doc.deviceOverrides[device]=L.diff(L.resolve(doc),{...L.resolve(doc),sections:out[device]});assert.deepEqual(L.resolve(doc,device).sections,out[device]);assert.deepEqual(M.validate(L.resolve(doc,device)),[]);}assert.deepEqual(L.resolve(doc).sections,out.sections);});
test('Desktop hero preserves margins, side by side media and nested text rows',()=>{const main=D.compile(hero(),M).sections[1],inside=main.grid.children[1];assert.equal(main.grid.direction,'columns');assert.equal(main.grid.children.length,3);assert.equal(inside.direction,'columns');assert.equal(inside.children.length,2);assert.equal(inside.children[0].direction,'rows');assert.equal(inside.children[0].children.length,4);});
test('All ratios sum to 100 and maximum grid depth is three',()=>{for(const s of D.compile(hero(),M).sections)M.visitCells(s.grid,(c,depth)=>{assert.ok(depth<=3);if(c.children.length){assert.ok(c.children.length<=4);assert.ok(Math.abs(c.ratios.reduce((a,b)=>a+b,0)-100)<.01);}});});
test('No enabled regions does not create an empty generation',()=>{const p=hero();p.regions.forEach(r=>r.enabled=false);assert.throws(()=>D.compile(p,M));});
test('Disabled regions excluded; image paths are explicit, buttons have no guessed URLs',()=>{const p=hero();p.regions[0].enabled=false;const out=D.compile(p,M,{assets:{'region-7':'assets/test/images/crop.webp'}}),e=allElements(out.sections);assert.equal(e.length,7);assert.equal(e.find(x=>x.type==='image').src,'assets/test/images/crop.webp');assert.equal(e.find(x=>x.type==='button').action.url,'');assert.equal(e.find(x=>x.type==='button').action.target,'');});
test('Compile does not mutate its input',()=>{const p=hero(),s=JSON.stringify(p);D.compile(p,M);assert.equal(JSON.stringify(p),s);});
test('White and dark image backgrounds are sampled accurately',()=>{for(const [color,expected]of [[[250,250,250],'#fafafa'],[[10,20,30],'#0a141e']]){const data=new Uint8ClampedArray(100*100*4);for(let i=0;i<data.length;i+=4)data.set([...color,255],i);const p=D.fromOCR('',{width:100,height:100,data});assert.equal(p.background,expected);assert.equal(p.regions.length,0);assert.deepEqual(D.findMedia({width:100,height:100,data},[]),[]);}});
test('OCR parses real TSV columns and combines paragraph lines',()=>{const data=new Uint8ClampedArray(800*600*4);const tsv='level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext\n5\t1\t1\t1\t1\t1\t30\t40\t100\t20\t95\tHello\n5\t1\t1\t1\t2\t1\t30\t68\t100\t20\t95\tWorld';const p=D.fromOCR(tsv,{width:800,height:600,data});assert.equal(p.regions.length,1);assert.equal(p.regions[0].text,'Hello\nWorld');});
test('Generated IDs and config survive JSON round trip',()=>{const out=D.compile(hero(),M,{name:'Test design',id:'test-design'}),doc=M.fresh();doc.sections=JSON.parse(JSON.stringify(out.sections));assert.deepEqual(M.validate(doc),[]);assert.ok(doc.sections.every(s=>s.id.startsWith('test-design')));});
test('Overlapping regions never introduce absolute CSS or arbitrary JavaScript',()=>{const p=hero();p.regions=p.regions.slice(0,4).map(r=>({...r,x:.2,y:.2,w:.3,h:.1}));const out=D.compile(p,M);const text=JSON.stringify(out);assert.ok(!text.includes('position:'));assert.ok(!text.includes('javascript:'));assert.equal(allElements(out.sections).length,4);});
test('Oversized text and nonfinite numeric values are bounded',()=>{const p=D.normalize({regions:[{text:'a'.repeat(10000),fontSize:'bad',weight:10000,w:NaN,h:NaN}]});assert.equal(p.regions[0].text.length,4000);assert.equal(p.regions[0].weight,900);assert.ok(Number.isFinite(p.regions[0].fontSize));});

const photoPlan=()=>({width:1600,height:845,background:'#131312',regions:[
 {type:'background',x:0,y:0,w:1,h:.1,text:'Header'},
 {type:'text',x:.1,y:.04,w:.1,h:.02,text:'About',fontSize:.8},
 {type:'background',x:0,y:.1,w:1,h:.9,text:'Landscape'},
 {type:'text',x:.42,y:.42,w:.16,h:.03,text:'GAME ARTIST',fontSize:1.2,letterSpacing:.3},
 {type:'text',x:.29,y:.49,w:.44,h:.24,text:'Portfolio',fontSize:9}
]});
test('Photographic backgrounds become section layers, never sibling image columns',()=>{
 const p=photoPlan(),out=D.compile(p,M,{assets:{'region-1':'assets/header.webp','region-3':'assets/hero.webp'}});
 assert.equal(out.sections.length,2);assert.equal(out.sections[0].surface.image,'assets/header.webp');assert.equal(out.sections[1].surface.image,'assets/hero.webp');
 assert.equal(allElements(out.sections).length,3);assert.ok(allElements(out.sections).every(e=>e.type==='text'));
 assert.ok(Math.abs(out.sections.reduce((n,s)=>n+s.height,0)-845/1600*80)<.001);
 assert.deepEqual(M.validate({...M.fresh(),sections:out.sections}),[]);
});
test('Large headings and tracking survive config serialization',()=>{
 const out=D.compile(photoPlan(),M),elements=allElements(JSON.parse(JSON.stringify(out.sections)));
 assert.equal(elements.find(e=>e.text==='Portfolio').style.fontSize,9);
 assert.equal(elements.find(e=>e.text==='GAME ARTIST').style.letterSpacing,.3);
 assert.ok(elements.every(e=>e.style.referenceWidth===1280));
});
test('Reference insets are opt-in and do not leak into mobile stacking or ordinary layouts',()=>{
 const out=D.compile(photoPlan(),M);let found=0;
 out.sections.forEach(s=>M.visitCells(s.grid,c=>{if(c.element){assert.ok(c.referenceInset.enabled);found++;}}));assert.equal(found,3);
 for(const s of [...out.mobile,...out.tablet,...D.compile(hero(),M).sections])M.visitCells(s.grid,c=>assert.equal(c.referenceInset,undefined));
 for(const e of allElements(out.mobile))assert.equal(e.style.referenceWidth,undefined);
});
test('Background-only designs compile; ambiguous overlapping layers are rejected',()=>{
 const p=photoPlan();p.regions=p.regions.filter(r=>r.type==='background');assert.equal(D.compile(p,M).sections.length,2);
 p.regions[1].y=.05;assert.throws(()=>D.compile(p,M),/overlap/);
});
test('Cleanup removes detected source glyphs even after text is moved or excluded',()=>{
 const width=60,height=40,data=new Uint8ClampedArray(width*height*4);for(let i=0;i<data.length;i+=4)data.set([30,20,10,255],i);
 for(let y=10;y<18;y++)for(let x=10;x<18;x++)data.set([240,240,240,255],(y*width+x)*4);
 const before=data.slice(),r={type:'text',enabled:false,x:.6,y:.6,w:.1,h:.1,color:'#ffffff',sourceBox:{x:10/width,y:10/height,w:8/width,h:8/height,color:'#f0f0f0'}};
 const clean=D.cleanBackdrop({width,height,data},[r]);assert.deepEqual([...clean.slice((12*width+12)*4,(12*width+12)*4+3)],[30,20,10]);assert.deepEqual(data,before);assert.deepEqual([...clean.slice(0,4)],[30,20,10,255]);
});
test('Backdrop classification leaves ordinary side-by-side media unchanged',()=>{
 const width=100,height=60,data=new Uint8ClampedArray(width*height*4);
 assert.equal(D.findBackdrop({width,height,data},[{x:.6,y:.2,w:.35,h:.55}]),null);
 assert.equal(D.findBackdrop({width,height:150,data:new Uint8ClampedArray(60000)},[{w:1,h:1}]),null);
});
