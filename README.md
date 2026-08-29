# 🌍 Family Travel Planner

> An intelligent, family-tailored travel planning application built with **React**, **Material UI (MUI)**, packaged for desktop with **Electron**, powered by a **Python (FastAPI)** backend, and running on **100% free open services**.

![Tech Stack](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Material%20UI%20v6-0284c7)
![Desktop](https://img.shields.io/badge/Desktop-Electron-475569)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI-10b981)
![Hosting](https://img.shields.io/badge/Hosting-100%25%20Free%20Tier%20Ready-f97316)

---

## ✨ Features

- 👨‍👩‍👧‍👦 **Custom Family Profile Builder**:
  - Add family members with specific ages (Toddler 0-3, Child 4-8, Tween 9-12, Teen 13-17, Adult 18+).
  - Select family likes & interests (Theme Parks, Nature, Beaches, Wildlife, Museums, Food, Water Parks, Adventure, Spas).
  - Configure dislikes and constraints (Avoid heat, avoid crowds, no strenuous hikes, stroller-friendly).

- 🗺️ **Smart Recommendations & Matching**:
  - Input a preferred destination (city, state, country) or leave blank for top AI-scored destinations matching your family's profile.
  - Live weather forecasts powered by **Open-Meteo API** (Free, no API key needed).
  - Geospatial maps powered by **OpenStreetMap / Leaflet**.

- ✈️ **Flight Recommendations & Price Ranges**:
  - Itemized roundtrip price estimates for budget saver, standard main cabin, and flexible fares.
  - Per-person vs. total family cost breakdown.
  - Family baggage rules, seating guarantees, and travel tips.

- 🏨 **Lodging Recommendations & Family Amenities**:
  - 4 tailored tiers: Vacation Homes with Kitchens, Family Resort Suites with Splash Pools, Budget Inns, and Luxury Resorts.
  - Nightly and total stay price ranges.
  - Family-focused amenities checklist (Cribs, full kitchen, washer/dryer, kid pool).

- 🎟️ **Curated Activities with Labels**:
  - Age suitability badges (`Toddler Approved`, `Teen Favorite`, `Great for All Ages`).
  - Category tags, estimated duration, best time of day, and insider family tips.
  - Transparent pricing per person and for the whole family.

- 💰 **Total Trip Budget Estimator**:
  - High-level Low / Realistic / Peak budget ranges.
  - Itemized progress bars for Flights, Lodging, Dining, Activities, Transport, and Emergency Buffer.

- 📅 **Day-by-Day Suggested Itinerary & Export**:
  - Morning, afternoon, and evening timelines.
  - One-click print to formatted PDF guide or download structured JSON.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000/docs`

### 3. Frontend Setup (React + MUI)
```bash
# Open a new terminal in the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Web app will be live at: `http://localhost:5173`

### 4. Running as a Desktop App (Electron)
```bash
cd frontend
npm run electron:dev
```

---

## ☁️ 100% Free Hosting Guide

This application is architected to be hosted **100% for free** on top free-tier cloud platforms.

### Step 1: Deploy Web Frontend to GitHub Pages (Free)
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Initial commit of Family Travel Planner"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The included workflow `.github/workflows/deploy-web.yml` will automatically build and deploy the React web application for free!

*(Alternative: You can also import the repository into **Vercel** or **Netlify** for instant 1-click free static hosting).*

### Step 2: Deploy Python Backend to Render (Free)
1. Sign up for a free account at [render.com](https://render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `backend/render.yaml` and configure the free Python web service.
5. Once deployed, Render will provide a free API URL (e.g. `https://family-travel-planner-api.onrender.com`).
6. *(Optional)* Add the environment variable `VITE_API_URL=https://your-render-url.onrender.com/api` to your frontend settings.

> **Note**: Even without deploying the Python backend, the frontend includes a complete **zero-config client fallback** engine that computes all family recommendations, price ranges, and itineraries directly in the browser!

---

## 🔒 Free APIs Used

- **Open-Meteo**: Real-time 7-day weather forecast (No API key required)
- **OpenStreetMap / Nominatim**: Free geocoding and search (Open Database License)
- **Leaflet**: Open-source interactive map rendering
- **Wikipedia REST API**: Curated destination descriptions

---

## 📜 License
MIT License. Free for personal and commercial use.
