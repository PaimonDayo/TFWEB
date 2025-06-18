
import { WeatherInfo } from '../types';

// Simple pseudo-random number generator for deterministic mocks based on date
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const getWeatherConditions = (seed: number): string => {
  const conditions = ['晴れ', '曇り', '時々晴れ', '雨', '晴れのち曇り', '曇りのち雨'];
  return conditions[seed % conditions.length];
};

export const getMockWeather = async (date: Date, location: string): Promise<WeatherInfo> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

  const dateStringSeed = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${location}`;
  const seed = simpleHash(dateStringSeed);

  const condition: string = getWeatherConditions(seed); // Correctly typed as string now
  let temperature: number;
  let humidity: number;
  let windSpeed: number;

  const month = date.getMonth(); // 0-11

  // Seasonal variation
  if (month >= 5 && month <= 8) { // Summer (June - Sep)
    temperature = 25 + (seed % 10); // 25-34°C
    humidity = 60 + (seed % 30);    // 60-89%
  } else if (month >= 2 && month <= 4) { // Spring (Mar - May)
    temperature = 15 + (seed % 10); // 15-24°C
    humidity = 50 + (seed % 25);    // 50-74%
  } else if (month >= 9 && month <= 10) { // Autumn (Oct - Nov)
    temperature = 18 + (seed % 10); // 18-27°C
    humidity = 55 + (seed % 25);    // 55-79%
  } else { // Winter (Dec - Feb)
    temperature = 5 + (seed % 8);  // 5-12°C
    humidity = 40 + (seed % 20);   // 40-59%
  }

  windSpeed = 2 + (seed % 4); // 2-5 m/s

  // Adjust for rain
  if (condition.includes('雨')) {
    humidity = Math.min(95, humidity + 15);
    temperature = Math.max(temperature - 2, 5); // Slightly cooler if raining
  }


  return {
    condition,
    temperature: parseFloat(temperature.toFixed(1)),
    humidity: Math.round(humidity),
    windSpeed: parseFloat(windSpeed.toFixed(1)),
  };
};
