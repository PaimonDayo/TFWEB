
export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || '1utxuwDZsrLZ5cTq8uIPRdOmMvlE9O1IbE1ymsIey3Uo';
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
export const DATA_YEAR = parseInt(import.meta.env.VITE_DATA_YEAR || '2025', 10);

// UI Constants
export const UI_CONSTANTS = {
  SKELETON_COUNT: 3,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  WEATHER_TIMEOUT: 5000,
} as const;

// Location color mapping
export const LOCATION_COLORS = {
  '東大': 'bg-red-100 border-red-300',
  '駒場': 'bg-blue-100 border-blue-300',
  '本郷': 'bg-green-100 border-green-300',
  '織田フィールド': 'bg-purple-100 border-purple-300',
  default: 'bg-gray-100 border-gray-300',
} as const;
