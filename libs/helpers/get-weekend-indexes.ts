import dayjs from 'dayjs';

export const getWeekendDayIndexes = (date: Date): number[] => {
  const weekends: number[] = [];
  const startOfMonth = dayjs(date).startOf('month');
  const daysInMonth = startOfMonth.daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = startOfMonth.date(day);
    if (currentDay.day() === 6 || currentDay.day() === 0) {
      // 6 is Saturday, 0 is Sunday
      weekends.push(day - 1);
    }
  }

  return weekends;
};
