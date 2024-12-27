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
  selectedDays: ISelectedDay[];
  disabledDays: IDisabledDays;
  unwantedDays: IUnwantedDay[];
  monthConfig: IDutyMonthConfig;
  numberOfRestDays: number;
}

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
}

export interface ISelectedDay {
  dayIndex: number;
  assistantId: string;
  section: IDutySection;
}

export interface IDisabledDays {
  [assistantId: string]: number[];
}

export interface IUnwantedDay {
  dayIndex: number;
  assistantId: string;
}

export interface IAssistantSectionConfig {
  assistantId: string;
  section: IDutySection;
  totalLimit: number;
}

export interface IDutySection {
  id: string;
  name: string;
  defaultValue: number;
  color: string | null;
}
