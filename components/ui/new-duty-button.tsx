'use client';

import { createNewDuty } from '@/libs/db/actions/duty-actions';
import { showSuccessNotification } from '@/libs/helpers/notification-service';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function NewDutyButton() {
  const router = useRouter();
  const [loading, setTransition] = useTransition();

  const handleNewDuty = () => {
    setTransition(async () => {
      const createdDuty = await createNewDuty();
      router.push(`/dashboard/duty-list/${createdDuty.id}`);
      showSuccessNotification({
        title: 'Duty Created',
        message: 'New duty has been created successfully'
      });
    });
  };

  return (
    <Button size="lg" loading={loading} variant="default" onClick={handleNewDuty}>
      New Duty
    </Button>
  );
}
