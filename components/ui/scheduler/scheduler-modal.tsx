'use client';

import Scheduler from '@/components/ui/scheduler/scheduler';
import { getDefaultAssistants } from '@/libs/db/actions/default-assistant-actions';
import { getDefaultSections } from '@/libs/db/actions/default-section-actions';
import { TableState } from '@/libs/enums/table-state';
import { NewDuty } from '@/libs/helpers/model-generator';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Modal, Text } from '@mantine/core';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconX } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SchedulerModal() {
  const params = useParams();
  const router = useRouter();
  const [opened, handlers] = useDisclosure(true);

  const setDuty = useDutyStore.use.setDuty();
  const resetDuty = useDutyStore.use.resetDuty();
  const setTableState = useDutyStore.use.setTableState();

  const initNewDuty = async () => {
    const [assistants, sections] = await Promise.all([
      getDefaultAssistants(),
      getDefaultSections()
    ]);

    const newDuty = NewDuty(assistants, sections);
    setDuty(newDuty);
  };

  useEffect(() => {
    setTableState(TableState.Loading);
    const setDutyData = async () => {
      if (params.id === 'new') {
        await initNewDuty();
      } else {
        console.log('fetch-duty');
      }
    };

    setDutyData().then(() => {
      setTableState(TableState.Active);
    });
  }, [params.id]);

  const windowReloadHandler = () => {
    resetDuty();
  };

  useWindowEvent('unload', windowReloadHandler);

  const handleOnModalClose = () => {
    const close = () => {
      handlers.close();
      router.push('/dashboard/duty-list');
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
        <Scheduler />
      </Modal.Body>
    </Modal>
  );
}
