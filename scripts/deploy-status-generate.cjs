// Stub: deploy status generate
const fs=require("fs"),path="automation/reports/deploy-status-latest.json";
fs.mkdirSync(path.split("/")[0],{recursive:true});
fs.writeFileSync(path,JSON.stringify({status:"ok",generatedAt:new Date().toISOString()},null,2));
console.log("deploy:status written");
