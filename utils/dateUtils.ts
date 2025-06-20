export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export const formatDateWithoutYear = (date: Date): string => {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

export const formatDateKey = (year: number, month: number, day: number): string => {
  return `${month}/${day}`;
};

export const getCurrentDateKey = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
};

export const createDateKey = (year: number, month: number, day: number): number => {
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
};