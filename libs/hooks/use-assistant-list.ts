import { SetStateAction, useCallback, useState } from 'react';
import { GenerateUUID } from '../helpers/id-generator';
import { newAssistant } from '../helpers/model-generator';
import { IDutyAssistant, SelectedDayConfig } from '../models/IAssistant';

export const useAssistantList = (
  defaultList: IDutyAssistant[],
  setSelectedDayConfig: (value: SetStateAction<SelectedDayConfig>) => void
) => {
  const [assistantList, setAssistantList] = useState(defaultList);

  const addNewAssistant = useCallback(() => {
    setAssistantList(prevState => [...prevState, newAssistant({ name: `New Assistant` })]);
  }, []);

  const removeAssistant = useCallback(
    (assistant: IDutyAssistant) => {
      setAssistantList(prevState => prevState.filter(a => a.id !== assistant.id));
      setSelectedDayConfig(prevState => {
        Object.entries(assistant.selectedDays.days).forEach(([dayIndex, section]) => {
          const selectedDayConfig = prevState[Number(dayIndex)];
          selectedDayConfig.sectionIds.delete(section.id);
          selectedDayConfig.version = GenerateUUID();
        });

        return prevState;
      });
    },
    [setSelectedDayConfig]
  );

  const setAssistantProps = useCallback(
    (assistantId: IDutyAssistant['id'], props: Partial<IDutyAssistant>) => {
      setAssistantList(prevState =>
        prevState.map(assistant =>
          assistant.id === assistantId ? { ...assistant, ...props } : assistant
        )
      );
    },
    []
  );

  const handleClearSelections = () => {
    setAssistantList(prevState =>
      prevState.map(assistant => ({
        ...assistant,
        selectedDays: {
          days: [],
          version: GenerateUUID()
        },
        disabledDays: {
          days: [],
          version: GenerateUUID()
        }
      }))
    );

    setSelectedDayConfig({});
  };

  return {
    assistantList,
    setAssistantList,
    addNewAssistant,
    removeAssistant,
    setAssistantProps,
    handleClearSelections
  };
};
