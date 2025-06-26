
import React, { useState } from 'react';
import { ScheduleItem, ScheduleViewType } from '../types';
import { getLocationCircleColor, getLocationIcon, getLocationTextColor } from '../utils/locationUtils';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface ScheduleCardProps {
  item: ScheduleItem;
  type: ScheduleViewType;
  defaultExpanded?: boolean;
}



const ScheduleCard: React.FC<ScheduleCardProps> = React.memo(({ item, type, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(type === 'today' || defaultExpanded);

  let cardClasses = "bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out";
  let headerBgClass = "bg-gray-50"; // Default header background

  if (type === 'today') {
    cardClasses += " border-l-4 border-blue-500";
    headerBgClass = "bg-blue-50";
  } else if (type === 'past') {
    cardClasses += " opacity-80 border-l-4 border-gray-400 hover:opacity-100";
    headerBgClass = "bg-gray-100";
  } else { // future
    cardClasses += " border-l-4 border-green-500";
    headerBgClass = "bg-green-50";
  }

  const DetailItemContent: React.FC<{ value: string }> = ({ value }) => (
     <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">{value}</p>
  );
  
  const DetailItemWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({label, children}) => (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-0.5 tracking-wide">{label}</p>
      {children}
    </div>
  );


  const hasPace = item.pace && item.pace.trim() !== '' && item.pace.toLowerCase() !== '情報なし';
  const hasStrengthening = item.strengthening && item.strengthening.trim() !== '' && item.strengthening.toLowerCase() !== '情報なし';
  const hasNotes = item.notes && item.notes.trim() !== '' && item.notes.toLowerCase() !== '情報なし';

  return (
    <div className={cardClasses}>
      <div
        className={`p-3 md:p-4 cursor-pointer flex justify-between items-center ${headerBgClass} border-b border-gray-200`}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`content-${item.id}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 md:space-x-3 mb-1.5">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm
              ${type === 'today' ? 'bg-blue-600 text-white' : 
                type === 'future' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}>
              {item.dateStr} ({item.dayOfWeek})
            </span>
            {/* Removed 'truncate' class from the time span below */}
            <span className="text-sm font-semibold text-gray-700" title={item.time}>{item.time}</span>
          </div>
          <div className="flex items-center text-xs pl-1">
            <span className="mr-1.5 text-sm" aria-hidden="true">{getLocationIcon(item.location)}</span>
            <span className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${getLocationCircleColor(item.location)} border border-white shadow-sm`}></span>
            <span className={`truncate font-medium ${getLocationTextColor(item.location)}`} title={item.location}>{item.location}</span>
          </div>
        </div>
        <div className="ml-2 md:ml-3 flex-shrink-0">
          {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-gray-700" /> : <ChevronDownIcon className="w-5 h-5 text-gray-700" />}
        </div>
      </div>
      <div
        id={`content-${item.id}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="bg-white p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4">
          <DetailItemWrapper label="練習メニュー">
            <DetailItemContent value={item.menu} /> {/* item.menu is guaranteed by service to be content or "情報なし" */}
          </DetailItemWrapper>
          
          {hasPace && (
            <DetailItemWrapper label="ペース">
              <DetailItemContent value={item.pace} />
            </DetailItemWrapper>
          )}
          {hasStrengthening && (
            <DetailItemWrapper label="補強">
              <DetailItemContent value={item.strengthening} />
            </DetailItemWrapper>
          )}
          {hasNotes && (
             <DetailItemWrapper label="補足">
               <DetailItemContent value={item.notes} />
            </DetailItemWrapper>
          )}
        </div>
      </div>
    </div>
  );
});

ScheduleCard.displayName = 'ScheduleCard';

export default ScheduleCard;
