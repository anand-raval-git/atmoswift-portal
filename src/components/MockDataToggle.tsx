
import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Database } from 'lucide-react';

const MockDataToggle: React.FC = () => {
  const { useMockData, setUseMockData } = useWeather();

  return (
    <div className="flex items-center space-x-2 mt-2">
      <Database className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center space-x-2">
        <Switch 
          id="mock-data" 
          checked={useMockData}
          onCheckedChange={setUseMockData}
        />
        <Label htmlFor="mock-data" className="text-sm font-medium text-muted-foreground cursor-pointer">
          Use Mock Data
        </Label>
      </div>
    </div>
  );
};

export default MockDataToggle;
