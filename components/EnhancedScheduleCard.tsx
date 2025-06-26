import React, { useState } from 'react';
import { ScheduleItem, ScheduleViewType } from '../types';
import { getLocationStyle } from '../utils/locationUtils';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface EnhancedScheduleCardProps {
  item: ScheduleItem;
  type: ScheduleViewType;
  defaultExpanded?: boolean;
  index?: number;
}

const LocationIndicator: React.FC<{ location: string }> = ({ location }) => {
  const locationStyle = getLocationStyle(location);
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm" aria-hidden="true">{locationStyle.icon}</span>
      <span className={`w-3.5 h-3.5 rounded-full ${locationStyle.circle} border-2 border-white shadow-lg ring-1 ring-gray-200`}></span>
      <span className="sr-only">場所: </span>
      <span className={`text-sm font-semibold ${locationStyle.text}`}>{location}</span>
    </div>
  );
};

const EnhancedScheduleCard: React.FC<EnhancedScheduleCardProps> = React.memo(({ 
  item, 
  type, 
  defaultExpanded = false,
  index = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(type === 'today' || defaultExpanded);

  const cardBaseClasses = `
    bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden
    shadow-md hover:shadow-xl transition-all duration-300 ease-in-out
    hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
    transform
  `;

  const getTypeSpecificClasses = () => {
    switch (type) {
      case 'today':
        return 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white';
      case 'future':
        return 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white';
      case 'past':
        return 'border-l-4 border-gray-400 opacity-90 hover:opacity-100';
      default:
        return '';
    }
  };

  const getDateBadgeClasses = () => {
    switch (type) {
      case 'today':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'future':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'past':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const animationDelay = `delay-${Math.min(index * 100, 500)}`;

  return (
    <div 
      className={`${cardBaseClasses} ${getTypeSpecificClasses()} ${animationDelay}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'both',
        animationName: 'fadeInUp'
      }}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Enhanced Header */}
      <div
        className="p-4 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls={`content-${item.id}`}
        aria-label={`${item.dateStr}の練習詳細を${isExpanded ? '折りたたむ' : '展開する'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Date and Time Row */}
            <div className="flex items-center space-x-3 flex-wrap">
              <span className={`
                inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full
                transition-all duration-200 group-hover:scale-105
                ${getDateBadgeClasses()}
              `}>
                <span className="mr-1">📅</span>
                {item.dateStr} ({item.dayOfWeek})
              </span>
              <span className="inline-flex items-center px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg">
                <span className="mr-1">🕐</span>
                {item.time}
              </span>
            </div>
            
            {/* Location Row */}
            <LocationIndicator location={item.location} />
          </div>
          
          {/* Expand/Collapse Icon */}
          <div className="ml-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-700" />
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Content */}
      <div
        id={`content-${item.id}`}
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
          <div className="p-4 space-y-4">
            {/* Practice Menu */}
            <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center">
                <span className="mr-1">💪</span>
                練習メニュー
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {item.menu}
              </p>
            </div>
            
            {/* Additional Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.pace && item.pace.toLowerCase() !== '情報なし' && (
                <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center">
                    <span className="mr-1">⚡</span>
                    ペース
                  </h4>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {item.pace}
                  </p>
                </div>
              )}
              
              {item.strengthening && item.strengthening.toLowerCase() !== '情報なし' && (
                <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center">
                    <span className="mr-1">🔧</span>
                    補強
                  </h4>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {item.strengthening}
                  </p>
                </div>
              )}
            </div>
            
            {/* Notes */}
            {item.notes && item.notes.toLowerCase() !== '情報なし' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide flex items-center">
                  <span className="mr-1">📝</span>
                  補足・注意事項
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {item.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

EnhancedScheduleCard.displayName = 'EnhancedScheduleCard';

export default EnhancedScheduleCard;