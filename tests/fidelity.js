(async()=>{
 const status=document.querySelector('#status'),results=document.querySelector('#results');let passed=0,failed=0;
 const wait=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m='Assertion failed')=>{if(!v)throw Error(m);};
 const until=async(fn,message='Timed out',ms=15000)=>{const end=Date.now()+ms;while(Date.now()<end){if(fn())return;await wait(80);}throw Error(message);};
 const test=async(name,fn)=>{try{await fn();passed++;results.insertAdjacentHTML('beforeend','<li class="pass">PASS '+name+'</li>');}catch(e){failed++;const li=document.createElement('li');li.className='fail';li.textContent='FAIL '+name+' — '+e.message;results.append(li);}status.textContent=passed+' passed · '+failed+' failed · running';};
 const frame=document.querySelector('#workspace');await new Promise(r=>frame.onload=r);const w=frame.contentWindow;await w.CraftCareer.ready;w.document.querySelector('#modal').close();
 const A=w.CraftDesignAssistant,D=w.CraftDesign,M=w.ForgeModel,L=w.CraftLayout,api=w.CraftCareer;
 const blob=await(await fetch('/__test__/artist-reference.png')).blob(),canvas=await A.decode(blob);let plan,media,result,zip,exported;
 const elements=sections=>{const found=[];sections.forEach(s=>M.visitCells(s.grid,c=>{if(c.element)found.push(c.element);}));return found;};
 const render=async(width,sections,container)=>{
  const target=document.createElement('iframe'),height=1280*canvas.height/canvas.width,doc=M.fresh();doc.site.backToTop=false;doc.sections=sections;
  target.style.cssText='width:'+width+'px;height:'+height+'px;border:0;transform-origin:0 0';
  if(container){container.append(target);target.style.transform='scale('+container.clientWidth/width+')';container.style.height=height*container.clientWidth/width+'px';}
  else{target.style.cssText+=';position:fixed;left:0;top:0;visibility:hidden';document.body.append(target);}
  target.srcdoc='<!doctype html><style>'+w.FORGE_RESOURCES.css+'</style><div id="site"></div><script>'+w.FORGE_RESOURCES.layout+'<\/script><script>'+w.FORGE_RESOURCES.icons+'<\/script><script>'+w.FORGE_RESOURCES.runtime+'<\/script><script>ForgeRuntime(document.getElementById("site"),'+JSON.stringify(doc).replace(/</g,'\\u003c')+');<\/script>';
  await new Promise(r=>target.onload=r);await wait(250);return target;
 };
 await test('Actual user screenshot: real OCR recognizes all nine main text groups',async()=>{
  plan=await A.analyse(canvas,{signal:new w.AbortController().signal,progress:t=>status.textContent=t});
  document.querySelector('#detected').textContent=JSON.stringify(plan,null,2);
  for(const label of ['About','Projects','Contact','GOURAV','WORLDBUILDING','GAME ARTIST','Portfolio','EXPLORE THE WORK','hello@gourav.art'])assert(plan.regions.some(r=>r.type==='text'&&r.text.includes(label)),'Missing '+label);
 });
 await test('Artwork is two background layers with no false text columns',()=>{assert(plan.regions.filter(r=>r.type==='background').length===2);assert(plan.regions.filter(r=>r.type==='text').length===9);assert(!plan.regions.some(r=>r.type==='image'));});
 await test('Source lettering bounds are retained separately from editable text',()=>{assert(plan.regions.filter(r=>r.type==='text').every(r=>r.sourceBox?.w>0));});
 await test('Background crops produce two compressed assets',async()=>{media=await A.crops(canvas,plan);assert(media.size===2);assert([...media.values()].every(b=>b.type==='image/webp'&&b.size>100));const paths=Object.fromEntries([...media].map(([id,b])=>[id,URL.createObjectURL(b)]));result=D.compile(plan,M,{assets:paths});});
 await test('Reference geometry uses bounded grids and nine editable components',()=>{assert(elements(result.sections).length===9);assert(elements(result.sections).every(e=>e.type==='text'));assert(M.validate({...M.fresh(),sections:result.sections}).length===0);result.sections.forEach(s=>M.visitCells(s.grid,(c,depth)=>assert(depth<=3)));});
 const target=await render(1280,result.sections,document.querySelector('#stage'));
 await test('1280px desktop: title and labels retain reference positions and widths',()=>{
  const rd=target.contentDocument,geometry=[];
  for(const p of plan.regions.filter(r=>r.type==='text')){
   const el=[...rd.querySelectorAll('.component-text')].find(n=>n.textContent===p.text);assert(el,'Missing rendered '+p.text);const b=el.getBoundingClientRect(),css=target.contentWindow.getComputedStyle(el),font=parseFloat(css.fontSize),glyph=p.sourceBox.h/1.5*676,expectedTop=p.sourceBox.y*676-Math.max(0,font*1.1-glyph)/2;
   assert(Math.abs(b.left-p.x*1280)<4,'Horizontal position: '+p.text);assert(Math.abs(b.width-p.w*1280)<6,'Width: '+p.text);assert(Math.abs(b.top-expectedTop)<9,'Vertical position: '+p.text);assert(el.scrollWidth<=el.clientWidth+2&&el.scrollHeight<=el.clientHeight+2,'Text clipped: '+p.text);geometry.push({text:p.text,bounds:b.toJSON(),font:css.fontSize});
  }document.querySelector('#geometry').textContent=JSON.stringify(geometry,null,2);
 });
 for(const width of [320,390,768,1024,1600,1920])await test(width+'px: text stays readable and inside the page',async()=>{
  const f=await render(width,width<=600?result.mobile:width<=1024?result.tablet:result.sections);try{const rd=f.contentDocument;assert(rd.documentElement.scrollWidth<=width+2,'Page width overflow');for(const n of rd.querySelectorAll('.component-text')){assert(n.scrollWidth<=n.clientWidth+2&&n.scrollHeight<=n.clientHeight+2,'Clipped '+n.textContent);const b=n.getBoundingClientRect();assert(b.left>=-1&&b.right<=width+1,'Outside viewport '+n.textContent);assert(parseFloat(f.contentWindow.getComputedStyle(n).fontSize)>=10.3,'Unreadable text size');}}finally{f.remove();}
 });
 await test('Original artwork can replace the reconstructed background without processing',async()=>{const r=plan.regions.find(r=>r.type==='background'),replacement=await new Promise(resolve=>A.sample().toBlob(resolve,'image/webp'));const replaced=await A.crops(canvas,plan,()=>true,new Map([[r.id,replacement]]));assert(replaced.get(r.id)===replacement);});
 await test('Editing or excluding recognized text does not change its background cleanup',async()=>{const p=M.clone(plan),title=p.regions.find(r=>r.text==='Portfolio');title.text='My work';title.x=.1;title.enabled=false;const changed=await A.crops(canvas,p);for(const[id,b]of media){const a=new Uint8Array(await b.arrayBuffer()),c=new Uint8Array(await changed.get(id).arrayBuffer());assert(a.length===c.length&&a.every((v,i)=>v===c[i]),'Original lettering reappeared');}});
 const old=M.section('Existing portfolio','flexible'),base=M.fresh();old.grid.element=M.element('text');old.grid.element.text='Keep existing work';base.sections=[old];base.site.publishing={repo:'keep-repo',projectId:'keep-id'};
 await api.applySharedWorkspace({document:base,assets:[],folders:[]});
 await test('Apply adds layers without changing existing work or GitHub identity',async()=>{await api.applyDesign(plan,media,'Artist reference');const doc=api.getDocument();assert(JSON.stringify(doc.sections[0])===JSON.stringify(old));assert(doc.site.publishing.repo==='keep-repo');assert(doc.sections.length===3);assert(api.validate().length===0);});
 await test('Undo and Redo cover both background assets and generated sections',async()=>{w.document.querySelector('#undo').click();assert(api.getDocument().sections.length===1);assert((await api.captureWorkspace()).assets.length===0);w.document.querySelector('#redo').click();assert(api.getDocument().sections.length===3);assert((await api.captureWorkspace()).assets.length===2);});
 await test('Imported heading exposes its font and editable reference-spacing controls',async()=>{
  const preview=w.document.querySelector('#preview');await until(()=>preview.contentDocument?.querySelectorAll('.component-text').length===10);
  const heading=[...preview.contentDocument.querySelectorAll('.component-text')].find(n=>n.textContent==='Portfolio');heading.click();
  await until(()=>w.document.querySelector('#floating-toolbar [aria-label="Font"]')?.value==='Arial, sans-serif','Detected font is missing from the toolbar');
  const group=[...w.document.querySelectorAll('#inspector-content details')].find(n=>n.querySelector('summary')?.textContent==='Reference spacing');assert(group,'Missing reference spacing controls');group.open=true;
  const toggle=group.querySelector('input[type="checkbox"]');assert(toggle?.checked);toggle.click();
  const find=()=>{let cell;api.getDocument().sections.forEach(s=>M.visitCells(s.grid,c=>{if(c.element?.text==='Portfolio')cell=c;}));return cell;};assert(find().referenceInset.enabled===false);
  w.document.querySelector('#undo').click();assert(find().referenceInset.enabled===true);
 });
 await test('Changed heading is saved as config content, not baked into an image',async()=>{const state=await api.captureWorkspace(),title=elements(state.document.sections).find(e=>e.text==='Portfolio');assert(title);title.text='My game art';await api.applySharedWorkspace(state,{preservePublishing:true});zip=await api.buildZip();const configs=await Promise.all(Object.keys(zip.files).filter(n=>/^config\/sections\/.*\.js$/.test(n)).map(n=>zip.file(n).async('string')));assert(configs.some(s=>s.includes('My game art')));assert(configs.some(s=>s.includes('referenceInset')));assert(configs.some(s=>s.includes('surface')));assert(Object.keys(zip.files).filter(n=>n.endsWith('.webp')).length===2);exported=await zip.generateAsync({type:'blob'});});
 await test('Export/reimport retains background assets and desktop/mobile grids',async()=>{const before=api.getDocument();await api.importWebsite(exported);const after=api.getDocument();assert(JSON.stringify(after.sections)===JSON.stringify(before.sections));assert(JSON.stringify(L.resolve(after,'mobile').sections)===JSON.stringify(L.resolve(before,'mobile').sections));assert((await api.captureWorkspace()).assets.length===2);assert(api.validate().length===0);});
 await test('Exported website uses the updated renderer but contains no OCR runtime',async()=>{const names=Object.keys(zip.files);assert(!names.some(n=>/tesseract|traineddata|design-assistant/.test(n)));const js=await zip.file('js/runtime.js').async('string');assert(js.includes('referenceInset'));});
 status.textContent=passed+' passed · '+failed+' failed · complete';document.title=(failed?'FAIL':'PASS')+' Actual-image checks';
})().catch(e=>document.querySelector('#status').textContent='Fatal: '+e.stack);
