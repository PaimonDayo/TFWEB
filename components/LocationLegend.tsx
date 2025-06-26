import React, { useState } from 'react';
import { LOCATION_COLORS } from '../constants';
import Modal from './Modal';

interface LocationLegendProps {
  className?: string;
}

const LocationLegend: React.FC<LocationLegendProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // グループ化された場所カテゴリ
  const locationGroups = [
    {
      title: '🏫 大学キャンパス',
      locations: ['東大', '駒場', '本郷', '農学部']
    },
    {
      title: '🏃 専用競技場・フィールド',
      locations: ['織田フィールド', '織田', '補助競技場', '補助']
    },
    {
      title: '🌍 外部施設・他大学',
      locations: ['府中', '武蔵野', '済美山', 'AGF']
    },
    {
      title: '🏁 練習タイプ別',
      locations: ['トラック', 'ロード', '競歩']
    },
    {
      title: '🏆 試合・イベント',
      locations: ['東工戦', '外大', '試合', '大会']
    },
    {
      title: '⚖️ その他・調整',
      locations: ['調整', '休み', 'オフ']
    }
  ];

  return (
    <>
      {/* Legend Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          inline-flex items-center px-3 py-2 text-xs font-medium
          bg-white border border-gray-300 rounded-lg shadow-sm
          hover:bg-gray-50 hover:border-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200
          ${className}
        `}
        aria-label="練習場所の色分け凡例を表示"
      >
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5zM21 15a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2z" />
        </svg>
        場所の色分け
      </button>

      {/* Legend Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="練習場所の色分け凡例"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            各練習場所は以下の色で区別されています。○の色とアイコンで一目で場所を識別できます。
          </p>

          <div className="space-y-5">
            {locationGroups.map((group) => (
              <div key={group.title} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{group.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.locations.map((location) => {
                    const style = LOCATION_COLORS[location as keyof typeof LOCATION_COLORS];
                    if (!style) return null;
                    
                    return (
                      <div key={location} className="flex items-center space-x-3 p-2 bg-white rounded border">
                        <span className="text-sm" aria-hidden="true">{style.icon}</span>
                        <span className={`w-3 h-3 rounded-full ${style.circle} border border-white shadow-sm flex-shrink-0`}></span>
                        <span className={`text-sm font-medium ${style.text} truncate`}>{location}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              使い方のコツ
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ○の色で練習場所を素早く識別できます</li>
              <li>• アイコンも併用することで、より分かりやすくなります</li>
              <li>• 似た場所は似た色で統一されています</li>
              <li>• 試合や大会は赤系の色で強調されています</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              閉じる
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LocationLegend;