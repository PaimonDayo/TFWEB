import React, { useState, useMemo } from 'react';
import { ScheduleItem } from '../types';
import { DATA_YEAR } from '../constants';
import ScheduleCard from './ScheduleCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import LoadingSpinner from './LoadingSpinner';
import MessageDisplay from './MessageDisplay';

interface PracticeCalendarProps {
  year: number;
  month: number; // 1-12
  scheduleItems: ScheduleItem[];
  onMonthChange: (newMonth: number) => void;
  isLoading: boolean;
}

const PracticeCalendar: React.FC<PracticeCalendarProps> = ({ year, month, scheduleItems, onMonthChange, isLoading }) => {
  const [selectedDayOnCalendar, setSelectedDayOnCalendar] = useState<number | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 (Sun) - 6 (Sat)
  
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const practiceDays = useMemo(() => new Set(
    scheduleItems.map(item => new Date(item.dateKey).getDate())
  ), [scheduleItems]);

  const calendarGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGrid.push(day);
  }

  const handleDayClick = (day: number | null) => {
    if (day) {
      setSelectedDayOnCalendar(day);
    }
  };

  const selectedDayScheduleItems = useMemo(() => {
    if (!selectedDayOnCalendar) return [];
    return scheduleItems.filter(item => new Date(item.dateKey).getDate() === selectedDayOnCalendar);
  }, [scheduleItems, selectedDayOnCalendar]);

  const changeMonth = (offset: number) => {
    let newMonth = month + offset;
    if (newMonth < 1) newMonth = 12;
    if (newMonth > 12) newMonth = 1;
    setSelectedDayOnCalendar(null); // Reset selected day when month changes
    onMonthChange(newMonth);
  };
  
  const today = new Date();
  const isCurrentActualMonthAndYear = year === today.getFullYear() && month === today.getMonth() + 1;


  return (
    <div className="bg-white rounded-lg p-3 md:p-4 w-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <button 
          onClick={() => changeMonth(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="前の月へ"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-700">
          {year}年 {month}月
        </h3>
        <button 
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="次の月へ"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {weekdays.map(day => (
          <div key={day} className="py-1.5">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarGrid.map((day, index) => {
          const isPracticeDay = day && practiceDays.has(day);
          const isSelected = day && day === selectedDayOnCalendar;
          const isToday = day && isCurrentActualMonthAndYear && day === today.getDate();

          let dayClasses = `h-10 md:h-12 flex items-center justify-center text-sm rounded transition-all duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400`;
          if (!day) {
            dayClasses += ' bg-transparent';
          } else {
            if (isSelected) {
              dayClasses += ' bg-blue-500 text-white font-bold ring-2 ring-blue-600';
            } else if (isPracticeDay) {
              dayClasses += ' bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium';
            } else {
              dayClasses += ' bg-gray-50 text-gray-700 hover:bg-gray-200';
            }
            if (isToday && !isSelected) {
               dayClasses += ' ring-2 ring-red-500 text-red-600 font-bold'; // Today's highlight
            } else if (isToday && isSelected) {
               dayClasses += ' ring-2 ring-red-500'; // Keep blue background if selected, but red ring
            }
             dayClasses += ' border border-gray-200';
          }
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={dayClasses}
              disabled={!day}
              aria-pressed={isSelected}
              aria-label={day ? `${month}月${day}日` : undefined}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 min-h-[10rem]"> {/* Added min-h-[10rem] here */}
        {isLoading && (
           <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
           </div>
        )}

        {!isLoading && selectedDayOnCalendar && selectedDayScheduleItems.length > 0 && (
          <>
            <h4 className="text-md font-semibold text-gray-700 mb-3">
              {month}月{selectedDayOnCalendar}日の練習予定
            </h4>
            {selectedDayScheduleItems.map(item => (
              <ScheduleCard key={item.id} item={item} type="future" defaultExpanded={true} />
            ))}
          </>
        )}
         {!isLoading && selectedDayOnCalendar && selectedDayScheduleItems.length === 0 && practiceDays.has(selectedDayOnCalendar) && (
           <div className="flex justify-center items-center h-full">
              <MessageDisplay type="info" message={`${month}月${selectedDayOnCalendar}日の詳細な練習情報はありません。`} />
           </div>
         )}
         {!isLoading && selectedDayOnCalendar && !practiceDays.has(selectedDayOnCalendar) && (
           <div className="flex justify-center items-center h-full">
              <MessageDisplay type="info" message={`${month}月${selectedDayOnCalendar}日に予定されている練習はありません。`} />
           </div>
         )}
         {!isLoading && !selectedDayOnCalendar && (
            <div className="flex justify-center items-center h-full pt-4">
              <p className="text-gray-500">カレンダーの日付を選択すると、その日の練習予定が表示されます。</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default PracticeCalendar;