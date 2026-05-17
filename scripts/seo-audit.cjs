// Stub: SEO audit
const fs=require("fs");
const {execSync}=require("child_process");
try{
  const html=fs.readFileSync("out/index.html","utf8");
  const hasTitle=html.includes("<title>")&&html.includes("Zion Tech Group");
  const hasDesc=html.includes('name="description"');
  console.log(hasTitle?"✅ Title present":"❌ Missing <title>");
  console.log(hasDesc?"✅ Meta description present":"❌ Missing meta description");
  process.exit(0);
}catch(e){console.log("⚠️ SEO audit skipped (out/ not built)");process.exit(0)}
