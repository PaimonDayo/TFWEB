import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onOpenCalendar: () => void;
  onToggleHelp?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onPreviousMonth,
  onNextMonth,
  onOpenCalendar,
  onToggleHelp,
  enabled = true
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      // Previous month: Cmd/Ctrl + Left Arrow
      if (modifierKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        onPreviousMonth();
        return;
      }

      // Next month: Cmd/Ctrl + Right Arrow
      if (modifierKey && event.key === 'ArrowRight') {
        event.preventDefault();
        onNextMonth();
        return;
      }

      // Open calendar: Cmd/Ctrl + K or Cmd/Ctrl + C
      if (modifierKey && (event.key === 'k' || event.key === 'c')) {
        event.preventDefault();
        onOpenCalendar();
        return;
      }

      // Toggle help: ? or Cmd/Ctrl + /
      if (event.key === '?' || (modifierKey && event.key === '/')) {
        event.preventDefault();
        onToggleHelp?.();
        return;
      }

      // Quick month navigation: 1-9 keys
      if (event.key >= '1' && event.key <= '9' && !modifierKey) {
        const month = parseInt(event.key, 10);
        if (month >= 1 && month <= 9) {
          event.preventDefault();
          // This would need to be passed as a prop if we want to support it
          // onSelectMonth(month);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPreviousMonth, onNextMonth, onOpenCalendar, onToggleHelp, enabled]);

  // Return available shortcuts for documentation
  const shortcuts = {
    'Cmd/Ctrl + ←': '前の月',
    'Cmd/Ctrl + →': '次の月', 
    'Cmd/Ctrl + K': 'カレンダーを開く',
    'Cmd/Ctrl + C': 'カレンダーを開く',
    '?': 'ヘルプを表示',
    '1-9': '月を直接選択'
  };

  return { shortcuts };
};