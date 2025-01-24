import {
  addAssistant,
  addSection,
  clearSelections,
  createAssistantSectionConfigsForAssistant,
  createAssistantSectionConfigsForSection,
  deleteAssistant,
  deleteSection,
  selectDay,
  selectUnwantedDay,
  unselectDay,
  unselectUnwantedDay,
  updateAssistant,
  updateAssistantSectionConfigLimit,
  updateSection
} from '@/libs/db/actions/duty-actions';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { createSelectors } from '@/libs/helpers/create-selectors';
import { getDisabledDays } from '@/libs/helpers/disabled-day-calculator';
import { getWeekendDayIndexes } from '@/libs/helpers/get-weekend-indexes';
import { GenerateUUID } from '@/libs/helpers/id-generator';
import {
  NewAssistantSectionConfigListByAssistant,
  NewAssistantSectionConfigListBySection,
  NewDutyAssistant,
  NewDutySection
} from '@/libs/helpers/model-generator';
import { DefaultMonthConfig } from '@/libs/mock/duty.data';
import { IDisabledDays, IDuty, IDutyAssistant, IDutySection } from '@/libs/models/duty-model';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { TableState } from '../enums/table-state';

type DutyFields = {
  [K in keyof IDuty]: IDuty[K];
};

interface DutyState extends DutyFields {
  tableState: 'loading' | 'active';
  screenMode: ScreenMode;
}

interface DutyActions {
  setTableState: (state: TableState) => void;
  setScreenMode: (mode: ScreenMode) => void;
  setRestDays: (restDays: IDuty['restDayCount']) => void;
  setDate: (date: Date) => void;
  getDuty: () => IDuty;
  setDuty: (duty: IDuty) => void;
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
  clearAllSelections: () => void;
  setAssistantSectionLimit: (assistantId: string, sectionId: string, limit: number) => void;
}

const defaultState: DutyState = {
  id: '',
  userId: undefined,
  pinned: false,
  assistantList: [],
  assistantSectionConfig: [],
  sectionList: [],
  disabledDays: {},
  selectedDays: [],
  unwantedDays: [],
  monthConfig: DefaultMonthConfig,
  restDayCount: 2,
  screenMode: ScreenMode.MonthPicker,
  tableState: TableState.Loading
};

const useDutyStoreBase = create<DutyState & DutyActions>()(
  devtools(
    immer((set, get) => ({
      ...defaultState,
      setTableState: tableState => {
        set(state => {
          state.tableState = tableState;
        });
      },
      setRestDays: restDays => {
        set(state => {
          state.restDayCount = restDays;
        });
      },
      setDate: date => {
        set(state => {
          const oldDate = dayjs(state.monthConfig.selectedDate);
          const newDate = dayjs(date);
          if (newDate.isSame(oldDate, 'month')) return state;

          state.monthConfig.selectedDate = date;
          state.monthConfig.datesInMonth = newDate.daysInMonth();
          state.monthConfig.weekendIndexes = getWeekendDayIndexes(date);
        });
      },
      resetDuty: () => {
        set(() => defaultState);
      },
      setDuty: duty => {
        get().resetDuty();

        set(state => {
          state.id = duty.id;
          state.assistantList = duty.assistantList;
          state.assistantSectionConfig = duty.assistantSectionConfig;
          state.sectionList = duty.sectionList;
          state.selectedDays = duty.selectedDays;
          state.monthConfig = duty.monthConfig;
          state.restDayCount = duty.restDayCount;
          state.unwantedDays = duty.unwantedDays;
          state.screenMode = ScreenMode.MonthPicker;
          state.disabledDays = duty.assistantList.reduce((acc, assistant) => {
            const selectedDayIndexes = duty.selectedDays
              .filter(d => d.assistantId === assistant.id)
              .map(d => d.dayIndex);
            acc[assistant.id] = getDisabledDays(selectedDayIndexes, duty.restDayCount);
            return acc;
          }, {} as IDisabledDays);
        });
      },
      getDuty: () => {
        return {
          id: get().id,
          userId: get().userId,
          assistantList: get().assistantList,
          assistantSectionConfig: get().assistantSectionConfig,
          sectionList: get().sectionList,
          selectedDays: get().selectedDays,
          monthConfig: get().monthConfig,
          restDayCount: get().restDayCount,
          disabledDays: get().disabledDays,
          unwantedDays: get().unwantedDays,
          pinned: get().pinned
        };
      },
      setScreenMode: mode =>
        set(state => {
          state.screenMode = mode;
        }),
      /** assistant actions **/
      addAssistant: async () => {
        const id = GenerateUUID();
        const newAssistant = NewDutyAssistant({ id });
        const newConfigs = NewAssistantSectionConfigListBySection(id, get().sectionList);

        set(state => {
          state.assistantList.push(newAssistant);
          state.assistantSectionConfig.push(...newConfigs);
        });

        // Server action
        await Promise.all([
          addAssistant(get().id, newAssistant),
          createAssistantSectionConfigsForAssistant(
            get().id,
            newAssistant.id,
            newConfigs.map(c => ({ sectionId: c.sectionId, totalLimit: c.totalLimit }))
          )
        ]);
      },
      removeAssistant: async assistant => {
        set(state => {
          state.assistantList = state.assistantList.filter(a => a.id !== assistant.id);
          state.assistantSectionConfig = state.assistantSectionConfig.filter(
            c => c.assistantId !== assistant.id
          );
          state.selectedDays = state.selectedDays.filter(day => day.assistantId !== assistant.id);
          state.unwantedDays = state.unwantedDays.filter(day => day.assistantId !== assistant.id);
          delete state.disabledDays[assistant.id];
        });

        // Server action - relations will cascade delete
        await deleteAssistant(get().id, assistant.id);
      },
      updateAssistant: async (assistantId, props) => {
        set(state => {
          const assistant = state.assistantList.find(a => a.id === assistantId)!;
          Object.assign(assistant, props);
        });

        // Server Action
        await updateAssistant(get().id, assistantId, props);
      },
      toggleUnwantedDay: async (assistantId, dayIndex) => {
        const screenMode = get().screenMode;
        if (screenMode !== ScreenMode.UnwantedDayPicker) return;
        const index = get().unwantedDays.findIndex(
          u => u.assistantId === assistantId && u.dayIndex === dayIndex
        );

        set(state => {
          if (index >= 0) state.unwantedDays.splice(index, 1);
          else state.unwantedDays.push({ assistantId: assistantId, dayIndex });
        });

        // Server Action
        if (index >= 0) await unselectUnwantedDay(get().id, { assistantId, dayIndex });
        else await selectUnwantedDay(get().id, { assistantId, dayIndex });
      },
      setAssistantSectionLimit: async (assistantId, sectionId, newLimit) => {
        set(state => {
          const config = state.assistantSectionConfig.find(
            c => c.assistantId === assistantId && c.sectionId === sectionId
          )!;
          config.totalLimit = newLimit;
        });

        // Server Action
        await updateAssistantSectionConfigLimit(get().id, assistantId, sectionId, newLimit);
      },
      clearAllSelections: async () => {
        set(state => {
          state.selectedDays = [];
          state.disabledDays = {};
          state.unwantedDays = [];
        });

        // Server action
        await clearSelections(get().id);
      },
      selectDay: async (assistantId, section, dayIndex) => {
        const selectedDay = { assistantId, sectionId: section.id, section, dayIndex };
        set(state => {
          state.selectedDays.push(selectedDay);
        });

        get().updateDisabledDays(assistantId);
        // Server action
        await selectDay(get().id, selectedDay);
      },
      unselectDay: async (assistantId, dayIndex) => {
        set(state => {
          state.selectedDays = state.selectedDays.filter(
            d => d.assistantId !== assistantId || d.dayIndex !== dayIndex
          );
        });

        get().updateDisabledDays(assistantId);
        // Server action
        await unselectDay(get().id, { assistantId, dayIndex });
      },
      updateDisabledDays: assistantId => {
        set(state => {
          const selectedDays = state.selectedDays
            .filter(d => d.assistantId === assistantId)
            .map(d => d.dayIndex);
          state.disabledDays[assistantId] = getDisabledDays(selectedDays, get().restDayCount);
        });
      },
      /** section actions **/
      addSection: async () => {
        const newSection = NewDutySection();
        const newConfigs = NewAssistantSectionConfigListByAssistant(
          get().assistantList.map(a => a.id),
          newSection
        );

        set(state => {
          state.sectionList.push(newSection);
          state.assistantSectionConfig.push(...newConfigs);
        });

        // Server action
        await Promise.all([
          await addSection(get().id, newSection),
          await createAssistantSectionConfigsForSection(
            get().id,
            newSection.id,
            newConfigs.map(c => ({ assistantId: c.assistantId, totalLimit: c.totalLimit }))
          )
        ]);
      },
      removeSection: async sectionId => {
        set(state => {
          state.sectionList = state.sectionList.filter(s => s.id !== sectionId);
          state.assistantSectionConfig = state.assistantSectionConfig.filter(
            c => c.sectionId !== sectionId
          );
        });

        // Server Actions - relations will cascade delete
        await deleteSection(get().id, sectionId);
      },
      updateSection: async (sectionId, props) => {
        set(state => {
          const section = state.sectionList.find(s => s.id === sectionId)!;
          Object.assign(section, props);
        });

        // Server Action
        await updateSection(get().id, sectionId, props);
      }
    }))
  )
);

const useDutyStore = createSelectors(useDutyStoreBase);
export { useDutyStore };
