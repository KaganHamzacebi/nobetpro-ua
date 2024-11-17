import { ISection } from '@/libs/models/ISection';
import { type Prisma } from '@prisma/client';

export interface IAssistant {
  id: string;
  name: string;
  selectedDays: {
    // dayIndex - section
    days: Record<number, ISection>;
    version?: string;
  };
  disabledDays: {
    days: number[];
    version?: string;
  };
  sectionConfig: {
    // sectionId - count
    counts: Record<string, number>;
    version?: string;
  };
}

export type IDefaultAssistant = Prisma.DefaultAssistantGetPayload<any>;
