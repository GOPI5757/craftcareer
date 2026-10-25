/* CraftCareer image-to-layout compiler. Images and model output are data, never code. */
(function (G) {
  'use strict';
  const clamp = (v, lo, hi, fallback = lo) => Number.isFinite(Number(v)) ? Math.max(lo, Math.min(hi, Number(v))) : fallback;
  const hex = v => /^#[\da-f]{6}$/i.test(String(v)) ? String(v) : null;
  const rgb = a => '#' + a.slice(0, 3).map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const distance = (a, b) => Math.hypot(...a.slice(0, 3).map((v, i) => v - b[i]));
  const bounds = rs => ({x: Math.min(...rs.map(r => r.x)), y: Math.min(...rs.map(r => r.y)), right: Math.max(...rs.map(r => r.x + r.w)), bottom: Math.max(...rs.map(r => r.y + r.h))});
  function normalize(input) {
    if (!input || !Array.isArray(input.regions)) throw Error('The analysis did not return an editable layout. Try local analysis or mark a region yourself.');
    if (input.regions.length > 80) throw Error('Use a smaller screenshot: at most 80 regions can be reviewed at once.');
    const ids=new Set();let nextId=Math.max(0,...input.regions.map(r=>/^region-\d{1,7}$/.test(String(r.id))?Number(r.id.slice(7)):0))+1;
    const regions = input.regions.map((r, i) => {
      const x = clamp(r.x, 0, .99), y = clamp(r.y, 0, .995);
      const id=/^region-\d{1,7}$/.test(String(r.id))&&!ids.has(r.id)?r.id:'region-'+nextId++;ids.add(id);
      return {id, type: ['text', 'button', 'image', 'background'].includes(r.type) ? r.type : 'text',
        x, y, w: clamp(r.w, .01, 1 - x, .3), h: clamp(r.h, .005, 1 - y, .05),
        text: String(r.text || '').slice(0, 4000), color: hex(r.color) || '#eeeeee',
        background: hex(r.background) || '', fontSize: clamp(r.fontSize, .65, 16, 1.1),
        weight: clamp(r.weight, 100, 900, 400), align: ['left', 'center', 'right'].includes(r.align) ? r.align : 'left',
        enabled: r.enabled !== false, visual:r.visual==='crop'?'crop':'', label:String(r.label||'').slice(0,150),reviewOwner:String(r.reviewOwner||''),reviewCreated:String(r.reviewCreated||''),erase:r.erase===true, confidence: clamp(r.confidence, 0, 100, 70), letterSpacing:clamp(r.letterSpacing,0,2,0),radius:clamp(r.radius,0,5,0),
        ...(r.sourceBox?{sourceBox:{x:clamp(r.sourceBox.x,0,.99),y:clamp(r.sourceBox.y,0,.995),w:clamp(r.sourceBox.w,.001,1),h:clamp(r.sourceBox.h,.001,1),color:hex(r.sourceBox.color)||'#eeeeee',mode:r.sourceBox.mode==='area'?'area':'letters'}}:{})};
    });
    return {width: clamp(input.width, 100, 6000, 1280), height: clamp(input.height, 100, 12000, 800), background: hex(input.background) || '#10151e',referenceLayout:input.referenceLayout===true, regions,questions:Array.isArray(input.questions)?structuredClone(input.questions).slice(0,40):[]};
  }
  function pixels(image) {
    const {width: w, height: h, data} = image;
    const at = (x, y) => {const i = (Math.round(clamp(y, 0, h - 1)) * w + Math.round(clamp(x, 0, w - 1))) * 4; return [data[i], data[i + 1], data[i + 2]];};
    function dominant(x, y, bw, bh) {
      const bins = new Map(), step = Math.max(1, Math.floor(Math.sqrt(bw * bh / 1600)));
      for (let yy = y; yy < y + bh; yy += step) for (let xx = x; xx < x + bw; xx += step) {
        const c = at(xx, yy), k = c.map(v => Math.round(v / 24)).join(',');
        const bin = bins.get(k) || {n: 0, sum: [0, 0, 0]}; bin.n++; c.forEach((v, i) => bin.sum[i] += v); bins.set(k, bin);
      }
      const best = [...bins.values()].sort((a, b) => b.n - a.n)[0];
      return best ? best.sum.map(v => v / best.n) : [16, 21, 30];
    }
    return {at, dominant};
  }
  function fromOCR(tsv, image) {
    const W = image.width, H = image.height, p = pixels(image), background = p.dominant(0, 0, W, H), lines = new Map();
    for (const line of String(tsv || '').split('\n').slice(1)) {
      const a = line.split('\t'); if (a[0] !== '5' || Number(a[10]) < 0 || !a[11]?.trim()) continue;
      const r = {x: +a[6], y: +a[7], w: +a[8], h: +a[9], text: a.slice(11).join('\t').trim(), confidence: +a[10]};
      if (![r.x, r.y, r.w, r.h].every(Number.isFinite) || r.w <= 0 || r.h < 5) continue;
      const key = a.slice(1, 5).join('-'); if (!lines.has(key)) lines.set(key, []); lines.get(key).push(r);
    }
    let regions = [];
    for (const words of lines.values()) {
      if(!words.some(r=>r.confidence>=40))continue;
      const b = bounds(words), x = b.x, y = b.y, w = b.right - x, h = b.bottom - y;
      const bg = p.dominant(x - h * .5, y - h * .5, w + h, h * 2);
      const colors = [];
      for (let yy = y; yy < y + h; yy += 2) for (let xx = x; xx < x + w; xx += 2) {const c = p.at(xx, yy); if (distance(c, bg) > 75) colors.push(c);}
      colors.sort((a,b)=>distance(a,bg)-distance(b,bg));
      const color = colors.length ? colors[Math.floor(colors.length * .9)] : (background.reduce((a, b) => a + b) > 384 ? [20, 20, 24] : [240, 240, 246]);
      const text = words.sort((a, b) => a.x - b.x).map(r => r.text).join(' ');
      const button = distance(bg, background) > 55 && text.length < 38 && w / W < .38 && h / H < .1;
      regions.push({type: button ? 'button' : 'text', x: x / W, y: y / H, w: Math.min(1 - x / W, (w + h * .3) / W), h: (h * 1.5) / H,
        text, color: rgb(color), background: button ? rgb(bg) : '', fontSize: Math.max(.75, h / W * 80 * (/[gjpqy]/.test(text)?1.1:1.3)), weight: h / W > .026 ? 700 : 400,
        align: Math.abs((x + w / 2) / W - .5) < .05 ? 'center' : 'left', confidence: words.reduce((n, r) => n + r.confidence, 0) / words.length});
    }
    const unique=[];for(const r of regions.sort((a,b)=>b.w-a.w||b.confidence-a.confidence))if(!unique.some(k=>Math.abs(k.y-r.y)<.01&&Math.min(k.x+k.w,r.x+r.w)-Math.max(k.x,r.x)>Math.min(k.w,r.w)*.6))unique.push(r);regions=unique;
    regions.sort((a, b) => a.y - b.y || a.x - b.x);
    // Join wrapped paragraph lines. Separate headings, buttons and columns remain separate components.
    const merged = [];
    for (const r of regions) {
      const last = merged[merged.length - 1];
      if (last && r.type === 'text' && last.type === 'text' && last.weight===r.weight && Math.abs(last.x - r.x) < .025 && Math.abs(last.fontSize - r.fontSize) < Math.max(.22,last.fontSize*.12) && r.y - (last.y + last.h) < .018 && r.y > last.y + last.h * .45 && last.text.length < 1200) {
        last.text += '\n' + r.text; last.w = Math.max(last.w, r.w); last.h = r.y + r.h - last.y;
      } else merged.push(r);
    }
    return normalize({width: W, height: H, background: rgb(background), regions: merged.slice(0, 60)});
  }
  function findMedia(image, texts) {
    const {width: W, height: H} = image, p = pixels(image), size = Math.max(10, Math.ceil(W / 80));
    const cols = Math.ceil(W / size), rows = Math.ceil(H / size), mask = new Uint8Array(cols * rows), texture=new Uint8Array(cols*rows), background=p.dominant(0,0,W,H);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const nx = (x + .5) * size / W, ny = (y + .5) * size / H;
      if (texts.some(r => nx >= r.x - .005 && nx <= r.x + r.w + .005 && ny >= r.y - .005 && ny <= r.y + r.h + .005)) continue;
      const colors = [], bins = new Set();
      for (let j = 1; j <= 3; j++) for (let i = 1; i <= 3; i++) {const c = p.at((x + i / 4) * size, (y + j / 4) * size); colors.push(c); bins.add(c.map(v => Math.floor(v / 32)).join(','));}
      const avg = [0, 1, 2].map(i => colors.reduce((n, c) => n + c[i], 0) / colors.length);
      const varied=bins.size>=4&&colors.reduce((n,c)=>n+distance(c,avg),0)/colors.length>18;
      if(varied)texture[y*cols+x]=1;
      if (varied || colors.filter(c=>distance(c,background)>24).length>=6) mask[y * cols + x] = 1;
    }
    // Close small holes in photographs without flooding into plain page backgrounds.
    const grown = mask.slice();
    for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {let n = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) n += mask[(y + j) * cols + x + i]; if (n >= 3) grown[y * cols + x] = 1;}
    const regions = [];
    for (let start = 0; start < grown.length; start++) {
      if (!grown[start]) continue;
      const queue = [start]; grown[start] = 0; let left = cols, right = 0, top = rows, bottom = 0, varied=0;
      for (let q = 0; q < queue.length; q++) {const n = queue[q], x = n % cols, y = Math.floor(n / cols); varied+=texture[n];left = Math.min(left, x); right = Math.max(right, x + 1); top = Math.min(top, y); bottom = Math.max(bottom, y + 1);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {const xx = x + dx, yy = y + dy, k = yy * cols + xx; if (xx >= 0 && xx < cols && yy >= 0 && yy < rows && grown[k]) {grown[k] = 0; queue.push(k);}}}
      // Ignore thin decorative tails attached to a picture (leaders, rays and rules).
      const trim=(axis,start,end)=>{const counts=new Array(end-start).fill(0);for(const n of queue)counts[(axis==='x'?n%cols:Math.floor(n/cols))-start]++;const max=Math.max(...counts),keep=counts.map((n,i)=>n>=Math.max(2,max*.12)?i+start:null).filter(n=>n!==null);return keep.length?[keep[0],keep.at(-1)+1]:[start,end];};
      [left,right]=trim('x',left,right);[top,bottom]=trim('y',top,bottom);
      const r = {type: 'image', x: left * size / W, y: top * size / H, w: Math.min(1, right * size / W) - left * size / W, h: Math.min(1, bottom * size / H) - top * size / H, text: 'Image from reference', confidence: 65};
      let denseRows=0;for(let yy=top;yy<bottom;yy++){let occupied=0;for(let xx=left;xx<right;xx++)occupied+=mask[yy*cols+xx];if(occupied/(right-left)>.35)denseRows++;}
      if (r.w > .1 && r.h * H / W > .08 && r.w * r.h > .015 && queue.length > 15 && varied>5 && denseRows/(bottom-top)>.45 && (r.w*r.h>.045||varied/queue.length>.25) && (r.w*r.h<.8||varied/queue.length>.05)) regions.push(r);
    }
    return regions.sort((a, b) => b.w * b.h - a.w * a.h).slice(0, 16).map(r=>{
      if(r.w>.65)return r;
      // Dark rims/shadows can match the page fill. Keep a small context margin
      // around isolated artwork rather than cutting the silhouette at bright ink.
      const pad=Math.max(r.w*W,r.h*H)*.08,x=Math.max(0,r.x-pad/W),y=Math.max(0,r.y-pad/H);
      return {...r,x,y,w:Math.min(1,r.x+r.w+pad/W)-x,h:Math.min(1,r.y+r.h+pad/H)-y};
    });
  }
  function findButtons(image,media=[]) {
    const W=image.width,H=image.height,p=pixels(image),bg=p.dominant(0,0,W,H),step=Math.max(2,Math.round(W/400)),cols=Math.ceil(W/step),rows=Math.ceil(H/step),keys=new Array(cols*rows).fill(''),visited=new Uint8Array(cols*rows);
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const c=p.at((x+.5)*step,(y+.5)*step);if(distance(c,bg)>14)keys[y*cols+x]=c.map(v=>Math.round(v/8)).join(',');}
    const found=[];
    for(let n=0;n<keys.length;n++){if(!keys[n]||visited[n])continue;const queue=[n],key=keys[n];visited[n]=1;let left=cols,right=0,top=rows,bottom=0;
      for(let q=0;q<queue.length;q++){const k=queue[q],x=k%cols,y=Math.floor(k/cols);left=Math.min(left,x);right=Math.max(right,x+1);top=Math.min(top,y);bottom=Math.max(bottom,y+1);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,i=yy*cols+xx;if(xx>=0&&xx<cols&&yy>=0&&yy<rows&&!visited[i]&&keys[i]===key){visited[i]=1;queue.push(i);}}}
      const w=(right-left)*step,h=(bottom-top)*step,r={x:left*step/W,y:top*step/H,w:w/W,h:h/H};
      if(w/W<.055||w/W>.45||h/W<.014||h/W>.09||w/h<1.5||queue.length/((right-left)*(bottom-top))<.62||media.some(m=>r.x+r.w/2>=m.x&&r.x+r.w/2<=m.x+m.w&&r.y+r.h/2>=m.y&&r.y+r.h/2<=m.y+m.h))continue;
      r.background=rgb(p.dominant(left*step,top*step,w,h));found.push(r);
    }
    return found.sort((a,b)=>a.y-b.y).slice(0,16);
  }
  // A broad photographic region is a layer, not a sibling column of its overlaid text.
  function findBackdrop(image,media) {
    const W=image.width,H=image.height;
    if(H/W>1.25||!media.some(r=>r.w>.65&&r.h>.5&&r.w*r.h>.5))return null;
    const p=pixels(image),step=Math.max(2,Math.floor(H/400)),busy=[];
    for(let y=0;y<H;y+=step){const cs=Array.from({length:30},(_,i)=>p.at((i+.5)*W/30,y)),median=[0,1,2].map(k=>cs.map(c=>c[k]).sort((a,b)=>a-b)[15]);busy.push(cs.filter(c=>distance(c,median)>30).length>=10);}
    // Text-free dark bands within a photo are still part of the same backdrop.
    for(let i=1;i<busy.length;i++){if(busy[i])continue;let j=i;while(j<busy.length&&!busy[j])j++;if(busy[i-1]&&busy[j]&&j-i<busy.length*.12)for(let k=i;k<j;k++)busy[k]=true;i=j;}
    let best={start:0,end:0},start=-1;
    for(let i=0;i<=busy.length;i++){if(busy[i]){if(start<0)start=i;}else if(start>=0){if(i-start>best.end-best.start)best={start,end:i};start=-1;}}
    if((best.end-best.start)*step/H<.5)return null;
    const top=best.start*step/H;let bottom=Math.min(1,best.end*step/H);if(bottom>.8){const colors=Array.from({length:40},(_,i)=>p.at((i+.5)*W/40,H*.98)),center=p.dominant(0,H*.96,W,H*.04);if(colors.filter(c=>distance(c,center)>22).length>=8)bottom=1;}
    return {type:'background',x:0,y:top,w:1,h:bottom-top,text:'Photographic background',confidence:80};
  }
  // Neutral bright/dark lettering remains readable over artwork; image texture is suppressed.
  function letteringMask(image,backdrop) {
    const out=new Uint8ClampedArray(image.data.length),W=image.width,H=image.height;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,c=Array.from(image.data.slice(i,i+3)),hi=Math.max(...c),lo=Math.min(...c);
      const inside=y/H>=backdrop.y&&y/H<=backdrop.y+backdrop.h;
      const ink=inside?lo>120&&hi-lo<70:lo>110&&hi-lo<100;
      out[i]=out[i+1]=out[i+2]=ink?0:255;out[i+3]=255;
    }return out;
  }
  function inkGroups(image) {
    const W=image.width,H=image.height,seen=new Uint8Array(W*H),parts=[];
    for(let n=0;n<W*H;n++){if(seen[n]||image.data[n*4]>100)continue;const queue=[n];seen[n]=1;let x0=W,y0=H,x1=0,y1=0;
      for(let q=0;q<queue.length;q++){const i=queue[q],x=i%W,y=Math.floor(i/W);x0=Math.min(x0,x);x1=Math.max(x1,x+1);y0=Math.min(y0,y);y1=Math.max(y1,y+1);
        for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy,k=yy*W+xx;if(xx>=0&&xx<W&&yy>=0&&yy<H&&!seen[k]&&image.data[k*4]<100){seen[k]=1;queue.push(k);}}}
      if(queue.length>=4&&y1-y0>=4&&x1-x0>=2&&y1-y0<H*.3&&x1-x0<W*.8)parts.push({x:x0,y:y0,w:x1-x0,h:y1-y0});
    }
    const groups=[];
    for(const p of parts.sort((a,b)=>a.x-b.x)){const g=groups.find(g=>p.x-g.right<Math.max(p.h,g.h)*2.3&&p.x>=g.right-3&&Math.min(p.y+p.h,g.bottom)-Math.max(p.y,g.y)>Math.min(p.h,g.h)*.45&&Math.max(p.h,g.h)/Math.min(p.h,g.h)<2.8);
      if(g){g.right=p.x+p.w;g.y=Math.min(g.y,p.y);g.bottom=Math.max(g.bottom,p.y+p.h);g.h=g.bottom-g.y;g.count++;}else groups.push({...p,right:p.x+p.w,bottom:p.y+p.h,count:1});}
    return groups.filter(g=>g.count>=2&&g.right-g.x>g.h&&g.h>5).sort((a,b)=>a.y-b.y).slice(0,35).map(g=>({x:Math.max(0,g.x-4)/W,y:Math.max(0,g.y-4)/H,w:Math.min(W-g.x+4,g.right-g.x+8)/W,h:Math.min(H-g.y+4,g.h+8)/H}));
  }
  // Fill only detected lettering. This is approximate local cleanup, not recovery of hidden artwork.
  function cleanBackdrop(image,regions) {
    const W=image.width,H=image.height,src=image.data,out=new Uint8ClampedArray(src),mask=new Uint8Array(W*H);
    for(const region of regions){if(!region.enabled&&!region.erase&&(!region.sourceBox||region.reviewOwner))continue;if(!region.sourceBox&&!['text','button'].includes(region.type))continue;const r=region.sourceBox||region;
      const pad=r.mode==='area'?-2:3,color=(r.color.match(/\w\w/g)||[]).map(c=>parseInt(c,16)),x0=Math.max(0,Math.floor(r.x*W)-pad),x1=Math.min(W,Math.ceil((r.x+r.w)*W)+pad),y0=Math.max(0,Math.floor(r.y*H)-pad),y1=Math.min(H,Math.ceil((r.y+r.h)*H)+pad);
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*W+x)*4;if(r.mode==='area'||Math.hypot(src[i]-color[0],src[i+1]-color[1],src[i+2]-color[2])<95)mask[y*W+x]=1;}
    }
    const grown=mask.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(mask[y*W+x])for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)grown[(y+dy)*W+x+dx]=1;
    const pending=grown.slice(),queue=[],neighbors=n=>[n-W,n+W,...(n%W?[n-1]:[]),...(n%W<W-1?[n+1]:[])].filter(i=>i>=0&&i<W*H);
    for(let n=0;n<pending.length;n++)if(pending[n]&&neighbors(n).some(i=>!grown[i])){queue.push(n);pending[n]=2;}
    for(let q=0;q<queue.length;q++){const n=queue[q],good=neighbors(n).filter(i=>!grown[i]);if(!good.length)continue;for(let k=0;k<3;k++)out[n*4+k]=Math.round(good.reduce((sum,i)=>sum+out[i*4+k],0)/good.length);grown[n]=0;
      for(const i of neighbors(n))if(pending[i]===1){pending[i]=2;queue.push(i);}}
    return out;
  }
  // Repeated controls are one list component, not a subdivision per control.
  // Require a clear common axis, compatible sizes, and no intervening content.
  function groupRepeats(regions,W=1280,H=800){
    const remaining=regions.slice(),groups=[];
    for(const direction of ['column','row']){
      const axis=direction==='row'?'x':'y',cross=direction==='row'?'y':'x',size=axis==='x'?'w':'h',breadth=cross==='x'?'w':'h',scale=axis==='x'?W:H;
      const controls=remaining.filter(r=>r.type==='button').sort((a,b)=>a[axis]-b[axis]);
      const used=new Set();
      for(const a of controls){if(used.has(a))continue;const members=[a];
        for(const b of controls){if(b===a||used.has(b)||b[axis]<members.at(-1)[axis]+members.at(-1)[size]-.003)continue;
          const p=members.at(-1),crossDelta=Math.abs((a[cross]+a[breadth]/2)-(b[cross]+b[breadth]/2)),gap=b[axis]-p[axis]-p[size];
          if(crossDelta>Math.max(.006,Math.min(a[breadth],b[breadth])*.22)||Math.max(a.h,b.h)/Math.min(a.h,b.h)>1.65||gap<-.003||gap*scale>Math.max(50,Math.min(p[size],b[size])*scale*1.5)||String(a.visual||'')!==String(b.visual||''))continue;
          const bnd=bounds([...members,b]),blocking=remaining.some(r=>!members.includes(r)&&r!==b&&r.type!=='button'&&r.x<bnd.right&&r.x+r.w>bnd.x&&r.y<bnd.bottom&&r.y+r.h>bnd.y);if(blocking)continue;
          if(members.length>1){const previous=members.slice(1).map((r,i)=>r[axis]-members[i][axis]-members[i][size]),mean=previous.reduce((n,v)=>n+v,0)/previous.length;if(Math.abs(gap-mean)>Math.max(.008,mean*.45))continue;}
          members.push(b);
        }
        if(members.length<2)continue;members.forEach(r=>used.add(r));const b=bounds(members),gaps=members.slice(1).map((r,i)=>r[axis]-members[i][axis]-members[i][size]);groups.push({id:'list-'+a.id,type:'list',x:b.x,y:b.y,w:b.right-b.x,h:b.bottom-b.y,direction,gap:Math.max(0,gaps.reduce((n,v)=>n+v,0)/gaps.length),members});
      }
      for(let i=remaining.length-1;i>=0;i--)if(used.has(remaining[i]))remaining.splice(i,1);
    }return [...remaining,...groups];
  }
  function compile(raw, M, {name = 'Design from image', id = 'design-from-image', assets = {}} = {}) {
    const plan = normalize(raw), backdrops=plan.regions.filter(r=>r.enabled&&r.type==='background'), notes = [];
    const reference=plan.referenceLayout||backdrops.length>0;
    for(let i=0;i<backdrops.length;i++)for(let j=0;j<i;j++)if(Math.min(backdrops[i].y+backdrops[i].h,backdrops[j].y+backdrops[j].h)-Math.max(backdrops[i].y,backdrops[j].y)>.005)throw Error('Background layers overlap. Adjust their top and height so each covers its own section.');
    const regions=plan.regions.filter(r=>r.enabled&&r.type!=='background').map(r=>{
      if(!reference||r.type!=='text')return r;
      const scale=plan.height/plan.width*80,line=r.fontSize*1.1,glyph=r.h/1.5*scale;
      return {...r,y:Math.max(0,r.y-Math.max(0,line-glyph)/2/scale),h:Math.max(r.h,line/scale)};
    });
    const active=groupRepeats(regions,plan.width,plan.height);
    if (!active.length&&!backdrops.length) throw Error('Add or enable at least one region before creating the layout.');
    const unit = 80, aspect = plan.height / plan.width;
    const regionElement = r => {
      if(r.type==='list'){
        const e=M.element('list');e.itemType='button';e.direction=r.direction;e.gap=r.gap*(r.direction==='column'?aspect:1)*unit;e.columnHeight=r.h*aspect*unit+.1;e.style.background=[];e.style.padding=0;e.itemStyle.background=[];e.itemStyle.padding=0;
        if(reference)e.referenceWidth=1280;
        e.items=r.members.map(m=>{const b=regionElement(m);return {...b,id:M.uid('item'),override:true,options:[],src:'',alt:m.label||m.text};});e.itemStyle=structuredClone(e.items[0].style);for(const item of e.items)item.override=JSON.stringify(item.style)!==JSON.stringify(e.itemStyle);for(const key of ['hoverBackground','clickBackground','hoverColor','clickColor'])e[key]=e.items[0][key];return e;
      }
      const e = M.element(r.type); e.style = {...e.style, color: r.color, fontSize: r.fontSize, fontWeight: r.weight, textAlign: r.align, lineHeight: 1.25, borderRadius: 0,letterSpacing:r.letterSpacing};
      if(reference){e.style.fontFamily='Arial, sans-serif';e.style.referenceWidth=1280;e.style.referenceFit=true;e.referenceWidth=1280;}
      if (r.type === 'image') {e.src = assets[r.id] || ''; e.alt = r.text || 'Image from reference'; e.height = Math.max(.5, r.h * aspect * unit); e.lightbox = false;e.fit='contain';}
      else {e.text = r.text; if (r.type === 'text') e.tag = r.fontSize >= 2.3 ? 'h2' : 'p';
        else {e.icon = ''; e.style.background = r.background ? [r.background] : []; e.style.borderWidth = 0; e.style.borderRadius = .4; e.style.padding = .6; e.hoverBackground = r.background || 'transparent'; e.clickBackground = r.background || 'transparent'; e.hoverColor = r.color; e.clickColor = r.color;if(r.reviewCreated){e.style.padding=0;e.style.borderRadius=0;}if(r.visual==='crop'){e.imageIcon=assets[r.id]||'';e.label=r.label||'Image button';e.sizeMode='custom';e.width=r.w*unit;e.height=r.h*aspect*unit;e.style.padding=0;e.style.background=[];e.style.borderRadius=0;e.hoverBackground='transparent';e.clickBackground='transparent';}}}
      if(r.type==='button'&&reference){e.sizeMode='custom';e.width=r.w*unit;e.height=r.h*aspect*unit;e.style.padding=0;e.style.borderRadius=r.radius||0;}
      return e;
    };
    function tree(rs, box, depth = 0) {
      const c = M.cell(); c.gap = 0; c.align = 'left top';
      if (rs.length === 1) {
        const r = rs[0], margin = Math.min(Math.max(0, r.x - box.x), Math.max(0, box.right - r.x - r.w), Math.max(0, (r.y - box.y) * aspect), Math.max(0, (box.bottom - r.y - r.h) * aspect));
        c.padding = Math.min(3, margin * unit); const cx = (r.x + r.w / 2 - box.x) / (box.right - box.x), cy = (r.y + r.h / 2 - box.y) / (box.bottom - box.y);
        c.align = (cx < .38 ? 'left' : cx > .62 ? 'right' : 'center') + (cy < .38 ? ' top' : cy > .62 ? ' bottom' : '');
        c.element = regionElement(r);
        if(reference){
          c.padding=0;c.align='left top';c.referenceInset={enabled:true,left:Math.max(0,(r.x-box.x)/(box.right-box.x)*100),right:Math.max(0,(box.right-r.x-r.w)/(box.right-box.x)*100),top:Math.max(0,(r.y-box.y)/(box.bottom-box.y)*100),bottom:0};c.element.style.lineHeight=1.1;
        }return c;
      }
      if (depth >= 3) {
        if (rs.every(r => r.type === 'text')) {
          const e = M.element('list'); e.direction = 'column'; e.gap = .5; e.columnHeight = 200; e.itemStyle.background = []; e.itemStyle.padding = 0;
          e.items = rs.sort((a, b) => a.y - b.y || a.x - b.x).map(r => ({id: M.uid('item'), enabled: true, text: r.text, override: true, style: regionElement(r).style, action: M.action(), options: []})); c.element = e; return c;
        }
        throw Error('This area is too complex for three grid levels. Split the screenshot into smaller images or remove overlapping regions.');
      }
      const choices = [];
      for (const axis of ['x', 'y']) {
        const length = axis === 'x' ? 'w' : 'h', start = box[axis], end = axis === 'x' ? box.right : box.bottom;
        const sorted = rs.slice().sort((a, b) => a[axis] - b[axis]); let maxEnd = sorted[0][axis] + sorted[0][length];
        for (let i = 1; i < sorted.length; i++) {const gap = sorted[i][axis] - maxEnd;
          if (gap > .002) choices.push({axis, cut: (maxEnd + sorted[i][axis]) / 2, score: gap / (end - start), groups: [sorted.slice(0, i), sorted.slice(i)]});
          maxEnd = Math.max(maxEnd, sorted[i][axis] + sorted[i][length]);}
      }
      choices.sort((a, b) => b.score - a.score);
      let groups, axis, cuts;
      const choice = choices.find(v => v.groups.every(g => g.length <= 4 ** (3 - depth - 1))) || choices[0];
      if (choice) {
        axis = choice.axis;
        const candidates = choices.filter(v => v.axis === axis).sort((a,b) => b.score-a.score).slice(0,3).sort((a,b) => a.cut-b.cut);
        cuts = candidates.map(v=>v.cut); groups = Array.from({length:cuts.length+1},()=>[]);
        for(const r of rs){let i=0;while(i<cuts.length&&r[axis]>=cuts[i])i++;groups[i].push(r);}
      }
      else {
        const b = bounds(rs); axis = (b.right - b.x) > (b.bottom - b.y) * aspect * 1.5 ? 'x' : 'y';
        const sorted = rs.slice().sort((a, b) => (a[axis] - b[axis]) || a.x - b.x), count = Math.min(4, Math.max(2, Math.ceil(rs.length / (4 ** (2 - depth)))));
        groups = Array.from({length: count}, (_, i) => sorted.slice(Math.floor(i * sorted.length / count), Math.floor((i + 1) * sorted.length / count)));
        cuts = groups.slice(0, -1).map((g, i) => {const a = bounds(g), b = bounds(groups[i + 1]); return axis === 'x' ? (a.right + b.x) / 2 : (a.bottom + b.y) / 2;});
      }
      const start = box[axis], end = axis === 'x' ? box.right : box.bottom;
      // Clamp cuts to increasing, nonzero tracks; no absolute-positioned DOM or arbitrary code.
      const points = [start]; cuts.forEach((n, i) => points.push(clamp(n, points.at(-1) + (end - start) * .04, end - (cuts.length - i) * (end - start) * .04))); points.push(end);
      c.direction = axis === 'x' ? 'columns' : 'rows'; c.ratios = points.slice(1).map((n, i) => (n - points[i]) / (end - start) * 100);
      c.children = groups.map((g, i) => tree(g, axis === 'x' ? {...box, x: points[i], right: points[i + 1]} : {...box, y: points[i], bottom: points[i + 1]}, depth + 1)); return c;
    }
    // Full-page designs become several sections at large whitespace breaks.
    const sorted = active.slice().sort((a, b) => a.y - b.y), bands = []; let group = [], bottom = 0;
    for (const r of sorted) {if (group.length && r.y - bottom > .055) {bands.push(group); group = [];} group.push(r); bottom = Math.max(bottom, r.y + r.h);}
    if (group.length) bands.push(group);
    const sectionRanges=backdrops.length?Array.from(new Set([0,1,...backdrops.flatMap(b=>[b.y,b.y+b.h])])).sort((a,b)=>a-b).slice(0,-1).map((top,i,starts)=>({top,end:starts[i+1]??1})).filter(b=>b.end-b.top>.002):bands.map((rs,i)=>({top:i===0?0:(bounds(bands[i-1]).bottom+bounds(rs).y)/2,end:i===bands.length-1?1:(bounds(rs).bottom+bounds(bands[i+1]).y)/2,rs}));
    const sections = sectionRanges.map(({top,end,rs:provided}, i) => {const rs=provided||active.filter(r=>r.y+r.h*.33>=top&&r.y+r.h*.33<end);
      const s = M.section(sectionRanges.length === 1 ? name : name + ' · ' + (i + 1), 'flexible'); s.id = sectionRanges.length === 1 ? id : id + '-' + (i + 1); s.height = Math.max(2, (end - top) * aspect * unit); s.surface.background = [plan.background]; s.surface.overlay.enabled = false; s.gap = 0;if(reference){s.referenceAspect=(end-top)*aspect;s.preserveProportions=true;}
      const backdrop=backdrops.find(b=>top>=b.y-.001&&end<=b.y+b.h+.001);if(backdrop){s.surface.image=assets[backdrop.id]||'';s.surface.imageFit='cover';}
      if(!rs.length)return s;
      const extent=bounds(active),left=extent.x>.015?extent.x:0,right=1-extent.right>.015?1-extent.right:0;
      if(!reference&&(left||right)){try{const inner=tree(rs,{x:left,y:top,right:1-right,bottom:end},1),outer=M.cell();outer.gap=0;outer.direction='columns';outer.children=[];outer.ratios=[];
        if(left){const margin=M.cell();margin.gap=0;outer.children.push(margin);outer.ratios.push(left*100);}outer.children.push(inner);outer.ratios.push((1-left-right)*100);
        if(right){const margin=M.cell();margin.gap=0;outer.children.push(margin);outer.ratios.push(right*100);}s.grid=outer;
      }catch{s.grid=tree(rs,{x:0,y:top,right:1,bottom:end});notes.push('Outer spacing was simplified to keep this section within the supported grid depth.');}}
      else s.grid = tree(rs, {x: 0, y: top, right: 1, bottom: end}); return s;
    });
    function responsive(s, device) {
      const copy = M.clone(s), width = device === 'mobile' ? 22 : 45;
      delete copy.referenceAspect;delete copy.preserveProportions;
      function adjust(c) {
        delete c.referenceInset;c.padding = Math.min(c.padding, 1); c.align = 'left top';
        if (c.children.length) {const sizes = c.children.map(adjust); c.direction = 'rows'; c.ratios = sizes.map(h => h / sizes.reduce((a, b) => a + b, 0) * 100); c.gap = .75; return sizes.reduce((a, b) => a + b, 0) + (sizes.length - 1) * .75 + c.padding * 2;}
        const e = c.element;if(e)delete e.referenceWidth; if (!e) {c.enabled=false;return .01;}
        if (e.type === 'image') {e.height = Math.min(device === 'mobile' ? 18 : 26, e.height); return e.height + .5;}
        delete e.style.referenceWidth;delete e.style.referenceFit;e.style.fontSize = Math.max(.85, Math.min(device === 'mobile' ? 2.5 : 3.5, e.style.fontSize));
        if (e.type === 'list') {delete e.itemStyle.referenceWidth;delete e.itemStyle.referenceFit;e.itemStyle.fontSize=Math.max(.85,Math.min(2.5,e.itemStyle.fontSize));e.items.forEach(t => {delete t.referenceWidth;delete t.style.referenceWidth;delete t.style.referenceFit;t.style.fontSize = Math.max(.85,Math.min(2.5, t.style.fontSize));if(e.itemType==='button'){t.height=Math.max(2.75,t.height);t.width=Math.min(width-2,t.width);}});e.columnHeight=200;return e.direction==='column'?e.items.reduce((n,t)=>n+(t.height||2.75)+e.gap,0):Math.ceil(e.items.reduce((n,t)=>n+(t.width||6)+e.gap,0)/(width-2))*Math.max(...e.items.map(t=>t.height||2.75))+1;}
        return Math.max(e.type === 'button' ? 3.5 : 2, (String(e.text).split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length * e.style.fontSize * .57 / width)), 0)) * e.style.fontSize * 1.4 + 1) + c.padding * 2;
      }
      copy.height = Math.max(copy.surface.image?16:0,adjust(copy.grid) + 2); copy.padding = 1;if(backdrops.length)copy.surface.imageFit='cover'; return copy;
    }
    const mobile=sections.map(s=>responsive(s,'mobile')),tablet=sections.map(s=>responsive(s,'tablet'));
    const navigation=plan.questions.find(q=>q.kind==='navigation'&&q.answer==='navigation');
    if(navigation){for(const variants of [sections,mobile,tablet]){const header=variants[0];if(header&&navigation.band&&sectionRanges[0].end<=navigation.band.h+.02){header.type='appbar';header.name=name+' · Navigation';header.sticky=false;header.surface.image='';header.surface.background=[navigation.band.color||plan.background];const block=M.subsection('');block.grid=header.grid;block.height=header.height;block.heightMode='auto';block.surface.enabled=false;header.blocks=[block];header.grid=M.cell();}}}
    if (regions.some(r => r.type === 'button')) notes.push('Button destinations cannot be read from a screenshot. Set their actions in the inspector.');
    if(active.some(r=>r.type==='list'))notes.push('Repeated buttons are grouped into editable lists. Change shared styling, spacing and individual actions in the inspector.');
    if(backdrops.length)notes.push('Artwork behind text is reconstructed approximately. Replace the background with the original artwork for a clean result. Review detected controls and add any missed regions before importing.');
    notes.push('Fonts, spacing and mobile stacking are approximations. Every generated component remains editable.');
    return {sections,mobile,tablet,notes};
  }
  const api = {normalize, fromOCR, findMedia, findButtons, findBackdrop, letteringMask, inkGroups, cleanBackdrop,groupRepeats, compile, pixels, clamp};
  G.CraftDesign = api; if (typeof module !== 'undefined') module.exports = api;
})(globalThis);
