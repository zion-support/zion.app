# VerifyRevenueJob Step C: surface build artifacts locally to validate deployment candidates
# Checks: next.config.js, out/ directory, public/, and route existence in build.

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Write-OK($msg) { Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Err($msg) { Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Warn($msg) { Write-Host "⚠️ $msg" -ForegroundColor Yellow }

$repoRoot = 'C:\Users\Zion\zion-support.github.io'
Set-Location $repoRoot

Write-Host "`n=== Q1: next.config.js output mode ==="
$cfg = Get-Content 'next.config.js' -Raw
if ($cfg -match "output:\s*'export'") {
  Write-OK "Static EXPORT confirmed — GitHub Pages compatible"
} elseif ($cfg -match "output:\s*'standalone'") {
  Write-Warn "Standalone mode — needs renderer, NOT GitHub Pages"
} else {
  Write-Err "Unknown output mode"
}

Write-Host "`n=== Q2: out/ directory exists? ==="
if (Test-Path 'out') {
  $pages = Get-ChildItem -Path 'out' -Recurse -Filter 'index.html' | Measure-Object
  Write-OK "out/ exists — $($pages.Count) pages rendered"
  Write-Host "`nSample routes in out/:"
  Get-ChildItem -Path 'out' -Recurse -Filter 'index.html' | Select-Object -First 25 | ForEach-Object {
    $rel = $_.FullName.Substring($repoRoot.Length + 5).Replace('\','/').Replace('/index.html','')
    Write-Host "  /$rel"
  }
} else {
  Write-Err "out/ directory NOT FOUND — site not built locally"
}

Write-Host "`n=== Q3: public/sitemap.xml size ==="
if (Test-Path 'public\sitemap.xml') {
  $sz = (Get-Item 'public\sitemap.xml').Length
  $urls = (Select-String -Path 'public\sitemap.xml' -Pattern '<loc>' -AllMatches).Matches.Count
  Write-OK "sitemap.xml: $sz bytes, $urls <loc> entries"
} else {
  Write-Err "public/sitemap.xml not found"
}

Write-Host "`n=== Q4: ROI Calculator route in out/ ==="
$roiPath = Join-Path $repoRoot 'out\tools\roi-calculator\index.html'
if (Test-Path $roiPath) { Write-OK "ROI Calculator page exists in out/" }
else { Write-Err "ROI Calculator page MISSING from out/" }

Write-Host "`n=== Q5: Pricing calculator route in out/ ==="
$pcPath = Join-Path $repoRoot 'out\pricing-calculator\index.html'
if (Test-Path $pcPath) { Write-OK "Pricing Calculator page exists in out/" }
else { Write-Err "Pricing Calculator page MISSING from out/" }

$svc811 = Join-Path $repoRoot 'out\services\ai-accessibility-auditor\index.html'
$svc337 = Join-Path $repoRoot 'out\services\ai-agents-autonomous\index.html'
Write-Host "`n=== Q6: Sample service detail pages in out/ ==="
if (Test-Path $svc811) { Write-OK "ai-accessibility-auditor EXISTS in out/" }
else { Write-Err "ai-accessibility-auditor MISSING from out/" }
if (Test-Path $svc337) { Write-OK "ai-agents-autonomous EXISTS in out/" }
else { Write-Err "ai-agents-autonomous MISSING from out/" }

Write-Host "`n=== Q7: package.json build cmd ==="
$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json
$build = $pkg.scripts.build
Write-Host "  build script: $build"

Write-Host "`n=== DONE ==="
