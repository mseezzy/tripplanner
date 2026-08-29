@echo off
echo ===================================================
echo Starting Family Travel Planner (Backend + Frontend)
echo ===================================================
start "Family Planner Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\uvicorn.exe app.main:app --reload --port 8000"
start "Family Planner Frontend (React)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"
echo Both servers are starting up!
echo Frontend will be at: http://localhost:5173
echo Backend will be at:  http://localhost:8000/docs
