import { ActionIcon, Tooltip } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { memo, useState } from 'react';

interface ITrashButton {
  callback: (...args: unknown[]) => Promise<unknown> | void;
  tooltip?: string;
}

function TrashButton({ callback, tooltip }: Readonly<ITrashButton>) {
  const [loading, setLoading] = useState(false);

  const handleCallback = async () => {
    setLoading(true);
    try {
      await callback();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip label={tooltip} disabled={!tooltip || loading} color="red">
      <ActionIcon loading={loading} size="sm" variant="transparent" onClick={handleCallback}>
        <IconTrashFilled className="text-attention hover:text-attention-hover" />
      </ActionIcon>
    </Tooltip>
  );
}
export default memo(TrashButton);
