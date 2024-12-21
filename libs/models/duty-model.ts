export interface IDutyMonthConfig {
  selectedDate: Date;
  datesInMonth: number;
  weekendIndexes: number[];
}

export interface IDuty {
  id?: string;
  userId?: string;
  assistantList: IDutyAssistant[];
  assistantSectionConfig: IAssistantSectionConfig[];
  sectionList: IDutySection[];
  daySectionState: IDaySectionState;
  monthConfig: IDutyMonthConfig;
  numberOfRestDays: number;
}

export type IDaySectionState = Record<number, IDaySectionStateConfig[]>;
type IDaySectionStateConfig = {
  assistant: IDutyAssistant;
  section: IDutySection;
};

export interface IDefaultAssistant {
  id: string;
  name: string;
}

export interface IDefaultSection {
  id: string;
  name: string;
  color: string | null;
  defaultValue?: number;
}

export interface IDutyAssistant {
  id: string;
  name: string;
  disabledDays: number[];
  unwantedDays: number[];
}

export interface IAssistantSelectedDays {
  dayIndex: number;
  assistantId: string;
  sectionId: string;
}

export interface IAssistantSectionConfig {
  assistantId: string;
  sectionId: string;
  totalLimit: number;
}

export interface IDutySection {
  id: string;
  name: string;
  defaultValue: number;
  color: string | null;
}
