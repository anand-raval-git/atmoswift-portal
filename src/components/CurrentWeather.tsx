
import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Sunrise, 
  Sunset,
  Sun
} from 'lucide-react';
import { formatTime, getWindDirection, getUVIndexLabel, getWeatherIconUrl } from '@/services/weatherService';

const CurrentWeather: React.FC = () => {
  const { weatherData, units, isLoading } = useWeather();
  
  if (isLoading) {
    return (
      <div className="glass-panel p-6 animate-fade-in">
        <div className="flex items-center justify-center h-32">
          <div className="loading-spinner w-8 h-8"></div>
          <span className="ml-3 text-muted-foreground">Loading weather data...</span>
        </div>
      </div>
    );
  }
  
  if (!weatherData?.current) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-lg">No weather data available.</p>
        <p className="text-sm text-muted-foreground">
          Please search for a location or enable location services.
        </p>
      </div>
    );
  }

  const { current } = weatherData;
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'km/h' : 'mph';
  
  // Convert wind speed from m/s to km/h if using metric
  const windSpeed = units === 'metric' 
    ? Math.round(current.wind_speed * 3.6) // m/s to km/h
    : Math.round(current.wind_speed); // mph
  
  // UV Index
  const uvIndex = current.uvi ? getUVIndexLabel(current.uvi) : { label: 'N/A', color: 'text-gray-500' };
  
  // Time format with timezone offset
  const sunriseTime = formatTime(current.sunrise, current.timezone, true);
  const sunsetTime = formatTime(current.sunset, current.timezone, true);
  
  // Capitalize first letter of description
  const description = current.description.charAt(0).toUpperCase() + current.description.slice(1);

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          {current.city}, {current.country}
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-4">
        <div className="flex items-center">
          <img 
            src={getWeatherIconUrl(current.icon)}
            alt={description}
            className="w-20 h-20"
          />
          <div className="text-5xl md:text-6xl font-bold ml-2">
            {current.temp}{tempUnit}
          </div>
        </div>
        
        <div className="text-center md:text-left md:ml-6">
          <p className="text-lg md:text-xl">{description}</p>
          <p className="text-sm text-muted-foreground">
            Feels like {current.feels_like}{tempUnit}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg hover-lift hover:bg-background/70 transition-all duration-300">
          <Thermometer className="h-6 w-6 mb-1 text-sky dark:text-cyan" />
          <span className="text-xs text-muted-foreground">UV Index</span>
          <span className={`text-sm font-semibold ${uvIndex.color}`}>
            {current.uvi ? Math.round(current.uvi) : 'N/A'} - {uvIndex.label}
          </span>
        </div>

        <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg hover-lift hover:bg-background/70 transition-all duration-300">
          <Droplets className="h-6 w-6 mb-1 text-sky dark:text-cyan" />
          <span className="text-xs text-muted-foreground">Humidity</span>
          <span className="text-sm font-semibold">{current.humidity}%</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg hover-lift hover:bg-background/70 transition-all duration-300">
          <Wind className="h-6 w-6 mb-1 text-sky dark:text-cyan" />
          <span className="text-xs text-muted-foreground">Wind</span>
          <span className="text-sm font-semibold">
            {windSpeed} {speedUnit} {getWindDirection(current.wind_deg)}
          </span>
        </div>

        <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg hover-lift hover:bg-background/70 transition-all duration-300">
          <Eye className="h-6 w-6 mb-1 text-sky dark:text-cyan" />
          <span className="text-xs text-muted-foreground">Visibility</span>
          <span className="text-sm font-semibold">
            {current.visibility ? `${Math.round(current.visibility / 1000)} km` : 'N/A'}
          </span>
        </div>

        <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg hover-lift hover:bg-background/70 transition-all duration-300">
          <Sunrise className="h-6 w-6 mb-1 text-orange dark:text-yellow" />
          <span className="text-xs text-muted-foreground">Sunrise</span>
          <span className="text-sm font-semibold">{sunriseTime}</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg hover-lift hover:bg-background/70 transition-all duration-300">
          <Sunset className="h-6 w-6 mb-1 text-orange dark:text-yellow" />
          <span className="text-xs text-muted-foreground">Sunset</span>
          <span className="text-sm font-semibold">{sunsetTime}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
