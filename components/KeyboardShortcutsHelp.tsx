import React, { useState } from 'react';
import Modal from './Modal';

interface KeyboardShortcutsHelpProps {
  shortcuts: Record<string, string>;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ shortcuts }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierSymbol = isMac ? '⌘' : 'Ctrl';

  const formatShortcut = (shortcut: string) => {
    return shortcut.replace('Cmd/Ctrl', modifierSymbol);
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 hover:scale-110 z-50"
        aria-label="キーボードショートカットヘルプ"
        title="キーボードショートカット"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Help Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="キーボードショートカット"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            以下のキーボードショートカットを使用して、より効率的にアプリを操作できます。
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">利用可能なショートカット</h3>
            <dl className="space-y-2">
              {Object.entries(shortcuts).map(([key, description]) => (
                <div key={key} className="flex items-center justify-between">
                  <dt className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                      {formatShortcut(key)}
                    </kbd>
                  </dt>
                  <dd className="text-sm text-gray-600 ml-4">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-1">💡 ヒント</h4>
            <p className="text-sm text-blue-800">
              入力フィールドにフォーカスがある時は、ショートカットは無効になります。
            </p>
          </div>
          
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default KeyboardShortcutsHelp;