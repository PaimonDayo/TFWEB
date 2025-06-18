
import React, { useState } from 'react';
import { ScheduleItem, ScheduleViewType } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface ScheduleCardProps {
  item: ScheduleItem;
  type: ScheduleViewType;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  let cardClasses = "bg-white border border-gray-300 rounded-lg mb-3 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg";
  if (type === 'today') {
    cardClasses += " border-l-4 border-blue-500 bg-blue-50";
  } else if (type === 'past') {
    cardClasses += " opacity-70 border-l-4 border-gray-400 bg-gray-100"; // Slightly adjusted past background
  }

  const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">{value || '情報なし'}</p>
    </div>
  );

  return (
    <div className={cardClasses}>
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`content-${item.id}`}
      >
        <div className="flex items-center space-x-3">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded
            ${type === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {item.dateStr} ({item.dayOfWeek})
          </span>
          <span className="text-sm text-gray-700">{item.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{item.location}</span>
          {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
        </div>
      </div>
      <div
        id={`content-${item.id}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-none' : 'max-h-0'}`}
      >
        <div className="bg-gray-100 border-t border-gray-200 p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <DetailItem label="練習メニュー" value={item.menu} />
          <DetailItem label="ペース" value={item.pace} />
          <DetailItem label="補強" value={item.strengthening} />
          <DetailItem label="補足" value={item.notes} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
