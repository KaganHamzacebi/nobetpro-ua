import {
  DefaultAssistantList,
  DefaultMonthConfig,
  DefaultSectionList
} from '@/libs/mock/duty.data';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import { MonthConfig } from '@/libs/models/MonthConfig';
import { Dispatch, SetStateAction } from 'react';
import { ScreenMode } from '../enums/screen-mode';

// Stores data by DayIndex
export type SelectedDayConfig = Record<
  number,
  {
    sectionIds: Set<string>;
    version: string;
  }
>;

export interface ISchedulerContext {
  screenMode: ScreenMode;
  monthConfig: MonthConfig;
  sectionList: ISection[];
  setSectionList: (sectionList: ISection[]) => void;
  assistantList: IAssistant[];
  setAssistantList: Dispatch<SetStateAction<IAssistant[]>>;
  selectedDayConfig: SelectedDayConfig;
  setSelectedDayConfig: (selectedDayConfig: SelectedDayConfig) => void;
}

export const DefaultSchedulerContext: ISchedulerContext = {
  screenMode: ScreenMode.MonthPicker,
  monthConfig: DefaultMonthConfig,
  sectionList: DefaultSectionList,
  setSectionList: () => {},
  assistantList: DefaultAssistantList,
  setAssistantList: () => {},
  selectedDayConfig: {},
  setSelectedDayConfig: () => {}
};
