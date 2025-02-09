'use client';

import Scheduler from '@/components/ui/scheduler/scheduler';
import { TableState } from '@/libs/enums/table-state';
import { IDuty } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

interface ISchedulerModal {
  duty: IDuty;
}

export default function SchedulerModal({ duty }: Readonly<ISchedulerModal>) {
  const router = useRouter();
  const [opened, { close }] = useDisclosure(true);
  const setDuty = useDutyStore.use.setDuty();
  const setScreenMode = useDutyStore.use.setScreenMode();
  const setTableState = useDutyStore.use.setTableState();

  useEffect(() => {
    setTableState(TableState.Loading);
    if (duty) setDuty(duty);
    setTableState(TableState.Active);
  }, [duty, setDuty, setScreenMode, setTableState]);

  const handleModalClose = useCallback(() => {
    close();
    router.push('/dashboard/duty-list');
  }, [close, router]);

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      title="Schedule Duties"
      size="100%"
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      closeButtonProps={{
        icon: <IconX color="red" size={20} stroke={2} />
      }}
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: 700
        },
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
