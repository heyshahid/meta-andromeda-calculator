# Open MarketingOps - Windows Setup & Launcher
# Copyright (c) 2026 Shahid Akram

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 Open MarketingOps Suite v1.0.0" -ForegroundColor Blue
Write-Host " Understand Performance. Make Better Decisions. Scale Smarter." -ForegroundColor White
Write-Host " Author: Shahid Akram | https://github.com/heyshahid" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "`n[*] Launching Open MarketingOps in your default browser..." -ForegroundColor Green
Start-Process "$ScriptDir\index.html"
