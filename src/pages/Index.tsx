
import React, { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WeatherProvider } from '@/contexts/WeatherContext';
import Header from '@/components/Header';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyForecast from '@/components/HourlyForecast';
import DailyForecast from '@/components/DailyForecast';
import UnitToggle from '@/components/UnitToggle';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="min-h-screen flex flex-col">
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
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default Index;
