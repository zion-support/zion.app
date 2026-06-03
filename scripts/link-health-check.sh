#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${ZION_REPO:-C:/Users/Zion/zion-support.github.io}"
BUILD_DIR="${REPO_DIR}/.deploy-temp"
REPORT_DIR="${REPO_DIR}/audit"
mkdir -p "$REPORT_DIR"

echo "[link-health] build dir: ${BUILD_DIR}"
if [ ! -d "$BUILD_DIR" ]; then
  echo "[link-health] missing build dir, skip" >&2
  exit 0
fi

HTML_COUNT=$(find "$BUILD_DIR" -type f -name '*.html' | wc -l || echo 0)
if [ "$HTML_COUNT" -eq 0 ]; then
  echo "[link-health] no html found, skip" >&2
  exit 0
fi

LINT=$(node -e "const fs=require('fs');const p=require('path');const root=process.argv[1];const seen=new Set();const bad=[];function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(ent.isDirectory()){if(ent.name.startsWith('.')&&ent.name!=='[root]')continue;walk(p.join(dir,ent.name))}else if(p.extname(ent.name)==='.html'){try{const html=fs.readFileSync(p.join(dir,ent.name),'utf8');const rel=(p.relative(root,p.join(dir,ent.name))||ent.name);const base=(html.match(/<base[^>]+href=\"([^\"]+)\"/)||[])[1]||'';const doc=base?new DOMParser().parseFromString(html,'text/html'):null;const links=doc?Array.from(doc.querySelectorAll('a[href]')):[];links.forEach(a=>{let href=a.getAttribute('href')||'';if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:')||href.startsWith('data:'))return;const full=href.startsWith('http')?href:(base?base.replace(/\/$/,'')+'/'+href.replace(/^\//,''):'');if(!full)return;if(seen.has(full))return;seen.add(full);try{const u=new URL(full);if(u.hostname===new URL('https://ziontechgroup.com').hostname){if(bad.some(b=>b.url===full&&b.file===rel))return;const route='/'+u.pathname.replace(/^\//,'');const f=p.join(root,route.replace(/\/$/,''),'index.html');const fp=p.join(root,route.replace(/\/$/,''),'index.txt');if(!fs.existsSync(f)&&!fs.existsSync(fp)&&route!=='/'){bad.push({url:full,file:rel,reason:'missing_local_page'})}}else if(!['https://ziontechgroup.com','http://localhost:3000','http://localhost:8888','http://127.0.0.1:3000'].includes(u.origin)&&!href.startsWith('http')){const candidate=p.join(root,href.replace(/^\//,''));if(href.includes('..')||!fs.existsSync(candidate)){bad.push({url:full,file:rel,reason:'relative_missing'})}}}catch(e){bad.push({url:full,file:rel,reason:'invalid_url'})}})}}catch(err){console.error(err&&err.message?err.message:err)}}}" "$BUILD_DIR" 2>/dev/null) || LINT="node parse failed"
echo "[link-health] candidate links summarized: ${LINT}"

node - <<'NODE'
const fs=require('fs');
const path=require('path');
const https=require('https');
const repoDir=process.argv[1];
const buildDir=path.join(repoDir,'.deploy-temp');
const reportDir=path.join(repoDir,'audit');
const reportPath=path.join(reportDir,'link-health-report.md');
const http=new https.Agent({keepAlive:true});
function fetch(url,opts={}){return new Promise((resolve,reject)=>{const req=https.request(url,{...opts,agent:opts.agent||http,headers:{'User-Agent':'zion-linkbot/1.0','Accept':'*/*'}},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,body:Buffer.concat(chunks).toString('utf8')}));});req.on('error',e=>resolve({status:0,error:e.message}));if(opts.body)req.write(opts.body);req.end();})}
async function main(){
  const htmlFiles=[];
  function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(ent.isDirectory()){if(ent.name.startsWith('.')&&ent.name!=='[root]')continue;walk(path.join(dir,ent.name))}else if(path.extname(ent.name)==='.html'){htmlFiles.push(path.join(dir,ent.name))}}}
  walk(buildDir);
  const seen=new Set();const bad=[];
  for(const file of htmlFiles){
    const html=fs.readFileSync(file,'utf8');
    const rel=path.relative(buildDir,file);
    const baseMatch=html.match(/<base[^>]+href="([^"]+)"/);
    const base=baseMatch?baseMatch[1]:'';
    const doc=base?new (require('jsdom').JSDOM)(html,{url:'https://ziontechgroup.com'}).window.document:null;
    const links=doc?Array.from(doc.querySelectorAll('a[href]')):[];
    for(const a of links){
      let href=a.getAttribute('href')||'';
      if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:')||href.startsWith('data:'))continue;
      const full=href.startsWith('http')?href:(base?base.replace(/\/$/,'')+'/'+href.replace(/^\//,''):href);
      if(!full||/^[a-z]+:/.test(href)&&!href.startsWith('http'))continue;
      if(seen.has(full))continue;seen.add(full);
      const u=new URL(full);
      if(u.hostname!==new URL('https://ziontechgroup.com').hostname){
        try{const r=await fetch('https://'+u.host+u.pathname+u.search,{method:'GET',timeout:8000});if(r.status<200||r.status>=400){bad.push({url:full,file:rel,reason:`http_${r.status}`})}}catch(e){bad.push({url:full,file:rel,reason:`fetch_error:${e.error||e.message}`})}
      }
    }
  }
  const now=new Date().toISOString();
  let md='# Link Health Audit\n\nGenerated: '+now+'\n\n';
  if(bad.length===0){md+='No broken external links detected in sampled HTML.\n'}else{md+=`Found ${bad.length} suspicious link(s):\n\n`+bad.slice(0,200).map(b=>`- [${b.reason}] ${b.url} in ${b.file}`).join('\n')+'\n'}
  fs.writeFileSync(reportPath,md);
  console.log(reportPath);
  console.log(bad.length?`${bad.length} suspicious links`:'clean');
}
main().catch(e=>{console.error(e&&e.message?e.message:e);process.exit(1)});
NODE
REPORT_DIR="${REPORT_DIR}" BUILD_DIR="${BUILD_DIR}" node - <<'NODE'
const fs=require('fs');const path=require('path');
const buildDir=process.env.BUILD_DIR;const reportDir=process.env.REPORT_DIR;
const reportPath=path.join(reportDir,'link-health-report.md');
const https=require('https');
const http=new https.Agent({keepAlive:true});
function request(url){return new Promise(resolve=>{https.get(url,{agent:http,headers:{'User-Agent':'zion-linkbot/1.0'}},res=>{const c=[];res.on('data',d=>c.push(d));res.on('end',()=>resolve({status:res.statusCode,body:Buffer.concat(c).toString('utf8')}));}).on('error',e=>resolve({status:0,error:e.message}))})}
(async()=>{
  const htmlFiles=[];
  function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(ent.isDirectory()){if(ent.name.startsWith('.')&&ent.name!=='[root]')continue;walk(path.join(dir,ent.name))}else if(path.extname(ent.name)==='.html'){htmlFiles.push(path.join(dir,ent.name))}}}
  walk(buildDir);
  const seen=new Set();const bad=[];
  for(const file of htmlFiles){
    const html=fs.readFileSync(file,'utf8');
    const rel=path.relative(buildDir,file);
    const baseMatch=html.match(/<base[^>]+href="([^"]+)"/);const base=baseMatch?baseMatch[1]:'';
    const doc=new(require('jsdom').JSDOM)(html,{url:'https://ziontechgroup.com'}).window.document;
    const links=Array.from(doc.querySelectorAll('a[href]'));
    for(const a of links){
      let href=a.getAttribute('href')||'';
      if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:')||href.startsWith('data:'))continue;
      const full=href.startsWith('http')?href:(base?base.replace(/\/$/,'')+'/'+href.replace(/^\//,''):href);
      if(!full||(/^[a-z]+:/.test(href)&&!href.startsWith('http')))continue;
      if(seen.has(full))continue;seen.add(full);
      const u=new URL(full);
      if(u.hostname===new URL('https://ziontechgroup.com').hostname)continue;
      try{const r=await request(full);if(r.status<200||r.status>=400){bad.push({url:full,file:rel,reason:'http_'+r.status})}}catch(e){bad.push({url:full,file:rel,reason:'fetch_error'})}
    }
  }
  const now=new Date().toISOString();
  let md='# Link Health Audit\n\nGenerated: '+now+'\n\n';
  if(bad.length===0){md+='No broken external links detected in sampled HTML.\n'}else{md+=`Found ${bad.length} suspicious link(s):\n\n`+bad.slice(0,200).map(b=>`- [${b.reason}] ${b.url} in ${b.file}`).join('\n')+'\n'}
  fs.writeFileSync(reportPath,md);
  console.log(reportPath);
  console.log(bad.length?`${bad.length} suspicious links`:'clean');
})()
NODE
