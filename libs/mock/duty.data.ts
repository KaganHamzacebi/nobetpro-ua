import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { newAssistant } from '@/libs/helpers/model-generator';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import { MonthConfig } from '@/libs/models/MonthConfig';
import dayjs from 'dayjs';

const DefaultSection: ISection = {
  id: GenerateUUID(),
  name: 'War Room',
  color: '#53a83e'
};

const DefaultAssistant: IAssistant = newAssistant('Kel Mahmut');

const DefaultSectionList: ISection[] = [DefaultSection];
const DefaultAssistantList: IAssistant[] = [DefaultAssistant];

const now = dayjs();

const DefaultMonthConfig: MonthConfig = {
  selectedDate: now.startOf('month').toDate(),
  datesInMonth: now.daysInMonth(),
  weekendIndexes: getWeekendDayIndexes(new Date()),
  numberOfRestDays: 2
};

export { DefaultAssistantList, DefaultMonthConfig, DefaultSectionList };
