const origin='https://sunclouny.github.io';
export default {async fetch(req,env){
 const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store'};
 const reply=(status,msg)=>new Response(msg,{status,headers});
 if(new URL(req.url).pathname!='/score'||req.headers.get('Origin')!==origin)return reply(403,'Forbidden');
 if(req.method==='OPTIONS')return reply(204,null);
 if(req.method!=='POST'||!req.headers.get('Content-Type')?.startsWith('application/json'))return reply(405,'POST JSON only');
 if(!env.GH_TOKEN||!env.SUBMITS)return reply(503,'Setup incomplete');
 if(!(await env.SUBMITS.limit({key:req.headers.get('CF-Connecting-IP')||'unknown'})).success)return reply(429,'Try later');
 if(Number(req.headers.get('Content-Length'))>1024)return reply(413,'Too large');
 let d;try{const t=await req.text();if(t.length>1024)return reply(413,'Too large');d=JSON.parse(t)}catch{return reply(400,'Invalid JSON')}
 if(!d||typeof d.name!=='string'||!d.name.trim()||Array.from(d.name).length>16||/[\p{C}]/u.test(d.name)||typeof d.key!=='string'||!/^[0-9a-f]{64}$/.test(d.key)||!Number.isSafeInteger(d.score)||d.score<1||d.score>100000000)return reply(400,'Invalid record');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(d.key));
 const player=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 const body=JSON.stringify({game:'long-or-get-v1',player,name:d.name.trim(),score:d.score});
 const r=await fetch('https://api.github.com/repos/SunClouny/long-or-get/issues/1/comments',{method:'POST',headers:{Authorization:'Bearer '+env.GH_TOKEN,'User-Agent':'LongOrGet','Content-Type':'application/json'},body:JSON.stringify({body:'```json\n'+body+'\n```'})});
 return r.ok?reply(201,'OK'):reply(503,'Save failed');
}};