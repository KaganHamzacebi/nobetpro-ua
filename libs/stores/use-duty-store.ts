import { ScreenMode } from '@/libs/enums/screen-mode';
import { createSelectors } from '@/libs/helpers/create-selectors';
import { getDisabledDays } from '@/libs/helpers/disabled-day-calculator';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import {
  NewAssistantSectionConfigListByAssistant,
  NewAssistantSectionConfigListBySection,
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
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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
  resetDuty: () => void;
  /** assistant actions **/
  addAssistant: () => void;
  removeAssistant: (assistant: IDutyAssistant) => void;
  updateAssistant: (assistantId: IDutyAssistant['id'], props: Partial<IDutyAssistant>) => void;
  toggleUnwantedDay: (assistantId: string, dayIndex: number) => void;
  selectDay: (assistantId: string, section: IDutySection, dayIndex: number) => void;
  unselectDay: (assistantId: string, dayIndex: number) => void;
  updateDisabledDays: (assistantId: string) => void;
  /** section actions **/
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
  disabledDays: {},
  selectedDays: [],
  unwantedDays: [],
  monthConfig: DefaultMonthConfig,
  numberOfRestDays: 2,
  screenMode: ScreenMode.MonthPicker
};

const useDutyStoreBase = create<DutyState & DutyActions>()(
  devtools(
    immer((set, get) => ({
      ...defaultState,
      setRestDays: restDays =>
        set(state => {
          state.numberOfRestDays = restDays;
        }),
      setDate: date =>
        set(state => {
          const oldDate = dayjs(state.monthConfig.selectedDate);
          const newDate = dayjs(date);
          if (newDate.isSame(oldDate, 'month')) return state;

          state.monthConfig.selectedDate = date;
          state.monthConfig.datesInMonth = newDate.daysInMonth();
          state.monthConfig.weekendIndexes = getWeekendDayIndexes(date);
        }),
      initDuty: (defaultAssistants, defaultSections) =>
        set(() => {
          const newDuty = NewDuty(defaultAssistants, defaultSections);
          get().setDuty(newDuty);
        }),
      resetDuty: () => set(() => defaultState),
      setDuty: duty =>
        set(state => {
          state.id = duty.id;
          state.assistantList = duty.assistantList;
          state.assistantSectionConfig = duty.assistantSectionConfig;
          state.sectionList = duty.sectionList;
          state.selectedDays = duty.selectedDays;
          state.monthConfig = duty.monthConfig;
          state.numberOfRestDays = duty.numberOfRestDays;
        }),
      setScreenMode: mode =>
        set(state => {
          state.screenMode = mode;
        }),
      /** assistant actions **/
      addAssistant: () =>
        set(state => {
          const id = GenerateUUID();
          state.assistantList.push(NewDutyAssistant({ id }));
          state.assistantSectionConfig.push(
            ...NewAssistantSectionConfigListBySection(id, state.sectionList)
          );
        }),
      removeAssistant: assistant =>
        set(state => {
          state.assistantList = state.assistantList.filter(a => a.id !== assistant.id);
          state.assistantSectionConfig = state.assistantSectionConfig.filter(
            c => c.assistantId !== assistant.id
          );
          state.selectedDays = state.selectedDays.filter(day => day.assistantId !== assistant.id);
          state.unwantedDays = state.unwantedDays.filter(day => day.assistantId !== assistant.id);
        }),
      updateAssistant: (assistantId, props) =>
        set(state => {
          const assistant = state.assistantList.find(a => a.id === assistantId)!;
          Object.assign(assistant, props);
        }),
      toggleUnwantedDay: (assistantId, dayIndex) =>
        set(state => {
          const screenMode = get().screenMode;
          if (screenMode !== ScreenMode.UnwantedDayPicker) return;

          const index = state.unwantedDays.findIndex(
            u => u.assistantId === assistantId && u.dayIndex === dayIndex
          );

          if (index > 0) state.unwantedDays.splice(index, 1);
          else state.unwantedDays.push({ assistantId: assistantId, dayIndex });
        }),
      setAssistantSectionLimit: (assistantId, sectionId, limit) =>
        set(state => {
          const config = state.assistantSectionConfig.find(
            c => c.assistantId === assistantId && c.section.id === sectionId
          )!;
          config.totalLimit = limit;
        }),
      clearAssistantSelections: () =>
        set(state => {
          state.selectedDays = [];
          state.disabledDays = {};
          state.unwantedDays = [];
        }),
      selectDay: (assistantId, section, dayIndex) => {
        set(state => {
          state.selectedDays.push({ assistantId, section, dayIndex });
        });
        get().updateDisabledDays(assistantId);
      },
      unselectDay: (assistantId, dayIndex) => {
        set(state => {
          state.selectedDays = state.selectedDays.filter(
            d => d.assistantId !== assistantId || d.dayIndex !== dayIndex
          );
        });
        get().updateDisabledDays(assistantId);
      },
      updateDisabledDays: assistantId =>
        set(state => {
          const selectedDays = state.selectedDays
            .filter(d => d.assistantId === assistantId)
            .map(d => d.dayIndex);
          state.disabledDays[assistantId] = getDisabledDays(selectedDays, get().numberOfRestDays);
        }),
      /** section actions **/
      addSection: () =>
        set(state => {
          const newSection = NewDutySection();
          state.sectionList.push(newSection);
          state.assistantSectionConfig.push(
            ...NewAssistantSectionConfigListByAssistant(
              get().assistantList.map(a => a.id),
              newSection
            )
          );
        }),
      removeSection: sectionId =>
        set(state => {
          state.sectionList = state.sectionList.filter(s => s.id !== sectionId);
          state.assistantSectionConfig = state.assistantSectionConfig.filter(
            c => c.section.id !== sectionId
          );
        }),
      updateSection: (sectionId, props) =>
        set(state => {
          const section = state.sectionList.find(s => s.id === sectionId)!;
          Object.assign(section, props);
        })
    }))
  )
);

const useDutyStore = createSelectors(useDutyStoreBase);
export { useDutyStore };
