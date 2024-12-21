import { ActionIcon } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { memo } from 'react';

interface ITrashButton {
  callback: (...args: unknown[]) => void;
}

function TrashButton({ callback }: Readonly<ITrashButton>) {
  return (
    <ActionIcon size="sm" variant="transparent" onClick={callback}>
      <IconTrashFilled className="text-attention hover:text-attention-hover" />
    </ActionIcon>
  );
}
export default memo(TrashButton);
