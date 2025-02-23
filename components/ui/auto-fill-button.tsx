import { autoFill } from '@/libs/db/actions/duty-actions';
import { TableState } from '@/libs/enums/table-state';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Button } from '@mantine/core';
import { IconAutomation } from '@tabler/icons-react';
import { useTransition } from 'react';

export default function AutoFillButton() {
  const [loading, setTransition] = useTransition();
  const tableState = useDutyStore.use.tableState();
  const setTableState = useDutyStore.use.setTableState();
  const dutyId = useDutyStore(state => state.id);

  const onAutoFill = () => {
    setTransition(async () => {
      if (!dutyId) throw new Error('Duty not found');
      setTableState(TableState.InProgress);
      await autoFill(dutyId);
      setTableState(TableState.Active);
    });
  };

  return (
    <Button
      loading={loading || tableState === TableState.Loading}
      onClick={onAutoFill}
      leftSection={<IconAutomation size={20} />}
      color="orange"
      className="ml-auto">
      Auto Fill
    </Button>
  );
}
