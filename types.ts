
export interface ScheduleItem {
  id: string;
  day: number;
  dateStr: string; // e.g., "5/1"
  dayOfWeek: string;
  time: string;
  location: string;
  menu: string;
  pace: string;
  strengthening: string;
  notes: string;
  dateKey: number; // Timestamp for sorting and comparison (year, month, day only)
}

export type ScheduleViewType = 'today' | 'future' | 'past';

export interface WeatherInfo {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}
