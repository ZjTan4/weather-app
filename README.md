# Zijie's Weather App

## Overview

**Zijie's Weather App** is a full-stack application that provides real-time and forecasted weather information for locations worldwide. It also integrates Google Maps for enhanced location-based functionality and supports basic CRUD operations on weather data using a NoSQL database.

### Features
- **Realtime Weather**: View current weather conditions for any location.
- **7-Day Forecast**: Get an extended weather forecast for planning ahead.
- **Historical Weather Data**: Access past weather information using Open-Meteo.
- **Location Search**: Search by city, postal code, GPS coordinates, or landmarks.
- **Google Maps Integration**: Visualize locations with an interactive map.
- **CRUD Operations**: Create, Read, Update, and Delete weather records.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## Technology Stack

### Backend
- **Framework**: Node.js + Express
- **Database**: MongoDB Atlas (NoSQL)
- **APIs**:
  - [Tomorrow.io API](https://www.tomorrow.io/) - Real-time and forecast weather data.
  - [Open-Meteo API](https://open-meteo.com/) - Historical weather data.
  - [Google Maps API](https://developers.google.com/maps) - Location visualization.
- **Deployed on**: [Render](https://weather-app-ut4m.onrender.com)

### Frontend
- **Framework**: React (with Vite for development)
- **Styling**: TailwindCSS
- **Deployed on**: [Vercel](https://weather-app-two-sage-56.vercel.app)

---

## Features

### 🌦️ Weather Data
- **Search Locations**: Input city name to get weather details (fuzzy match allowed).
- **Real-time Updates**: Fetch live weather data, including temperature, humidity, wind speed, and conditions.
- **7-Day Forecast**: Detailed forecast data for the upcoming days.
- **Historical Weather**: Access past weather data for a specific range of dates (92 days in the past) and locations.

### 🌐 Google Maps Integration
- View searched locations on an interactive Google Map for enhanced visualization.

### 🗄️ Database Operations
- **Create**: Whenever users perform new location search, a range of weather records with location, date, and weather info are added to the database.
- **Read**: Users are able to view the stored weather records in a list when scrolling down.
- **Update**: Users are able to modify the existing weather records in the database by clicking the edit button on each record entries in the list.
- **Delete**: Users are able to remove the existing weather records in the database by clicking the delete button on each record entries in the list.
- **Export to CSV**: Users are able to export the data in database to a CSV file by clicking the export button. 

---

## How to Run in Development mode?

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/ZjTan4/weather-app.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Add environment variables in a `.env` file:
   ```env
   MONGO_URI=<your_mongodb_connection_string>
   WEATHER_API_KEY=<your_tomorrow_api_key>
   WEATHER_URI=https://api.tomorrow.io/v4
   HISTORICAL_WEATHER_URI=https://api.open-meteo.com/v1/forecast
   ```
5. Start the server:
   ```bash
   npm start
   ```
6. The backend will be available at `http://localhost:5000`.

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add environment variables in a `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Follow instructions in terminal and open app in your browser.

---

## Deployment Links
- **Backend**: [Render Deployment](https://weather-app-ut4m.onrender.com)
- **Frontend**: [Vercel Deployment](https://weather-app-two-sage-56.vercel.app)

---

## API Endpoints

### Backend API Endpoints
| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/api/weather`     | Fetch real-time weather data.  |
| GET    | `/api/forecast`    | Fetch 7-day weather forecast.  |
| POST   | `/api/historical`  | Fetch historical weather data. |
| GET    | `/api/records`     | Retrieve all weather records.  |
| PUT    | `/api/records/:id` | Update a weather record.       |
| DELETE | `/api/records/:id` | Delete a weather record.       |

---

## Known Issues and Future Improvements
- **Unsorted Database Records**: .
- **Weather APIs Integration**: .

---

## Credits
- **Weather APIs**: [Tomorrow.io](https://www.tomorrow.io/) and [Open-Meteo](https://open-meteo.com/)
- **Maps**: [Google Maps API](https://developers.google.com/maps)
- **Frontend Hosting**: [Vercel](https://vercel.com/)
- **Backend Hosting**: [Render](https://render.com/)

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository:
   ```bash
   git clone https://github.com/ZjTan4/weather-app.git
   ```
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

