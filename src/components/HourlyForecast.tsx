
import React, { useRef } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { formatTime, getWeatherIconUrl } from '@/services/weatherService';

const HourlyForecast: React.FC = () => {
  const { weatherData, units, isLoading } = useWeather();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -200 : 200;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="glass-panel p-4 mt-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-36"></div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!weatherData?.hourly || weatherData.hourly.length === 0) {
    return null;
  }
  
  const { hourly, current } = weatherData;
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="glass-panel p-4 mt-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Hourly Forecast</h3>
        <div className="flex gap-1">
          <button 
            onClick={() => scroll('left')} 
            className="p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
      >
        {hourly.map((hour, index) => {
          const time = formatTime(hour.dt, current.timezone);
          const pop = Math.round(hour.pop * 100); // Probability of precipitation
          
          return (
            <div 
              key={index} 
              className="flex-shrink-0 flex flex-col items-center p-3 bg-background/50 rounded-lg card-hover min-w-[5rem]"
            >
              <span className="text-sm font-medium">
                {index === 0 ? 'Now' : time}
              </span>
              
              <img 
                src={getWeatherIconUrl(hour.weather[0].icon, '2x')} 
                alt={hour.weather[0].description}
                className="w-12 h-12 my-1"
              />
              
              <span className="text-base font-bold">
                {hour.temp}{tempUnit}
              </span>
              
              {pop > 0 && (
                <div className="flex items-center mt-1 text-xs text-sky dark:text-cyan">
                  <Droplets className="h-3 w-3 mr-1" />
                  <span>{pop}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
