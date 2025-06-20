import React from 'react';

const ScheduleCardSkeleton: React.FC = React.memo(() => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm animate-pulse">
      <div className="p-3 md:p-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="h-5 w-24 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center space-x-2 pl-1">
            <div className="w-3.5 h-3.5 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="ml-2 md:ml-3 flex-shrink-0">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
});

ScheduleCardSkeleton.displayName = 'ScheduleCardSkeleton';

export default ScheduleCardSkeleton;