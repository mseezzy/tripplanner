@echo off
echo ==========================================================
echo Deploy Family Travel Planner Backend to Google Cloud Run
echo ==========================================================

:: Check for gcloud CLI
where gcloud >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Google Cloud SDK (gcloud CLI) is not installed.
    echo Please download and install it from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

set /p PROJECT_ID="Enter your Google Cloud Project ID: "
if "%PROJECT_ID%"=="" (
    echo Project ID cannot be empty.
    pause
    exit /b 1
)

set /p REGION="Enter Deployment Region (default: us-central1): "
if "%REGION%"=="" set REGION=us-central1

set /p GEMINI_KEY="Enter your Google Gemini API Key (AIzaSy...): "

echo.
echo [1/3] Setting Google Cloud Project to %PROJECT_ID%...
call gcloud config set project %PROJECT_ID%

echo.
echo [2/3] Enabling required Google Cloud APIs (Cloud Run, Cloud Build, Secret Manager)...
call gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

echo.
echo [3/3] Building and deploying backend container to Google Cloud Run...
cd /d "%~dp0backend"

call gcloud run deploy family-travel-planner ^
    --source . ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --set-env-vars GEMINI_API_KEY=%GEMINI_KEY% ^
    --memory 512Mi ^
    --cpu 1 ^
    --min-instances 0 ^
    --max-instances 5

echo.
echo ==========================================================
echo Deployment Completed!
echo Copy the Service URL provided above (e.g. https://family-travel-planner-xyz.a.run.app)
echo Set VITE_API_BASE_URL=<your-url>/api in your frontend .env
echo ==========================================================
pause
