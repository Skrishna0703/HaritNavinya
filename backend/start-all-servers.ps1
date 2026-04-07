# HaritNavinya Backend Servers Launcher
# Run all backend servers in parallel

Write-Host "Starting all HaritNavinya backend servers..." -ForegroundColor Green
Write-Host ""

# Change to backend directory
Set-Location $PSScriptRoot

# Start each server in a new PowerShell window
Write-Host "Starting Weather Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run weather"

Start-Sleep -Seconds 2

Write-Host "Starting Mandi Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run mandi"

Start-Sleep -Seconds 2

Write-Host "Starting Chatbot Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run chatbot:dev"

Start-Sleep -Seconds 2

Write-Host "Starting Disaster Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "All servers started! Check the separate windows above." -ForegroundColor Green
Write-Host ""
Write-Host "Servers running on:" -ForegroundColor Yellow
Write-Host "  - Weather Server: port 4000" -ForegroundColor White
Write-Host "  - Mandi Server: port 5000" -ForegroundColor White
Write-Host "  - Chatbot Server: port 5001" -ForegroundColor White
Write-Host "  - Disaster Server: port 3000" -ForegroundColor White
