
Currency Converter Pro
A modern currency converter with live rates, historical trends, and instant multi-currency comparison.
Built with Vite + React (TypeScript) for the frontend and Python Flask for the backend.
Uses freecurrencyapi.com for real-time rates.

Why It Stands Out
Live currency rates with historical trend graphs

Compare one currency against all others instantly

Live scrolling rate ticker for a stock-market feel

Auto-detect user’s local currency for quick conversions

Offline fallback mode so it works even without internet

Features
Convert between 150+ currencies in real-time

Historical 7-day graph for selected currency pairs

Multiple currency comparison in a single view

Light/Dark mode toggle

Error handling with fallback rates

Responsive design for mobile & desktop

Tech Stack
Frontend: Vite + React + TypeScript

Backend: Python Flask

API: freecurrencyapi.com

Setup Instructions
Backend
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
export API_KEY=your_freecurrencyapi_key
flask run
Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
API Endpoints
GET /rate?from=USD&to=PKR – Fetch current exchange rate

GET /history?from=USD&to=PKR&days=7 – Get last 7 days rates

GET /compare?from=USD – Compare base currency against all supported currencies

Presentation Tip
Run Live Mode with:

A trending currency pair (like USD → PKR)

The historical graph updating in real-time

Ticker scrolling below
Ye instantly logon ko lagega ke yeh real-time trading tool hai, na ke basic college project.
