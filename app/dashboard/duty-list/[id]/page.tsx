'use client';

import SchedulerBase from '@/components/ui/scheduler/scheduler-base';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

export default function SchedulerModal() {
  const router = useRouter();
  const [opened] = useDisclosure(true);

  const handleOnModalClose = () => {
    router.back();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleOnModalClose}
      title="Schedule Duties"
      size="auto"
      centered
      className="h-[85vh] min-h-[85vh]">
      <Modal.Body>
        <SchedulerBase />
      </Modal.Body>
    </Modal>
  );
}
