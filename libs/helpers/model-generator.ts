import { getRandomColor } from '@/libs/helpers/color-generator';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import { DefaultMonthConfig } from '@/libs/mock/duty.data';
import {
  IAssistantSectionConfig,
  IDefaultAssistant,
  IDefaultSection,
  IDuty,
  IDutyAssistant,
  IDutySection
} from '@/libs/models/duty-model';

const NewDuty = (
  defaultAssistants: IDefaultAssistant[],
  defaultSections: IDefaultSection[]
): IDuty => {
  const dutySections: IDutySection[] = defaultSections.map(section =>
    NewDutySection({
      ...(section as IDutySection),
      id: GenerateUUID()
    })
  );

  const dutyAssistants: IDutyAssistant[] = defaultAssistants.map(assistant =>
    NewDutyAssistant(assistant)
  );

  const assistantSectionConfig = dutyAssistants.flatMap(assistant => {
    return dutySections.map(section =>
      NewAssistantSectionConfig(assistant.id, section.id, section.defaultValue)
    );
  });

  return {
    assistantList: dutyAssistants,
    sectionList: dutySections,
    assistantSectionConfig: assistantSectionConfig,
    daySectionState: {},
    monthConfig: DefaultMonthConfig,
    numberOfRestDays: 2
  };
};

const NewDutyAssistant = (defaults?: Partial<IDutyAssistant>): IDutyAssistant => {
  return {
    id: GenerateUUID(),
    name: defaults?.name ?? 'New Assistant',
    disabledDays: defaults?.disabledDays ?? [],
    unwantedDays: defaults?.unwantedDays ?? []
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
  sectionId: string,
  totalLimit = 0
): IAssistantSectionConfig => {
  return {
    assistantId: assistantId,
    sectionId: sectionId,
    totalLimit: totalLimit
  };
};

const NewAssistantSectionConfigList = (assistantId: string, sectionList: IDutySection[]) => {
  return sectionList.map(section =>
    NewAssistantSectionConfig(assistantId, section.id, section.defaultValue)
  );
};

export {
  NewAssistantSectionConfig,
  NewAssistantSectionConfigList,
  NewDuty,
  NewDutyAssistant,
  NewDutySection
};
