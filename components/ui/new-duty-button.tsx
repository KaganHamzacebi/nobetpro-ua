'use client';

import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function NewDutyButton() {
  const router = useRouter();

  const handleNewDuty = () => {
    router.push('/dashboard/duty-list/new-duty');
  };

  return (
    <Button className="fixed bottom-4 right-4" size="lg" variant="default" onClick={handleNewDuty}>
      New Duty
    </Button>
  );
}
