import TrashButton from '@/components/ui/trash-button';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { TextInput } from '@mantine/core';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface IAssistantNameRenderer {
  assistantId: string;
}

function AssistantNameRenderer({ assistantId }: Readonly<IAssistantNameRenderer>) {
  const assistant = useDutyStore(
    useShallow(state => state.assistantList.find(assistant => assistant.id === assistantId)!)
  );

  const [name, setName] = useState<string>(assistant.name);
  const removeAssistant = useDutyStore.use.removeAssistant();
  const updateAssistant = useDutyStore.use.updateAssistant();

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleUpdateAssistant = useCallback(async () => {
    updateAssistant(assistant.id, { name: name });
  }, [assistant.id, name, updateAssistant]);

  const handleRemove = useCallback(async () => {
    removeAssistant(assistant);
  }, [assistant, removeAssistant]);

  return (
    <div className="flex min-h-[5vh] min-w-fit flex-row items-center gap-x-2 px-2">
      <TextInput
        size="xs"
        value={name}
        onChange={handleNameChange}
        onBlur={handleUpdateAssistant}
      />
      <TrashButton callback={handleRemove} tooltip={`Delete ${name}`} />
    </div>
  );
}

export default memo(AssistantNameRenderer);
