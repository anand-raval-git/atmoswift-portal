const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// API key from environment variable
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Proxy endpoint for current weather
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Proxy endpoint for forecast
app.get('/api/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Proxy endpoint for geocoding
app.get('/api/geo/direct', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    res.status(500).json({ error: 'Failed to fetch geocoding data' });
  }
});

// Proxy endpoint for reverse geocoding
app.get('/api/geo/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching reverse geocoding data:', error);
    res.status(500).json({ error: 'Failed to fetch reverse geocoding data' });
  }
});

// For any other request, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
