@echo off
title HaritNavinya Backend Servers
echo Starting all HaritNavinya backend servers...
echo.

REM Open new windows for each server
start "Weather Server" cmd /k "npm run weather"
timeout /t 2 /nobreak
start "Mandi Server" cmd /k "npm run mandi"
timeout /t 2 /nobreak
start "Chatbot Server" cmd /k "npm run chatbot:dev"
timeout /t 2 /nobreak
start "Disaster Server" cmd /k "npm run dev"

echo.
echo All servers started! Check the separate windows above.
pause
