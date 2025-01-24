import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { IMonthConfig } from '@/libs/models/duty-model';
import dayjs from 'dayjs';

const now = dayjs();

const DefaultMonthConfig: IMonthConfig = {
  selectedDate: now.startOf('month').toDate(),
  datesInMonth: now.daysInMonth(),
  weekendIndexes: getWeekendDayIndexes(new Date())
};

export { DefaultMonthConfig };
