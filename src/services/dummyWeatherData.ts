
import { WeatherResponseData } from './weatherService';

// Mock weather data for testing purposes
export const dummyWeatherData: WeatherResponseData = {
  current: {
    city: "New York",
    country: "US",
    description: "scattered clouds",
    icon: "03d",
    temp: 22,
    feels_like: 21,
    temp_min: 19,
    temp_max: 24,
    humidity: 65,
    wind_speed: 3.5,
    wind_deg: 240,
    clouds: 40,
    sunrise: 1628835120,
    sunset: 1628886540,
    timezone: -14400,
    dt: 1628865234,
    uvi: 6.2,
    visibility: 10000,
    lon: -73.9866,
    lat: 40.7306
  },
  hourly: Array(24).fill(null).map((_, index) => ({
    dt: 1628865234 + (index * 3600),
    temp: 22 + Math.sin(index / 3) * 5,
    feels_like: 21 + Math.sin(index / 3) * 4,
    humidity: 65 - (index % 20),
    weather: [{
      id: 800 + (index % 3),
      main: index % 5 === 0 ? "Rain" : "Clouds",
      description: index % 5 === 0 ? "light rain" : "scattered clouds",
      icon: index % 5 === 0 ? "10d" : "03d"
    }],
    pop: index % 5 === 0 ? 0.4 : 0.1 // 40% chance of rain every 5 hours
  })),
  daily: Array(7).fill(null).map((_, index) => ({
    dt: 1628865234 + (index * 86400),
    sunrise: 1628835120 + (index * 100),
    sunset: 1628886540 + (index * 100),
    temp: {
      day: 22 + Math.sin(index) * 4,
      min: 17 + Math.sin(index) * 3,
      max: 26 + Math.sin(index) * 3,
      night: 18 + Math.sin(index) * 2,
      eve: 23 + Math.sin(index) * 3,
      morn: 19 + Math.sin(index) * 2
    },
    feels_like: {
      day: 21 + Math.sin(index) * 4,
      night: 17 + Math.sin(index) * 2,
      eve: 22 + Math.sin(index) * 3,
      morn: 18 + Math.sin(index) * 2
    },
    humidity: 65 - (index * 5),
    weather: [{
      id: 800 + (index % 4),
      main: ["Clear", "Clouds", "Rain", "Thunderstorm"][index % 4],
      description: ["clear sky", "scattered clouds", "light rain", "thunderstorm"][index % 4],
      icon: ["01d", "03d", "10d", "11d"][index % 4]
    }],
    wind_speed: 3.5 + (index * 0.5),
    wind_deg: (240 + index * 20) % 360,
    pop: Math.min(0.1 + (index * 0.1), 0.8) // Increasing chance of precipitation
  }))
};

// Function to get dummy data (could be extended to support different scenarios)
export const getDummyWeatherData = (): WeatherResponseData => {
  return dummyWeatherData;
};
