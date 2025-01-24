import {
  IAssistantSectionConfig,
  IDuty,
  IDutyAssistant,
  IDutySection
} from '@/libs/models/duty-model';

export const dutyProtectedFields: ReadonlyArray<keyof IDuty> = [
  'id',
  'userId',
  'monthConfig',
  'sectionList',
  'assistantList',
  'assistantSectionConfig',
  'selectedDays',
  'unwantedDays',
  'disabledDays',
  'createdAt',
  'updatedAt'
];

export const dutyAssistantProtectedFields: ReadonlyArray<keyof IDutyAssistant> = [
  'id',
  'dutyId',
  'createdAt',
  'updatedAt'
];

export const dutySectionProtectedFields: ReadonlyArray<keyof IDutySection> = [
  'id',
  'dutyId',
  'createdAt',
  'updatedAt'
];

export const assistantSectionConfigProtectedFields: ReadonlyArray<keyof IAssistantSectionConfig> = [
  'dutyId',
  'assistantId',
  'sectionId',
  'assistant',
  'section'
];
