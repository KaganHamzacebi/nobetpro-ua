import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { MonthConfig } from '@/libs/models/MonthConfig';
import dayjs from 'dayjs';

const now = dayjs();

const DefaultMonthConfig: MonthConfig = {
  selectedDate: now.startOf('month').toDate(),
  datesInMonth: now.daysInMonth(),
  weekendIndexes: getWeekendDayIndexes(new Date()),
  numberOfRestDays: 2
};

export { DefaultMonthConfig };
