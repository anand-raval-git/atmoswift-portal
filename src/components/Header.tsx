
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useWeather } from '@/contexts/WeatherContext';
import { MapPin, Search, Moon, Sun, RefreshCw, X, Clock, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { searchCity, getCurrentLocation, refreshWeather, isLoading, searchHistory, clearSearchHistory } = useWeather();
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchCity(searchTerm);
      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (city: string) => {
    setSearchTerm(city);
    searchCity(city);
    setShowHistory(false);
  };

  return (
    <header className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-3xl md:text-4xl font-bold text-sky dark:text-cyan">
          SkyPulse Weather
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Built and Deployed by Anand Raval using OpenWeatherMap API
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full md:w-auto"
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowHistory(true)}
            className="pl-10 pr-4 py-2 rounded-lg border border-input bg-background w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky dark:focus:ring-cyan text-sm"
          />
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <button
            type="submit"
            className="absolute right-2 p-1 rounded-md hover:bg-accent text-muted-foreground"
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div
              ref={historyDropdownRef}
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-md z-10 max-h-60 overflow-y-auto"
            >
              <div className="flex justify-between items-center p-2 border-b border-border">
                <div className="flex items-center text-sm text-muted-foreground">
                  <History className="h-4 w-4 mr-1" />
                  <span>Recent Searches</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    clearSearchHistory();
                    setShowHistory(false);
                  }}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear
                </Button>
              </div>
              <ul className="py-1">
                {searchHistory.map((city, index) => (
                  <li key={`${city}-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleHistoryItemClick(city)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent/50 flex items-center"
                    >
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => getCurrentLocation()}
            disabled={isLoading}
            title="Get current location"
            className="border-input hover:bg-background hover:text-sky dark:hover:text-cyan"
          >
            <MapPin className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refreshWeather()}
            disabled={isLoading}
            title="Refresh weather data"
            className="border-input hover:bg-background hover:text-sky dark:hover:text-cyan"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="border-input hover:bg-background hover:text-sky dark:hover:text-cyan"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
