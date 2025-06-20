import { useState, useCallback } from 'react';
import { ScheduleItem } from '../types';
import { fetchAndParseSheetData } from '../services/scheduleService';

interface UseCalendarDataReturn {
  calendarScheduleItems: ScheduleItem[];
  isLoadingCalendarData: boolean;
  calendarError: string | null;
  loadCalendarData: (spreadsheetId: string, year: number, month: number) => Promise<void>;
}

export const useCalendarData = (): UseCalendarDataReturn => {
  const [calendarScheduleItems, setCalendarScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoadingCalendarData, setIsLoadingCalendarData] = useState<boolean>(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const loadCalendarData = useCallback(async (spreadsheetId: string, year: number, month: number) => {
    setIsLoadingCalendarData(true);
    setCalendarScheduleItems([]);
    setCalendarError(null);
    
    try {
      const data = await fetchAndParseSheetData(spreadsheetId, month, year);
      setCalendarScheduleItems(data);
    } catch (err) {
      console.error(`Error fetching calendar data for ${year}-${month}:`, err);
      setCalendarError(`${year}年${month}月のカレンダーデータの取得に失敗しました`);
      setCalendarScheduleItems([]);
    } finally {
      setIsLoadingCalendarData(false);
    }
  }, []);

  return {
    calendarScheduleItems,
    isLoadingCalendarData,
    calendarError,
    loadCalendarData,
  };
};