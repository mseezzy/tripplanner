# ==========================================================
# Deploy Family Travel Planner Backend to Google Cloud Run
# ==========================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Deploy Family Travel Planner Backend to Google Cloud Run" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if gcloud is installed
$gcloudCmd = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudCmd) {
    Write-Host "`n[ERROR] Google Cloud SDK ('gcloud' CLI) is not installed." -ForegroundColor Red
    Write-Host "Please download and install it from: https://cloud.google.com/sdk/docs/install`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$projectId = Read-Host "Enter your Google Cloud Project ID"
if ([string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host "Project ID cannot be empty." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$region = Read-Host "Enter Deployment Region [default: us-central1]"
if ([string]::IsNullOrWhiteSpace($region)) {
    $region = "us-central1"
}

$geminiKey = Read-Host "Enter your Google Gemini API Key [AIzaSy...]"
if ([string]::IsNullOrWhiteSpace($geminiKey)) {
    Write-Host "Warning: No Gemini API Key entered. Backend will use fallback intelligence." -ForegroundColor Yellow
}

Write-Host "`n[1/3] Setting Google Cloud Project to $projectId..." -ForegroundColor Green
gcloud config set project $projectId

Write-Host "`n[2/3] Enabling required Google Cloud APIs (Cloud Run, Cloud Build, Secret Manager)..." -ForegroundColor Green
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

Write-Host "`n[3/3] Building and deploying backend container to Google Cloud Run..." -ForegroundColor Green
$backendDir = Join-Path $PSScriptRoot "backend"

if ($geminiKey) {
    gcloud run deploy family-travel-planner `
        --source $backendDir `
        --region $region `
        --platform managed `
        --allow-unauthenticated `
        --set-env-vars "GEMINI_API_KEY=$geminiKey" `
        --memory 512Mi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 5
} else {
    gcloud run deploy family-travel-planner `
        --source $backendDir `
        --region $region `
        --platform managed `
        --allow-unauthenticated `
        --memory 512Mi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 5
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "Copy the Service URL provided above (e.g. https://family-travel-planner-xyz.a.run.app)" -ForegroundColor Yellow
Write-Host "Set VITE_API_BASE_URL=<your-url>/api in your frontend .env" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Read-Host "Press Enter to finish"
