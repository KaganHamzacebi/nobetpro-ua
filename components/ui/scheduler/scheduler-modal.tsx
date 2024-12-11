'use client';

import SchedulerBase from '@/components/ui/scheduler/scheduler-base';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DefaultAssistant, DefaultSection } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ISchedulerModal {
  defaultAssistants: DefaultAssistant[];
  defaultSections: DefaultSection[];
}

export default function SchedulerModal({
  defaultAssistants,
  defaultSections
}: Readonly<ISchedulerModal>) {
  const { id } = useParams();
  const router = useRouter();
  const [opened] = useDisclosure(true);

  const handleOnModalClose = () => {
    router.back();
  };

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <Modal
      opened={opened}
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
        <SchedulerBase
          duty={undefined}
          defaultSectionConfig={[]}
          defaultAssistants={[]}
          defaultSections={[]}
        />
      </Modal.Body>
    </Modal>
  );
}
