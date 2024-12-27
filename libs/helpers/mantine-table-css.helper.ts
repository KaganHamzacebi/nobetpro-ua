import { IDuty, IDutyAssistant } from '@/libs/models/duty-model';
import { ScreenMode } from '../enums/screen-mode';

const monthCellCssClasses = (
  dayIndex: number,
  assistantId: IDutyAssistant['id'],
  monthConfig: IDuty['monthConfig'],
  unwantedDays: IDuty['unwantedDays'],
  screenMode: ScreenMode
) => {
  const classes: string[] = [];

  const isWeekend = monthConfig.weekendIndexes.includes(dayIndex);
  const isUnwanted = !!unwantedDays.find(
    u => u.assistantId === assistantId && u.dayIndex === dayIndex
  );
  const isUnwantedMode = screenMode === ScreenMode.UnwantedDayPicker;

  if (isWeekend && isUnwanted) classes.push('bg-attention-700');
  else if (isWeekend) classes.push('bg-onyx');
  else if (isUnwanted) classes.push('bg-attention');
  if (isUnwantedMode) classes.push('cursor-pointer');

  return classes.join(' ');
};

const sectionHeaderDateCountColor = (totalDayCount: number, datesInMonth: number) => {
  if (totalDayCount < datesInMonth) return 'bg-onyx';
  if (totalDayCount === datesInMonth) return 'bg-success';
  return 'bg-attention-700';
};

export { monthCellCssClasses, sectionHeaderDateCountColor };
