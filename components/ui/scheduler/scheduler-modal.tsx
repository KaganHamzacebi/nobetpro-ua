'use client';

import Scheduler from '@/components/ui/scheduler/scheduler';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { TableState } from '@/libs/enums/table-state';
import { IDuty } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ISchedulerModal {
  duty: IDuty;
}

export default function SchedulerModal({ duty }: Readonly<ISchedulerModal>) {
  const router = useRouter();
  const [opened, handlers] = useDisclosure(true);
  const setDuty = useDutyStore.use.setDuty();
  const setScreenMode = useDutyStore.use.setScreenMode();
  const setTableState = useDutyStore.use.setTableState();

  useEffect(() => {
    console.log('here');
    setTableState(TableState.Loading);
    if (duty) {
      setScreenMode(ScreenMode.MonthPicker);
      setDuty(duty);
    }
    setTableState(TableState.Active);
  }, []);

  const handleOnModalClose = () => {
    handlers.close();
    router.push('/dashboard/duty-list');
  };

  return (
    <Modal
      opened={opened}
      closeButtonProps={{
        icon: <IconX color="red" size={20} stroke={2} />
      }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={handleOnModalClose}
      title="Schedule Duties"
      size="100%"
      centered
      styles={{
        content: {
          height: '90vh'
        }
      }}>
      <Modal.Body>
        <Scheduler />
      </Modal.Body>
    </Modal>
  );
}
