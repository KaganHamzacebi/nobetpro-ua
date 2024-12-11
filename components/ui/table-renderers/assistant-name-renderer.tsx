import { IDutyAssistant } from '@/libs/models/IAssistant';
import { ActionIcon, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';
import { IconTrashFilled } from '@tabler/icons-react';
import { useState } from 'react';

interface IAssistantNameRenderer {
  assistant: IDutyAssistant;
  setAssistantProps: (id: string, props: Partial<IDutyAssistant>) => void;
  removeAssistant: (id: IDutyAssistant) => void;
}

export default function AssistantNameRenderer({
  assistant,
  setAssistantProps,
  removeAssistant
}: Readonly<IAssistantNameRenderer>) {
  const [name, setName] = useState<string>(assistant.name);

  const setDebouncedName = useDebouncedCallback((name: string) => {
    setAssistantProps(assistant.id, { name: name });
  }, 500);

  useDidUpdate(() => {
    setDebouncedName(name);
  }, [name]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      <TextInput size="xs" value={name} onChange={e => setName(e.target.value)} />
      <Tooltip label={`Remove ${name}`}>
        <ActionIcon size="sm" variant="transparent" onClick={() => removeAssistant(assistant)}>
          <IconTrashFilled className="text-attention hover:text-attention-hover" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
