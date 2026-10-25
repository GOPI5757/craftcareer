// Local-only test server. Its synthetic login and repositories NEVER contact GitHub.
// Do not deploy this file. Production entry point is server/server.mjs.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createApp} from '../server/server.mjs';
import {mockGitHub} from './mock-github.mjs';
const port=18988,origin=`http://localhost:${port}`,mock=mockGitHub();
const app=createApp({origin,clientId:'test-client',clientSecret:'test-secret',fetchImpl:mock.fetchImpl,writeDelayMs:0});
const root=fileURLToPath(new URL('.',import.meta.url));
createServer(async(req,res)=>{try{
 const path=new URL(req.url,origin).pathname;
 if(path==='/__test__/guided-reference.png'){res.setHeader('Content-Type','image/png');res.end(await readFile(root+'fixtures/guided-reference.png'));return;}
 if(path==='/__test__/artist-reference.png'){res.setHeader('Content-Type','image/png');res.end(await readFile(root+'fixtures/artist-reference.png'));return;}
 if(['/fidelity.html','/fidelity.js','/guided.html','/guided.js','/sharing-ui.html','/sharing-ui.js'].includes(path)){res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':'text/html');res.end(await readFile(root+path.slice(1)));return;}
 if(path==='/__test__/login'){
  const r=await fetch(origin+'/api/github/connect',{redirect:'manual'}),u=new URL(r.headers.get('location'));
  const done=await fetch(origin+'/api/github/callback?state='+u.searchParams.get('state')+'&code=test',{headers:{Cookie:r.headers.get('set-cookie').split(';')[0]}});
  res.setHeader('Set-Cookie',done.headers.getSetCookie());res.setHeader('Content-Type','application/json');res.end('{"connected":true}');return;
 }
 if(path==='/__test__/built'){for(const name of mock.repos.keys())mock.finishBuild(name);res.end('{}');return;}
 if(path==='/__test__/state'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({repositories:[...mock.repos.values()].map(r=>({name:r.name,pages:!!r.pages,marker:JSON.parse(mock.readFile(r.name,'.craftcareer-publish.json')||'null'),config:mock.readFile(r.name,'config/site.js')?.toString()}))}));return;}
 if(['/verification/design.html','/verification/design.js'].includes(path)){res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':'text/html');res.end(await readFile(root+path.split('/').pop()));return;}
 if(['/browser.html','/browser.js','/regression.html','/regression.js'].includes(path)){res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':'text/html');res.end(await readFile(root+path.slice(1)));return;}
 await app.handler(req,res);
 }catch(e){res.statusCode=500;res.end(e.message);}
}).listen(port,'127.0.0.1',()=>console.log('TEST ONLY: '+origin+'/browser.html and /regression.html'));
