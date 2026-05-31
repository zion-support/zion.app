@echo off
REM =====================================================
REM Zion Tech Group - Automated Deployment Script
REM V451-V475 Email Intelligence Engines
REM =====================================================
REM Usage: Run this script as Administrator
REM =====================================================

echo.
echo =====================================================
echo  Zion Tech Group - Automated Deployment
echo  V451-V475 Email Intelligence Implementation
echo =====================================================
echo.

cd /d C:\Users\Zion\tmp\zion-clone-test

REM Step 1: Kill stuck processes
echo [1/8] Cleaning stuck processes...
taskkill /F /IM git.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

REM Step 2: Clean git state
echo [2/8] Cleaning git state...
del /f .git\index.lock 2>nul
rmdir /s /q .git\rebase-merge 2>nul

REM Step 3: Add services to catalog
echo [3/8] Adding V471-V475 services...
node add_v471_services.cjs

REM Step 4: Stage files
echo [4/8] Staging files...
git add email_engines/v471*.py
git add email_engines/v472*.py
git add email_engines/v473*.py
git add email_engines/v474*.py
git add email_engines/v475*.py
git add add_v471_services.cjs
git add components/V471V475Showcase.tsx
git add app/data/servicesData.json

REM Step 5: Commit
echo [5/8] Committing changes...
git commit -m "Add V471-V475: Sentiment Trends, Priority Queue, Auto-Responder, Integration Hub, Compliance Checker"

REM Step 6: Sync with remote
echo [6/8] Syncing with remote...
git pull --rebase origin main

REM Step 7: Push
echo [7/8] Pushing to main...
git push origin main

REM Step 8: Build
echo [8/8] Building application...
call npm install
call npm run build

echo.
echo =====================================================
echo  Deployment Complete!
echo  Check: https://ziontechgroup.com
echo =====================================================
echo.
pause
