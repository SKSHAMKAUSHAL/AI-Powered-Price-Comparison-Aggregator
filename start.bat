@echo off
echo 🚀 AI-Powered Price Comparison Aggregator
echo Emma Robot Technology Demonstration
echo.

echo 📋 Project Structure:
echo   ✅ Backend: FastAPI + Gemini AI Vision
echo   ✅ Frontend: Vite + React + TypeScript  
echo   ✅ Demo: Interactive HTML demo available
echo.

echo 🎯 Available Options:
echo   1. Start Backend + Frontend
echo   2. Quick Demo: Open demo.html in browser
echo   3. Backend Only
echo   4. Frontend Only
echo.

echo 🌐 Access Points:
echo   • Demo: demo.html (instant access)
echo   • Frontend: http://localhost:3000
echo   • Backend: http://localhost:8000
echo   • API Docs: http://localhost:8000/docs
echo.

echo 🎉 Perfect Emma Robot Portfolio Demonstration!
echo Interface-independent automation with Gemini AI Vision
echo.

choice /c 1234 /m "Choose option: [1] Full Stack [2] Demo [3] Backend [4] Frontend"

if errorlevel 4 goto frontend
if errorlevel 3 goto backend
if errorlevel 2 goto demo  
if errorlevel 1 goto fullstack

:fullstack
echo Starting Backend...
cd backend
start "Backend API" py simple_main.py
timeout /t 3 /nobreak >nul
cd ..\frontend-vite
echo Starting Frontend...
start "Frontend Dashboard" npm run dev
timeout /t 3 /nobreak >nul
start http://localhost:3000
goto end

:backend
echo Starting Backend only...
cd backend
py simple_main.py
goto end

:frontend
echo Starting Frontend only...
cd frontend-vite
npm run dev
goto end

:demo
echo Opening interactive demo...
start demo.html
goto end

:end
pause
