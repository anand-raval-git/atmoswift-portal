
import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Sunrise, Sunset, Droplets, Wind } from 'lucide-react';
import { formatDay, formatDate, getWeatherIconUrl, formatTime, getWindDirection } from '@/services/weatherService';

const DailyForecast: React.FC = () => {
  const { weatherData, units, isLoading } = useWeather();
  
  if (isLoading) {
    return (
      <div className="glass-panel p-4 mt-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-36"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!weatherData?.daily || weatherData.daily.length === 0) {
    return null;
  }
  
  const { daily, current } = weatherData;
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'km/h' : 'mph';
  
  // Convert wind speed from m/s to km/h if using metric
  const getFormattedWindSpeed = (speed: number) => {
    return units === 'metric' 
      ? Math.round(speed * 3.6) // m/s to km/h
      : Math.round(speed); // mph
  };

  return (
    <div className="glass-panel p-4 mt-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-foreground">7-Day Forecast</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daily.slice(0, 7).map((day, index) => {
          const dayName = index === 0 ? 'Today' : formatDay(day.dt, current.timezone);
          const date = formatDate(day.dt, current.timezone);
          const pop = Math.round(day.pop * 100); // Probability of precipitation
          const sunriseTime = formatTime(day.sunrise, current.timezone, true);
          const sunsetTime = formatTime(day.sunset, current.timezone, true);
          
          return (
            <div 
              key={index} 
              className="bg-background/50 rounded-lg p-4 card-hover text-foreground"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-bold">{dayName}</h4>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
                <img 
                  src={getWeatherIconUrl(day.weather[0].icon, '2x')} 
                  alt={day.weather[0].description}
                  className="w-12 h-12"
                />
              </div>
              
              <p className="text-sm mb-2 capitalize">
                {day.weather[0].description}
              </p>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold">
                  {day.temp.max}{tempUnit}
                </span>
                <span className="text-sm text-muted-foreground">
                  {day.temp.min}{tempUnit}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <Droplets className="h-3 w-3 mr-1 text-sky dark:text-cyan" />
                  <span>{day.humidity}%</span>
                </div>
                
                <div className="flex items-center">
                  <Wind className="h-3 w-3 mr-1 text-sky dark:text-cyan" />
                  <span>
                    {getFormattedWindSpeed(day.wind_speed)} {speedUnit}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Sunrise className="h-3 w-3 mr-1 text-orange dark:text-yellow" />
                  <span>{sunriseTime}</span>
                </div>
                
                <div className="flex items-center">
                  <Sunset className="h-3 w-3 mr-1 text-orange dark:text-yellow" />
                  <span>{sunsetTime}</span>
                </div>
              </div>
              
              {pop > 0 && (
                <div className="mt-2 text-xs flex items-center">
                  <Droplets className="h-3 w-3 mr-1 text-sky dark:text-cyan" />
                  <span>Precipitation: {pop}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
