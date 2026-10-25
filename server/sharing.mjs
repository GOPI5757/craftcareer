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
 async function read(req){if(activeUploads>=3)throw fail('The sharing service is busy. Please retry shortly.',429);activeUploads++;try{let n=0,chunks=[];for await(const chunk of req){n+=chunk.length;if(n>SHARE_LIMITS.payloadBytes)throw fail('Shared canvas exceeds the session size limit.',413);chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw fail('Invalid sharing request.');}}finally{activeUploads--;}}
 const total=()=>[...rooms.values()].reduce((n,r)=>n+r.bytes,0);
 function authenticate(req,room){const raw=String(req.headers.authorization||'').replace(/^Bearer /,'');if(!/^[A-Za-z0-9_-]{43}$/.test(raw))throw fail('This canvas link is invalid or expired.',403);const hash=digest(raw);for(const role of ['owner','editor','viewer'])if(timingSafeEqual(hash,room.keys[role]))return role;throw fail('This canvas link is invalid or expired.',403);}
 async function handle(req,res,url){if(!url.pathname.startsWith('/api/canvas'))return false;cleanup();try{
  if(req.method!=='GET'){if(req.headers.origin!==origin)throw fail('Open sharing on the CraftCareer website.',403);if(!String(req.headers['content-type']||'').startsWith('application/json'))throw fail('Expected JSON.',415);}
  if(url.pathname==='/api/canvas'&&req.method==='POST'){
   // Trust the socket, not an unverified X-Forwarded-For header. The global cap
   // remains effective behind a hosting proxy as well.
   const ip=req.socket.remoteAddress||'local',rate=rates.get(ip)||{time:now(),count:0};if(rate.time<now()-3600000){rate.time=now();rate.count=0;}if(++rate.count>20)throw fail('Too many new shared sessions. Try again in an hour.',429);rates.set(ip,rate);
   const input=await read(req),snapshot=validateSharedSnapshot(input.snapshot),bytes=Buffer.byteLength(JSON.stringify(snapshot));if(rooms.size>=20||total()+bytes>maxBytes)throw fail('Shared canvas capacity is full. Try again later.',503);
   const id=randomBytes(16).toString('hex'),keys={owner:token(),editor:token(),viewer:token()},expires=now()+SHARE_LIMITS.hours*3600000;
   rooms.set(id,{snapshot,bytes,revision:1,assetRevision:1,updatedAt:now(),expires,keys:Object.fromEntries(Object.entries(keys).map(([role,t])=>[role,digest(t)]))});send(res,201,{id,...keys,revision:1,assetRevision:1,expires,limits:SHARE_LIMITS});return true;
  }
  const match=url.pathname.match(/^\/api\/canvas\/([a-f0-9]{32})$/);if(!match)throw fail('Unknown shared canvas.',404);const room=rooms.get(match[1]);if(!room)throw fail('This shared session has expired or the service restarted. Your local draft and exported ZIP remain available.',410);const role=authenticate(req,room);
  const info=()=>({revision:room.revision,assetRevision:room.assetRevision,role,updatedAt:room.updatedAt,expires:room.expires});
  if(req.method==='GET'){const since=Number(url.searchParams.get('since'));const reuse=Number(url.searchParams.get('assetRevision'))===room.assetRevision;send(res,200,{...info(),assetsUnchanged:reuse,snapshot:since===room.revision?undefined:reuse?{...room.snapshot,assets:undefined}:room.snapshot});return true;}
  if(req.method==='DELETE'){if(role!=='owner')throw fail('Only the session owner can end sharing.',403);rooms.delete(match[1]);send(res,200,{ended:true});return true;}
  if(req.method==='PUT'){if(role==='viewer')throw fail('This is a view-only link.',403);const input=await read(req);if(input.revision!==room.revision){send(res,409,{error:'Another participant saved changes. Keep a copy of your work or load their version before continuing.',...info()});return true;}if(input.reuseAssets&&input.snapshot)input.snapshot.assets=room.snapshot.assets;const snapshot=validateSharedSnapshot(input.snapshot),bytes=Buffer.byteLength(JSON.stringify(snapshot));if(total()-room.bytes+bytes>maxBytes)throw fail('Shared canvas capacity is full.',503);if(!input.reuseAssets&&JSON.stringify(snapshot.assets)!==JSON.stringify(room.snapshot.assets))room.assetRevision++;room.snapshot=snapshot;room.bytes=bytes;room.revision++;room.updatedAt=now();send(res,200,info());return true;}
  throw fail('Method not allowed.',405);
 }catch(e){send(res,e.status||500,{error:e.status?e.message:'Sharing is temporarily unavailable.'});return true;}}
 return {handle,close:()=>{rooms.clear();rates.clear();}};
}
