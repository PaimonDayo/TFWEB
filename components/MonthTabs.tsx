
import React, { useRef, useEffect } from 'react';

interface MonthTabsProps {
  months: number[];
  selectedMonth: number;
  currentMonth: number;
  onSelectMonth: (month: number) => void;
}

const MonthTabs: React.FC<MonthTabsProps> = ({ months, selectedMonth, currentMonth, onSelectMonth }) => {
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      let scrollLeft = container.scrollLeft;
      if (tabRect.left < containerRect.left) { // Tab is to the left of viewport
        scrollLeft -= (containerRect.left - tabRect.left) + tab.clientWidth / 2; // Scroll to center
      } else if (tabRect.right > containerRect.right) { // Tab is to the right of viewport
        scrollLeft += (tabRect.right - containerRect.right) + tab.clientWidth / 2; // Scroll to center
      }
      
      // Ensure the scroll brings the tab towards the center
      const desiredScrollLeft = tab.offsetLeft + tab.offsetWidth / 2 - container.offsetWidth / 2;

      container.scrollTo({
        left: desiredScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [selectedMonth]);


  return (
    <div ref={tabsContainerRef} className="month-tabs-container flex overflow-x-auto py-2 mb-4 space-x-2">
      {months.map(month => {
        const isActive = month === selectedMonth;
        return (
          <button
            key={month}
            ref={isActive ? activeTabRef : null}
            onClick={() => onSelectMonth(month)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out
              ${isActive
                ? 'bg-blue-500 text-white shadow-md'
                : month === currentMonth 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {month}月
          </button>
        );
      })}
    </div>
  );
};

export default MonthTabs;
