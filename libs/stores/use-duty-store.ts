import { ScreenMode } from '@/libs/enums/screen-mode';
import { createSelectors } from '@/libs/helpers/create-selectors';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import {
  NewAssistantSectionConfigList,
  NewDuty,
  NewDutyAssistant,
  NewDutySection
} from '@/libs/helpers/model-generator';
import { DefaultMonthConfig } from '@/libs/mock/duty.data';
import {
  IDefaultAssistant,
  IDefaultSection,
  IDuty,
  IDutyAssistant,
  IDutySection
} from '@/libs/models/duty-model';
import dayjs from 'dayjs';
import { create } from 'zustand';

type DutyFields = {
  [K in keyof IDuty]: IDuty[K];
};

interface DutyState extends DutyFields {
  screenMode: ScreenMode;
}

interface DutyActions {
  setRestDays: (restDays: IDuty['numberOfRestDays']) => void;
  setDate: (date: Date) => void;
  setScreenMode: (mode: ScreenMode) => void;
  setDuty: (duty: IDuty) => void;
  initDuty: (defaultAssistants: IDefaultAssistant[], defaultSections: IDefaultSection[]) => void;
  addAssistant: () => void;
  removeAssistant: (assistant: IDutyAssistant) => void;
  updateAssistant: (assistantId: IDutyAssistant['id'], props: Partial<IDutyAssistant>) => void;
  toggleUnwantedDay: (assistant: IDutyAssistant, dayIndex: number) => void;
  addSection: () => void;
  removeSection: (sectionId: IDutySection['id']) => void;
  updateSection: (sectionId: IDutySection['id'], props: Partial<IDutySection>) => void;
  clearAssistantSelections: () => void;
  setAssistantSectionLimit: (assistantId: string, sectionId: string, limit: number) => void;
}

const defaultState: DutyState = {
  id: undefined,
  userId: undefined,
  assistantList: [],
  assistantSectionConfig: [],
  sectionList: [],
  daySectionState: {},
  monthConfig: DefaultMonthConfig,
  numberOfRestDays: 2,
  screenMode: ScreenMode.MonthPicker
};

const useDutyStoreBase = create<DutyState & DutyActions>(set => ({
  ...defaultState,
  setRestDays: restDays => set({ numberOfRestDays: restDays }),
  setDate: date =>
    set(state => {
      const oldDate = dayjs(state.monthConfig.selectedDate);
      const newDate = dayjs(date);
      if (newDate.isSame(oldDate, 'month')) return state;

      return {
        ...state,
        monthConfig: {
          ...state.monthConfig,
          selectedDate: date,
          datesInMonth: newDate.daysInMonth(),
          weekendIndexes: getWeekendDayIndexes(date)
        }
      };
    }),
  initDuty: (defaultAssistants, defaultSections) =>
    set({ ...NewDuty(defaultAssistants, defaultSections) }),
  setDuty: duty => set({ ...duty }),
  setScreenMode: mode => set({ screenMode: mode }),
  /** assistant actions **/
  addAssistant: () =>
    set(state => {
      const newAssistant = NewDutyAssistant();
      return {
        assistantList: [...state.assistantList, newAssistant],
        assistantSectionConfig: [
          ...state.assistantSectionConfig,
          ...NewAssistantSectionConfigList(newAssistant.id, state.sectionList)
        ]
      };
    }),
  removeAssistant: assistant =>
    set(state => ({
      assistantList: state.assistantList.filter(a => a.id !== assistant.id),
      assistantSectionConfig: state.assistantSectionConfig.filter(
        c => c.assistantId !== assistant.id
      ),
      daySectionState: Object.values(state.daySectionState).reduce(
        (acc, val, index) => {
          acc[Number(index)] = acc[Number(index)].filter(s => s.assistant.id !== assistant.id);
          return acc;
        },
        {} as DutyState['daySectionState']
      )
    })),
  updateAssistant: (assistantId, props) =>
    set(state => ({
      assistantList: state.assistantList.map(a => (a.id === assistantId ? { ...a, ...props } : a))
    })),
  toggleUnwantedDay: (assistant, dayIndex) =>
    set(state => {
      const unwantedDays = assistant.unwantedDays.includes(dayIndex)
        ? assistant.unwantedDays.filter(d => d !== dayIndex)
        : [...assistant.unwantedDays, dayIndex];
      return {
        assistantList: state.assistantList.map(a =>
          a.id === assistant.id ? { ...a, unwantedDays } : a
        )
      };
    }),
  setAssistantSectionLimit: (assistantId, sectionId, limit) =>
    set(state => ({
      assistantSectionConfig: state.assistantSectionConfig.map(c =>
        c.assistantId === assistantId && c.sectionId === sectionId ? { ...c, totalLimit: limit } : c
      )
    })),
  clearAssistantSelections: () => set({ assistantSectionConfig: [] }),
  /** section actions **/
  addSection: () =>
    set(state => ({
      sectionList: [...state.sectionList, NewDutySection()]
    })),
  removeSection: sectionId =>
    set(state => ({
      sectionList: state.sectionList.filter(s => s.id !== sectionId)
    })),
  updateSection: (sectionId, props) =>
    set(state => ({
      sectionList: state.sectionList.map(s => (s.id === sectionId ? { ...s, ...props } : s))
    }))
}));

/** Custom Selectors **/
const assistantSectionLimitSelector = (assistantId: string, sectionId: string) => {
  return (state: DutyState) =>
    state.assistantSectionConfig.find(
      config => config.assistantId === assistantId && config.sectionId === sectionId
    )?.totalLimit ?? 0;
};
/** Custom Selectors **/

const useDutyStore = createSelectors(useDutyStoreBase);

export { assistantSectionLimitSelector, useDutyStore };
