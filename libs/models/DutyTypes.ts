import { ScreenMode } from '@/libs/enums/screen-mode';
import { IDutyAssistant, ISectionConfig, SelectedDayConfig } from '@/libs/models/IAssistant';
import { MonthConfig } from '@/libs/models/MonthConfig';
import { DutySection } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';

export interface ISchedulerContext {
  screenMode: ScreenMode;
  monthConfig: MonthConfig;
  assistantList: IDutyAssistant[];
  setAssistantList: Dispatch<SetStateAction<IDutyAssistant[]>>;
  sectionList: DutySection[];
  setSectionList: Dispatch<SetStateAction<DutySection[]>>;
  sectionConfigList: ISectionConfig[];
  setSectionConfigList: Dispatch<SetStateAction<ISectionConfig[]>>;
  selectedDayConfig: SelectedDayConfig;
  setSelectedDayConfig: Dispatch<SetStateAction<SelectedDayConfig>>;
}
