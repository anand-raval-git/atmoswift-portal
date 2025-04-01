
import { WeatherResponseData } from '../services/weatherService';

// Generate a timestamp for a specific time today
const getTimestampForHour = (hour: number): number => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

// Generate timestamps for days (0 = today, 1 = tomorrow, etc.)
const getTimestampForDay = (dayOffset: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(12, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

// Mock sunrise/sunset times
const getSunriseTime = (dayOffset: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(6, 30, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

const getSunsetTime = (dayOffset: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(19, 15, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

// Weather conditions options for variety
const weatherConditions = [
  { main: 'Clear', description: 'clear sky', icon: '01d' },
  { main: 'Clouds', description: 'few clouds', icon: '02d' },
  { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
  { main: 'Clouds', description: 'broken clouds', icon: '04d' },
  { main: 'Rain', description: 'light rain', icon: '10d' },
  { main: 'Rain', description: 'moderate rain', icon: '09d' },
  { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
  { main: 'Snow', description: 'light snow', icon: '13d' },
  { main: 'Mist', description: 'mist', icon: '50d' }
];

// Night versions of the icons
const getNightIcon = (icon: string): string => {
  return icon.replace('d', 'n');
};

// Generate mock hourly forecast
const generateMockHourlyForecast = (units: 'metric' | 'imperial'): any[] => {
  const hourly = [];
  const currentHour = new Date().getHours();
  
  const baseTemp = units === 'metric' ? 22 : 72; // Base temperature in C or F
  
  for (let i = 0; i < 24; i++) {
    const hourOfDay = (currentHour + i) % 24;
    const isNight = hourOfDay < 6 || hourOfDay > 18;
    
    // Temperature varies throughout the day
    let tempVariation = 0;
    if (hourOfDay > 6 && hourOfDay < 15) {
      tempVariation = 5; // Warmer during day
    } else if (hourOfDay > 18 || hourOfDay < 6) {
      tempVariation = -3; // Cooler at night
    }
    
    // Randomize weather a bit
    const weatherIndex = Math.floor(Math.random() * 5); // More limited selection for hourly
    let weather = weatherConditions[weatherIndex];
    
    // Use night icons during night hours
    if (isNight) {
      weather = {...weather, icon: getNightIcon(weather.icon)};
    }
    
    hourly.push({
      dt: getTimestampForHour(hourOfDay),
      temp: baseTemp + tempVariation + Math.floor(Math.random() * 3),
      feels_like: baseTemp + tempVariation + Math.floor(Math.random() * 2) - 1,
      humidity: 50 + Math.floor(Math.random() * 30),
      weather: [weather],
      pop: Math.random() * 0.5 // 0-50% chance of precipitation
    });
  }
  
  return hourly;
};

// Generate mock daily forecast
const generateMockDailyForecast = (units: 'metric' | 'imperial'): any[] => {
  const daily = [];
  const baseMaxTemp = units === 'metric' ? 25 : 77;
  const baseMinTemp = units === 'metric' ? 15 : 59;
  
  for (let i = 0; i < 7; i++) {
    // Temperature trends (warmer in the middle of the forecast)
    let tempAdjustment = 0;
    if (i > 0 && i < 4) {
      tempAdjustment = i; // Getting warmer
    } else if (i >= 4) {
      tempAdjustment = 7 - i; // Getting cooler
    }
    
    const maxTemp = baseMaxTemp + tempAdjustment + Math.floor(Math.random() * 3);
    const minTemp = baseMinTemp + tempAdjustment - Math.floor(Math.random() * 3);
    
    // More varied weather for daily forecast
    const weatherIndex = Math.floor(Math.random() * weatherConditions.length);
    
    daily.push({
      dt: getTimestampForDay(i),
      sunrise: getSunriseTime(i),
      sunset: getSunsetTime(i),
      temp: {
        day: maxTemp - 2,
        min: minTemp,
        max: maxTemp,
        night: minTemp + 2,
        eve: maxTemp - 4,
        morn: minTemp + 3
      },
      feels_like: {
        day: maxTemp - 3,
        night: minTemp + 1,
        eve: maxTemp - 5,
        morn: minTemp + 2
      },
      humidity: 50 + Math.floor(Math.random() * 30),
      weather: [weatherConditions[weatherIndex]],
      wind_speed: 2 + Math.random() * 8,
      wind_deg: Math.floor(Math.random() * 360),
      pop: Math.random() * 0.7 // 0-70% chance of precipitation
    });
  }
  
  return daily;
};

// Main mock data function
export const getMockWeatherData = (units: 'metric' | 'imperial'): WeatherResponseData => {
  // Current time
  const now = Math.floor(Date.now() / 1000);
  
  return {
    current: {
      city: "New York",
      country: "US",
      description: "partly cloudy",
      icon: "02d",
      temp: units === 'metric' ? 24 : 75,
      feels_like: units === 'metric' ? 25 : 77,
      temp_min: units === 'metric' ? 22 : 72,
      temp_max: units === 'metric' ? 26 : 79,
      humidity: 65,
      wind_speed: 5.2,
      wind_deg: 220,
      clouds: 40,
      sunrise: getSunriseTime(0),
      sunset: getSunsetTime(0),
      timezone: 0, // UTC offset in seconds
      dt: now,
      uvi: 4.5,
      visibility: 10000,
      lon: -74.006,
      lat: 40.7128
    },
    hourly: generateMockHourlyForecast(units),
    daily: generateMockDailyForecast(units)
  };
};
