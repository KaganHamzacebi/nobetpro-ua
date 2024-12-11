import { getRandomColor } from '@/libs/helpers/color-generator';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { IDutyAssistant, ISectionConfig, SelectedDayConfig } from '@/libs/models/IAssistant';
import { DefaultAssistant, DefaultSection, DutySection } from '@prisma/client';

const newAssistant = (defaults: Partial<DefaultAssistant>): IDutyAssistant => {
  return {
    id: GenerateUUID(),
    name: defaults.name ?? 'New Assistant',
    selectedDays: {
      days: []
    },
    disabledDays: {
      days: []
    }
  };
};

const newSection = (defaults: Partial<DefaultSection>): DutySection => {
  return {
    id: GenerateUUID(),
    name: defaults.name ?? 'New Section',
    color: defaults.color ?? getRandomColor(),
    createdAt: defaults.createdAt ?? new Date(),
    dutyId: 'unknown'
  };
};

const newDefaultSection = (defaults: Partial<DefaultSection>): DefaultSection => {
  return {
    id: GenerateUUID(),
    name: defaults.name ?? 'New Default Section',
    createdAt: defaults.createdAt ?? new Date(),
    defaultValue: defaults.defaultValue ?? 0,
    color: defaults.color ?? null,
    userId: 'unknown'
  };
};

const newSelectedDayConfig = (sectionId: string): SelectedDayConfig[number] => {
  return {
    sectionIds: new Set<string>([sectionId]),
    version: GenerateUUID()
  };
};

const newSectionConfiguration = (
  assistantId: string,
  counts?: Record<string, number>
): ISectionConfig => {
  return {
    assistantId: assistantId,
    counts: counts ?? {}
  };
};

export {
  newAssistant,
  newDefaultSection,
  newSection,
  newSectionConfiguration,
  newSelectedDayConfig
};
