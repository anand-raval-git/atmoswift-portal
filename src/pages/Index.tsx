
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WeatherProvider } from '@/contexts/WeatherContext';
import Header from '@/components/Header';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyForecast from '@/components/HourlyForecast';
import DailyForecast from '@/components/DailyForecast';
import UnitToggle from '@/components/UnitToggle';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

const IndexContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'light-gradient-bg' : 'bg-background'}`}>
      <div className="container mx-auto px-4 flex-grow">
        <Header />
        <UnitToggle />
        <main className="py-4">
          <CurrentWeather />
          <HourlyForecast />
          <DailyForecast />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <IndexContent />
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default Index;
