
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScheduleItem } from './types';
import { SPREADSHEET_ID, MONTHS } from './constants';
import { fetchAndParseSheetData } from './services/scheduleService';
import MonthTabs from './components/MonthTabs';
import ScheduleCard from './components/ScheduleCard';
import MessageDisplay from './components/MessageDisplay';
import ScheduleCardSkeleton from './components/ScheduleCardSkeleton';

const App: React.FC = () => {
  const [now] = useState(new Date());
  const [currentYear] = useState(now.getFullYear());
  const [currentMonth] = useState(now.getMonth() + 1);
  const [currentDay] = useState(now.getDate());

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [allScheduleItems, setAllScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const todayDateKey = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, currentDay).getTime();
  }, [currentYear, currentMonth, currentDay]);

  const loadData = useCallback(async (month: number) => {
    setIsLoading(true);
    setError(null);
    setAllScheduleItems([]); // CRITICAL: Clear previous data immediately
    try {
      const data = await fetchAndParseSheetData(SPREADSHEET_ID, month, currentYear);
      setAllScheduleItems(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError('An unknown error occurred while fetching data.');
      }
      setAllScheduleItems([]); // Ensure data is cleared on error
    } finally {
      setIsLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    loadData(selectedMonth);
  }, [selectedMonth, loadData]);

  const categorizedItems = useMemo(() => {
    const todayItems: ScheduleItem[] = [];
    const futureItems: ScheduleItem[] = [];
    const pastItems: ScheduleItem[] = [];

    allScheduleItems.forEach(item => {
      if (item.dateKey === todayDateKey && selectedMonth === currentMonth) {
        todayItems.push(item);
      } else if (item.dateKey > todayDateKey) {
        futureItems.push(item);
      } else {
        pastItems.push(item);
      }
    });

    futureItems.sort((a, b) => a.dateKey - b.dateKey);
    pastItems.sort((a, b) => b.dateKey - a.dateKey);

    return { todayItems, futureItems, pastItems };
  }, [allScheduleItems, todayDateKey, selectedMonth, currentMonth]);

  const LoadingSkeletons: React.FC = () => (
    <>
      <ScheduleCardSkeleton />
      <ScheduleCardSkeleton />
      <ScheduleCardSkeleton />
    </>
  );

  const renderNoDataMessage = () => {
    let messageText = "";
    if (selectedMonth > currentMonth || (selectedMonth === currentMonth && currentDay > new Date(currentYear, selectedMonth -1, 0).getDate())) { // Future month or current month after all days passed
        messageText = `${selectedMonth}月の練習予定はまだ公開されていません。`;
    } else if (selectedMonth === currentMonth) {
        messageText = `今月の練習予定はまだ登録されていません。`;
    } else { // Past month
        messageText = `${selectedMonth}月の練習データはありませんでした。`;
    }
    return <MessageDisplay type="info" message={messageText} />;
  };

  let mainContent;
  if (isLoading) {
    mainContent = <LoadingSkeletons />;
  } else if (error) {
    mainContent = <MessageDisplay type="error" message={error} />;
  } else if (allScheduleItems.length === 0) {
    mainContent = renderNoDataMessage();
  } else {
    mainContent = (
      <>
        {/* Today Section (only if selectedMonth is currentMonth) */}
        {selectedMonth === currentMonth && (
          <section id="today-section" className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
              今日の練習
            </h2>
            {categorizedItems.todayItems.length > 0 ? (
              categorizedItems.todayItems.map(item => (
                <ScheduleCard key={item.id} item={item} type="today" />
              ))
            ) : (
              <MessageDisplay type="info" message="今日の練習予定はありません" />
            )}
          </section>
        )}

        {/* Future Section */}
        {(categorizedItems.futureItems.length > 0 || (selectedMonth >= currentMonth && !(selectedMonth === currentMonth && categorizedItems.todayItems.length === 0 && categorizedItems.futureItems.length === 0))) && (
          <section id="future-section" className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
              {selectedMonth === currentMonth ? '今後の練習予定' : `${selectedMonth}月の練習予定`}
            </h2>
            {categorizedItems.futureItems.length > 0 ? (
              categorizedItems.futureItems.map(item => (
                <ScheduleCard key={item.id} item={item} type="future" />
              ))
            ) : (
              (selectedMonth > currentMonth || (selectedMonth === currentMonth && categorizedItems.todayItems.length > 0 )) &&  // Show if future month, or current month if there were today items but no future ones. Avoids double "no practice" if today is also empty.
              <MessageDisplay type="info" message={`${selectedMonth === currentMonth ? 'これからの練習予定' : `${selectedMonth}月の練習予定`}はありません。`} />
            )}
          </section>
        )}
        
        {/* Past Section */}
        {categorizedItems.pastItems.length > 0 && (
             <section id="past-section">
             <h2 className="text-lg font-medium text-gray-600 border-b border-gray-300 pb-1 mb-3">
               過去の練習 ({selectedMonth}月)
             </h2>
             {categorizedItems.pastItems.map(item => (
               <ScheduleCard key={item.id} item={item} type="past" />
             ))}
           </section>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-4"> {/* Added pt-4 for spacing after removing header */}
      {/* Header removed */}
      <main className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-500 mb-4">
          {`${currentYear}年${currentMonth}月${currentDay}日`}
        </div>

        <MonthTabs
          months={MONTHS}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          currentMonth={currentMonth}
        />
        {mainContent}
      </main>
      <footer className="text-center py-4 mt-8 text-sm text-gray-500">
        <p>&copy; {currentYear} TUATTF Schedule Viewer</p>
      </footer>
    </div>
  );
};

export default App;
