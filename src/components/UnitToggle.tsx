
import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';

const UnitToggle: React.FC = () => {
  const { units, setUnits } = useWeather();

  return (
    <div className="flex justify-end mt-4">
      <div className="glass-panel p-1 rounded-full flex">
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-full transition-colors ${
            units === 'metric' 
              ? 'bg-sky/80 dark:bg-cyan/80 text-white' 
              : 'hover:bg-sky/20 dark:hover:bg-cyan/20'
          }`}
          onClick={() => setUnits('metric')}
        >
          °C
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-full transition-colors ${
            units === 'imperial' 
              ? 'bg-sky/80 dark:bg-cyan/80 text-white' 
              : 'hover:bg-sky/20 dark:hover:bg-cyan/20'
          }`}
          onClick={() => setUnits('imperial')}
        >
          °F
        </Button>
      </div>
    </div>
  );
};

export default UnitToggle;
