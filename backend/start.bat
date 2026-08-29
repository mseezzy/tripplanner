@echo off
echo Starting FastAPI Backend on port 8000...
cd /d "%~dp0"
.\venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8000
pause
