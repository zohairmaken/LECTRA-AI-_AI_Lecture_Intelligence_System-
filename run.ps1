# Lectra-AI Unified Startup Script (Windows PowerShell)

$root = Get-Location

Write-Host "--- INITIALIZING LECTRA-AI SYSTEM (GPU ACCELERATED) ---" -ForegroundColor Cyan

# Cleanup existing processes to avoid Port-In-Use errors
Write-Host "Cleaning up existing processes..." -ForegroundColor Gray
Get-Process -Name py, python, node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1 # Ensure ports are actually released

# 1. Start Backend in a new window
Write-Host "[1/2] Launching Backend Engine (Port 8000)..." -ForegroundColor Yellow
$venvPython = "$root\.venv\Scripts\python.exe"
if (!(Test-Path $venvPython)) { $venvPython = "py" } # Fallback
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; & '$venvPython' -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

# 2. Start Frontend in a new window
Write-Host "[2/2] Launching Frontend Interface (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\ai-audio-platform'; npm run dev -- --host 127.0.0.1"

Write-Host ""
Write-Host "SUCCESS: Both services are starting in separate windows." -ForegroundColor Green
Write-Host "Backend:  http://127.0.0.1:8000"
Write-Host "Frontend: http://127.0.0.1:5173"
Write-Host ""
Write-Host "NOTE: The backend now starts INSTANTLY. Heavy AI models will load only when you perform your first upload." -ForegroundColor Gray
Write-Host "Run this script anytime to restart the entire stack." -ForegroundColor Green
