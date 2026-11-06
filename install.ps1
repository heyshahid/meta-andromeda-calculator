# Meta Andromeda Calculator - Windows Setup & Launcher
# Copyright (c) 2026 Shahid Akram

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 Meta Andromeda ROAS & Scaling Suite" -ForegroundColor Magenta
Write-Host " Author: Shahid Akram | https://github.com/heyshahid" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "`n[*] Launching Meta Andromeda Calculator in your default browser..." -ForegroundColor Green
Start-Process "$ScriptDir\index.html"
