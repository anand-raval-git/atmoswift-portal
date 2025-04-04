
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WeatherProvider } from '@/contexts/WeatherContext';
import Header from '@/components/Header';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyForecast from '@/components/HourlyForecast';
import DailyForecast from '@/components/DailyForecast';
import UnitToggle from '@/components/UnitToggle';
import MockDataToggle from '@/components/MockDataToggle';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="min-h-screen flex flex-col">
          <div className="container mx-auto px-4 flex-grow">
            <Header />
            <div className="flex justify-end items-center gap-4 flex-wrap mt-4">
              <MockDataToggle />
              <UnitToggle />
            </div>
            <main className="py-4">
              <CurrentWeather />
              <HourlyForecast />
              <DailyForecast />
              <Projects />
            </main>
          </div>
          <Footer />
        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default Index;
