import { toast } from "sonner";

export interface WeatherData {
  city: string;
  country: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
  uvi?: number;
  visibility?: number;
  rain?: { '1h': number } | undefined;
  snow?: { '1h': number } | undefined;
  lon: number;
  lat: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  humidity: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind_speed: number;
  wind_deg: number;
  pop: number; // Probability of precipitation
}

export interface WeatherResponseData {
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

// Use a free OpenWeatherMap API key for demo purposes
// In a production app, this would be stored securely
const API_KEY = "84b79da5e5d7c92085660485702f4ce8";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Helper functions
const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

const kelvinToFahrenheit = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * 9/5 + 32);
};

export const fetchWeatherByCity = async (
  city: string,
  units: "metric" | "imperial" = "metric"
): Promise<WeatherResponseData | null> => {
  try {
    // Step 1: Get coordinates for the city
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error("City not found");
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      toast.error("City not found. Please try another location.");
      return null;
    }
    
    const { lat, lon } = geoData[0];
    
    // Step 2: Get current weather and forecast data
    return await fetchWeatherByCoordinates(lat, lon, units);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
};

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number,
  units: "metric" | "imperial" = "metric"
): Promise<WeatherResponseData | null> => {
  try {
    // Get city name from coordinates
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error("Location not found");
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      toast.error("Location not found. Please try another location.");
      return null;
    }
    
    const cityName = geoData[0].name;
    const country = geoData[0].country;
    
    // Get current weather and forecast
    const weatherResponse = await fetch(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error("Weather data not available");
    }
    
    const weatherData = await weatherResponse.json();
    
    // Format the data
    const current: WeatherData = {
      city: cityName,
      country: country,
      description: weatherData.current.weather[0].description,
      icon: weatherData.current.weather[0].icon,
      temp: units === "metric" 
        ? kelvinToCelsius(weatherData.current.temp) 
        : kelvinToFahrenheit(weatherData.current.temp),
      feels_like: units === "metric"
        ? kelvinToCelsius(weatherData.current.feels_like)
        : kelvinToFahrenheit(weatherData.current.feels_like),
      temp_min: 0, // Not available in current data
      temp_max: 0, // Not available in current data
      humidity: weatherData.current.humidity,
      wind_speed: weatherData.current.wind_speed,
      wind_deg: weatherData.current.wind_deg,
      clouds: weatherData.current.clouds,
      sunrise: weatherData.current.sunrise,
      sunset: weatherData.current.sunset,
      timezone: weatherData.timezone_offset,
      dt: weatherData.current.dt,
      uvi: weatherData.current.uvi,
      visibility: weatherData.current.visibility,
      rain: weatherData.current.rain,
      snow: weatherData.current.snow,
      lon: lon,
      lat: lat
    };
    
    // Process hourly forecast
    const hourly = weatherData.hourly.slice(0, 24).map((hour: any) => ({
      dt: hour.dt,
      temp: units === "metric" 
        ? kelvinToCelsius(hour.temp) 
        : kelvinToFahrenheit(hour.temp),
      feels_like: units === "metric"
        ? kelvinToCelsius(hour.feels_like)
        : kelvinToFahrenheit(hour.feels_like),
      humidity: hour.humidity,
      weather: hour.weather,
      pop: hour.pop
    }));
    
    // Process daily forecast
    const daily = weatherData.daily.map((day: any) => ({
      dt: day.dt,
      sunrise: day.sunrise,
      sunset: day.sunset,
      temp: {
        day: units === "metric" 
          ? kelvinToCelsius(day.temp.day) 
          : kelvinToFahrenheit(day.temp.day),
        min: units === "metric" 
          ? kelvinToCelsius(day.temp.min) 
          : kelvinToFahrenheit(day.temp.min),
        max: units === "metric" 
          ? kelvinToCelsius(day.temp.max) 
          : kelvinToFahrenheit(day.temp.max),
        night: units === "metric" 
          ? kelvinToCelsius(day.temp.night) 
          : kelvinToFahrenheit(day.temp.night),
        eve: units === "metric" 
          ? kelvinToCelsius(day.temp.eve) 
          : kelvinToFahrenheit(day.temp.eve),
        morn: units === "metric" 
          ? kelvinToCelsius(day.temp.morn) 
          : kelvinToFahrenheit(day.temp.morn),
      },
      feels_like: {
        day: units === "metric" 
          ? kelvinToCelsius(day.feels_like.day) 
          : kelvinToFahrenheit(day.feels_like.day),
        night: units === "metric" 
          ? kelvinToCelsius(day.feels_like.night) 
          : kelvinToFahrenheit(day.feels_like.night),
        eve: units === "metric" 
          ? kelvinToCelsius(day.feels_like.eve) 
          : kelvinToFahrenheit(day.feels_like.eve),
        morn: units === "metric" 
          ? kelvinToCelsius(day.feels_like.morn) 
          : kelvinToFahrenheit(day.feels_like.morn),
      },
      humidity: day.humidity,
      weather: day.weather,
      wind_speed: day.wind_speed,
      wind_deg: day.wind_deg,
      pop: day.pop
    }));
    
    return {
      current,
      hourly,
      daily
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
};

export const getWeatherIconUrl = (iconCode: string, size: "2x" | "4x" = "4x"): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const formatTime = (timestamp: number, timezone: number, use12Hour = false): string => {
  const date = new Date((timestamp + timezone) * 1000);
  
  if (use12Hour) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  }
  
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });
};

export const formatDay = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    timeZone: 'UTC'
  });
};

export const formatDate = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    timeZone: 'UTC'
  });
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVIndexLabel = (uvi: number): { label: string; color: string } => {
  if (uvi <= 2) return { label: 'Low', color: 'text-green-500' };
  if (uvi <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
  if (uvi <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uvi <= 10) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
};
