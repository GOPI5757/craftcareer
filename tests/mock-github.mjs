// Test double only. Never used by the production server.
import {createHash} from 'node:crypto';
export const blobSha=b=>createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
export function mockGitHub(){
 const repos=new Map(),blobs=new Map(),trees=new Map(),commits=new Map(),calls=[];let serial=0,revokeFails=false;
 const key=()=> (++serial).toString(16).padStart(40,'0');
 const storeBlob=b=>{b=Buffer.from(b);const sha=blobSha(b);blobs.set(sha,b);return sha;};
 const commitTree=(r,tree)=>{const t=key(),c=key();trees.set(t,new Map(tree));commits.set(c,{sha:c,tree:{sha:t}});r.head=c;return c;};
 function makeRepo(name){const r={name,private:false,owner:{id:7,login:'student'},permissions:{admin:true},default_branch:'main',head:null,pages:null,build:null};repos.set(name,r);commitTree(r,new Map([['README.md',storeBlob('Original README')]]));return r;}
 function writeFile(name,path,bytes){const r=repos.get(name),tree=new Map(trees.get(commits.get(r.head).tree.sha));tree.set(path,storeBlob(bytes));commitTree(r,tree);}
 const response=(status,data)=>new Response(status===204?null:JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
 async function fetchImpl(url,opts={}){const u=new URL(url),method=opts.method||'GET',b=opts.body?JSON.parse(opts.body):null;calls.push({url,method,body:b,headers:opts.headers});
  if(u.pathname==='/login/oauth/access_token')return response(200,{access_token:'test-token-not-for-client',scope:'repo',token_type:'bearer'});
  if(u.pathname.startsWith('/applications/')){if(revokeFails)throw Error('test network outage');return response(204);}
  if(u.pathname==='/user')return response(200,{id:7,login:'student'});
  if(u.pathname==='/user/repos'&&method==='GET'){const page=Number(u.searchParams.get('page')||1),per=Number(u.searchParams.get('per_page')||20);return response(200,[...repos.values()].slice((page-1)*per,page*per));}
  if(u.pathname==='/user/repos'&&method==='POST'){if(repos.has(b.name))return response(422,{});return response(201,makeRepo(b.name));}
  const m=u.pathname.match(/^\/repos\/student\/([^/]+)(.*)$/);if(!m)return response(404,{});const name=decodeURIComponent(m[1]),r=repos.get(name),p=decodeURIComponent(m[2]);if(!r)return response(404,{});
  const tree=()=>trees.get(commits.get(r.head).tree.sha);
  if(!p){if(method==='PATCH')Object.assign(r,b);return response(200,r);}
  if(p.startsWith('/contents/')){const path=p.slice(10);if(method==='PUT'){writeFile(name,path,Buffer.from(b.content,'base64'));return response(201,{commit:{sha:r.head}});}const id=tree().get(path);return id?response(200,{content:blobs.get(id).toString('base64')}):response(404,{});}
  if(p==='/git/ref/heads/main')return response(200,{object:{sha:r.head}});
  if(p==='/git/refs/heads/main'&&method==='PATCH'){if(!commits.has(b.sha))return response(422,{});r.head=b.sha;return response(200,{object:{sha:r.head}});}
  if(p.startsWith('/git/blobs/')&&method==='GET'){const id=p.slice(11),bytes=blobs.get(id);return bytes?response(200,{sha:id,size:bytes.length,encoding:'base64',content:bytes.toString('base64')}):response(404,{});}
  if(p==='/git/blobs'&&method==='POST')return response(201,{sha:storeBlob(Buffer.from(b.content,'base64'))});
  if(p==='/git/trees'&&method==='POST'){const next=new Map(trees.get(b.base_tree));for(const f of b.tree){if(f.sha===null)next.delete(f.path);else next.set(f.path,f.content===undefined?f.sha:storeBlob(f.content));}const id=key();trees.set(id,next);return response(201,{sha:id});}
  if(p.startsWith('/git/trees/'))return response(200,{truncated:false,tree:[...trees.get(p.slice(11))].map(([path,sha])=>({path,sha,type:'blob',mode:'100644',size:blobs.get(sha).length}))});
  if(p==='/git/commits'&&method==='POST'){const c={sha:key(),tree:{sha:b.tree},parents:b.parents};commits.set(c.sha,c);return response(201,c);}
  if(p.startsWith('/git/commits/'))return response(200,commits.get(p.slice(13)));
  if(p==='/pages'){if(method==='GET')return response(r.pages?200:404,r.pages||{});if(method==='DELETE'){r.pages=null;return response(204);}r.pages={...b,html_url:`https://student.github.io/${name}/`};return response(method==='POST'?201:204,method==='POST'?r.pages:undefined);}
  if(p==='/pages/builds'&&method==='POST'){r.build={status:'building',commit:r.head};return response(201,r.build);}
  if(p==='/pages/builds/latest')return response(r.build?200:404,r.build||{});
  throw Error('Unmocked endpoint '+method+' '+p);
 }
 return {fetchImpl,repos,calls,makeRepo,writeFile,readFile:(repo,path)=>{const r=repos.get(repo),id=trees.get(commits.get(r.head).tree.sha).get(path);return id?blobs.get(id):null;},finishBuild:name=>{const r=repos.get(name);r.build={commit:r.head,status:'built'};},setRevokeFailure:v=>revokeFails=v};
}
