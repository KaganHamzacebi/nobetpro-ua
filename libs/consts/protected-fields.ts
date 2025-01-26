import {
  IAssistantSectionConfig,
  IDuty,
  IDutyAssistant,
  IDutySection
} from '@/libs/models/duty-model';

export const dutyProtectedFields: Array<keyof IDuty> = [
  'id',
  'userId',
  'monthConfig',
  'sectionList',
  'assistantList',
  'assistantSectionConfig',
  'selectedDays',
  'disabledDays',
  'unwantedDays',
  'createdAt',
  'updatedAt'
];

export const dutyAssistantProtectedFields: Array<keyof IDutyAssistant> = [
  'id',
  'dutyId',
  'createdAt',
  'updatedAt'
];

export const dutySectionProtectedFields: Array<keyof IDutySection> = [
  'id',
  'dutyId',
  'createdAt',
  'updatedAt'
];

export const assistantSectionConfigProtectedFields: Array<keyof IAssistantSectionConfig> = [
  'dutyId',
  'assistantId',
  'sectionId',
  'assistant',
  'section'
];
