import { useReducer } from 'react';

interface CalendarState {
  isCalendarVisible: boolean;
  calendarFocusedMonth: number;
}

type CalendarAction =
  | { type: 'OPEN_CALENDAR'; month: number }
  | { type: 'CLOSE_CALENDAR' }
  | { type: 'CHANGE_MONTH'; month: number };

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'OPEN_CALENDAR':
      return {
        isCalendarVisible: true,
        calendarFocusedMonth: action.month,
      };
    case 'CLOSE_CALENDAR':
      return {
        ...state,
        isCalendarVisible: false,
      };
    case 'CHANGE_MONTH':
      return {
        ...state,
        calendarFocusedMonth: action.month,
      };
    default:
      return state;
  }
};

interface UseCalendarStateReturn {
  calendarState: CalendarState;
  openCalendar: (month: number) => void;
  closeCalendar: () => void;
  changeCalendarMonth: (month: number) => void;
}

export const useCalendarState = (initialMonth: number): UseCalendarStateReturn => {
  const [calendarState, dispatch] = useReducer(calendarReducer, {
    isCalendarVisible: false,
    calendarFocusedMonth: initialMonth,
  });

  const openCalendar = (month: number) => {
    dispatch({ type: 'OPEN_CALENDAR', month });
  };

  const closeCalendar = () => {
    dispatch({ type: 'CLOSE_CALENDAR' });
  };

  const changeCalendarMonth = (month: number) => {
    dispatch({ type: 'CHANGE_MONTH', month });
  };

  return {
    calendarState,
    openCalendar,
    closeCalendar,
    changeCalendarMonth,
  };
};