
import React, { useState, useEffect, useMemo } from 'react';
import { ScheduleItem } from './types';
import { SPREADSHEET_ID, MONTHS, DATA_YEAR, UI_CONSTANTS } from './constants';
import { useScheduleData } from './hooks/useScheduleData';
import { useWeatherData } from './hooks/useWeatherData';
import { useCalendarData } from './hooks/useCalendarData';
import { useCalendarState } from './hooks/useCalendarState';
import { formatDate, getCurrentDateKey } from './utils/dateUtils';
import MonthTabs from './components/MonthTabs';
import ScheduleCard from './components/ScheduleCard';
import MessageDisplay from './components/MessageDisplay';
import ScheduleCardSkeleton from './components/ScheduleCardSkeleton';
import Modal from './components/Modal';
import PracticeCalendar from './components/PracticeCalendar';
import CalendarIcon from './components/icons/CalendarIcon';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import LocationLegend from './components/LocationLegend';


const App: React.FC = () => {
  const [userActualDate] = useState(new Date());
  const userActualYear = userActualDate.getFullYear();
  const userActualMonth = userActualDate.getMonth() + 1;
  const userActualDay = userActualDate.getDate();

  const [selectedMonth, setSelectedMonth] = useState<number>(userActualMonth);

  const userCurrentAbsoluteDateKey = useMemo(() => {
    return getCurrentDateKey(userActualDate);
  }, [userActualDate]);

  const { allScheduleItems, isLoading, error, loadScheduleData, categorizedItems } = useScheduleData(userCurrentAbsoluteDateKey);
  const { todayWeather } = useWeatherData(userActualDate, userActualYear, DATA_YEAR);
  const { calendarScheduleItems, isLoadingCalendarData, loadCalendarData } = useCalendarData();
  const { calendarState, openCalendar, closeCalendar, changeCalendarMonth } = useCalendarState(selectedMonth);

  useEffect(() => {
    loadScheduleData(SPREADSHEET_ID, selectedMonth, DATA_YEAR);
  }, [selectedMonth, loadScheduleData]);

  useEffect(() => {
    if (calendarState.isCalendarVisible) {
      loadCalendarData(SPREADSHEET_ID, DATA_YEAR, calendarState.calendarFocusedMonth);
    }
  }, [calendarState.isCalendarVisible, calendarState.calendarFocusedMonth, loadCalendarData]);

  const handleCalendarMonthChange = (newMonth: number) => {
    changeCalendarMonth(newMonth);
  };
  
  const handleOpenCalendar = () => {
    openCalendar(selectedMonth);
  };



  const LoadingSkeletons: React.FC = () => (
    <>
      {Array.from({ length: UI_CONSTANTS.SKELETON_COUNT }, (_, index) => (
        <ScheduleCardSkeleton key={index} />
      ))}
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 text-gray-800 pt-4">
      <header className="container mx-auto px-4 mb-2 md:mb-4">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500" aria-label="Current date and weather">
              {formatDate(userActualDate)}
              {todayWeather && DATA_YEAR === userActualYear && (
                <span className="ml-2">
                  {`東京: ${todayWeather.condition}, ${todayWeather.temperature}°C`}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <LocationLegend />
              <button
                onClick={handleOpenCalendar}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="練習カレンダーを表示"
              >
                <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
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
        isOpen={calendarState.isCalendarVisible} 
        onClose={closeCalendar}
        title={`${DATA_YEAR}年 ${calendarState.calendarFocusedMonth}月 練習カレンダー`}
      >
        {isLoadingCalendarData ? <LoadingSpinner/> : (
            <PracticeCalendar 
              year={DATA_YEAR} 
              month={calendarState.calendarFocusedMonth} 
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
    </ErrorBoundary>
  );
};

export default App;
