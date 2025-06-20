import { useState, useEffect } from 'react';
import { WeatherInfo } from '../types';
import { getMockWeather } from '../services/weatherService';

interface UseWeatherDataReturn {
  todayWeather: WeatherInfo | null;
  isLoadingWeather: boolean;
  weatherError: string | null;
}

export const useWeatherData = (userActualDate: Date, userActualYear: number, dataYear: number): UseWeatherDataReturn => {
  const [todayWeather, setTodayWeather] = useState<WeatherInfo | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayWeather = async () => {
      if (dataYear === userActualYear) {
        setIsLoadingWeather(true);
        setWeatherError(null);
        
        try {
          const weatherData = await getMockWeather(userActualDate, 'Tokyo');
          setTodayWeather(weatherData);
        } catch (err) {
          console.error("Failed to fetch today's weather:", err);
          setWeatherError("天気情報の取得に失敗しました");
          setTodayWeather(null);
        } finally {
          setIsLoadingWeather(false);
        }
      }
    };

    fetchTodayWeather();
  }, [userActualDate, userActualYear, dataYear]);

  return {
    todayWeather,
    isLoadingWeather,
    weatherError,
  };
};