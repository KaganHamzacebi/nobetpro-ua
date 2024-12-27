'use client';

import Scheduler from '@/components/ui/scheduler/scheduler';
import { IDuty } from '@/libs/models/duty-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Modal, Text } from '@mantine/core';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface ISchedulerModal {
  duty: IDuty;
}

export default function SchedulerModal({ duty }: Readonly<ISchedulerModal>) {
  const router = useRouter();
  const [opened, handlers] = useDisclosure(true);
  const resetDuty = useDutyStore.use.resetDuty();

  const windowReloadHandler = () => {
    resetDuty();
  };

  useWindowEvent('beforeunload', windowReloadHandler);

  const handleOnModalClose = () => {
    const close = () => {
      handlers.close();
      router.back();
      resetDuty();
    };

    modals.openConfirmModal({
      title: 'Close Without Saving?',
      centered: true,
      labels: { confirm: 'Yes', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      children: (
        <Text size="sm">
          You have unsaved changes. Closing this modal will discard them. Do you want to proceed?
        </Text>
      ),
      onConfirm: close
    });
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
        <Scheduler defaultDuty={duty} />
      </Modal.Body>
    </Modal>
  );
}
