import { getRandomColor } from '@/libs/helpers/color-generator';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import {
  IAssistantSectionConfig,
  IDefaultAssistant,
  IDefaultSection,
  IDutyAssistant,
  IDutySection
} from '@/libs/models/duty-model';
import dayjs from 'dayjs';

const NewDuty = (defaultAssistants: IDefaultAssistant[], defaultSections: IDefaultSection[]) => {
  const dutySections: IDutySection[] = defaultSections.map(section =>
    NewDutySection({
      ...section,
      id: GenerateUUID()
    })
  );

  const dutyAssistants: IDutyAssistant[] = defaultAssistants.map(assistant =>
    NewDutyAssistant({
      ...assistant,
      id: GenerateUUID()
    })
  );

  const assistantSectionConfig = dutyAssistants.flatMap(assistant => {
    return dutySections.map(section =>
      NewAssistantSectionConfig(assistant.id, section, section.defaultValue)
    );
  });

  const now = dayjs();

  return {
    id: GenerateUUID(),
    pinned: false,
    dutyMonth: now.startOf('month').toDate(),
    monthConfig: {
      datesInMonth: now.daysInMonth(),
      weekendIndexes: getWeekendDayIndexes(now.toDate())
    },
    assistantList: dutyAssistants,
    sectionList: dutySections,
    selectedDays: [],
    unwantedDays: [],
    disabledDays: {},
    assistantSectionConfig: assistantSectionConfig,
    restDayCount: 2
  };
};

const NewDutyAssistant = (defaults?: Partial<IDutyAssistant>): IDutyAssistant => {
  return {
    id: defaults?.id ?? GenerateUUID(),
    name: defaults?.name ?? 'New Assistant'
  };
};

const NewDutySection = (defaults?: Partial<IDutySection>): IDutySection => {
  return {
    id: GenerateUUID(),
    name: defaults?.name ?? 'New Section',
    color: defaults?.color ?? getRandomColor(),
    defaultValue: defaults?.defaultValue ?? 0
  };
};

const NewAssistantSectionConfig = (
  assistantId: string,
  section: IDutySection,
  totalLimit = 0
): IAssistantSectionConfig => {
  return {
    assistantId: assistantId,
    sectionId: section.id,
    totalLimit: totalLimit,
    section: section
  };
};

const NewAssistantSectionConfigListBySection = (
  assistantId: IDutyAssistant['id'],
  sectionList: IDutySection[]
) => {
  return sectionList.map(section =>
    NewAssistantSectionConfig(assistantId, section, section.defaultValue)
  );
};

// prefer me name
const NewAssistantSectionConfigListByAssistant = (
  assistantIdList: IDutyAssistant['id'][],
  section: IDutySection
) => {
  return assistantIdList.map(assistantId =>
    NewAssistantSectionConfig(assistantId, section, section.defaultValue)
  );
};

export {
  NewAssistantSectionConfig,
  NewAssistantSectionConfigListByAssistant,
  NewAssistantSectionConfigListBySection,
  NewDuty,
  NewDutyAssistant,
  NewDutySection
};
