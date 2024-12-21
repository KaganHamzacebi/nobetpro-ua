import TrashButton from '@/components/ui/trash-button';
import { IDutyAssistant } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { TextInput } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { ChangeEvent, memo, useCallback, useState } from 'react';

interface IAssistantNameRenderer {
  assistant: IDutyAssistant;
}

function AssistantNameRenderer({ assistant }: Readonly<IAssistantNameRenderer>) {
  console.log('asistant-name rerendered');
  const [name, setName] = useState<string>(assistant.name);
  const removeAssistant = useDutyStore.use.removeAssistant();
  const updateAssistant = useDutyStore.use.updateAssistant();

  useDidUpdate(() => {
    updateAssistantName(name);
  }, [name]);

  const updateAssistantName = useDebouncedCallback((name: string) => {
    updateAssistant(assistant.id, { name: name });
  }, 500);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleRemove = useCallback(() => {
    removeAssistant(assistant);
  }, [assistant, removeAssistant]);

  return (
    <div className="flex min-w-[200px] flex-row items-center gap-x-2">
      <TextInput size="xs" value={name} onChange={handleNameChange} />
      <TrashButton callback={handleRemove} />
    </div>
  );
}

export default memo(AssistantNameRenderer);
