import { ActionIcon, Tooltip } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { memo } from 'react';

interface ITrashButton {
  callback: (...args: unknown[]) => void;
  tooltip?: string;
}

function TrashButton({ callback, tooltip }: Readonly<ITrashButton>) {
  return (
    <Tooltip label={tooltip} disabled={!tooltip} color="red">
      <ActionIcon size="sm" variant="transparent" onClick={callback}>
        <IconTrashFilled className="text-attention hover:text-attention-hover" />
      </ActionIcon>
    </Tooltip>
  );
}
export default memo(TrashButton);
