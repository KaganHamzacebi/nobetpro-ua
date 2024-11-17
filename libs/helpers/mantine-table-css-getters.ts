import { ScreenMode } from '../enums/screen-mode';
import { MonthConfig } from '../models/MonthConfig';

export const monthCellCssClasses = (
  index: number,
  asssitantId: string,
  monthConfig: MonthConfig,
  unwantedDays: Record<string, boolean>,
  screenMode: ScreenMode
) => {
  const classes: string[] = [];

  const isWeekend = monthConfig.weekendIndexes.includes(index);
  const isUnwanted = unwantedDays[`${asssitantId}-${index}`];
  const isUnwantedMode = screenMode === ScreenMode.UnwantedDayPicker;

  if (isWeekend && isUnwanted) classes.push('bg-attention-700');
  else if (isWeekend) classes.push('bg-onyx');
  else if (isUnwanted) classes.push('bg-attention');
  if (isUnwantedMode) classes.push('cursor-pointer');

  return classes.join(' ');
};
