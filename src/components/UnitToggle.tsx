
import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

const UnitToggle: React.FC = () => {
  const { units, setUnits, useDummyData, setUseDummyData } = useWeather();

  return (
    <div className="flex justify-end mt-4 gap-4 items-center">
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
      
      <div className="glass-panel p-1 rounded-full flex">
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
            useDummyData 
              ? 'bg-orange/80 dark:bg-yellow/80 text-white' 
              : 'hover:bg-orange/20 dark:hover:bg-yellow/20'
          }`}
          onClick={() => setUseDummyData(!useDummyData)}
          title="Toggle dummy data for testing"
        >
          <Database className="h-4 w-4" />
          {useDummyData ? 'Using Test Data' : 'Use Test Data'}
        </Button>
      </div>
    </div>
  );
};

export default UnitToggle;
