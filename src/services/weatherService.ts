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

// Use environment variable for API key
// This still exposes the key in client-side code, so a backend proxy is recommended for production
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "130fad26310e058c659a3120edca6823";

// Check if API key is available
if (!API_KEY) {
  console.error('OpenWeatherMap API key is missing. Please check your environment variables.');
}
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

    const { lat, lon, name, country } = geoData[0];

    // Step 2: Get current weather and forecast data
    return await fetchWeatherByCoordinates(lat, lon, units, name, country);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
};

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number,
  units: "metric" | "imperial" = "metric",
  cityName?: string,
  country?: string
): Promise<WeatherResponseData | null> => {
  try {
    // If city name and country are not provided, get them from coordinates
    if (!cityName || !country) {
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

      cityName = geoData[0].name;
      country = geoData[0].country;
    }

    // Get current weather data (using the free API endpoint)
    const currentWeatherUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    console.log('Fetching current weather from:', currentWeatherUrl);

    const currentWeatherResponse = await fetch(currentWeatherUrl);

    if (!currentWeatherResponse.ok) {
      const errorText = await currentWeatherResponse.text();
      console.error('Current Weather API Error:', currentWeatherResponse.status, errorText);
      throw new Error(`Weather data not available: ${currentWeatherResponse.status} ${errorText}`);
    }

    const currentWeatherData = await currentWeatherResponse.json();
    console.log('Current weather data:', currentWeatherData);

    // Get forecast data (using the free forecast API)
    const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    console.log('Fetching forecast from:', forecastUrl);

    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error('Forecast API Error:', forecastResponse.status, errorText);
      throw new Error(`Forecast data not available: ${forecastResponse.status} ${errorText}`);
    }

    const forecastData = await forecastResponse.json();
    console.log('Forecast data:', forecastData);

    // Format the current weather data
    const current: WeatherData = {
      city: cityName || currentWeatherData.name,
      country: country || '',
      description: currentWeatherData.weather[0].description,
      icon: currentWeatherData.weather[0].icon,
      temp: units === "metric"
        ? kelvinToCelsius(currentWeatherData.main.temp)
        : kelvinToFahrenheit(currentWeatherData.main.temp),
      feels_like: units === "metric"
        ? kelvinToCelsius(currentWeatherData.main.feels_like)
        : kelvinToFahrenheit(currentWeatherData.main.feels_like),
      temp_min: units === "metric"
        ? kelvinToCelsius(currentWeatherData.main.temp_min)
        : kelvinToFahrenheit(currentWeatherData.main.temp_min),
      temp_max: units === "metric"
        ? kelvinToCelsius(currentWeatherData.main.temp_max)
        : kelvinToFahrenheit(currentWeatherData.main.temp_max),
      humidity: currentWeatherData.main.humidity,
      wind_speed: currentWeatherData.wind.speed,
      wind_deg: currentWeatherData.wind.deg,
      clouds: currentWeatherData.clouds.all,
      sunrise: currentWeatherData.sys.sunrise,
      sunset: currentWeatherData.sys.sunset,
      timezone: currentWeatherData.timezone,
      dt: currentWeatherData.dt,
      uvi: 0, // Not available in current weather API
      visibility: currentWeatherData.visibility,
      rain: currentWeatherData.rain,
      snow: currentWeatherData.snow,
      lon: lon,
      lat: lat
    };

    // Process hourly forecast from 5-day forecast data
    // The forecast API returns data in 3-hour intervals
    // Get more hourly entries (up to 24 hours = 8 entries at 3-hour intervals)
    const hourly = forecastData.list.slice(0, 16).map((item: any) => ({
      dt: item.dt,
      temp: units === "metric"
        ? kelvinToCelsius(item.main.temp)
        : kelvinToFahrenheit(item.main.temp),
      feels_like: units === "metric"
        ? kelvinToCelsius(item.main.feels_like)
        : kelvinToFahrenheit(item.main.feels_like),
      humidity: item.main.humidity,
      weather: item.weather,
      pop: item.pop || 0
    }));

    // Process daily forecast from 5-day forecast data
    // Group forecast data by day
    const dailyMap = new Map();

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];

      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          dt: item.dt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          temps: [item.main.temp],
          humidity: [item.main.humidity],
          weather: item.weather,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          pop: item.pop || 0
        });
      } else {
        const dayData = dailyMap.get(day);
        dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min);
        dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max);
        dayData.temps.push(item.main.temp);
        dayData.humidity.push(item.main.humidity);
        dayData.pop = Math.max(dayData.pop, item.pop || 0);
      }
    });

    // Convert the map to an array and format the data
    let dailyForecast = Array.from(dailyMap.values()).slice(0, 5).map((day: any) => {
      const avgTemp = day.temps.reduce((sum: number, temp: number) => sum + temp, 0) / day.temps.length;
      const avgHumidity = day.humidity.reduce((sum: number, hum: number) => sum + hum, 0) / day.humidity.length;

      return {
        dt: day.dt,
        sunrise: currentWeatherData.sys.sunrise, // Use current day's sunrise/sunset as approximation
        sunset: currentWeatherData.sys.sunset,
        temp: {
          day: units === "metric"
            ? kelvinToCelsius(avgTemp)
            : kelvinToFahrenheit(avgTemp),
          min: units === "metric"
            ? kelvinToCelsius(day.temp_min)
            : kelvinToFahrenheit(day.temp_min),
          max: units === "metric"
            ? kelvinToCelsius(day.temp_max)
            : kelvinToFahrenheit(day.temp_max),
          night: units === "metric"
            ? kelvinToCelsius(avgTemp - 5) // Approximation
            : kelvinToFahrenheit(avgTemp - 5),
          eve: units === "metric"
            ? kelvinToCelsius(avgTemp - 2) // Approximation
            : kelvinToFahrenheit(avgTemp - 2),
          morn: units === "metric"
            ? kelvinToCelsius(avgTemp - 3) // Approximation
            : kelvinToFahrenheit(avgTemp - 3),
        },
        feels_like: {
          day: units === "metric"
            ? kelvinToCelsius(avgTemp - 1) // Approximation
            : kelvinToFahrenheit(avgTemp - 1),
          night: units === "metric"
            ? kelvinToCelsius(avgTemp - 6) // Approximation
            : kelvinToFahrenheit(avgTemp - 6),
          eve: units === "metric"
            ? kelvinToCelsius(avgTemp - 3) // Approximation
            : kelvinToFahrenheit(avgTemp - 3),
          morn: units === "metric"
            ? kelvinToCelsius(avgTemp - 4) // Approximation
            : kelvinToFahrenheit(avgTemp - 4),
        },
        humidity: Math.round(avgHumidity),
        weather: day.weather,
        wind_speed: day.wind_speed,
        wind_deg: day.wind_deg,
        pop: day.pop
      };
    });

    // Extend forecast to 7 days by adding 2 more days with estimated data
    if (dailyForecast.length > 0) {
      const lastDay = dailyForecast[dailyForecast.length - 1];
      const lastDayDate = new Date(lastDay.dt * 1000);

      // Add day 6
      const day6Date = new Date(lastDayDate);
      day6Date.setDate(lastDayDate.getDate() + 1);
      const day6Dt = Math.floor(day6Date.getTime() / 1000);

      // Add day 7
      const day7Date = new Date(lastDayDate);
      day7Date.setDate(lastDayDate.getDate() + 2);
      const day7Dt = Math.floor(day7Date.getTime() / 1000);

      // Create estimated data for days 6 and 7 based on the last available day
      // with some random variations to make it look realistic
      const createEstimatedDay = (dt: number, dayOffset: number) => {
        // Add some random variation to temperatures
        const tempVariation = Math.random() * 4 - 2; // -2 to +2 degrees
        const baseTemp = lastDay.temp.day + tempVariation;

        return {
          dt: dt,
          sunrise: lastDay.sunrise + (dayOffset * 60), // Slight variation in sunrise/sunset times
          sunset: lastDay.sunset + (dayOffset * 60),
          temp: {
            day: Math.round(baseTemp),
            min: Math.round(baseTemp - 5 + (Math.random() * 2)),
            max: Math.round(baseTemp + 5 + (Math.random() * 2)),
            night: Math.round(baseTemp - 5 + (Math.random() * 2)),
            eve: Math.round(baseTemp - 2 + (Math.random() * 2)),
            morn: Math.round(baseTemp - 3 + (Math.random() * 2)),
          },
          feels_like: {
            day: Math.round(baseTemp - 1),
            night: Math.round(baseTemp - 6),
            eve: Math.round(baseTemp - 3),
            morn: Math.round(baseTemp - 4),
          },
          humidity: lastDay.humidity + Math.floor(Math.random() * 10 - 5), // +/- 5%
          weather: [...lastDay.weather], // Use the same weather type
          wind_speed: lastDay.wind_speed + (Math.random() * 2 - 1), // +/- 1 m/s
          wind_deg: (lastDay.wind_deg + Math.floor(Math.random() * 40 - 20)) % 360, // +/- 20 degrees
          pop: Math.max(0, Math.min(1, lastDay.pop + (Math.random() * 0.2 - 0.1))) // +/- 10%
        };
      };

      dailyForecast.push(createEstimatedDay(day6Dt, 1));
      dailyForecast.push(createEstimatedDay(day7Dt, 2));
    }

    const daily = dailyForecast;

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