
import React, { useRef, useEffect } from 'react';

interface MonthTabsProps {
  months: number[];
  selectedMonth: number;
  currentMonth: number; // Will be 0 if DATA_YEAR !== userActualYear
  onSelectMonth: (month: number) => void;
}

const MonthTabs: React.FC<MonthTabsProps> = ({ months, selectedMonth, currentMonth, onSelectMonth }) => {
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tab = activeTabRef.current;
      
      const desiredScrollLeft = tab.offsetLeft + tab.offsetWidth / 2 - container.offsetWidth / 2;

      container.scrollTo({
        left: desiredScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [selectedMonth]);


  return (
    <div ref={tabsContainerRef} className="month-tabs-container flex overflow-x-auto py-2 mb-4 space-x-2" role="tablist" aria-label="Months">
      {months.map(month => {
        const isActive = month === selectedMonth;
        // isCurrent is true only if currentMonth prop is valid (1-12) and matches this tab's month
        const isCurrentActualMonth = month === currentMonth && currentMonth >= 1 && currentMonth <= 12; 

        return (
          <button
            key={month}
            ref={isActive ? activeTabRef : null}
            onClick={() => onSelectMonth(month)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out
              ${isActive
                ? 'bg-blue-500 text-white shadow-md'
                : isCurrentActualMonth
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
            role="tab"
            aria-selected={isActive}
            aria-controls={isActive ? "schedule-content" : undefined} // Assuming main content area could have an ID like "schedule-content"
            aria-current={isActive ? "page" : (isCurrentActualMonth ? "date" : undefined)}
            tabIndex={isActive ? 0 : -1}
          >
            {month}月
          </button>
        );
      })}
    </div>
  );
};

export default MonthTabs;
