import { useState, useCallback, useMemo } from 'react';
import { ScheduleItem } from '../types';
import { fetchAndParseSheetData } from '../services/scheduleService';

interface UseScheduleDataReturn {
  allScheduleItems: ScheduleItem[];
  isLoading: boolean;
  error: string | null;
  loadScheduleData: (spreadsheetId: string, month: number, year: number) => Promise<void>;
  categorizedItems: {
    todayItems: ScheduleItem[];
    futureItems: ScheduleItem[];
    pastItems: ScheduleItem[];
  };
}

export const useScheduleData = (userCurrentAbsoluteDateKey: number): UseScheduleDataReturn => {
  const [allScheduleItems, setAllScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadScheduleData = useCallback(async (spreadsheetId: string, month: number, year: number) => {
    setIsLoading(true);
    setError(null);
    setAllScheduleItems([]);
    
    try {
      const data = await fetchAndParseSheetData(spreadsheetId, month, year);
      setAllScheduleItems(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching data.');
      }
      setAllScheduleItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const categorizedItems = useMemo(() => {
    const todayItems: ScheduleItem[] = [];
    const futureItems: ScheduleItem[] = [];
    const pastItems: ScheduleItem[] = [];

    allScheduleItems.forEach(item => {
      if (item.dateKey === userCurrentAbsoluteDateKey) {
        todayItems.push(item);
      } else if (item.dateKey > userCurrentAbsoluteDateKey) {
        futureItems.push(item);
      } else {
        pastItems.push(item);
      }
    });

    futureItems.sort((a, b) => a.dateKey - b.dateKey);
    pastItems.sort((a, b) => a.dateKey - b.dateKey);

    return { todayItems, futureItems, pastItems };
  }, [allScheduleItems, userCurrentAbsoluteDateKey]);

  return {
    allScheduleItems,
    isLoading,
    error,
    loadScheduleData,
    categorizedItems,
  };
};