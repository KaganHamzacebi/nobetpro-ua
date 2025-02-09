import { ScreenMode } from '../enums/screen-mode';

const getMonthCellStyles = (isWeekend: boolean, isUnwantedDay: boolean, screenMode: ScreenMode) => {
  const classes: string[] = [];
  const isUnwantedMode = screenMode === ScreenMode.UnwantedDayPicker;

  if (isWeekend && isUnwantedDay) classes.push('bg-attention-700');
  else if (isWeekend) classes.push('bg-onyx');
  else if (isUnwantedDay) classes.push('bg-attention');
  if (isUnwantedMode) classes.push('cursor-pointer');

  return classes.join(' ');
};

const sectionHeaderDateCountColor = (totalDayCount: number, datesInMonth: number) => {
  if (totalDayCount < datesInMonth) return 'bg-onyx';
  if (totalDayCount === datesInMonth) return 'bg-success';
  return 'bg-attention-700';
};

export { getMonthCellStyles, sectionHeaderDateCountColor };
