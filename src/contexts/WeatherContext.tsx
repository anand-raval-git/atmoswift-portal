
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WeatherData,
  WeatherResponseData,
  HourlyForecast,
  DailyForecast,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
  EndpointType,
  EndpointTypes
} from '../services/weatherService';
import { getMockWeatherData } from '../utils/mockWeatherData';
import { toast } from 'sonner';

interface WeatherContextType {
  weatherData: WeatherResponseData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  units: 'metric' | 'imperial';
  endpointType: EndpointType;
  setUnits: (units: 'metric' | 'imperial') => void;
  setEndpointType: (endpointType: EndpointType) => void;
  searchCity: (city: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  refreshWeather: () => Promise<void>;
  useMockData: boolean;
  setUseMockData: (useMock: boolean) => void;
<<<<<<< HEAD
  searchHistory: string[];
  clearSearchHistory: () => void;
=======
  isPremiumEnabled: boolean;
>>>>>>> 2de44c9f5b556c2af8b3142f3d5dd8e44387c6f9
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>(() => {
    return localStorage.getItem('units') === 'imperial' ? 'imperial' : 'metric';
  });
  const [endpointType, setEndpointType] = useState<EndpointType>(() => {
    return localStorage.getItem('endpointType') === EndpointTypes.PREMIUM 
      ? EndpointTypes.PREMIUM 
      : EndpointTypes.STANDARD;
  });
  const [useMockData, setUseMockData] = useState<boolean>(() => {
    return localStorage.getItem('useMockData') === 'true';
  });
  // Premium is disabled by default - will be implemented in future
  const [isPremiumEnabled] = useState<boolean>(false);
  const [lastSearchedLocation, setLastSearchedLocation] = useState<{
    type: 'city' | 'coordinates';
    value: string | { lat: number; lon: number };
  } | null>(() => {
    const saved = localStorage.getItem('lastLocation');
    return saved ? JSON.parse(saved) : null;
  });

  // Search history state
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage when units change
  useEffect(() => {
    localStorage.setItem('units', units);

    // If we have a last searched location, refresh the weather with new units
    if (lastSearchedLocation && !isLoading) {
      refreshWeather();
    }
  }, [units]);

  // Update localStorage when endpoint type changes
  useEffect(() => {
    localStorage.setItem('endpointType', endpointType);
    
    // If we have a last searched location, refresh the weather with new endpoint type
    if (lastSearchedLocation && !isLoading) {
      refreshWeather();
    }
  }, [endpointType]);

  // Update localStorage when mock data preference changes
  useEffect(() => {
    localStorage.setItem('useMockData', useMockData.toString());
    if (useMockData) {
      loadMockData();
    } else if (lastSearchedLocation && !isLoading) {
      refreshWeather();
    }
  }, [useMockData]);

  // Save last searched location to localStorage
  useEffect(() => {
    if (lastSearchedLocation) {
      localStorage.setItem('lastLocation', JSON.stringify(lastSearchedLocation));
    }
  }, [lastSearchedLocation]);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Initial weather fetch
  useEffect(() => {
    const fetchInitialWeather = async () => {
      if (useMockData) {
        loadMockData();
        return;
      }

      // If we have a last searched location, use that
      if (lastSearchedLocation) {
        if (lastSearchedLocation.type === 'city') {
          await searchCity(lastSearchedLocation.value as string);
        } else {
          const { lat, lon } = lastSearchedLocation.value as { lat: number; lon: number };
          await fetchWeatherForCoordinates(lat, lon);
        }
      } else {
        // Otherwise use geolocation
        await getCurrentLocation();
      }
    };

    fetchInitialWeather();
  }, []);

  const loadMockData = () => {
    const mockData = getMockWeatherData(units);
    setWeatherData(mockData);
    setLastUpdated(new Date());
    setError(null);
  };

  const searchCity = async (city: string) => {
    // Add to search history if not already present
    const formattedCity = city.trim();
    if (formattedCity && !searchHistory.includes(formattedCity)) {
      // Keep only the last 10 searches
      setSearchHistory(prev => [formattedCity, ...prev.slice(0, 9)]);
    }

    if (useMockData) {
      loadMockData();
      setLastSearchedLocation({ type: 'city', value: formattedCity });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const data = await fetchWeatherByCity(formattedCity, units);

=======
      // Only use premium endpoint if it's enabled and selected
      const activeEndpoint = isPremiumEnabled ? endpointType : EndpointTypes.STANDARD;
      
      const data = await fetchWeatherByCity(city, units, activeEndpoint);
      
>>>>>>> 2de44c9f5b556c2af8b3142f3d5dd8e44387c6f9
      if (data) {
        setWeatherData(data);
        setLastUpdated(new Date());
        setLastSearchedLocation({ type: 'city', value: formattedCity });
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const fetchWeatherForCoordinates = async (lat: number, lon: number) => {
    if (useMockData) {
      loadMockData();
      setLastSearchedLocation({ type: 'coordinates', value: { lat, lon } });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const data = await fetchWeatherByCoordinates(lat, lon, units);

=======
      // Only use premium endpoint if it's enabled and selected
      const activeEndpoint = isPremiumEnabled ? endpointType : EndpointTypes.STANDARD;
      
      const data = await fetchWeatherByCoordinates(lat, lon, units, activeEndpoint);
      
>>>>>>> 2de44c9f5b556c2af8b3142f3d5dd8e44387c6f9
      if (data) {
        setWeatherData(data);
        setLastUpdated(new Date());
        setLastSearchedLocation({
          type: 'coordinates',
          value: { lat, lon }
        });
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    if (useMockData) {
      loadMockData();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await fetchWeatherForCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('Unable to get your location. Please allow location access or search for a city.');
            setIsLoading(false);
            // Try to use IP-based location or default to a major city
            searchCity('New York');
          }
        );
      } else {
        setError('Geolocation is not supported by your browser. Please search for a city.');
        setIsLoading(false);
        // Default to a major city
        searchCity('New York');
      }
    } catch (err) {
      setError('Failed to get your location. Please try again.');
      console.error(err);
      setIsLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (useMockData) {
      loadMockData();
      toast.success('Weather data updated!');
      return;
    }

    if (!lastSearchedLocation) {
      await getCurrentLocation();
      return;
    }

    if (lastSearchedLocation.type === 'city') {
      await searchCity(lastSearchedLocation.value as string);
    } else {
      const { lat, lon } = lastSearchedLocation.value as { lat: number; lon: number };
      await fetchWeatherForCoordinates(lat, lon);
    }

    toast.success('Weather data updated!');
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        isLoading,
        error,
        lastUpdated,
        units,
        endpointType,
        setUnits,
        setEndpointType,
        searchCity,
        getCurrentLocation,
        refreshWeather,
        useMockData,
        setUseMockData,
<<<<<<< HEAD
        searchHistory,
        clearSearchHistory
=======
        isPremiumEnabled
>>>>>>> 2de44c9f5b556c2af8b3142f3d5dd8e44387c6f9
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }

  return context;
};
