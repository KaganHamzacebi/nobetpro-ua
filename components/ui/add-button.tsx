import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

interface IAddButton {
  onClick?: () => void;
  label?: string;
}

export default function AddButton({ label, onClick }: Readonly<IAddButton>) {
  return (
    <Button className="add-button" leftSection={<IconPlus />} onClick={onClick}>
      {label}
    </Button>
  );
}
