
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScheduleItem, WeatherInfo } from './types';
import { SPREADSHEET_ID, MONTHS, DATA_YEAR } from './constants';
import { fetchAndParseSheetData } from './services/scheduleService';
import { getMockWeather } from './services/weatherService'; 
import MonthTabs from './components/MonthTabs';
import ScheduleCard from './components/ScheduleCard';
import MessageDisplay from './components/MessageDisplay';
import ScheduleCardSkeleton from './components/ScheduleCardSkeleton';
import Modal from './components/Modal';
import PracticeCalendar from './components/PracticeCalendar';
import CalendarIcon from './components/icons/CalendarIcon';
import LoadingSpinner from './components/LoadingSpinner';


const App: React.FC = () => {
  const [userActualDate] = useState(new Date());
  const userActualYear = userActualDate.getFullYear();
  const userActualMonth = userActualDate.getMonth() + 1;
  const userActualDay = userActualDate.getDate();

  const [selectedMonth, setSelectedMonth] = useState<number>(userActualMonth);
  const [allScheduleItems, setAllScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [calendarFocusedMonth, setCalendarFocusedMonth] = useState<number>(selectedMonth);
  const [calendarScheduleItems, setCalendarScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoadingCalendarData, setIsLoadingCalendarData] = useState<boolean>(false);

  const [todayWeather, setTodayWeather] = useState<WeatherInfo | null>(null);


  const userCurrentAbsoluteDateKey = useMemo(() => {
    return new Date(userActualYear, userActualMonth - 1, userActualDay, 0, 0, 0, 0).getTime();
  }, [userActualYear, userActualMonth, userActualDay]);

  useEffect(() => {
    const fetchTodayWeather = async () => {
      if (DATA_YEAR === userActualYear) { 
        try {
          const weatherData = await getMockWeather(userActualDate, 'Tokyo'); 
          setTodayWeather(weatherData);
        } catch (err) {
          console.error("Failed to fetch today's weather:", err);
          setTodayWeather(null);
        }
      }
    };
    fetchTodayWeather();
  }, [userActualDate, userActualYear]);

  const loadMainData = useCallback(async (month: number) => {
    setIsLoading(true);
    setError(null);
    setAllScheduleItems([]); 
    try {
      const data = await fetchAndParseSheetData(SPREADSHEET_ID, month, DATA_YEAR);
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
  
  const loadCalendarData = useCallback(async (year: number, month: number) => {
    setIsLoadingCalendarData(true);
    setCalendarScheduleItems([]);
    try {
      const data = await fetchAndParseSheetData(SPREADSHEET_ID, month, year);
      setCalendarScheduleItems(data);
    } catch (err) {
      console.error(`Error fetching calendar data for ${year}-${month}:`, err);
      setCalendarScheduleItems([]); // Set to empty on error
    } finally {
      setIsLoadingCalendarData(false);
    }
  }, []);


  useEffect(() => {
    loadMainData(selectedMonth);
  }, [selectedMonth, loadMainData]);

  useEffect(() => {
    if (isCalendarVisible) {
      setCalendarFocusedMonth(selectedMonth); // Sync calendar month with main selected month on open
      loadCalendarData(DATA_YEAR, selectedMonth);
    }
  }, [isCalendarVisible, selectedMonth, loadCalendarData]);

  const handleCalendarMonthChange = (newMonth: number) => {
    setCalendarFocusedMonth(newMonth);
    loadCalendarData(DATA_YEAR, newMonth);
  };
  
  const handleOpenCalendar = () => {
    setCalendarFocusedMonth(selectedMonth); // Ensure calendar opens to the currently selected main month
    setIsCalendarVisible(true); 
    // loadCalendarData will be triggered by the useEffect watching isCalendarVisible and selectedMonth
  };


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
    pastItems.sort((a, b) => a.dateKey - b.dateKey); // Changed to ascending order

    return { todayItems, futureItems, pastItems };
  }, [allScheduleItems, userCurrentAbsoluteDateKey]);

  const LoadingSkeletons: React.FC = () => (
    <>
      <ScheduleCardSkeleton />
      <ScheduleCardSkeleton />
      <ScheduleCardSkeleton />
    </>
  );

  const renderNoDataMessage = () => {
    const messageText = `${DATA_YEAR}年${selectedMonth}月の練習データは登録されていません。`;
    return <MessageDisplay type="info" message={messageText} />;
  };
  
  const sectionTitleBaseClass = "text-xl font-semibold border-b-2 pb-2 mb-4";

  let futureSectionTitle = `${selectedMonth}月の練習予定`;
  let futureTitleColor = "text-green-700 border-green-300";
  if (DATA_YEAR === userActualYear && selectedMonth === userActualMonth) {
    futureSectionTitle = `今後の練習予定 (${selectedMonth}月)`;
  }

  let pastSectionTitle = `過去の練習 (${selectedMonth}月)`;
  let pastTitleColor = "text-gray-600 border-gray-400";
  if (DATA_YEAR === userActualYear && selectedMonth === userActualMonth) {
    pastSectionTitle = `今月の過去の練習 (${selectedMonth}月)`;
  }
  
  const todaySectionTitle = `今日の練習 (${userActualMonth}月${userActualDay}日)`;
  const todaySectionTitleColor = "text-blue-600 border-blue-300";


  let noFutureItemsMessageText = `${selectedMonth}月の練習予定はありません。`;
  if (DATA_YEAR === userActualYear && selectedMonth === userActualMonth) {
    noFutureItemsMessageText = `これからの練習予定 (${selectedMonth}月) はありません。`;
  }

  const isFutureOrientedContext = DATA_YEAR > userActualYear || (DATA_YEAR === userActualYear && selectedMonth >= userActualMonth);

  const showFutureSectionWrapper = categorizedItems.futureItems.length > 0 || 
    (isFutureOrientedContext && 
     !(DATA_YEAR === userActualYear && selectedMonth === userActualMonth && categorizedItems.todayItems.length === 0 && categorizedItems.futureItems.length === 0)
    );
  
  const showNoFutureItemsMessageCondition = isFutureOrientedContext && 
    ( (DATA_YEAR > userActualYear || (DATA_YEAR === userActualYear && selectedMonth > userActualMonth)) || 
      (DATA_YEAR === userActualYear && selectedMonth === userActualMonth && categorizedItems.todayItems.length > 0)
    );

  let mainContent;
  if (isLoading) {
    mainContent = <LoadingSkeletons />;
  } else if (error) {
    mainContent = <MessageDisplay type="error" message={error} />;
  } else if (allScheduleItems.length === 0 && categorizedItems.todayItems.length === 0) { 
    mainContent = renderNoDataMessage();
  } else {
    mainContent = (
      <>
        {categorizedItems.todayItems.length > 0 && (
          <section id="today-section" className="mb-8" aria-labelledby="today-heading">
            <h2 id="today-heading" className={`${sectionTitleBaseClass} ${todaySectionTitleColor}`}>
              {todaySectionTitle}
            </h2>
            {categorizedItems.todayItems.map(item => (
              <ScheduleCard key={item.id} item={item} type="today" />
            ))}
          </section>
        )}

        {showFutureSectionWrapper && (
          <section id="future-section" className="mb-8" aria-labelledby="future-heading">
            <h2 id="future-heading" className={`${sectionTitleBaseClass} ${futureTitleColor}`}>
              {futureSectionTitle}
            </h2>
            {categorizedItems.futureItems.length > 0 ? (
              categorizedItems.futureItems.map(item => (
                <ScheduleCard key={item.id} item={item} type="future" />
              ))
            ) : (
              showNoFutureItemsMessageCondition && 
              <MessageDisplay type="info" message={noFutureItemsMessageText} />
            )}
          </section>
        )}
        
        {categorizedItems.pastItems.length > 0 && (
             <section id="past-section" aria-labelledby="past-heading">
             <h2 id="past-heading" className={`${sectionTitleBaseClass} ${pastTitleColor} text-lg`}>
               {pastSectionTitle}
             </h2>
             {categorizedItems.pastItems.map(item => (
               <ScheduleCard key={item.id} item={item} type="past" />
             ))}
           </section>
        )}
      </>
    );
  }

  const currentMonthForTabs = DATA_YEAR === userActualYear ? userActualMonth : 0; 

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 pt-4">
      <header className="container mx-auto px-4 mb-2 md:mb-4">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500" aria-label="Current date and weather">
              {`${userActualYear}年${userActualMonth}月${userActualDay}日`}
              {todayWeather && DATA_YEAR === userActualYear && (
                <span className="ml-2">
                  {`東京: ${todayWeather.condition}, ${todayWeather.temperature}°C`}
                </span>
              )}
            </div>
            <button
              onClick={handleOpenCalendar}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="練習カレンダーを表示"
            >
              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
          </div>
      </header>
      <main className="container mx-auto px-4 py-3 md:py-6">
        <MonthTabs
          months={MONTHS}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          currentMonth={currentMonthForTabs} 
        />
        {mainContent}
      </main>

      <Modal 
        isOpen={isCalendarVisible} 
        onClose={() => setIsCalendarVisible(false)}
        title={`${DATA_YEAR}年 ${calendarFocusedMonth}月 練習カレンダー`}
      >
        {isLoadingCalendarData ? <LoadingSpinner/> : (
            <PracticeCalendar 
              year={DATA_YEAR} 
              month={calendarFocusedMonth} 
              scheduleItems={calendarScheduleItems} 
              onMonthChange={handleCalendarMonthChange}
              isLoading={isLoadingCalendarData}
            />
        )}
      </Modal>

      <footer className="text-center py-4 mt-8 text-xs md:text-sm text-gray-500">
        <p>&copy; {userActualYear} TUATTF Schedule Viewer</p>
      </footer>
    </div>
  );
};

export default App;
