import { DutySection } from '@prisma/client';

export interface IDutyAssistant {
  id: string;
  name: string;
  selectedDays: {
    // dayIndex - section
    days: Record<number, DutySection>;
    version?: string;
  };
  disabledDays: {
    days: number[];
    version?: string;
  };
}

export interface ISectionConfig {
  assistantId: string;
  counts: Record<string, number>;
}

// Stores data by DayIndex
export type SelectedDayConfig = Record<
  number,
  {
    sectionIds: Set<string>;
    version: string;
  }
>;
