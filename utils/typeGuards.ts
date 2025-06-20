import { ScheduleItem, WeatherInfo } from '../types';

export const isValidScheduleItem = (item: unknown): item is ScheduleItem => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const obj = item as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.day === 'number' &&
    obj.day >= 1 &&
    obj.day <= 31 &&
    typeof obj.dateStr === 'string' &&
    typeof obj.dayOfWeek === 'string' &&
    typeof obj.time === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.menu === 'string' &&
    typeof obj.pace === 'string' &&
    typeof obj.strengthening === 'string' &&
    typeof obj.notes === 'string' &&
    typeof obj.dateKey === 'number' &&
    !isNaN(obj.dateKey)
  );
};

export const isValidWeatherInfo = (weather: unknown): weather is WeatherInfo => {
  if (typeof weather !== 'object' || weather === null) {
    return false;
  }

  const obj = weather as Record<string, unknown>;

  return (
    typeof obj.condition === 'string' &&
    typeof obj.temperature === 'number' &&
    !isNaN(obj.temperature) &&
    typeof obj.humidity === 'number' &&
    !isNaN(obj.humidity) &&
    obj.humidity >= 0 &&
    obj.humidity <= 100 &&
    typeof obj.windSpeed === 'number' &&
    !isNaN(obj.windSpeed) &&
    obj.windSpeed >= 0
  );
};

export const isValidMonth = (month: unknown): month is number => {
  return typeof month === 'number' && month >= 1 && month <= 12;
};

export const isValidYear = (year: unknown): year is number => {
  return typeof year === 'number' && year >= 2000 && year <= 2100;
};

export const isValidDay = (day: unknown): day is number => {
  return typeof day === 'number' && day >= 1 && day <= 31;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};