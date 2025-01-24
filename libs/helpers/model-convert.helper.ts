import { IDuty } from '@/libs/models/duty-model';

const dutyToCreateInput = (duty: IDuty) => {
  return {
    ...duty,
    assistantSectionConfig: duty.assistantSectionConfig.map(config => ({
      ...config,
      section: undefined,
      assistant: undefined
    })),
    sectionList: duty.sectionList.map(section => ({
      ...section,
      defaultValue: undefined
    })),
    disabledDays: Object.entries(duty.disabledDays).flatMap(([assistantId, dayIndex]) => {
      return dayIndex.map(day => ({ assistantId, dayIndex: day }));
    }),
    selectedDays: duty.selectedDays.map(day => ({
      ...day,
      section: undefined
    }))
  };
};

export { dutyToCreateInput };
