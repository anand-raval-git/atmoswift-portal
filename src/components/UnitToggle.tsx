
import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';
import { Thermometer } from 'lucide-react';

const UnitToggle: React.FC = () => {
  const { units, setUnits } = useWeather();

  return (
    <div className="flex items-center">
      <div className="glass-panel p-1 rounded-full flex items-center">
        <Thermometer className="h-4 w-4 text-muted-foreground ml-2 mr-1" />
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-full transition-colors ${
            units === 'metric' 
              ? 'bg-sky dark:bg-cyan text-white' 
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
              ? 'bg-sky dark:bg-cyan text-white' 
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
