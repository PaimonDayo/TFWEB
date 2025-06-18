import React from 'react';

const ScheduleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm animate-pulse">
      {/* Header */}
      <div className="p-3 md:p-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
        <div className="flex-1 min-w-0 space-y-2.5"> {/* Increased space-y slightly */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="h-5 w-24 bg-gray-300 rounded-full"></div> {/* Date/DayOfWeek Badge */}
            <div className="h-4 w-16 bg-gray-300 rounded"></div>   {/* Time */}
          </div>
          <div className="flex items-center space-x-2 pl-1">
            <div className="w-3.5 h-3.5 bg-gray-300 rounded-full flex-shrink-0"></div> {/* Location icon */}
            <div className="h-4 w-32 bg-gray-300 rounded"></div> {/* Location text */}
          </div>
        </div>
        <div className="ml-2 md:ml-3 flex-shrink-0">
          <div className="w-5 h-5 bg-gray-300 rounded"></div> {/* Chevron icon placeholder */}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCardSkeleton;