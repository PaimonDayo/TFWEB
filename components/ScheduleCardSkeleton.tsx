
import React from 'react';

const ScheduleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg mb-3 overflow-hidden animate-pulse">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-5 w-12 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      {/* Optionally, you can add a skeleton for the collapsed content area if you want to show more structure
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      */}
    </div>
  );
};

export default ScheduleCardSkeleton;
