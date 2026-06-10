#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';

const dotenvPaths=[...fs.readdirSync(root).filter(f=>f.startsWith('.env')&&!f.endsWith('.example'))].map(f=>path.join(root,f));
const envVars={};
for(const p of dotenvPaths){
  try{
    const txt=fs.readFileSync(p,'utf8');
    for(const line of txt.split(/\r?\n/)){
      const m=line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
      if(m){
        const name=m[1];
        const value=m[2].trim().replace(/^["']|["']$/g,'');
        envVars[name]={file:path.basename(p),value};
      }
    }
  }catch(e){}
}

const regex=/\bprocess\.env\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)\b/g;

const fakeRegex=/^(x{3,}|example|test|placeholder|changeme|your_.*|.*_EXAMPLE|fake|demo|dummy|mock|abc123|secret_key|changeme|xxx)$/i;
function isFake(v){ return !v || fakeRegex.test(v) || /your-domain/i.test(v) || /example\.com/i.test(v) || /your/i.test(v) || /REPLACE/i.test(v) || /TODO/i.test(v); }

let hits=0;
let unique=0;
const perVar={};

function scanFile(file){
  let txt;
  try{ txt=fs.readFileSync(file,'utf8'); }catch(e){ return; }
  let m;
  while((m=regex.exec(txt))!==null){
    hits++;
    const varName=m[1];
    const lineno=txt.slice(0,m.index).split(/\r?\n/).length;
    const existing=perVar[varName];
    if(existing){
      existing.linenos.push({file:path.relative(root,file),line:lineno});
    }else{
      perVar[varName]={linenos:[{file:path.relative(root,file),line:lineno}]};
    }
  }
}

function walk(dir){
  const stack=[dir];
  while(stack.length){
    const cur=stack.pop();
    let entries;
    try{ entries=fs.readdirSync(cur,{withFileTypes:true}); }catch(e){ continue; }
    for(const ent of entries){
      if(ent.name.startsWith('.git')||ent.name.startsWith('node_modules')||ent.name.startsWith('.next')||ent.name==='dist'||ent.name==='build') continue;
      const full=path.join(cur,ent.name);
      if(ent.isDirectory()){
        const stat=fs.statSync(full);
        if(stat.isDirectory()) stack.push(full);
      }else{
        const ext=path.extname(full).toLowerCase();
        if(['.js','.jsx','.ts','.tsx','.cjs','.mjs','.py','.env','.json','.yaml','.yml'].includes(ext) || ent.name==='.env' || ent.name.startsWith('.env.')){
          scanFile(full);
        }
      }
    }
  }
}
walk(root);

const definedKeys=Object.keys(envVars);
let inUse=0;
for(const k of definedKeys){
  if(perVar[k]) inUse++;
}
const unused=definedKeys.filter(k=>!perVar[k]);

const likelyRealKeys=[...definedKeys].filter(k=>{
  const v=(envVars[k]||{}).value||'';
  return !isFake(v);
});

console.log(JSON.stringify({
  envFiles: [...new Set(dotenvPaths.map(p=>path.relative(root,p)))],
  totalEnvKeys: definedKeys.length,
  inUseCount: inUse,
  unusedCount: unused.length,
  unusedKeys: unused,
  lookupHits: hits,
  uniqueLookedUp: Object.keys(perVar).length,
  likelyRealKeys: likelyRealKeys,
  usageFileCounts: Object.fromEntries(Object.entries(perVar).slice(0,40).map(([k,v])=>[k,v.linenos.length]))
},null,2));
