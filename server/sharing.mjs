// Ephemeral collaboration foundation. Nothing here grants GitHub access.
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),M=require('../site/model.js'),L=require('../site/layout.js');
const token=()=>randomBytes(32).toString('base64url');
const digest=value=>createHash('sha256').update(value).digest();
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
export const SHARE_LIMITS={assetBytes:15*1024*1024,payloadBytes:24*1024*1024,files:400,hours:24};
function safeTree(value,depth=0,budget={n:0}){if(++budget.n>160000||depth>64)throw fail('Shared configuration is too complex.');if(!value||typeof value!=='object')return;for(const key of Object.keys(value)){if(['__proto__','prototype','constructor'].includes(key))throw fail('Unsupported configuration key.');safeTree(value[key],depth+1,budget);}}
const safePath=p=>typeof p==='string'&&p.length<400&&/^assets\/[a-z0-9-]+\/(images|documents|models|videos)\//.test(p)&&!/[\\?#<>:"\x00-\x1f]/.test(p)&&!p.split('/').some(x=>!x||x==='.'||x==='..')&&(!p.startsWith('assets/archive/')||p.split('/').length===4);
export function validateSharedSnapshot(snapshot){
 if(!snapshot||typeof snapshot!=='object'||!snapshot.document||!Array.isArray(snapshot.assets)||!Array.isArray(snapshot.folders))throw fail('Invalid shared canvas.');safeTree(snapshot.document);
 if(JSON.stringify(snapshot.document).length>2*1024*1024)throw fail('Shared configuration exceeds 2 MB.');
 for(const device of ['desktop','tablet','mobile']){let errors;try{errors=M.validate(L.resolve(snapshot.document,device));}catch{throw fail('Invalid shared layout.');}if(errors.length)throw fail('Invalid shared layout: '+errors[0]);}
 if(snapshot.document.site.publishing&&Object.keys(snapshot.document.site.publishing).length)throw fail('Remove the GitHub publishing connection before sharing.');
 if(snapshot.assets.length>SHARE_LIMITS.files||snapshot.folders.length>2000)throw fail('Too many shared assets or folders.');let size=0;const paths=new Set();
 for(const file of snapshot.assets){if(typeof file.content==='string'&&file.content.length>SHARE_LIMITS.assetBytes*4/3+4)throw fail('Shared assets exceed the 15 MB session limit.',413);if(!safePath(file.path)||paths.has(file.path.toLowerCase())||typeof file.content!=='string'||file.content.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(file.content))throw fail('Invalid shared asset.');const bytes=Buffer.from(file.content,'base64');if(bytes.toString('base64')!==file.content)throw fail('Invalid shared asset encoding.');if(/\.(svgz?|html?|xhtml|xml|js|mjs)$/i.test(file.path))throw fail('Shared sessions cannot include executable or SVG files. Use a PNG or WebP image instead of SVG; ZIP export still keeps your originals.');paths.add(file.path.toLowerCase());size+=bytes.length;if(size>SHARE_LIMITS.assetBytes)throw fail('Shared assets exceed the 15 MB session limit.',413);}
 for(const folder of snapshot.folders)if(typeof folder!=='string'||!(folder==='assets'||safePath(folder+'/placeholder')||/^assets\/[a-z0-9-]+$/.test(folder)))throw fail('Invalid shared folder.');
 return snapshot;
}
export function createSharing({origin,now=()=>Date.now(),maxBytes=100*1024*1024}={}){
 const rooms=new Map(),rates=new Map();let activeUploads=0;
 const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(data));};
 const cleanup=()=>{for(const[id,room]of rooms)if(room.expires<=now())rooms.delete(id);for(const[ip,rate]of rates)if(rate.time<now()-3600000)rates.delete(ip);};
 async function read(req,limit=SHARE_LIMITS.payloadBytes){if(activeUploads>=3)throw fail('The sharing service is busy. Please retry shortly.',429);activeUploads++;try{let n=0,chunks=[];for await(const chunk of req){n+=chunk.length;if(n>limit)throw fail('Sharing request exceeds its size limit.',413);chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw fail('Invalid sharing request.');}}finally{activeUploads--;}}
 const total=()=>[...rooms.values()].reduce((n,r)=>n+r.bytes+[...r.links.values()].reduce((sum,l)=>sum+(l.bytes||0),0),0);
 function authenticate(req,room){const raw=String(req.headers.authorization||'').replace(/^Bearer /,'');if(!/^[A-Za-z0-9_-]{43}$/.test(raw))throw fail('This canvas link is invalid or expired.',403);const hash=digest(raw);for(const role of ['owner','editor','viewer'])if(room.keys[role]&&timingSafeEqual(hash,room.keys[role]))return {role,linkId:'legacy-'+role};for(const link of room.links.values())if(!link.revoked&&timingSafeEqual(hash,link.hash))return {role:link.role,linkId:link.id,link};throw fail('This canvas link has been deleted or expired.',403);}
 const ownerOnly=auth=>{if(auth.role!=='owner')throw fail('Only the owner can manage sent links.',403);};
 const publicLink=l=>({id:l.id,role:l.role,created:l.created,revoked:l.revoked||false});
 function revoke(room,link){link.revoked=true;delete link.snapshot;link.bytes=0;for(const[id,p]of room.people)if(p.linkId===link.id)room.people.delete(id);}
 async function handle(req,res,url){if(!url.pathname.startsWith('/api/canvas'))return false;cleanup();try{
  if(req.method!=='GET'){if(req.headers.origin!==origin)throw fail('Open sharing on the CraftCareer website.',403);if(!String(req.headers['content-type']||'').startsWith('application/json'))throw fail('Expected JSON.',415);}
  if(url.pathname==='/api/canvas'&&req.method==='POST'){
   const ip=req.socket.remoteAddress||'local',rate=rates.get(ip)||{time:now(),count:0};if(rate.time<now()-3600000){rate.time=now();rate.count=0;}if(++rate.count>20)throw fail('Too many new shared sessions. Try again in an hour.',429);rates.set(ip,rate);
   const input=await read(req),snapshot=validateSharedSnapshot(input.snapshot),bytes=Buffer.byteLength(JSON.stringify(snapshot));if(rooms.size>=20||total()+bytes>maxBytes)throw fail('Shared canvas capacity is full. Try again later.',503);
   const id=randomBytes(16).toString('hex'),keys={owner:token(),editor:token(),viewer:token()},expires=now()+SHARE_LIMITS.hours*3600000;
   rooms.set(id,{snapshot,bytes,revision:1,assetRevision:1,updatedAt:now(),expires,links:new Map(),people:new Map(),keys:Object.fromEntries(Object.entries(keys).map(([role,t])=>[role,digest(t)]))});send(res,201,{id,...keys,revision:1,assetRevision:1,expires,limits:SHARE_LIMITS});return true;
  }
  const match=url.pathname.match(/^\/api\/canvas\/([a-f0-9]{32})(?:\/(links|presence)(?:\/([a-f0-9]{24}))?)?$/);if(!match)throw fail('Unknown shared canvas.',404);
  const room=rooms.get(match[1]);if(!room)throw fail('This shared session has expired or the service restarted. Imported independent copies remain on their devices.',410);
  const auth=authenticate(req,room),{role}=auth;
  const reauthorize=()=>{if(rooms.get(match[1])!==room||room.expires<=now())throw fail('This shared session has ended.',410);authenticate(req,room);};
  const info=()=>({revision:room.revision,assetRevision:room.assetRevision,role,updatedAt:room.updatedAt,expires:room.expires});
  if(match[2]==='links'){
   ownerOnly(auth);
   if(req.method==='GET'&&!match[3]){send(res,200,{links:[...room.links.values()].map(publicLink),expires:room.expires});return true;}
   if(req.method==='POST'&&!match[3]){const input=await read(req,4096);reauthorize();if(!['viewer','helper','instance'].includes(input.role))throw fail('Choose Viewer, Instance editor or Helper.');if(room.links.size>=100)throw fail('This session has reached its 100-link limit.');
    const value=token(),link={id:randomBytes(12).toString('hex'),role:input.role,created:now(),hash:digest(value)};
    // Independent copies are frozen when the link is generated, never writable by recipients.
    if(link.role==='instance'){if(total()+room.bytes>maxBytes)throw fail('Shared copy capacity is full.',503);link.snapshot=structuredClone(room.snapshot);link.bytes=room.bytes;}
    room.links.set(link.id,link);send(res,201,{...publicLink(link),token:value,expires:room.expires});return true;
   }
   if(req.method==='DELETE'){if(match[3]){const link=room.links.get(match[3]);if(!link)throw fail('Link not found.',404);revoke(room,link);}else{for(const link of room.links.values())revoke(room,link);room.keys.editor=null;room.keys.viewer=null;for(const[id,p]of room.people)if(p.linkId!=='legacy-owner')room.people.delete(id);}send(res,200,{revoked:true});return true;}
   throw fail('Method not allowed.',405);
  }
  if(match[2]==='presence'){
   if(match[3]||req.method!=='POST')throw fail('Method not allowed.',405);
   if(!['owner','helper','editor'].includes(role))throw fail('Only helpers and the owner can join the live canvas.',403);
   const input=await read(req,4096);reauthorize();if(!/^[a-zA-Z0-9-]{16,64}$/.test(input.clientId||''))throw fail('Invalid participant identifier.');
   for(const[id,p]of room.people)if(now()-p.seen>12000)room.people.delete(id);
   const key=auth.linkId+':'+input.clientId,previous=room.people.get(key);if(previous&&now()-previous.seen<120)throw fail('Please slow down cursor updates.',429);if(!previous&&room.people.size>=30)throw fail('This canvas has reached its 30-participant limit.',429);
   let name=role==='owner'?'Owner':String(input.name||previous?.name||'').replace(/[\x00-\x1f\x7f]/g,'').trim().slice(0,32);
   if(!name)throw fail('Choose a name before joining.');if(role!=='owner'&&/^owner$/i.test(name))name='Owner (helper)';
   let cursor=null;const c=input.cursor;if(c&&typeof c==='object'&&Number.isFinite(c.x)&&Number.isFinite(c.y))cursor={x:Math.max(0,Math.min(1,c.x)),y:Math.max(0,Math.min(1,c.y)),cell:String(c.cell||'').slice(0,90),section:String(c.section||'').slice(0,90),page:String(c.page||'home').slice(0,100),device:['desktop','tablet','mobile'].includes(c.device)?c.device:'desktop'};
   room.people.set(key,{id:input.clientId,name,role:role==='owner'?'owner':'helper',cursor,seen:now(),linkId:auth.linkId});
   send(res,200,{participants:[...room.people.entries()].filter(([k])=>k!==key).map(([,p])=>({id:p.id,name:p.name,role:p.role,cursor:p.cursor}))});return true;
  }
  if(req.method==='GET'){
   if(role==='instance'){send(res,200,{...info(),revision:1,assetRevision:1,snapshot:auth.link.snapshot,independent:true});return true;}
   const since=Number(url.searchParams.get('since')),reuse=Number(url.searchParams.get('assetRevision'))===room.assetRevision;send(res,200,{...info(),assetsUnchanged:reuse,snapshot:since===room.revision?undefined:reuse?{...room.snapshot,assets:undefined}:room.snapshot});return true;
  }
  if(req.method==='DELETE'){ownerOnly(auth);rooms.delete(match[1]);send(res,200,{ended:true});return true;}
  if(req.method==='PUT'){
   if(!['owner','helper','editor'].includes(role))throw fail(role==='instance'?'Independent copies cannot update the owner’s canvas.':'This is a view-only link.',403);
   const input=await read(req);reauthorize();if(input.revision!==room.revision){send(res,409,{error:'Another participant saved changes. Keep a copy of your work or load their version before continuing.',...info()});return true;}
   if(input.reuseAssets&&input.snapshot)input.snapshot.assets=room.snapshot.assets;const snapshot=validateSharedSnapshot(input.snapshot),bytes=Buffer.byteLength(JSON.stringify(snapshot));if(total()-room.bytes+bytes>maxBytes)throw fail('Shared canvas capacity is full.',503);if(!input.reuseAssets&&JSON.stringify(snapshot.assets)!==JSON.stringify(room.snapshot.assets))room.assetRevision++;room.snapshot=snapshot;room.bytes=bytes;room.revision++;room.updatedAt=now();send(res,200,info());return true;
  }
  throw fail('Method not allowed.',405);
 }catch(e){send(res,e.status||500,{error:e.status?e.message:'Sharing is temporarily unavailable.'});return true;}}
 return {handle,close:()=>{rooms.clear();rates.clear();}};
}
